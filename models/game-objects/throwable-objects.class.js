/**
 * Represents throwable objects like bombs that can be thrown by the character
 * @extends MovableObject
 */
class ThrowableObjects extends MovableObject {
    /**
     * Explosion image sequence for the bomb
     * @type {string[]}
     */
    IMAGES_EXPLOSION = [
        'img/Collision_Fx/Fx02/skeleton-Fx2_0.png',
        'img/Collision_Fx/Fx02/skeleton-Fx2_1.png',
        'img/Collision_Fx/Fx02/skeleton-Fx2_2.png',
        'img/Collision_Fx/Fx02/skeleton-Fx2_3.png',
        'img/Collision_Fx/Fx02/skeleton-Fx2_4.png',
        'img/Collision_Fx/Fx02/skeleton-Fx2_5.png',
        'img/Collision_Fx/Fx02/skeleton-Fx2_6.png',
        'img/Collision_Fx/Fx02/skeleton-Fx2_7.png',
        'img/Collision_Fx/Fx02/skeleton-Fx2_8.png',
        'img/Collision_Fx/Fx02/skeleton-Fx2_9.png'
    ];

    /**
     * Indicates if the bomb has already exploded
     * @type {boolean}
     */
    hasExploded = false;
    /**
     * Indicates if the bomb is currently exploding
     * @type {boolean}
     */
    isExploding = false;

    /**
     * Returns the current rectangle of the explosion
     * @returns {{x: number, y: number, width: number, height: number}|null}
     */
    getExplosionRect() {
        if (!this.isExploding) return null;
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
    }
    IMAGES_EXPLOSION = [
        'img/Collision_Fx/Fx02/skeleton-Fx2_0.png',
        'img/Collision_Fx/Fx02/skeleton-Fx2_1.png',
        'img/Collision_Fx/Fx02/skeleton-Fx2_2.png',
        'img/Collision_Fx/Fx02/skeleton-Fx2_3.png',
        'img/Collision_Fx/Fx02/skeleton-Fx2_4.png',
        'img/Collision_Fx/Fx02/skeleton-Fx2_5.png',
        'img/Collision_Fx/Fx02/skeleton-Fx2_6.png',
        'img/Collision_Fx/Fx02/skeleton-Fx2_7.png',
        'img/Collision_Fx/Fx02/skeleton-Fx2_8.png',
        'img/Collision_Fx/Fx02/skeleton-Fx2_9.png'
    ];

    hasExploded = false;
    isExploding = false;

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
        this.throw();
    }

    /**
     * Initiates the throwing physics for the object
     * Sets initial velocity, acceleration and applies gravity
     * Adjusts horizontal speed based on character direction
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
     * Handles the explosion of the throwable object
     * Stops the object movement, plays explosion animation and marks the object as exploded
     */
    explode() {
        if (this.hasExploded) return;
        this.hasExploded = true;
        clearInterval(this.moveInterval);
        this.speedX = 0;
        this.speedY = 0;
        this.loadImages(this.IMAGES_EXPLOSION);

        const centerX = this.x + this.width / 2;
        const centerY = this.y + this.height / 2;
        this.width = 150;
        this.height = 150;
        this.x = centerX - this.width / 2;
        this.y = centerY - this.height / 2 - 30; 

        this.isExploding = true;
        this.currentImage = 0;
        this.images = this.IMAGES_EXPLOSION;
        this.img = this.imageCache[this.IMAGES_EXPLOSION[0]];

        this.explosionInterval = setInterval(() => {
            this.currentImage++;
            if (this.currentImage < this.IMAGES_EXPLOSION.length) {
                this.img = this.imageCache[this.IMAGES_EXPLOSION[this.currentImage]];
            } else {
                clearInterval(this.explosionInterval);
                this.isExploding = false;
                this.visible = false;
            }
        }, 50);
    }

    /**
     * Called regularly in the game loop to animate the object if needed
     */
    animate() {
    }

    /**
     * Draws the bomb including explosion and blue border
     * @param {CanvasRenderingContext2D} ctx - The 2D rendering context
     */
    draw(ctx) {
        if (this.visible === false) return;
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
        if (this.isExploding) {
            ctx.save();
            ctx.strokeStyle = 'blue';
            ctx.lineWidth = 4;
            ctx.strokeRect(this.x, this.y, this.width, this.height);
            ctx.restore();
        }
    }
}