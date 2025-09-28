/**
 * Base class for all drawable objects in the game.
 */
class DrawableObject {
    
    img;
    imageCache = {};
    currentImage = 0;
    y = 170;
    width = 300;
    height = 300;

    /**
     * Loads a single image from the given path.
     */
    loadImage(imagePath) {
    this.img = ImageCacheManager.getImage(imagePath);
    }

    /**
     * Draws the object on the canvas.
     */
    draw(ctx) {
        if (this.visible === false) return;
        if (this.img && this.img.src) {
            if (this.img.src.includes('1.png')) {
                ctx.drawImage(this.img, 0, 0, this.img.width - 1, this.img.height, this.x, this.y, this.width - 1, this.height);
                return;
            }
            if (this.img.src.includes('2.png')) {
                ctx.drawImage(this.img, 1, 0, this.img.width - 1, this.img.height, this.x, this.y, this.width - 1, this.height);
                return;
            }
        }
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }

    /**
     * Draws a frame around the object for debugging purposes.
     */
    drawFrame(ctx) {

        if(this instanceof Character || this instanceof EnemyOne) {
        ctx.strokeStyle = 'transparent';
        ctx.lineWidth = 2;
        ctx.strokeRect(this.x, this.y, this.width, this.height);
        }
    }

    /**
     * Loads multiple images and stores them in the image cache.
     */
    loadImages(array) {
                array.forEach(imagePath => {
                    this.imageCache[imagePath] = ImageCacheManager.getImage(imagePath);
                });
    }
}