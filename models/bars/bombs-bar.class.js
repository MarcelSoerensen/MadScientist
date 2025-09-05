/**
 * @class BombsBar
 * @extends DrawableObject
 * Displays the collected bombs as a bar with circles. Collected bombs are shown as bomb images, uncollected as transparent gray circles.
 */
class BombsBar extends DrawableObject {
    /** @type {number} X position of the bar */
    x;
    /** @type {number} Y position of the bar */
    y;
    /** @type {number} Maximum number of bombs */
    maxBombs;
    /** @type {number} Number of collected bombs */
    collected = 0;
    /** @type {number} Radius of each bomb circle */
    radius = 9;
    /** @type {number} Spacing between bomb circles */
    spacing = 12;
    /** @type {HTMLImageElement} Bomb image */
    bombImg;

    /**
     * Creates a BombsBar instance.
     * @param {number} [x=30] - X position of the bar
     * @param {number} [y=70] - Y position of the bar
     * @param {number} [maxBombs=5] - Maximum number of bombs
     */
    constructor(x = 30, y = 70, maxBombs = 5) {
        super();
        this.x = x;
        this.y = y;
        this.maxBombs = maxBombs;
        this.collected = 0;
        this.radius = 9;
        this.spacing = 12;
        this.bombImg = new Image();
        this.bombImg.src = 'img/Projectile/Other/1.png';
    }

    /**
     * Sets the number of collected bombs.
     * @param {number} count - Number of collected bombs
     */
    setBombs(count) {
        this.collected = Math.max(0, Math.min(count, this.maxBombs));
    }

    /**
     * Draws the bombs bar on the canvas.
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
     */
    draw(ctx) {
        for (let i = 0; i < this.maxBombs; i++) {
            const cx = this.x + i * (this.radius * 2 + this.spacing);
            const cy = this.y;
            if (i < this.collected) {
                ctx.save();
                ctx.beginPath();
                ctx.arc(cx, cy, this.radius, 0, 2 * Math.PI);
                ctx.fillStyle = 'rgba(255,255,255,0.5)';
                ctx.fill();
                ctx.globalAlpha = 1;
                const imgRadius = this.radius * 0.8;
                ctx.drawImage(this.bombImg, cx - imgRadius, cy - imgRadius, imgRadius * 2, imgRadius * 2);
                ctx.restore();
            } else {
                ctx.save();
                ctx.globalAlpha = 0.7;
                ctx.beginPath();
                ctx.arc(cx, cy, this.radius, 0, 2 * Math.PI);
                ctx.fillStyle = 'gray';
                ctx.fill();
                ctx.restore();
            }
        }
    }
}
