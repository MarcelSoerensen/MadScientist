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
        this.img = ImageCacheManager.getImage('img/Projectile/Other/7.png');
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
        this.computeCollectingDistanceAndDuration();
    }

    /**
     * Computes the distance and duration for the collecting animation.
     */
    computeCollectingDistanceAndDuration() {
        const dx = this.targetX - this.startX;
        const dy = this.targetY - this.startY;
        this.distance = Math.sqrt(dx * dx + dy * dy);
        this.speed = 10;
        this.duration = this.distance / this.speed;
        if (this.duration < 1) this.duration = 1;
    }

    static activeSounds = [];

    /**
     * Plays the collecting sound effect.
     */
    playCollectingSound() {
        try {
            const collectedSound = SoundCacheManager.getAudio('sounds/collected-energyball.mp3');
            collectedSound.play();
            EnergyBall.activeSounds.push(collectedSound);
            collectedSound.addEventListener('ended', () => {
                const idx = EnergyBall.activeSounds.indexOf(collectedSound);
                if (idx !== -1) EnergyBall.activeSounds.splice(idx, 1);
            });
        } catch (e) {}
    }

    /** 
     * Stops all currently playing collecting sounds.
     */
    static stopAllCollectingSounds() {
        EnergyBall.activeSounds.forEach(sound => {
            sound.pause();
            sound.currentTime = 0;
        });
        EnergyBall.activeSounds = [];
    }

    /**
     * Updates pulse and collecting animation.
     */
    updatePulse() {
        const step = 0.2;
        if (this.pulseUp) {
            this.width += step;
            this.height += step;
            if (this.width >= this.maxSize) this.pulseUp = false;
        } else {
            this.width -= step;
            this.height -= step;
            if (this.width <= this.baseSize) this.pulseUp = true;
        }        this.updateCollectingAnimation();
    }

    /**
     * Updates collecting animation.
     */
    updateCollectingAnimation() {
        if (!this.isCollecting) return;
        if (!this.duration) this.duration = 1; // ensure duration
        this.collectProgress += 1 / this.duration; // advance progress
        if (this.collectProgress >= 1) return this.applyCollectingFinalState();
        this.applyCollectingInterpolatedState();
    }

    /**
     * Applies final state when collecting is complete.
     */
    applyCollectingFinalState() {
        this.x = this.targetX;
        this.y = this.targetY;
        this.width = this.startWidth * 0.4;
        this.height = this.startHeight * 0.4;
    }

    /**
     * Applies interpolated state during collecting animation.
     */
    applyCollectingInterpolatedState() {
        this.x = this.startX + (this.targetX - this.startX) * this.collectProgress;
        this.y = this.startY + (this.targetY - this.startY) * this.collectProgress;
        const shrink = 1 - 0.6 * this.collectProgress;
        this.width = this.startWidth * shrink;
        this.height = this.startHeight * shrink;
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
        const { xOffset, yOffset, rotation } = this.setElectricOffsets();
        this.applyElectricTransform(ctx, xOffset, yOffset, rotation);
        this.renderElectricEllipse(ctx, scale);
        ctx.restore();
    }

    /**
     * Sets the electric effect offsets.   
     */
    setElectricOffsets() {
        const t = performance.now() * 0.005;
        const angle = Math.random() * Math.PI * 2;
        const rotation = Math.random() * Math.PI * 2;
        const radius = (this.width + this.height) / 8;
        return {
            xOffset: Math.cos(angle + t) * radius,
            yOffset: Math.sin(angle + t) * radius,
            rotation
        };
    }

    /**
     * Applies electric effect transformations to the canvas context.
     */
    applyElectricTransform(ctx, xOffset, yOffset, rotation) {
        ctx.translate(this.x + this.baseSize / 2 + xOffset - 3, this.y + this.baseSize / 2 + yOffset - 3);
        ctx.rotate(rotation);
    }

    /**
     * Renders the electric ellipse.
     */
    renderElectricEllipse(ctx, scale) {
        ctx.globalAlpha = 0.6;
        ctx.beginPath();
        const w = this.baseSize * scale * 0.7;
        const h = this.baseSize * 0.13 * scale * 0.7;
        ctx.ellipse(0, 0, w, h, 0, 0, 2 * Math.PI);
        ctx.fillStyle = ctx.shadowColor = 'white';
        ctx.shadowBlur = 15;
        ctx.fill();
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
