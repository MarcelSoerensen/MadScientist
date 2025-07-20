/**
 * Base class for all movable objects in the game
 * Provides basic movement, animation, and collision detection functionality
 */
class MovableObject extends DrawableObject {
    /** @type {number} Movement speed */
    speed = 0.15;
    /** @type {boolean} Whether the object is facing the opposite direction */
    otherDirection = false;
    /** @type {number} Vertical speed for gravity */
    speedY = 0;
    /** @type {number} Gravity acceleration */
    acceleration = 1;
    /** @type {number} Health/energy of the object */
    energy = 100;
    /** @type {number} Timestamp of last hit */
    lastHit = 0;

    applyGravity() {
        setInterval(() => {
            this.y -= this.speedY;
            this.speedY -= this.acceleration;
        }, 1000 / 60);
    }

    /**
     * Applies gravity animation with custom delays
     * @param {string[]} images - Array of image paths for animation
     * @param {number[]} delays - Array of delays for each frame
     * @param {Function} onDone - Callback function when animation completes
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
     * Checks if the object is currently above ground
     * @returns {boolean} True if object is above ground
     */
    isAboveGround() {
        return this.isAboveGroundActive;
    }

    /**
     * Checks if this object is colliding with another movable object
     * @param {MovableObject} movableObject - The other object to check collision with
     * @returns {boolean} True if objects are colliding
     */
    isColliding(movableObject){

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
            
            const leftA = this.x + this.offset.left;
            const rightA = this.x + this.width - this.offset.right;
            const topA = thisYPos + this.offset.top;
            const bottomA = thisYPos + this.height - this.offset.bottom;

            const leftB = movableObject.x + movableObject.offset.left;
            const rightB = movableObject.x + movableObject.width - movableObject.offset.right;
            const topB = otherYPos + movableObject.offset.top;
            const bottomB = otherYPos + movableObject.height - movableObject.offset.bottom;

            /**
             * Standard collision: bounding boxes overlap
             */
            const collision =
                leftA < rightB &&
                rightA > leftB &&
                topA < bottomB &&
                bottomA > topB;

            /**
             * Containment: A is fully inside B
             */
            const contained =
                leftA >= leftB &&
                rightA <= rightB &&
                topA >= topB &&
                bottomA <= bottomB;

            return collision || contained;
        } else {
            return  this.x + this.width > movableObject.x &&
                    this.y + this.height > movableObject.y &&
                    this.x < movableObject.x + movableObject.width &&
                    this.y < movableObject.y + movableObject.height;
        }
    }

    /**
     * Reduces the object's energy when hit
     * Sets the last hit timestamp for hurt animation
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
     * @returns {boolean} True if object is dead
     */
    isDead() {
        return this.energy == 0;
    }

    /**
     * Checks if the object is currently hurt (recently hit)
     * @returns {boolean} True if object is in hurt state
     */
    isHurt() {
        let timepassed = new Date().getTime() - this.lastHit;
        timepassed = timepassed / 1000;
        return timepassed < 0.5;
    }

    /**
     * Plays an animation by cycling through image array
     * @param {string[]} images - Array of image paths for the animation
     */
    playAnimation(images) {
        let currentImageIndex = this.currentImage % images .length;
        let imagePath = images[currentImageIndex];
        this.img = this.imageCache[imagePath];
        this.currentImage++;
    }

    /**
     * Moves the object to the right
     * @param {number} moveSpeed - Speed of movement (default: this.speed)
     */
    moveRight(moveSpeed = this.speed) {
        this.x += moveSpeed;
    }

    /**
     * Moves the object to the left
     * @param {number} moveSpeed - Speed of movement (default: this.speed)
     */
    moveLeft(moveSpeed = this.speed) {
        this.x -= moveSpeed;  
    }

}