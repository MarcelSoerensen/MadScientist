/**
 * Represents a background object that extends MovableObject
 */
class BackgroundObject extends MovableObject {

    /**
     * Creates a new BackgroundObject instance
     */
    constructor(imagePath, x, y, height, width) {
        super().loadImage(imagePath);
        this.x = x;
        this.y = y;
        this.height = height;
        this.width = width;
    }
}
