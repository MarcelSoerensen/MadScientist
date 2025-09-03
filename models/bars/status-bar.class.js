/**
 * Represents the status bar that displays character health and other game statistics
 */
class StatusBar extends DrawableObject {

    /** @type {Array<string>} Array of image paths for the status bar */
    IMAGES = [
        'img/User Interfaces/ProfileBar.png'
    ];

    /** @type {number} Current health percentage (0-100) */
    percentage;
    /** @type {number} Current calculated HP bar width in pixels */
    currentHPWidth;

    /**
     * Creates a new StatusBar instance
     * Initializes position, size, and sets full health (100%)
     */
    constructor() {
        super();
        this.loadImage(this.IMAGES);
        this.x = 5;
        this.y = 15;
        this.width = 200;
        this.height = 60;
        this.setPercentage(100);
    }

    /**
     * Sets the health percentage and calculates the corresponding HP bar width
     * @param {number} percentage - The health percentage (0-100)
     */
    setPercentage(percentage) {
        this.percentage = percentage;
        const trapezWidth = 148;
        this.currentHPWidth = (trapezWidth * percentage) / 100;
    }

}