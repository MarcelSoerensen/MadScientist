/**
 * Displays the collected bombs as a bar with circles. Collected bombs are shown as bomb images, uncollected as transparent gray circles.
 */
class BombsBar extends DrawableObject {
    x;
    y;
    maxBombs;
    collected = 0;
    radius = 9;
    spacing = 12;
    bombImg;

    /**
     * Creates a BombsBar instance.
     */
    constructor(x = 30, y = 70, maxBombs = 5) {
        super();
        this.x = x;
        this.y = y;
        this.maxBombs = maxBombs;
        this.collected = 0;
        this.radius = 9;
        this.spacing = 12;
        this.bombImg = ImageCacheManager.getImage('img/Projectile/Other/1.png');
    }

    /**
     * Sets the number of collected bombs.
     */
    setBombs(count) {
        this.collected = Math.max(0, Math.min(count, this.maxBombs));
    }

    /**
     * Draws the bombs bar on the canvas.
     */
    draw(ctx) {
        for (let i = 0; i < this.maxBombs; i++) {
            const cx = this.x + i * (this.radius * 2 + this.spacing);
            const cy = this.y;
            i < this.collected ? this.drawCollectedBomb(ctx, cx, cy) : this.drawEmptyBomb(ctx, cx, cy);
        }
    }

    /**
     * Draws a collected bomb slot (background glow + bomb image).
     */
    drawCollectedBomb(ctx, cx, cy) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(cx, cy, this.radius, 0, 2 * Math.PI);
        ctx.fillStyle = 'rgba(255,255,255,0.5)';
        ctx.fill();
        ctx.globalAlpha = 1;
        const imgRadius = this.radius * 0.8;
        ctx.drawImage(this.bombImg, cx - imgRadius, cy - imgRadius, imgRadius * 2, imgRadius * 2);
        ctx.restore();
    }

    /**
     * Draws an empty (uncollected) bomb slot.
     */
    drawEmptyBomb(ctx, cx, cy) {
        ctx.save();
        ctx.globalAlpha = 0.7;
        ctx.beginPath();
        ctx.arc(cx, cy, this.radius, 0, 2 * Math.PI);
        ctx.fillStyle = 'gray';
        ctx.fill();
        ctx.restore();
    }
}
