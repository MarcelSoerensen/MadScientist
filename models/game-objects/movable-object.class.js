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
        if (!Array.isArray(images) || images.length === 0) {
            if (onDone) onDone();
            return;
        }
        const baseDelays = Array.isArray(delays) ? delays : [];
        let elapsed = 0;
        images.forEach((imgPath, index) => {
            const delay = baseDelays[index] || 60;
            setTimeout(() => {
                this.img = this.imageCache[imgPath];
                if (index === images.length - 1 && onDone) onDone();
            }, elapsed);
            elapsed += delay;
        });
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
        if (this.collidable === false || movableObject.collidable === false) return false;
        if (this.hasValidOffset(this) && this.hasValidOffset(movableObject)) {
            return this.checkOffsetCollision(movableObject);
        }
        return this.checkSimpleCollision(movableObject);
    }

    /**
     * Checks collision using offset rectangles.
     */
    checkOffsetCollision(obj) {
        const a = this.getCollisionBox();
        const b = obj.getCollisionBox();
        const collision = a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
        const contained = a.left >= b.left && a.right <= b.right && a.top >= b.top && a.bottom <= b.bottom;
        return collision || contained;
    }

    /**
     * Returns the collision box for the object.
     */
    getCollisionBox() {
        let yPos = this.y;
        if (this.jumpOffsetY !== undefined) yPos += this.jumpOffsetY * 1.5;
        let leftOffset = this.offset?.left || 0;
        let rightOffset = this.offset?.right || 0;
        if (this instanceof Character && this.otherDirection) {
            leftOffset = this.offset?.right || 0;
            rightOffset = this.offset?.left || 0;
        }
        return {
            left: this.x + leftOffset,
            right: this.x + this.width - rightOffset,
            top: yPos + (this.offset?.top || 0),
            bottom: yPos + this.height - (this.offset?.bottom || 0)
        };
    }

    /**
     * Checks simple bounding box collision.
     */
    checkSimpleCollision(obj) {
        return this.x + this.width > obj.x &&
            this.y + this.height > obj.y &&
            this.x < obj.x + obj.width &&
            this.y < obj.y + obj.height;
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