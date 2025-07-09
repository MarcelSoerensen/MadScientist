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
            let delay = delays[frame] || 60;
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
        ctx.strokeStyle = 'transparent';
        ctx.lineWidth = 2;
        ctx.strokeRect(this.x, this.y, this.width, this.height);
        }
    }

    isColliding(movableObject){

        if (this.offset && movableObject.offset && 
            this.offset.left !== undefined && this.offset.right !== undefined &&
            this.offset.top !== undefined && this.offset.bottom !== undefined &&
            movableObject.offset.left !== undefined && movableObject.offset.right !== undefined &&
            movableObject.offset.top !== undefined && movableObject.offset.bottom !== undefined) {
            
            return (
                this.x + this.offset.left < movableObject.x + movableObject.width - movableObject.offset.right &&
                this.x + this.width - this.offset.right > movableObject.x + movableObject.offset.left &&
                this.y + this.offset.top < movableObject.y + movableObject.height - movableObject.offset.bottom &&
                this.y + this.height - this.offset.bottom > movableObject.y + movableObject.offset.top
            );
        } else {

            return  this.x + this.width > movableObject.x &&
                    this.y + this.height > movableObject.y &&
                    this.x < movableObject.x + movableObject.width &&
                    this.y < movableObject.y + movableObject.height;
        }
    }

    hit() {
        this.energy -= 5;
        if (this.energy < 0) {
            this.energy = 0;
        }
    }

    isDead() {
        return this.energy == 0;
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