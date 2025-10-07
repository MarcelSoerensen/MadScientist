/**
 * Displays the character health and other game statistics as a status bar.
 */
class StatusBar extends DrawableObject {
    IMAGES = [
        'img/User Interfaces/ProfileBar.png'
    ];
    x = 5;
    y = 15;
    width = 200;
    height = 60;
    percentage = 100;
    currentHPWidth = 148;

    /**
     * Creates a new StatusBar instance.
     */
    constructor(x = 5, y = 15, width = 200, height = 60) {
        super();
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.loadImage(this.IMAGES);
        this.setPercentage(100);
    }

    /**
     * Sets the health percentage and calculates the corresponding HP bar width.
     */
    setPercentage(percentage) {
        this.percentage = percentage;
        const trapezWidth = 148;
        this.currentHPWidth = (trapezWidth * percentage) / 100;
    }

    /**
     * Draws the HP bar as a trapezoid with gradient fill on the given canvas context.
     */
    draw(ctx) {
        ctx.save();
        if (this.img) {
            ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
        }
        if (this.percentage > 0) {
            this.drawHealthOutline(ctx);
            this.drawHealthFill(ctx);
        }
        ctx.restore();
    }

    /**
     * Draws the health outline (clipping shape) on the given canvas context.
     */
    drawHealthOutline(ctx) {
        const clipStartX = this.x + 47;
        const clipWidth = this.currentHPWidth;
        const widthRatio = clipWidth / 148;
        ctx.beginPath();
        ctx.moveTo(clipStartX, this.y + 4);
        ctx.lineTo(clipStartX + clipWidth, this.y + 4);
        ctx.lineTo(clipStartX + clipWidth - (3 * widthRatio), this.y + 22);
        ctx.lineTo(clipStartX, this.y + 28);
        ctx.closePath();
        ctx.clip();
    }

    /**
     * Fills the health bar with a green gradient on the given canvas context.
     */
    drawHealthFill(ctx) {
        ctx.beginPath();
        ctx.moveTo(this.x + 46, this.y + 6.9);
        ctx.lineTo(this.x + 195, this.y + 4);
        ctx.lineTo(this.x + 192, this.y + 22);
        ctx.lineTo(this.x + 49, this.y + 22);
        ctx.closePath();
        const g = ctx.createLinearGradient(0, this.y + 6, 0, this.y + 22);
        g.addColorStop(0, 'rgb(117, 197, 27)');
        g.addColorStop(0.4, 'rgb(117, 197, 27)');
        g.addColorStop(0.6, 'rgb(103, 178, 27)');
        g.addColorStop(1, 'rgb(103, 178, 27)');
        ctx.fillStyle = g;
        ctx.fill();
    }
}