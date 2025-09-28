/**
 * Represents a collectible heart object.
 */
class CollectibleHeart extends CollidableObject {
    /**
     * Creates a CollectibleHeart instance.
     */
    constructor(x, y) {
        super();
        this.x = x;
        this.y = y;
        this.width = 32;
        this.height = 32;
        this.img = ImageCacheManager.getImage('img/User Interfaces/HpICon.png');
        this.collected = false;
        this.baseSize = 32;
        this.pulse = 0;
        this.isCollecting = false;
        this.collectProgress = 0;
        this.pulseCount = 0;
        this.maxPulses = 2;
        this.fadeAlpha = 1;
    }

    /**
     * Checks collision with the character.
     */
    isColliding(character) {
        const charRect = character.getCollisionRect();
        const heartRect = {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
        return window.collisionManager.isCollision(charRect, heartRect);
    }

    static activeSounds = [];

    /**
     * Starts the collecting animation for the heart.
     */
    startCollecting() {
        if (this.isCollecting) return;
        this.isCollecting = true;
        this.pulse = 0;
        this.pulseCount = 0;
        this.fadeAlpha = 1;
        this.collectProgress = 0;
        try {
            const heartSound = SoundCacheManager.getAudio('sounds/heartbeat.mp3');
            heartSound.volume = 0.7;
            heartSound.play();
            CollectibleHeart.activeSounds.push(heartSound);
            setTimeout(() => {
                heartSound.pause();
                heartSound.currentTime = 0;
                const idx = CollectibleHeart.activeSounds.indexOf(heartSound);
                if (idx !== -1) CollectibleHeart.activeSounds.splice(idx, 1);
            }, 500);
        } catch (e) {}
    }

    /**
     * Stops all active collecting sounds immediately.
     */
    static stopAllCollectingSounds() {
        CollectibleHeart.activeSounds.forEach(sound => {
            sound.pause();
            sound.currentTime = 0;
        });
        CollectibleHeart.activeSounds = [];
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
        this.fadeScale = 1;
    }

    /**
     * Updates collecting animation.
     */
    updateCollectingAnimation() {
        if (this.isCollecting) {
            if (this.collectProgress === undefined) this.collectProgress = 0;
            this.collectProgress += 0.04;
        }
    }

    /**
     * Draws the heart on the canvas.
     */
    draw(ctx) {
        if (this.collected && !this.isCollecting) return;
        if (this.bounceActive) {
            this.drawBounce(ctx);
        } else if (!this.isCollecting) {
            this.drawImage(ctx);
        } else {
            this.drawCollectingAnimation(ctx);
        }
    }

    /**
     * Draws the bounce animation.
     */
    drawBounce(ctx) {
        ctx.save();
        this.bounceProgress = (this.bounceProgress || 0) + 0.08;
        let scale = 1 - 0.7 * Math.sin(Math.PI * Math.min(this.bounceProgress, 1));
        let alpha = 0.5 + 0.5 * Math.abs(Math.sin(Math.PI * Math.min(this.bounceProgress, 1)));
        ctx.globalAlpha = alpha;
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
        ctx.scale(scale, scale);
        ctx.drawImage(this.img, -this.width / 2, -this.height / 2, this.width, this.height);
        ctx.globalAlpha = 1;
        if (this.bounceProgress >= 1) {
            this.bounceActive = false;
            this.bounceProgress = 0;
        }
        ctx.restore();
    }

    /**
     * Draws the heart image.
     */
    drawImage(ctx) {
        ctx.save();
        let t = performance.now() * 0.004;
        let move = Math.sin(t);
        ctx.translate(this.x + move + this.width / 2, this.y + move + this.height / 2);
        ctx.drawImage(this.img, -this.width / 2, -this.height / 2, this.width, this.height);
        ctx.restore();
    }

    /**
     * Draws the collecting animation.
     */
    drawCollectingAnimation(ctx) {
        ctx.save();
        if (this.collectProgress === undefined) this.collectProgress = 0;
        this.collectProgress += 0.04;
        let pulse = 1;
        let alpha = 1;
        if (this.collectProgress < 1) {
            pulse = 1 + 22 / this.width * Math.abs(Math.sin(this.collectProgress * Math.PI * 2));
            alpha = 1;
        } else if (this.collectProgress < 2) {
            pulse = 1 + 22 / this.width * Math.abs(Math.sin((this.collectProgress - 1) * Math.PI * 2));
            alpha = Math.max(0, 1 - (this.collectProgress - 1));
        } else {
            pulse = 2.3;
            alpha = 0;
        }
        ctx.globalAlpha = alpha;
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
        ctx.scale(pulse, pulse);
        ctx.drawImage(this.img, -this.width / 2, -this.height / 2, this.width, this.height);
        ctx.restore();
    }
}
    
    
    
    
    
    



