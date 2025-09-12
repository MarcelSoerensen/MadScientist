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
    isColliding(movableObject) {
        if (this.collidable === false || movableObject.collidable === false) {
            return false;
        }
        if (this.hasValidOffset(this) && this.hasValidOffset(movableObject)) {
            return this.isCollidingWithOffset(movableObject);
        } else {
            return this.isCollidingSimple(movableObject);
        }
    }

    /**
     * Checks if the object has a valid offset.
     */
    hasValidOffset(obj) {
        return obj.offset &&
            obj.offset.left !== undefined && obj.offset.right !== undefined &&
            obj.offset.top !== undefined && obj.offset.bottom !== undefined;
    }

    /**
     * Checks collision using offset rectangles.
     */
    isCollidingWithOffset(movableObject) {
        const rectA = this.getCollisionRect(this);
        const rectB = this.getCollisionRect(movableObject);
        return this.isRectCollision(rectA, rectB) || this.isRectContained(rectA, rectB);
    }

    /**
     * Returns the collision rectangle for the object.
     */
    getCollisionRect(obj) {
        let yPos = obj.y;
        if (obj.jumpOffsetY !== undefined) {
            yPos += obj.jumpOffsetY * 1.5;
        }
        let leftOffset = obj.offset.left;
        let rightOffset = obj.offset.right;
        if (obj instanceof Character && obj.otherDirection) {
            leftOffset = obj.offset.right;
            rightOffset = obj.offset.left;
        }
        return {
            left: obj.x + leftOffset,
            right: obj.x + obj.width - rightOffset,
            top: yPos + obj.offset.top,
            bottom: yPos + obj.height - obj.offset.bottom
        };
    }

    /**
     * Checks if two rectangles collide.
     */
    isRectCollision(rectA, rectB) {
        return rectA.left < rectB.right &&
            rectA.right > rectB.left &&
            rectA.top < rectB.bottom &&
            rectA.bottom > rectB.top;
    }

    /**
     * Checks if one rectangle is contained in another.
     */
    isRectContained(rectA, rectB) {
        return rectA.left >= rectB.left &&
            rectA.right <= rectB.right &&
            rectA.top >= rectB.top &&
            rectA.bottom <= rectB.bottom;
    }

    /**
     * Checks simple bounding box collision.
     */
    isCollidingSimple(movableObject) {
        return this.x + this.width > movableObject.x &&
            this.y + this.height > movableObject.y &&
            this.x < movableObject.x + movableObject.width &&
            this.y < movableObject.y + movableObject.height;
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