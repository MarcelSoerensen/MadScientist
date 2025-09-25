/**
 * Represents the game world. Manages all game objects, rendering, and main game loop.
 */
class World {
    gameOver = false;
    lastCollisionSoundTime = 0;
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
    gameIntervals = [];

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
        this.check = new WorldCheck(this);
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
     * Sets the world reference for all enemies after loading the level
     */
    setWorldReferenceForEnemies() {
        if (this.enemies) {
            this.enemies.forEach(enemy => {
                enemy.world = this;
            });
        }
    }

    /**
     * Starts the main game loop. Runs collision detection and throwable object checks at different intervals.
     */
    run() {
        this.gameIntervals.push(setInterval(() => {
            this.check.checkCollisions();
        }, 200));
        
        this.gameIntervals.push(setInterval(() => {
            this.check.checkThrowableObjects();
            this.check.checkLaserBeams();
            this.check.checkSuperShot();
            this.check.checkFirstEnemyDistance();
        }, 1000 / 60));
        
        this.gameIntervals.push(setInterval(() => {
            this.check.checkStickCollision();
        }, 50));
    }

    /**
     * Cleans up the world by clearing all intervals and references.
     */
    cleanup() {
        this.cleanupIntervals();
        this.cleanupAnimations();
        this.cleanupCharacter();
        this.cleanupEnemies();
        this.cleanupManagers();
        this.cleanupCanvas();
    }

    /**
     * Cleans up all game intervals.
     */
    cleanupIntervals() {
        this.gameIntervals.forEach(interval => {
            clearInterval(interval);
        });
        this.gameIntervals = [];
    }

    /**
     * Cleans up animation frames and drawing loops.
     */
    cleanupAnimations() {
        if (this.worldDraw && this.worldDraw.animationFrameId) {
            cancelAnimationFrame(this.worldDraw.animationFrameId);
        }
    }

    /**
     * Cleans up character-related intervals.
     */
    cleanupCharacter() {
        if (this.character && this.character.handler && typeof this.character.handler.clearAllIntervals === 'function') {
            this.character.handler.clearAllIntervals();
        }
    }

    /**
     * Cleans up all enemy intervals and references.
     */
    cleanupEnemies() {
        if (this.enemies) {
            this.enemies.forEach(enemy => {
                if (enemy.clearIntervals && typeof enemy.clearIntervals === 'function') {
                    enemy.clearIntervals();
                }
                if (enemy.moveInterval) {
                    clearInterval(enemy.moveInterval);
                    enemy.moveInterval = null;
                }
                if (enemy.animInterval) {
                    clearInterval(enemy.animInterval);
                    enemy.animInterval = null;
                }
                if (enemy.deathAnimInterval) {
                    clearInterval(enemy.deathAnimInterval);
                    enemy.deathAnimInterval = null;
                }
            });
        }
    }

    /**
     * Cleans up manager references.
     */
    cleanupManagers() {
        if (this.energyBallManager) this.energyBallManager = null;
        if (this.bombManager) this.bombManager = null;
        if (this.heartsManager) this.heartsManager = null;
    }

    /**
     * Cleans up canvas content.
     */
    cleanupCanvas() {
        if (this.ctx) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }

    /**
     * Adds multiple objects to the map.
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
