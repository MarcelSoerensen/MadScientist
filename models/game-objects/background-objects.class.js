/**
 * Represents a background object that extends MovableObject
 * Used for static background elements like scenery
 * @extends MovableObject
 */
class BackgroundObject extends MovableObject {

    /**
     * Creates a new BackgroundObject instance
     * @param {string} imagePath - Path to the background image
     * @param {number} x - X coordinate position
     * @param {number} y - Y coordinate position
     * @param {number} height - Height of the background object
     * @param {number} width - Width of the background object
     */
    constructor(imagePath, x, y, height, width) {
        super().loadImage(imagePath);
        this.x = x;
        this.y = y;
        this.height = height;
        this.width = width;
    }
}
