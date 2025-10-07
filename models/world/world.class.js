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
        this.cleanup = new WorldCleanup(this);
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
            this.check.checkEndbossXPositionSound();
        }, 1000 / 60));
        this.gameIntervals.push(setInterval(() => {
            this.check.checkStickCollision();
        }, 50));
    }

    /**
     * Cleans up the world by clearing all intervals and references.
     */
    performCleanup() {
        this.cleanup.cleanup();
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
        const img = movableObject.img;
        if (!img || !img.complete || img.naturalWidth <= 0) return; // Bild nicht bereit => nichts zeichnen

        const flipped = !!movableObject.otherDirection;
        if (flipped) this.flipImage(movableObject);

        movableObject.draw(this.ctx);
        movableObject.drawFrame?.(this.ctx);
        this.drawCollisionFrames(movableObject);

        if (flipped) this.flipImageBack(movableObject);
    }

    /**
     * Draws collision frame for Endboss if applicable.
     */
    drawCollisionFrames(movableObject) {
        if (movableObject instanceof Endboss) {
            movableObject.drawCollisionFrameEndboss?.(this.ctx);
            movableObject.drawCollisionFrameStick?.(this.ctx);
            return;
        }
        if (movableObject.drawCollisionFrame && movableObject.collidable !== false) {
            movableObject.drawCollisionFrame(this.ctx);
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
