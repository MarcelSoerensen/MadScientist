/**
 * Represents throwable objects like bombs that can be thrown by the character
 */
class ThrowableObjects extends MovableObject {
    /**
     * Factory method to create a throwable object of a given type.
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
     */
    draw(ctx) {
        if (this.visible === false) return;
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }
}