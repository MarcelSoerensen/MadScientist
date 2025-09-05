/**
 * @class StatusBar
 * @extends DrawableObject
 * Displays the character health and other game statistics as a status bar.
 */
class StatusBar extends DrawableObject {
    /** @type {Array<string>} Array of image paths for the status bar */
    IMAGES = [
        'img/User Interfaces/ProfileBar.png'
    ];
    /** @type {number} X position of the bar */
    x = 5;
    /** @type {number} Y position of the bar */
    y = 15;
    /** @type {number} Width of the bar */
    width = 200;
    /** @type {number} Height of the bar */
    height = 60;
    /** @type {number} Current health percentage (0-100) */
    percentage = 100;
    /** @type {number} Current calculated HP bar width in pixels */
    currentHPWidth = 148;

    /**
     * Creates a new StatusBar instance.
     * @param {number} [x=5] - X position of the bar
     * @param {number} [y=15] - Y position of the bar
     * @param {number} [width=200] - Width of the bar
     * @param {number} [height=60] - Height of the bar
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
     * @param {number} percentage - The health percentage (0-100)
     */
    setPercentage(percentage) {
        this.percentage = percentage;
        const trapezWidth = 148;
        this.currentHPWidth = (trapezWidth * percentage) / 100;
    }

    /**
     * Draws the HP bar as a trapezoid with gradient fill on the given canvas context.
     * @param {CanvasRenderingContext2D} ctx - The canvas context to draw on
     */
    drawHPBar(ctx) {
        if (this.percentage > 0) {
            ctx.save();
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
            ctx.beginPath();
            ctx.moveTo(this.x + 46, this.y + 6.9);
            ctx.lineTo(this.x + 195, this.y + 4);
            ctx.lineTo(this.x + 192, this.y + 22);
            ctx.lineTo(this.x + 49, this.y + 22);
            ctx.closePath();
            const gradient = ctx.createLinearGradient(0, this.y + 6, 0, this.y + 22);
            gradient.addColorStop(0, 'rgb(117, 197, 27)');
            gradient.addColorStop(0.4, 'rgb(117, 197, 27)');
            gradient.addColorStop(0.6, 'rgb(103, 178, 27)');
            gradient.addColorStop(1, 'rgb(103, 178, 27)');
            ctx.fillStyle = gradient;
            ctx.fill();
            ctx.restore();
        }
    }
}