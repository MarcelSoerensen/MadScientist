/**
 * Represents a collectible bomb object.
 */
class CollectibleBomb extends CollidableObject {
        /**
         * Creates a CollectibleBomb instance.
         */
    constructor(x, y) {
        super();
        this.x = x;
        this.y = y;
        this.width = 40;
        this.height = 40;
        this.img = new Image();
        this.img.src = 'img/Projectile/Other/1.png';
        this.originX = x;
        this.originY = y;
        this.isCollecting = false;
        this.collectProgress = 0;
        this.startX = x;
        this.startY = y;
        this.targetX = x;
        this.targetY = y;
        this.startWidth = this.width;
        this.startHeight = this.height;
    }

        /**
         * Checks collision with the character.
         */
    isColliding(character) {
        const charRect = character.getCollisionRect();
        const bombRect = this.getBombRect();
        return window.collisionManager.isCollision(charRect, bombRect);
    }

        /**
         * Returns the bomb's rectangle for collision.
         */
    getBombRect() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
    }

        /**
         * Checks rectangle collision between two objects.
         */
    isRectCollision(rectA, rectB) {
        return (
            rectA.left < rectB.right &&
            rectA.right > rectB.left &&
            rectA.top < rectB.bottom &&
            rectA.bottom > rectB.top
        );
    }

        /**
         * Starts the collecting animation for the bomb.
         */
    startCollecting(targetX, targetY) {
        if (this.isCollecting) return;
        this.isCollecting = true;
        this.collectProgress = 0;
        this.startX = this.originX;
        this.startY = this.originY;
        this.targetX = targetX;
        this.targetY = targetY;
        this.startWidth = 40;
        this.startHeight = 40;
        try {
            const collectedSound = new Audio('sounds/collected-bomb.mp3');
            collectedSound.play();
        } catch (e) {}
        const dx = this.targetX - this.startX;
        const dy = this.targetY - this.startY;
        this.distance = Math.sqrt(dx * dx + dy * dy);
        this.speed = 10;
        this.duration = this.distance / this.speed;
        if (this.duration < 1) this.duration = 1;
    }

        /**
         * Updates the bomb (animation, collection).
         */
    update() {
        this.updateCollectingAnimation();
    }

        /**
         * Updates collecting animation.
         */
    updateCollectingAnimation() {
        this.updateCollectingProgress();
        this.updateCollectingTransform();
    }

        /**
         * Updates collecting progress.
         */
    updateCollectingProgress() {
        if (this.isCollecting) {
            if (!this.duration) this.duration = 1;
            this.collectProgress += 1 / this.duration;
        }
    }

        /**
         * Updates collecting transform (position, size).
         */
    updateCollectingTransform() {
        if (this.isCollecting) {
            const done = this.collectProgress >= 1;
            this.x = done ? this.targetX : this.startX + (this.targetX - this.startX) * this.collectProgress;
            this.y = done ? this.targetY : this.startY + (this.targetY - this.startY) * this.collectProgress;
            const shrink = done ? 0.4 : 1 - 0.6 * this.collectProgress;
            this.width = this.startWidth * shrink;
            this.height = this.startHeight * shrink;
            if (done && !this._animationDone) this._animationDone = true;
        }
    }

        /**
         * Draws the bomb on the canvas.
         */
    draw(ctx) {
        ctx.save();
        if (!this.isCollecting) {
            let t = performance.now() * 0.003;
            let angle = t % (2 * Math.PI);
            let radius = (this.width + this.height) / 32;
            let xOffset = Math.cos(angle) * radius;
            let yOffset = Math.sin(angle) * radius;
            ctx.globalAlpha = 1;
            ctx.drawImage(this.img, this.x + xOffset, this.y + yOffset, this.width, this.height);
        } else {
            ctx.globalAlpha = 1;
            ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
        }
        ctx.restore();
    }
}

