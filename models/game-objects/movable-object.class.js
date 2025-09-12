/**
 * Base class for all movable objects in the game
 */
class MovableObject extends DrawableObject {
    
    speed = 0.15;
    otherDirection = false;
    speedY = 0;
    acceleration = 1;
    energy = 100;
    lastHit = 0;

    /**
     * Applies gravity to the object, updating its vertical position and speed.
     */
    applyGravity() {
        this.gravityInterval = setInterval(() => {
            if (this instanceof ThrowableObjects && this.hasExploded) {
                clearInterval(this.gravityInterval);
                return;
            }

            this.y -= this.speedY;
            this.speedY -= this.acceleration;

            const GROUND_Y = 400;
            if (this instanceof ThrowableObjects && !this.hasExploded && this.y + this.height >= GROUND_Y) {
                this.y = GROUND_Y - this.height;
                this.explode();
            }
        }, 1000 / 60);
    }

    /**
     * Applies gravity animation with custom delays.
     */
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

    /**
     * Checks if the object is currently above ground.
     */
    isAboveGround() {
        return this.isAboveGroundActive;
    }

    /**
     * Checks if this object is colliding with another movable object.
     */
    isColliding(movableObject){
        if (this.collidable === false || movableObject.collidable === false) {
            return false;
        }
        if (this.offset && movableObject.offset && 
            this.offset.left !== undefined && this.offset.right !== undefined &&
            this.offset.top !== undefined && this.offset.bottom !== undefined &&
            movableObject.offset.left !== undefined && movableObject.offset.right !== undefined &&
            movableObject.offset.top !== undefined && movableObject.offset.bottom !== undefined) {
            let thisYPos = this.y;
            let otherYPos = movableObject.y;
            if (this.jumpOffsetY !== undefined) {
                thisYPos += this.jumpOffsetY * 1.5;
            }
            if (movableObject.jumpOffsetY !== undefined) {
                otherYPos += movableObject.jumpOffsetY * 1.5;
            }
            let leftOffsetA = this.offset.left;
            let rightOffsetA = this.offset.right;
            if (this instanceof Character && this.otherDirection) {
                leftOffsetA = this.offset.right;
                rightOffsetA = this.offset.left;
            }
            let leftOffsetB = movableObject.offset.left;
            let rightOffsetB = movableObject.offset.right;
            if (movableObject instanceof Character && movableObject.otherDirection) {
                leftOffsetB = movableObject.offset.right;
                rightOffsetB = movableObject.offset.left;
            }
            const leftA = this.x + leftOffsetA;
            const rightA = this.x + this.width - rightOffsetA;
            const topA = thisYPos + this.offset.top;
            const bottomA = thisYPos + this.height - this.offset.bottom;
            const leftB = movableObject.x + leftOffsetB;
            const rightB = movableObject.x + movableObject.width - rightOffsetB;
            const topB = otherYPos + movableObject.offset.top;
            const bottomB = otherYPos + movableObject.height - movableObject.offset.bottom;
            const collision =
                leftA < rightB &&
                rightA > leftB &&
                topA < bottomB &&
                bottomA > topB;
            const contained =
                leftA >= leftB &&
                rightA <= rightB &&
                topA >= topB &&
                bottomA <= bottomB;
            if (collision || contained) {
                if (this.constructor.name === 'ThrowableObjects' || movableObject.constructor.name === 'ThrowableObjects') {
                    console.log('Bomb Kollision:', {
                        bomb: this.constructor.name === 'ThrowableObjects' ? this : movableObject,
                        other: this.constructor.name === 'ThrowableObjects' ? movableObject : this,
                        collision,
                        contained
                    });
                } else {
                    console.log('isColliding detected:', {
                        objectA: {leftA, rightA, topA, bottomA, x: this.x, y: this.y, w: this.width, h: this.height, offset: this.offset},
                        objectB: {leftB, rightB, topB, bottomB, x: movableObject.x, y: movableObject.y, w: movableObject.width, h: movableObject.height, offset: movableObject.offset}
                    });
                }
            }
            return collision || contained;
        } else {
            const collision =  this.x + this.width > movableObject.x &&
                    this.y + this.height > movableObject.y &&
                    this.x < movableObject.x + movableObject.width &&
                    this.y < movableObject.y + movableObject.height;
            if (collision) {
                console.log('isColliding detected:', {
                    objectA: {x: this.x, y: this.y, w: this.width, h: this.height},
                    objectB: {x: movableObject.x, y: movableObject.y, w: movableObject.width, h: movableObject.height}
                });
            }
            return collision;
        }
    }

    /**
     * Reduces the object's energy when hit
     */
    hit() {
        this.energy -= 5;
        if (this.energy < 0) {
            this.energy = 0;
        } else {
            this.lastHit = new Date().getTime();
        }
    }

    /**
     * Checks if the object is dead (energy = 0)
     */
    isDead() {
        return this.energy == 0;
    }

    /**
     * Checks if the object is currently hurt (recently hit)
     */
    isHurt() {
        let timepassed = new Date().getTime() - this.lastHit;
        timepassed = timepassed / 1000;
        return timepassed < 0.5;
    }

    /**
     * Plays an animation by cycling through image array
     */
    playAnimation(images) {
        let currentImageIndex = this.currentImage % images .length;
        let imagePath = images[currentImageIndex];
        this.img = this.imageCache[imagePath];
        this.currentImage++;
    }

    /**
     * Moves the object to the right
     */
    moveRight(moveSpeed = this.speed) {
        this.x += moveSpeed;
    }

    /**
     * Moves the object to the left
     */
    moveLeft(moveSpeed = this.speed) {
        this.x -= moveSpeed;  
    }

}