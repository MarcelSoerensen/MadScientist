/**
 * Represents a collectible energy ball object.
 */
class EnergyBall extends CollidableObject {
        /**
         * Creates an EnergyBall instance.
         */
    constructor(x, y) {
        super();
        this.x = x;
        this.y = y;
        this.baseSize = 20;
        this.maxSize = 30;
        this.width = this.baseSize;
        this.height = this.baseSize;
        this.pulseUp = true;
        this.img = new Image();
        this.img.src = 'img/Projectile/Other/7.png';
        this.isCollecting = false;
        this.collectProgress = 0;
        this.startX = x;
        this.startY = y;
        this.startWidth = this.width;
        this.startHeight = this.height;
        this.targetX = 0;
        this.targetY = 0;
    }

        /**
         * Checks collision with the character.
         */
    isColliding(character) {
        const charRect = character.getCollisionRect();
        const ballRect = { x: this.x, y: this.y, width: this.width, height: this.height };
        return window.collisionManager.isCollision(charRect, ballRect);
    }

        /**
         * Starts the collecting animation for the energy ball.
         */
    startCollecting(targetX, targetY) {
        if (this.isCollecting) return;
        this.startCollectingAnimation(targetX, targetY);
        this.playCollectingSound();
    }

        /**
         * Starts the collecting animation (internal).
         */
    startCollectingAnimation(targetX, targetY) {
        this.isCollecting = true;
        this.collectProgress = 0;
        this.startX = this.x;
        this.startY = this.y;
        this.targetX = targetX;
        this.targetY = targetY;
        this.startWidth = this.width;
        this.startHeight = this.height;
        const dx = this.targetX - this.startX;
        const dy = this.targetY - this.startY;
        this.distance = Math.sqrt(dx * dx + dy * dy);
        this.speed = 10;
        this.duration = this.distance / this.speed;
        if (this.duration < 1) this.duration = 1;
    }

        /**
         * Plays the collecting sound effect.
         */
    playCollectingSound() {
        try {
            const collectedSound = new Audio('sounds/collected-energyball.mp3');
            collectedSound.play();
        } catch (e) {}
    }

        /**
         * Updates pulse and collecting animation.
         */
    updatePulse() {
        this.updatePulseAnimation();
        this.updateCollectingAnimation();
    }

        /**
         * Updates pulse animation.
         */
    updatePulseAnimation() {
        const step = 0.2;
        if (this.pulseUp) {
            this.width += step;
            this.height += step;
            if (this.width >= this.maxSize) this.pulseUp = false;
        } else {
            this.width -= step;
            this.height -= step;
            if (this.width <= this.baseSize) this.pulseUp = true;
        }
    }

        /**
         * Updates collecting animation.
         */
    updateCollectingAnimation() {
        if (this.isCollecting) {
            if (!this.duration) this.duration = 1;
            this.collectProgress += 1 / this.duration;
            if (this.collectProgress >= 1) {
                this.x = this.targetX;
                this.y = this.targetY;
                this.width = this.startWidth * 0.4;
                this.height = this.startHeight * 0.4;
            } else {
                this.x = this.startX + (this.targetX - this.startX) * this.collectProgress;
                this.y = this.startY + (this.targetY - this.startY) * this.collectProgress;
                const shrink = 1 - 0.6 * this.collectProgress;
                this.width = this.startWidth * shrink;
                this.height = this.startHeight * shrink;
            }
        }
    }

        /**
         * Draws the energy ball on the canvas.
         */
    draw(ctx) {
        let offsetX = (this.baseSize - this.width) / 2;
        let offsetY = (this.baseSize - this.height) / 2;
        let scale = this.width / this.baseSize;
        let alpha = 1;
        if (this.isCollecting) {
            scale = 1 - 0.6 * this.collectProgress;
            alpha = 1;
            offsetX = (this.baseSize - this.baseSize * scale) / 2;
            offsetY = (this.baseSize - this.baseSize * scale) / 2;
        }
        this.drawElectricEffect(ctx, scale, alpha);
        this.drawImage(ctx, offsetX, offsetY, scale, alpha);
    }

        /**
         * Draws the electric effect.
         */
    drawElectricEffect(ctx, scale, alpha) {
        ctx.save();
        let t = performance.now() * 0.005;
        let randomAngle = Math.random() * Math.PI * 2;
        let randomRotation = Math.random() * Math.PI * 2;
        let radius = (this.width + this.height) / 8;
        let xOffset = Math.cos(randomAngle + t) * radius;
        let yOffset = Math.sin(randomAngle + t) * radius;
        ctx.translate(this.x + this.baseSize / 2 + xOffset - 3, this.y + this.baseSize / 2 + yOffset - 3);
        ctx.rotate(randomRotation);
        ctx.globalAlpha = 0.6;
        ctx.beginPath();
        ctx.ellipse(0, 0, this.baseSize * scale * 0.7, this.baseSize * 0.13 * scale * 0.7, 0, 0, 2 * Math.PI);
        ctx.fillStyle = 'white';
        ctx.shadowColor = 'white';
        ctx.shadowBlur = 15;
        ctx.fill();
        ctx.restore();
    }

        /**
         * Draws the energy ball image.
         */
    drawImage(ctx, offsetX, offsetY, scale, alpha) {
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.drawImage(this.img, this.x + offsetX, this.y + offsetY, this.baseSize * scale, this.baseSize * scale);
        ctx.restore();
    }
}
