/**
 * Displays the collected energy balls as a filling bar using a graphic.
 * Only the bar is shown, the count is tracked internally.
 * @class SuperShotBar
 * @extends DrawableObject
 */
class SuperShotBar extends DrawableObject {
    /** @type {string} Path to the bar image */
    imgPath = 'img/Projectile/Laser/skeleton-animation_2.png';
    /** @type {number} Number of collected balls (tracked internally) */
    collectedCount = 0;
    /** @type {number} Maximum number of balls */
    maxBalls = 5;
    /** @type {number} Maximum width of the bar in px */
    maxWidth = 80;
    /** @type {number} Calculated width for current state */
    currentBallWidth = 0;

    /**
     * Creates a SuperShotBar instance and initializes its properties.
     */
    constructor() {
        super();
        this.loadImage(this.imgPath);
        this.x = 52;
        this.y = 16.9;
        this.width = 147;
        this.height = 25;
        this.maxWidth = 147;
        this.setBalls(0);
    }

    /**
     * Sets the number of collected balls and updates the bar width.
     * @param {number} count - Number of collected balls
     */
    /**
     * Sets the number of collected balls and updates the bar width.
     * @param {number} count - Number of collected balls
     */
    setBalls(count) {
        this.collectedCount = Math.max(0, Math.min(count, this.maxBalls));
        this.currentBallWidth = (this.maxWidth * this.collectedCount) / this.maxBalls;
    }

    /**
     * Draws the energy ball bar.
     * @param {CanvasRenderingContext2D} ctx
     */
    /**
     * Draws the energy ball bar.
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
     */
    draw(ctx) {
        const visibleWidth = (this.maxWidth * this.collectedCount) / this.maxBalls;
        ctx.save();
        ctx.beginPath();
        ctx.rect(this.x, this.y, visibleWidth, this.height);
        ctx.clip();
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
        ctx.restore();
    }
}