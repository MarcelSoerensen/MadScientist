/**
 * Represents the game world. Manages all game objects, rendering, and main game loop.
 * @class World
 */
class World {
    /**
     * Indicates if the game is over
     * @type {boolean}
     */
    gameOver = false;
    /**
     * Sets the world reference for all enemies after loading the level
     * @returns {void}
     */
    setWorldReferenceForEnemies() {
        if (this.enemies) {
            this.enemies.forEach(enemy => {
                enemy.world = this;
            });
        }
    }

    _lastCollisionSoundTime = 0;

    /**
     * Starts the first enemy only if the character is at least 800px away
     * @returns {void}
     */
    checkFirstEnemyDistance() {
        if (this.level && this.level.enemies && this.level.enemies.length > 0) {
            this.level.enemies.forEach(enemy => {
                let activateAt = enemy._activateAt || 500;
                if (enemy._waitingForCharacter && this.character.x >= activateAt) {
                    enemy.visible = true;
                    enemy._waitingForCharacter = false;
                    if (!enemy.moveInterval && !enemy.animInterval) {
                        enemy.animate();
                    }
                }
            });
        }
    }
    /**
     * Checks for supershot creation when S key is pressed. Fires a large laser, subtracts 5 balls, and counts 3 hits on the enemy.
     * @returns {void}
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
                const shotSound = new Audio('sounds/superlaser-shot.wav');
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
    /** @type {Character} The player character */
    character = new Character();
    /** @type {Level} The current game level */
    level = level1;
    /** @type {Array<EnemyOne|EnemyTwo>} Array of enemy objects */
    enemies = level1.enemies;
    /** @type {EnergyBallManager} Manages all energy balls */
    energyBallManager;
    /** @type {HeartsManager} Manages all collectible hearts */
    heartsManager;
    /** @type {SuperShotBar} Displays collected energy balls as a bar */
    superShotBar;
    /** @type {BombsBar} Displays collected bombs as a bar */
    bombsBar;
    /** @type {BombManager} Manages all collectible bombs */
    bombManager;
    /** @type {Array<DrawableObject>} Array of background objects */
    backgroundObjects = level1.backgroundObjects;

    /** @type {HTMLCanvasElement} The game canvas */
    canvas;
    /** @type {CanvasRenderingContext2D} The 2D rendering context */
    ctx;
    /** @type {Keyboard} Keyboard input handler */
    keyboard;
    /** @type {number} Camera X position for scrolling */
    camera_x = 0;
    /** @type {StatusBar} Displays game stats */
    statusBar = new StatusBar();
    /** @type {Array<ThrowableObjects>} Array of throwable objects */
    throwableObjects = [];
    /** @type {Array<LaserBeam>} Array of laser beam objects */
    laserBeams = [];

    /** @type {boolean} Tracks if D key was pressed in previous frame */
    lastDKeyState = false;
    /** @type {boolean} Tracks if Y key was pressed in previous frame */
    lastYKeyState = false;
    /** @type {boolean} Indicates if laser is currently active */
    laserActive = false;

    /**
     * Creates a new World instance.
     * Initializes all game objects and starts the main loop.
     * @param {HTMLCanvasElement} canvas - The game canvas
     * @param {Keyboard} keyboard - The keyboard input handler
     */
    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.setWorld();
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
        this.draw();
        this.run();
    }
    
    /**
     * Sets up bidirectional reference between world and character.
     * @returns {void}
     */
    setWorld() {
        this.character.world = this;
    }

    /**
     * Starts the main game loop. Runs collision detection and throwable object checks at different intervals.
     * @returns {void}
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
                        if (!this._lastCollisionSoundTime || now - this._lastCollisionSoundTime > 500) {
                            try {
                                const collisionSound = new Audio('sounds/character-collided.wav');
                                collisionSound.volume = 0.5;
                                collisionSound.play();
                                this._lastCollisionSoundTime = now;
                            } catch (e) {
                            }
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
     * @returns {void}
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
     * @returns {void}
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
     * Reduces character energy and updates status bar when collision occurs.
     * @returns {void}
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
     * Main rendering loop for the game. Handles camera translation and draws all game objects.
     * @returns {void}
     */
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.translate(this.camera_x, 0);
        this.drawMainBackground();
        this.drawGameObjects();
        this.drawParallaxTop();
        this.drawParallaxBottom();
        this.ctx.translate(-this.camera_x, 0);
        this.drawStatusBar();

        if (this.energyBallManager && this.superShotBar) {
            this.superShotBar.setBalls(this.energyBallManager.collectedCount);
            this.superShotBar.draw(this.ctx);
        }
        if (this.bombsBar && this.bombManager) {
            this.bombsBar.setBombs(this.bombManager.collectedCount);
            this.bombsBar.draw(this.ctx);
        }

        this.gameAlerts.draw(this.ctx);

        let self = this;
        requestAnimationFrame(function() {
            self.draw();
        });
    }

    /**
     * Draws the main background layers.
     * @returns {void}
     */
    drawMainBackground() {
        this.addToMap(this.backgroundObjects[3]);
        this.addToMap(this.backgroundObjects[0]);
    }

    /**
     * Draws the status bar on the map. Renders the status bar image and overlays a custom HP bar with trapezoid shape.
     * @returns {void}
     */
    drawStatusBar() {
    this.addToMap(this.statusBar);
    this.statusBar.drawHPBar(this.ctx);
    }

    /**
     * Draws all game objects (enemies, character, projectiles, energy balls).
     * @returns {void}
     */
    drawGameObjects() {
    this.addObjectsToMap(this.enemies);
        this.enemies.forEach(enemy => {
            if (enemy instanceof EnemyTwo && enemy.visible) {
                this.ctx.save();
                this.ctx.restore();
            }
        });
        this.addToMap(this.character);
        this.addObjectsToMap(this.throwableObjects);
        this.addObjectsToMap(this.laserBeams);
        if (this.energyBallManager && this.superShotBar) {
            // SuperShot-Alert: Prüfe, ob sich die Anzahl der SuperShots erhöht hat
            const prevSuperShots = this.superShotBar.getSuperShots();
            this.energyBallManager.update(this.character);
            this.superShotBar.setBalls(this.energyBallManager.collectedCount);
            const newSuperShots = this.superShotBar.getSuperShots();
            if (newSuperShots > prevSuperShots) {
                this.gameAlerts.triggerSuperlaser(newSuperShots);
            }
            this.energyBallManager.draw(this.ctx);
            this.superShotBar.draw(this.ctx);
        }
        if (this.bombManager) {
            this.bombManager.update(this.character);
            this.bombManager.draw(this.ctx);
        }
        if (this.heartsManager) {
            const prevEnergy = this.statusBar.percentage;
            this.heartsManager.update(this.character);
            // StatusBar wird vermutlich im CollisionManager oder nach Heart-Update gesetzt
            if (prevEnergy < 100 && this.statusBar.percentage === 100) {
                this.gameAlerts.triggerFullEnergy();
            }
            this.heartsManager.draw(this.ctx);
        }
        if (this.bombsBar && this.bombManager) {
            this.bombsBar.setBombs(this.bombManager.collectedCount);
            this.bombsBar.draw(this.ctx);
        }
    }

    /**
     * Draws parallax background layers for the top portion.
     * @returns {void}
     */
    drawParallaxTop() {
        this.ctx.translate(this.camera_x * 0.25, 0);
        this.addToMap(this.backgroundObjects[6]);
        this.addToMap(this.backgroundObjects[4]);
        this.addToMap(this.backgroundObjects[1]);
        this.ctx.translate(-this.camera_x * 0.25, 0);
    }

    /**
     * Draws parallax background layers for the bottom portion.
     * @returns {void}
     */
    drawParallaxBottom() {
        this.ctx.translate(this.camera_x * 0.5, 0);
        this.addToMap(this.backgroundObjects[7]);
        this.addToMap(this.backgroundObjects[5]);
        this.addToMap(this.backgroundObjects[2]);
        this.ctx.translate(-this.camera_x * 0.5, 0);
    }

    /**
     * Adds an array of objects to the map.
     * @param {Array<DrawableObject>} objects - Array of objects to draw
     * @returns {void}
     */
    addObjectsToMap(objects) {
        objects.forEach(object => {
            this.addToMap(object);
        });
    }

    /**
     * Adds a single movable object to the map with proper flipping and collision frames.
     * @param {MovableObject} movableObject - The object to add to the map
     * @returns {void}
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

            if (movableObject.drawCollisionFrame && movableObject.collidable !== false) {
                movableObject.drawCollisionFrame(this.ctx);
            }

            if (movableObject.otherDirection) {
                this.flipImageBack(movableObject);
            }
        }
    }

    /**
     * Flips the image horizontally for objects facing the opposite direction.
     * @param {MovableObject} movableObject - The object to flip
     * @returns {void}
     */
    flipImage(movableObject) {
        this.ctx.save();
        this.ctx.translate(movableObject.width, 0);
        this.ctx.scale(-1, 1);
        movableObject.x = movableObject.x * -1;
    }

    /**
     * Restores the canvas state after flipping an image.
     * @param {MovableObject} movableObject - The object to restore
     * @returns {void}
     */
    flipImageBack(movableObject) {
        movableObject.x = movableObject.x * -1;
        this.ctx.restore();
    }
            
}
