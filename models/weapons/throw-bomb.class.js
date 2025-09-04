/**
 * Bomb throwing object with explosion and animation
 * Inherits from ThrowableObjects
 */
class ThrowBomb extends ThrowableObjects {
    /**
     * Explosion image sequence
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

    hasExploded = false;
    isExploding = false;

    /**
     * Creates a new bomb instance
     * @param {number} x
     * @param {number} y
     * @param {boolean} otherDirection
     */
    constructor(x, y, otherDirection = false) {
        super(x, y, otherDirection, 'img/Projectile/Other/1.png');
    }

    /**
     * Returns the current explosion rectangle
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

    /**
     * Executes the explosion
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
            try {
                const explosionSound = new Audio('sounds/explosion.flac');
                explosionSound.play();
            } catch (e) {
            }

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
     * Animation of the bomb (optional)
     */
    animate() {
    }

    /**
     * Draws the bomb including explosion and blue border
     * @param {CanvasRenderingContext2D} ctx
     */
    draw(ctx) {
        if (this.visible === false) return;
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
        if (this.isExploding) {
            ctx.save();
            ctx.strokeStyle = 'rgba(0,0,0,0)';
            ctx.lineWidth = 4;
            ctx.strokeRect(this.x, this.y, this.width, this.height);
            ctx.restore();
        }
    }
}
