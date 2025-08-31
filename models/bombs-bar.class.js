/**
 * Displays the collected bombs as a bar with 5 circles. Collected bombs are shown as bomb images, uncollected as transparent gray circles.
 * @class BombsBar
 */
class BombsBar {
    /**
     * Creates a BombsBar instance.
     * @param {number} x - X position of the bar
     * @param {number} y - Y position of the bar
     * @param {number} maxBombs - Maximum number of bombs (default: 5)
     */
    constructor(x = 30, y = 70, maxBombs = 5) {
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
     * @param {number} count
     */
    setBombs(count) {
        this.collected = Math.max(0, Math.min(count, this.maxBombs));
    }

    /**
     * Draws the bombs bar on the canvas.
     * @param {CanvasRenderingContext2D} ctx
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
