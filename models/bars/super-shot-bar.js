/**
 * Displays the collected energy balls as a filling bar using a graphic. Shows the number of available super shots.
 */
class SuperShotBar extends DrawableObject {
    /**
     * Returns the current number of available super shots.
     */
    getSuperShots() {
        return Math.floor(this.collectedCount / this.maxBalls);
    }
    imgPath = 'img/Projectile/Laser/skeleton-animation_2.png';
    collectedCount = 0;
    maxBalls = 5;
    maxWidth = 147;
    currentBallWidth = 0;
    x = 52;
    y = 16.9;
    height = 25;
    width = 147;

    /**
     * Creates a SuperShotBar instance and initializes its properties.
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
     */
    setBalls(count) {
        this.collectedCount = Math.max(0, count);
        this.currentBallWidth = (this.maxWidth * Math.min(this.collectedCount, this.maxBalls)) / this.maxBalls;
    }

    /**
     * Draws the energy ball bar and the superlaser count.
     */
    draw(ctx) {
        this.drawBarFill(ctx);
        this.drawSuperShotCount(ctx);
    }

    /**
     * Draws the filling portion of the bar using currentBallWidth.
     */
    drawBarFill(ctx) {
        const visibleWidth = this.currentBallWidth;
        ctx.beginPath();
        ctx.rect(this.x, this.y, visibleWidth, this.height);
        ctx.clip();
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
        ctx.restore();
    }

    /**
     * Draws the numeric count of available super shots (if > 0).
     */
    drawSuperShotCount(ctx) {
        const superShots = this.getSuperShots();
        if (superShots <= 0) return;
        ctx.save();
        ctx.font = 'bold 18px "Comic Relief", "Comic Sans MS", "Comic Sans", cursive, sans-serif';
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