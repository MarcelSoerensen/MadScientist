/**
 * Represents throwable objects like bombs that can be thrown by the character
 * @extends MovableObject
 */
class ThrowableObjects extends MovableObject {

    /**
     * Creates a new ThrowableObjects instance
     * @param {number} x - The initial x position
     * @param {number} y - The initial y position
     * @param {boolean} otherDirection - Whether the object should fly to the left
     */
    constructor(x, y, otherDirection = false) {
        super().loadImage('img/Projectile/Other/1.png');
        this.x = x;
        this.y = y;
        this.height = 40;
        this.width = 40;
        this.otherDirection = otherDirection;
        this.throw()
    }

    /**
     * Initiates the throwing physics for the object
     * Sets initial velocity, acceleration and applies gravity
     * Adjusts horizontal speed based on character direction
     */
    throw() {
        this.speedY = 15;
        this.speedX = this.otherDirection ? -8 : 8;
        this.acceleration = 0.5;
        this.applyGravity();
        
        setInterval(() => {
            this.x += this.speedX;
        }, 1000 / 60);
    }
}