/**
 * Represents the game world. Manages all game objects, rendering, and main game loop.
 * @class World
 */
// @ts-ignore
// eslint-disable-next-line no-undef
// If using modules, use: import EnemyTwo from './enemy-2.class.js';
// Otherwise, ensure EnemyTwo is loaded globally
class World {
    /**
     * Starts the first enemy only if the character is at least 800px away
     */
    checkFirstEnemyDistance() {
        if (this.level && this.level.enemies && this.level.enemies.length > 0) {
            const firstEnemy = this.level.enemies[0];
            if (firstEnemy._delayedStart && Math.abs(this.character.x - firstEnemy.x) >= 800) {
                firstEnemy._delayedStart = false;
                if (!firstEnemy.moveInterval && !firstEnemy.animInterval) {
                    firstEnemy.animate();
                }
            }
        }
    }
    /**
     * Checks for supershot creation when S key is pressed.
     * Fires a large laser, subtracts 5 balls, and counts 3 hits on the enemy.
     * @returns {void}
     */
    checkSuperShot() {
        if (
            this.keyboard.S &&
            this.energyBallManager.collectedCount >= 5 &&
            this.laserBeams.length === 0
        ) {
            let offsetY = 170;
            let offsetX = this.character.otherDirection ? -80 : 220;
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
        /** Initialize EnergyBallManager with character */
        this.energyBallManager = new EnergyBallManager(4000, 600, this.character);
    /** Initialize SuperShotBar */
    this.superShotBar = new SuperShotBar();
    /** Initialize BombsBar */
    this.bombsBar = new BombsBar(65, 50, 5);
    /** Initialize BombManager with character */
    this.bombManager = new BombManager(4000, 600, this.character);
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
                let bomb = new ThrowableObjects(
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
                let offsetX = this.character.otherDirection ? -0 : 220;
                let laser = new LaserBeam(
                    this.character.x + offsetX,
                    this.character.y + offsetY,
                    this.character.otherDirection,
                    this.character,
                    offsetX,
                    offsetY
                );
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
        /**
         * Checks collision between character and all enemies, including Endboss stick hit detection.
         * Triggers character hit and updates status bar if collision occurs.
         */
        this.level.enemies.forEach(enemy => {
            if (!enemy.collidable) {
                return;
            }

            let collided = this.character.isColliding(enemy);

            if (enemy instanceof Endboss && enemy.animState === 'hit' && enemy.collidable) {
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
                        collided = true;
                    }
                }
            }

            
            this.throwableObjects.forEach(bomb => {
                if (bomb.isExploding) {
                    const bombRect = bomb.getExplosionRect();
                    const enemyRect = {
                        x: enemy.x + (enemy.offset?.left || 0),
                        y: enemy.y + (enemy.offset?.top || 0),
                        width: enemy.width - ((enemy.offset?.left || 0) + (enemy.offset?.right || 0)),
                        height: enemy.height - ((enemy.offset?.top || 0) + (enemy.offset?.bottom || 0))
                    };
                    const overlap =
                        enemyRect.x < bombRect.x + bombRect.width &&
                        enemyRect.x + enemyRect.width > bombRect.x &&
                        enemyRect.y < bombRect.y + bombRect.height &&
                        enemyRect.y + enemyRect.height > bombRect.y;
                    const contained =
                        enemyRect.x >= bombRect.x &&
                        enemyRect.y >= bombRect.y &&
                        enemyRect.x + enemyRect.width <= bombRect.x + bombRect.width &&
                        enemyRect.y + enemyRect.height <= bombRect.y + bombRect.height;
                    if (overlap || contained) {
                        console.log('Bomb Kollision:', { bomb, enemy, overlap, contained });
                        if (enemy instanceof Endboss) {
                            enemy.triggerElectricHurt(5);
                        } else if (typeof enemy.startDeathAnimation === 'function' && !enemy.isDeadAnimationPlaying) {
                            enemy.startDeathAnimation();
                        }
                    }
                }
            });

            if (collided) {
                this.character.hit();
                this.statusBar.setPercentage(this.character.energy);
            }
            this.laserBeams.forEach(laser => {
                if (laser.isColliding(enemy)) {
                    if (enemy instanceof Endboss) {
                        if (laser.isSuperShot) {
                            enemy.triggerElectricHurt(5);
                        } else {
                            enemy.triggerElectricHurt(1);
                        }
                    } else {
                        if (laser.isSuperShot) {
                            enemy.triggerElectricHurt(3);
                        } else {
                            enemy.triggerElectricHurt(1);
                        }
                    }
                }
            });
        });
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
            const superShots = Math.floor(this.energyBallManager.collectedCount / 5);
            if (superShots > 0) {
                this.ctx.save();
                this.ctx.font = 'bold 18px "Comic Sans MS", "Comic Sans", cursive, sans-serif';
                this.ctx.textAlign = 'left';
                const barX = this.superShotBar.x || 0;
                const barY = this.superShotBar.y || 0;
                const barWidth = this.superShotBar.width || 120;
                const textX = barX + barWidth - 21;
                const textY = barY + (this.superShotBar.height ? this.superShotBar.height / 2 + 6 : 37);
                this.ctx.lineWidth = 4;
                this.ctx.strokeStyle = 'black';
                this.ctx.strokeText(superShots, textX, textY);
                this.ctx.fillStyle = 'rgba(255,255,255,1)';
                this.ctx.fillText(superShots, textX, textY);
                this.ctx.restore();
            }
        }
        if (this.bombsBar && this.bombManager) {
            this.bombsBar.setBombs(this.bombManager.collectedCount);
            this.bombsBar.draw(this.ctx);
        }

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
        
        if (this.character.energy > 0) {
            const currentHPWidth = this.statusBar.currentHPWidth;
            this.ctx.save();
            const clipStartX = this.statusBar.x + 47;
            const clipWidth = currentHPWidth;
            const widthRatio = clipWidth / 148;
            this.ctx.beginPath();
            this.ctx.moveTo(clipStartX, this.statusBar.y + 4);
            this.ctx.lineTo(clipStartX + clipWidth, this.statusBar.y + 4);
            this.ctx.lineTo(clipStartX + clipWidth - (3 * widthRatio), this.statusBar.y + 22);
            this.ctx.lineTo(clipStartX, this.statusBar.y + 28);
            this.ctx.closePath();
            this.ctx.clip();
            this.ctx.beginPath();
            this.ctx.moveTo(this.statusBar.x + 46, this.statusBar.y + 6.9);
            this.ctx.lineTo(this.statusBar.x + 195, this.statusBar.y + 4);
            this.ctx.lineTo(this.statusBar.x + 192, this.statusBar.y + 22);
            this.ctx.lineTo(this.statusBar.x + 49, this.statusBar.y + 22);
            this.ctx.closePath();
            const gradient = this.ctx.createLinearGradient(0, this.statusBar.y + 6, 0, this.statusBar.y + 22);
            gradient.addColorStop(0, 'rgb(117, 197, 27)');
            gradient.addColorStop(0.4, 'rgb(117, 197, 27)');
            gradient.addColorStop(0.6, 'rgb(103, 178, 27)');
            gradient.addColorStop(1, 'rgb(103, 178, 27)');
            this.ctx.fillStyle = gradient;
            this.ctx.fill();
            this.ctx.restore();
        }
        
        if (this.superShotBar) {
            this.superShotBar.draw(this.ctx);
        }
    }

    /**
     * Draws all game objects (enemies, character, projectiles, energy balls).
     * @returns {void}
     */
    drawGameObjects() {
        this.addObjectsToMap(this.enemies);
        this.addToMap(this.character);
        this.addObjectsToMap(this.throwableObjects);
        this.addObjectsToMap(this.laserBeams);
        if (this.energyBallManager) {
            this.energyBallManager.update(this.character);
            this.energyBallManager.draw(this.ctx);
            if (this.superShotBar) {
                this.superShotBar.setBalls(this.energyBallManager.collectedCount);
            }
        }
        if (this.bombManager) {
            this.bombManager.update(this.character);
            this.bombManager.draw(this.ctx);
        }
        if (this.bombsBar && this.bombManager) {
            this.bombsBar.setBombs(this.bombManager.collectedCount);
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
