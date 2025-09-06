/**
 * @class SuperShotBar
 * @extends DrawableObject
 * Displays the collected energy balls as a filling bar using a graphic. Shows the number of available super shots.
 */
class SuperShotBar extends DrawableObject {
    /**
     * Gibt die aktuelle Anzahl der verfügbaren Supershots zurück
     */
    getSuperShots() {
        return Math.floor(this.collectedCount / this.maxBalls);
    }
    /** @type {string} Path to the bar image */
    imgPath = 'img/Projectile/Laser/skeleton-animation_2.png';
    /** @type {number} Number of collected balls (tracked internally) */
    collectedCount = 0;
    /** @type {number} Maximum number of balls for one super shot */
    maxBalls = 5;
    /** @type {number} Maximum width of the bar in px */
    maxWidth = 147;
    /** @type {number} Calculated width for current state */
    currentBallWidth = 0;
    /** @type {number} X position of the bar */
    x = 52;
    /** @type {number} Y position of the bar */
    y = 16.9;
    /** @type {number} Height of the bar */
    height = 25;
    /** @type {number} Width of the bar */
    width = 147;

    /**
     * Creates a SuperShotBar instance and initializes its properties.
     * @param {number} [x=52] - X position of the bar
     * @param {number} [y=16.9] - Y position of the bar
     * @param {number} [maxBalls=5] - Maximum balls for one super shot
     */
    constructor(x = 52, y = 16.9, maxBalls = 5) {
        super();
        this.x = x;
        this.y = y;
        this.maxBalls = maxBalls;
        this.width = 147;
        this.height = 25;
        this.maxWidth = 147;
        this.loadImage(this.imgPath);
        this.setBalls(0);
    }

    /**
     * Sets the number of collected balls and updates the bar width.
     * @param {number} count - Number of collected balls
     */
    setBalls(count) {
        this.collectedCount = Math.max(0, count);
        this.currentBallWidth = (this.maxWidth * Math.min(this.collectedCount, this.maxBalls)) / this.maxBalls;
    }

    /**
     * Draws the energy ball bar and the superlaser count.
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
     */
    draw(ctx) {
        const visibleWidth = (this.maxWidth * Math.min(this.collectedCount, this.maxBalls)) / this.maxBalls;
        ctx.save();
        ctx.beginPath();
        ctx.rect(this.x, this.y, visibleWidth, this.height);
        ctx.clip();
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
        ctx.restore();

        const superShots = Math.floor(this.collectedCount / this.maxBalls);
        if (superShots > 0) {
            ctx.save();
            ctx.font = 'bold 18px "Comic Sans MS", "Comic Sans", cursive, sans-serif';
            ctx.textAlign = 'left';
            const textX = this.x + this.width - 21;
            const textY = this.y + (this.height ? this.height / 2 + 6 : 37);
            ctx.lineWidth = 4;
            ctx.strokeStyle = 'black';
            ctx.strokeText(superShots, textX, textY);
            ctx.fillStyle = 'rgba(255,255,255,1)';
            ctx.fillText(superShots, textX, textY);
            ctx.restore();
        }
    }
}