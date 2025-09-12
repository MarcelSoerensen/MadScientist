/**
 * Represents the game world. Manages all game objects, rendering, and main game loop.
 */

class World {
    /**
     * Indicates if the game is over
     */
    gameOver = false;
    /**
     * Sets the world reference for all enemies after loading the level
     */
    setWorldReferenceForEnemies() {
        if (this.enemies) {
            this.enemies.forEach(enemy => {
                enemy.world = this;
            });
        }
    }

    lastCollisionSoundTime = 0;

    /**
     * Starts the first enemy only if the character is at least 800px away
     */
    checkFirstEnemyDistance() {
        if (this.level && this.level.enemies && this.level.enemies.length > 0) {
            this.level.enemies.forEach(enemy => {
                let activateAt = enemy._activateAt || 500;
                if (enemy._waitingForCharacter && this.character.x >= activateAt) {
                    enemy.visible = true;
                    enemy._waitingForCharacter = false;
                    if (!enemy.moveInterval && !enemy.animInterval) {
                        if (enemy instanceof EnemyOne && enemy.handler && typeof enemy.handler.animateEnemyOne === 'function') {
                            enemy.handler.animateEnemyOne(enemy);
                        } else if (typeof enemy.animate === 'function') {
                            enemy.animate();
                        }
                    }
                }
            });
        }
    }
    /**
     * Checks for supershot creation when S key is pressed. Fires a large laser, subtracts 5 balls, and counts 3 hits on the enemy.
     */
    checkSuperShot() {
        if (
            this.keyboard.S &&
            this.energyBallManager.collectedCount >= 5 &&
            this.laserBeams.length === 0
        ) {
            let offsetY = 170;
            let offsetX = this.character.otherDirection ? -94 : 187;
            let laser = new LaserBeam(
                this.character.x + offsetX,
                this.character.y + offsetY,
                this.character.otherDirection,
                this.character,
                offsetX,
                offsetY
            );
            laser.width *= 2;
            laser.height *= 2;
            laser.isSuperShot = true;
            try {
                const shotSound = new Audio('sounds/superlaser-shot.mp3');
                shotSound.volume = 0.5;
                shotSound.play();
            } catch (e) {}
            this.laserBeams.push(laser);
            this.energyBallManager.collectedCount = Math.max(0, this.energyBallManager.collectedCount - 5);
            this.laserActive = true;
            setTimeout(() => {
                this.laserBeams.forEach(l => l.stopAnimation());
                this.laserBeams = [];
                this.laserActive = false;
            }, 1000);
        }
    }

    character = new Character();
    level = level1;
    enemies = level1.enemies;
    energyBallManager;
    heartsManager;
    superShotBar;
    bombsBar;
    bombManager;
    backgroundObjects = level1.backgroundObjects;

    canvas;
    ctx;
    keyboard;
    camera_x = 0;
    statusBar = new StatusBar();
    throwableObjects = [];
    laserBeams = [];

    lastDKeyState = false;
    lastYKeyState = false;
    laserActive = false;

    /**
     * Creates a new World instance.
     */
    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.setWorld();
        window.collisionManager = new CollisionManager();
        this.energyBallManager = new EnergyBallManager(4000, 600, this.character, [], this);
        this.bombManager = new BombManager(4000, 600, this.character, this.energyBallManager.balls);
        this.heartsManager = new HeartsManager(4000, 600, this.character, [], this.energyBallManager.balls, this.bombManager.bombs);
        this.superShotBar = new SuperShotBar();
        this.bombsBar = new BombsBar(65, 50, 5);
        this.gameAlerts = new window.GameAlerts(this.canvas);
        if (this.level && this.level.enemies) {
            this.level.enemies.forEach(enemy => {
                if (enemy instanceof Endboss) {
                    enemy.setCharacter(this.character);
                }
            });
        }
        this.worldDraw = new WorldDraw(this);
        this.worldDraw.draw();
        this.run();
    }
    
    /**
     * Sets up bidirectional reference between world and character.
     */
    setWorld() {
        this.character.world = this;
    }

    /**
     * Starts the main game loop. Runs collision detection and throwable object checks at different intervals.
     */
    run() {
        setInterval(() => {
            this.checkCollisions();
        }, 200);
        setInterval(() => {
            this.checkThrowableObjects();
            this.checkLaserBeams();
            this.checkSuperShot();
            this.checkFirstEnemyDistance();
        }, 1000 / 60);

        
        setInterval(() => {
            this.checkStickCollision();
        }, 50);
    }

    /**
     * Checks only the stick collision of the Endboss with the character
     */
    checkStickCollision() {
        this.level.enemies.forEach(enemy => {
            if (
                enemy instanceof Endboss &&
                enemy.animState === 'hit' &&
                !enemy.isDeadAnimationPlaying &&
                enemy.collidable !== false
            ) {
                const stickRect = enemy.getStickCollisionRect && enemy.getStickCollisionRect();
                if (stickRect) {
                    const charRect = {
                        x: this.character.x + (this.character.offset?.left || 0),
                        y: this.character.y + (this.character.offset?.top || 0),
                        width: this.character.width - ((this.character.offset?.left || 0) + (this.character.offset?.right || 0)),
                        height: this.character.height - ((this.character.offset?.top || 0) + (this.character.offset?.bottom || 0))
                    };
                    const stickCollision =
                        charRect.x < stickRect.x + stickRect.width &&
                        charRect.x + charRect.width > stickRect.x &&
                        charRect.y < stickRect.y + stickRect.height &&
                        charRect.y + charRect.height > stickRect.y;
                    if (stickCollision) {
                        const now = Date.now();
                            if (!this.lastCollisionSoundTime || now - this.lastCollisionSoundTime > 500) {
                                this.character.sounds.hurtSound(this.character, this);
                            }
                        this.character.hit();
                        this.statusBar.setPercentage(this.character.energy);
                    }
                }
            }
        });
    }

    /**
     * Checks for throwable object creation when D key is pressed.
     * Ensures only one projectile is created per key press and starts throw animation.
     */
    checkThrowableObjects() {
        
        if (this.keyboard.D && !this.lastDKeyState && !this.character.throwAnimationPlaying && this.bombManager.collectedCount > 0) {
            this.character.playThrowBombAnimation();
            setTimeout(() => {
                let bombX = this.character.otherDirection ? this.character.x + 100 : this.character.x + 160;
                let bomb = ThrowableObjects.createThrowableObject(
                    'bomb',
                    bombX,
                    this.character.y + 180,
                    this.character.otherDirection
                );
                this.throwableObjects.push(bomb);
                this.bombManager.collectedCount = Math.max(0, this.bombManager.collectedCount - 1);
            }, 500);
        }
        this.lastDKeyState = this.keyboard.D;
    }

    /**
     * Checks for laser beam creation when Y key is pressed.
     * Creates animated laser beam while Y is held, removes when released.
     */
    checkLaserBeams() {
        if (!this.laserActive) {
            if (this.keyboard.Y && !this.lastYKeyState && this.energyBallManager.collectedCount > 0 && this.laserBeams.length === 0) {
                this.laserActive = true;
                this.laserBeams.forEach(laser => {
                    laser.stopAnimation();
                });
                this.laserBeams = [];
                let offsetY = 205;
                let offsetX = this.character.otherDirection ? -20 : 190;
                let laser = new LaserBeam(
                    this.character.x + offsetX,
                    this.character.y + offsetY,
                    this.character.otherDirection,
                    this.character,
                    offsetX,
                    offsetY
                );
                laser.shoot();
                this.laserBeams.push(laser);
                this.energyBallManager.collectedCount = Math.max(0, this.energyBallManager.collectedCount - 1);
                setTimeout(() => {
                    this.laserBeams.forEach(laser => {
                        laser.stopAnimation();
                    });
                    this.laserBeams = [];
                    this.laserActive = false;
                }, 500);
            } else if (!this.keyboard.Y && this.lastYKeyState) {
                this.laserBeams.forEach(laser => {
                    laser.stopAnimation();
                });
                this.laserBeams = [];
            }
        }
        this.lastYKeyState = this.keyboard.Y;
    }

    /**
     * Checks for collisions between the character and enemies.
     */
    checkCollisions() {
        if (this.checkGameOver()) return;
    window.collisionManager.checkEnemyCollision(this);
    window.collisionManager.checkBombCollision(this);
    window.collisionManager.checkLaserCollision(this);
    window.collisionManager.checkEndbossStickCollision(this);
    }

    checkGameOver() {
        if (this.gameOver || (this.character.isDead && this.character.isDead())) {
            if (!this.gameOver) {
                this.gameOver = true;
                if (this.keyboard) {
                    this.keyboard.S = false;
                    this.keyboard.D = false;
                    this.keyboard.Y = false;
                }
                if (this.gameAlerts && typeof this.gameAlerts.showAlert === 'function') {
                    this.gameAlerts.showAlert('gameOver', 'Game Over');
                }
            }
            return true;
        }
        if (window.endbossDefeated) {
            if (!this.gameOver) {
                this.gameOver = true;
                if (this.keyboard) {
                    this.keyboard.S = false;
                    this.keyboard.D = false;
                    this.keyboard.Y = false;
                }
                this.gameAlerts.triggerLevelComplete && typeof this.gameAlerts.triggerLevelComplete === 'function'
                    ? this.gameAlerts.triggerLevelComplete()
                    : this.gameAlerts.showAlert('levelComplete', 'Level Complete');
            }
            return true;
        }
        return false;
    }



    /**
     * Adds an array of objects to the map.
     */
    addObjectsToMap(objects) {
        objects.forEach(object => {
            this.addToMap(object);
        });
    }

    /**
     * Adds a single movable object to the map with proper flipping and collision frames.
     */
    addToMap(movableObject) {
        if (
            movableObject.img &&
            movableObject.img.complete &&
            movableObject.img.naturalWidth > 0
        ) {
            if (movableObject.otherDirection) {
                this.flipImage(movableObject);
            }
            
            movableObject.draw(this.ctx);
            movableObject.drawFrame(this.ctx); 

            if (movableObject instanceof Endboss) {
                movableObject.drawCollisionFrameEndboss(this.ctx);
                movableObject.drawCollisionFrameStick(this.ctx);
            } else if (movableObject.drawCollisionFrame && movableObject.collidable !== false) {
                movableObject.drawCollisionFrame(this.ctx);
            }

            if (movableObject.otherDirection) {
                this.flipImageBack(movableObject);
            }
        }
    }

    /**
     * Flips the image horizontally for objects facing the opposite direction.
     */
    flipImage(movableObject) {
        this.ctx.save();
        this.ctx.translate(movableObject.width, 0);
        this.ctx.scale(-1, 1);
        movableObject.x = movableObject.x * -1;
    }

    /**
     * Restores the canvas state after flipping an image.
     */
    flipImageBack(movableObject) {
        movableObject.x = movableObject.x * -1;
        this.ctx.restore();
    }
            
}
