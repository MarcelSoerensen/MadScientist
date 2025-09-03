/**
 * Represents throwable objects like bombs that can be thrown by the character
 * @extends MovableObject
 */
class ThrowableObjects extends MovableObject {
    /**
     * Factory method to create a throwable object of a given type.
     * @param {string} type - The type of throwable object (e.g. 'bomb').
     * @param {number} x - Initial x position.
     * @param {number} y - Initial y position.
     * @param {boolean} otherDirection - Whether the object should fly to the left.
     * @returns {ThrowableObjects} The created throwable object instance.
     */
    static createThrowableObject(type, x, y, otherDirection = false) {
        switch(type) {
            case 'bomb':
                return new ThrowBomb(x, y, otherDirection);
            default:
                return new ThrowableObjects(x, y, otherDirection);
        }
    }

    /**
     * Creates a new instance of a generic throwable object.
     * @param {number} x - Initial x position.
     * @param {number} y - Initial y position.
     * @param {boolean} otherDirection - Whether the object should fly to the left.
     * @param {string} imagePath - Image path for the object.
     */
    constructor(x, y, otherDirection = false, imagePath = 'img/Projectile/Other/1.png') {
        super().loadImage(imagePath);
        this.x = x;
        this.y = y;
        this.height = 40;
        this.width = 40;
        this.otherDirection = otherDirection;
        this.throw();
    }

    /**
     * Initiates the throwing physics for the object.
     * Sets initial velocity, acceleration and applies gravity.
     * Adjusts horizontal speed based on direction.
     */
    throw() {
        this.speedY = 15;
        this.speedX = this.otherDirection ? -4 : 4;
        this.acceleration = 0.5;
        this.applyGravity();
        this.moveInterval = setInterval(() => {
            this.x += this.speedX;
        }, 1000 / 60);
    }


    /**
     * Can be overridden by subclasses, e.g. for animations.
     */
    animate() {}

    /**
     * Draws the throwable object.
     * @param {CanvasRenderingContext2D} ctx - The 2D rendering context.
     */
    draw(ctx) {
        if (this.visible === false) return;
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }
}