class MovableObject {
    
    y = 170;
    width = 300;
    height = 300;
    img;
    imageCache = {};
    currentImage = 0;
    speed = 0.15;
    otherDirection = false;
    speedY = 0;
    acceleration = 1;


    applyGravityForAnimation(images, delays, onDone) {
        let frame = 0;
        let self = this;

        function animateFrame() {
            self.img = self.imageCache[images[frame]];
            let delay = delays[frame] || 70;
            frame++;
            if (frame < images.length) {
                setTimeout(animateFrame, delay);
            } else {
                if (onDone) onDone();
            }
        }

        animateFrame();
    }

    isAboveGround() {
        return this.isAboveGroundActive;
    }

    loadImage(imagePath) {
        this.img = new Image();
        this.img.src = imagePath;
    }

    loadImages(array) {
        array.forEach(imagePath => {
          let img = new Image();
          img.src = imagePath;
          this.imageCache[imagePath] = img;
        });
    }

    playAnimation(images) {
        let currentImageIndex = this.currentImage % images .length;
        let imagePath = images[currentImageIndex];
        this.img = this.imageCache[imagePath];
        this.currentImage++;
    }

    moveRight(moveSpeed = this.speed) {
        this.x += moveSpeed;
        
        setInterval(() => {
        }, 1000 / 60);
    }

    moveLeft(moveSpeed = this.speed) {
        this.x -= moveSpeed;
        
        setInterval(() => {
        }, 1000 / 60);
    }

}