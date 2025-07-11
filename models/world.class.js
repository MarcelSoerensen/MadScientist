/**
 * Represents the game world that manages all game objects and rendering
 */
class World{
    /** @type {Character} The player character */
    character = new Character();
    /** @type {Level} Current game level */
    level = level1;
    /** @type {Array} Array of enemy objects */
    enemies = level1.enemies;
    /** @type {Array} Array of background objects */
    backgroundObjects = level1.backgroundObjects;

    /** @type {HTMLCanvasElement} The game canvas */
    canvas;
    /** @type {CanvasRenderingContext2D} The 2D rendering context */
    ctx;
    /** @type {Keyboard} Keyboard input handler */
    keyboard;
    /** @type {number} Camera X position for scrolling */
    camera_x = 0;
    /** @type {StatusBar} The status bar for displaying game stats */
    statusBar = new StatusBar();
    /** @type {Array} Array of throwable objects */
    throwableObjects = [];

    /** @type {boolean} Flag to track if D key was pressed in previous frame */
    lastDKeyState = false;

    /**
     * Creates a new World instance
     * @param {HTMLCanvasElement} canvas - The game canvas
     * @param {Keyboard} keyboard - The keyboard input handler
     */
    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        
        this.draw();
        this.setWorld();
        this.run();
    }
    
    /**
     * Sets up bidirectional reference between world and character
     */
    setWorld() {
        this.character.world = this;
    }

    /**
     * Starts the main game loop
     * Runs collision detection and throwable object checks at different intervals
     */
    run() {
        setInterval(() => {
            this.checkCollisions();
        }, 200);
        
        setInterval(() => {
            this.checkThrowableObjects();
        }, 1000 / 60);
    }

    /**
     * Checks for throwable object creation when D key is pressed
     * Ensures only one projectile is created per key press and starts throw animation
     */
    checkThrowableObjects() {
        if (this.keyboard.D && !this.lastDKeyState && !this.character.throwAnimationPlaying) {
            this.character.playThrowBombAnimation();
            
            setTimeout(() => {
                let bomb = new ThrowableObjects(
                    this.character.x + 160, 
                    this.character.y + 180,
                    this.character.otherDirection
                );
                this.throwableObjects.push(bomb);
            }, 500);
        }
        this.lastDKeyState = this.keyboard.D;
    }

    /**
     * Checks for collisions between the character and enemies
     * Reduces character energy and updates status bar when collision occurs
     */
    checkCollisions() {
        this.level.enemies.forEach(enemy => {
               if( this.character.isColliding(enemy)) {
                    this.character.hit();
                    this.statusBar.setPercentage(this.character.energy);
                    console.log(`Collision detected! Character energy: ${this.character.energy}`);   
               }
            });
        }

    /**
     * Main rendering loop for the game
     * Handles camera translation and draws all game objects
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

        let self = this;
        requestAnimationFrame(function() {
            self.draw();
        });
    }

    /**
     * Draws the main background layers
     */
    drawMainBackground() {
        this.addToMap(this.backgroundObjects[3]);
        this.addToMap(this.backgroundObjects[0]);
    }

    /**
     * Draws the status bar on the map
     * Renders the status bar image and overlays a custom HP bar with trapezoid shape
     */
    drawStatusBar() {
        this.addToMap(this.statusBar);
        
        /** Draw the green HP bar overlay based on character's health percentage */
        if (this.character.energy > 0) {
            /** Use the pre-calculated HP width from the StatusBar */
            const currentHPWidth = this.statusBar.currentHPWidth;
            
            this.ctx.save();
            
            /** Create slanted clipping path for HP-based width */
            const clipStartX = this.statusBar.x + 47;
            const clipWidth = currentHPWidth;
            const widthRatio = clipWidth / 148; // 148 = trapezWidth (195 - 47)
            
            this.ctx.beginPath();
            this.ctx.moveTo(clipStartX, this.statusBar.y + 4);
            this.ctx.lineTo(clipStartX + clipWidth, this.statusBar.y + 4);
            this.ctx.lineTo(clipStartX + clipWidth - (3 * widthRatio), this.statusBar.y + 22);
            this.ctx.lineTo(clipStartX, this.statusBar.y + 28);
            this.ctx.closePath();
            this.ctx.clip();
            
            /** Create trapezoid path for HP bar shape */
            this.ctx.beginPath();
            this.ctx.moveTo(this.statusBar.x + 46, this.statusBar.y + 6.9);    // topLeft
            this.ctx.lineTo(this.statusBar.x + 195, this.statusBar.y + 4);     // topRight
            this.ctx.lineTo(this.statusBar.x + 192, this.statusBar.y + 22);    // bottomRight
            this.ctx.lineTo(this.statusBar.x + 49, this.statusBar.y + 22);     // bottomLeft
            this.ctx.closePath();
            
            /** Create sharp gradient with "kink" effect for HP bar color */
            const gradient = this.ctx.createLinearGradient(0, this.statusBar.y + 6, 0, this.statusBar.y + 22);
            gradient.addColorStop(0, 'rgb(117, 197, 27)');
            gradient.addColorStop(0.4, 'rgb(117, 197, 27)');
            gradient.addColorStop(0.6, 'rgb(103, 178, 27)');
            gradient.addColorStop(1, 'rgb(103, 178, 27)');
            
            this.ctx.fillStyle = gradient;
            this.ctx.fill();
            
            this.ctx.restore();
        }
    }

    /**
     * Draws all game objects (enemies and character)
     */
    drawGameObjects() {
        this.addObjectsToMap(this.enemies);
        this.addToMap(this.character);
        this.addObjectsToMap(this.throwableObjects);
    }

    /**
     * Draws parallax background layers for the top portion
     */
    drawParallaxTop() {
        this.ctx.translate(this.camera_x * 0.25, 0);
        this.addToMap(this.backgroundObjects[6]);
        this.addToMap(this.backgroundObjects[4]);
        this.addToMap(this.backgroundObjects[1]);
        this.ctx.translate(-this.camera_x * 0.25, 0);
    }

    /**
     * Draws parallax background layers for the bottom portion
     */
    drawParallaxBottom() {
        this.ctx.translate(this.camera_x * 0.5, 0);
        this.addToMap(this.backgroundObjects[7]);
        this.addToMap(this.backgroundObjects[5]);
        this.addToMap(this.backgroundObjects[2]);
        this.ctx.translate(-this.camera_x * 0.5, 0);
    }

    /**
     * Adds an array of objects to the map
     * @param {Array} objects - Array of objects to draw
     */
    addObjectsToMap(objects) {
        objects.forEach(object => {
            this.addToMap(object);
        });
    }

    /**
     * Adds a single movable object to the map with proper flipping and collision frames
     * @param {MovableObject} movableObject - The object to add to the map
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

            if (movableObject.drawCollisionFrame) {
                movableObject.drawCollisionFrame(this.ctx);
            }

            if (movableObject.otherDirection) {
                this.flipImageBack(movableObject);
            }
        }
    }

    /**
     * Flips the image horizontally for objects facing the opposite direction
     * @param {MovableObject} movableObject - The object to flip
     */
    flipImage(movableObject) {
        this.ctx.save();
        this.ctx.translate(movableObject.width, 0);
        this.ctx.scale(-1, 1);
        movableObject.x = movableObject.x * -1;
    }

    /**
     * Restores the canvas state after flipping an image
     * @param {MovableObject} movableObject - The object to restore
     */
    flipImageBack(movableObject) {
        movableObject.x = movableObject.x * -1;
        this.ctx.restore();
    }
            
}
