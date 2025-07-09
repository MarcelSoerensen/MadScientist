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
    energy = 100;


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

    draw(ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }

    drawFrame(ctx) {

        if(this instanceof Character || this instanceof EnemyOne) {
        ctx.strokeStyle = 'blue';
        ctx.lineWidth = 2;
        ctx.strokeRect(this.x, this.y, this.width, this.height);
        }
    }

    isColliding(movableObject){
        return  this.x + this.width > movableObject.x &&
                this.y + this.height > movableObject.y &&
                this.x < movableObject.x + movableObject.width &&
                this.y < movableObject.y + movableObject.height;
    }

    playAnimation(images) {
        let currentImageIndex = this.currentImage % images .length;
        let imagePath = images[currentImageIndex];
        this.img = this.imageCache[imagePath];
        this.currentImage++;
    }

    moveRight(moveSpeed = this.speed) {
        this.x += moveSpeed;
    }

    moveLeft(moveSpeed = this.speed) {
        this.x -= moveSpeed;  
    }

}