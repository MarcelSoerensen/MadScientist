class DrawableObject {
    /** @type {HTMLImageElement} Current image being displayed */
    img;
    /** @type {Object.<string, HTMLImageElement>} Cache of loaded images */
    imageCache = {};
     /** @type {number} Current animation frame index */
    currentImage = 0;
    /** @type {number} Y position of the object */
    y = 170;
    /** @type {number} Width of the object */
    width = 300;
    /** @type {number} Height of the object */
    height = 300;

    /**
     * Loads a single image from the given path
     * @param {string} imagePath - Path to the image file
     */
    loadImage(imagePath) {
        this.img = new Image();
        this.img.src = imagePath;
    }

    /**
     * Draws the object on the canvas
     * @param {CanvasRenderingContext2D} ctx - The 2D rendering context
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
     * Draws a frame around the object for debugging purposes
     * @param {CanvasRenderingContext2D} ctx - The 2D rendering context
     */
    drawFrame(ctx) {

        if(this instanceof Character || this instanceof EnemyOne) {
        ctx.strokeStyle = 'transparent';
        ctx.lineWidth = 2;
        ctx.strokeRect(this.x, this.y, this.width, this.height);
        }
    }

    /**
     * Loads multiple images and stores them in the image cache
     * @param {string[]} array - Array of image paths to load
     */
    loadImages(array) {
        array.forEach(imagePath => {
          let img = new Image();
          img.src = imagePath;
          this.imageCache[imagePath] = img;
        });
    }
}