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
        this.checkCollisions();
    }
    
    /**
     * Sets up bidirectional reference between world and character
     */
    setWorld() {
        this.character.world = this;
    }

    /**
     * Checks for collisions between character and enemies
     * Runs at 200ms intervals
     */
    checkCollisions() {
        setInterval(() => {
            this.level.enemies.forEach(enemy => {
               if( this.character.isColliding(enemy)) {
                    this.character.hit();
                    console.log(`Collision detected! Character energy: ${this.character.energy}`);   
               }
            });
        },200);
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
     * Draws all game objects (enemies and character)
     */
    drawGameObjects() {
        this.addObjectsToMap(this.enemies);
        this.addToMap(this.character);
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
