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
        Object.assign(this, { isCollecting: true, pulse: 0, pulseCount: 0, fadeAlpha: 1, collectProgress: 0 });
        try {
            const snd = SoundCacheManager.getAudio('sounds/heartbeat.mp3');
            snd.volume = 0.7; snd.play();
            CollectibleHeart.activeSounds.push(snd);
            setTimeout(() => {
                snd.pause(); snd.currentTime = 0;
                const i = CollectibleHeart.activeSounds.indexOf(snd);
                if (i !== -1) CollectibleHeart.activeSounds.splice(i, 1);
            }, 500);
        } catch (e) {}
    }

    /**
     * Updates pulse and collecting animation.
     */
    updatePulse() {
        this.fadeScale = 1;
            if (this.isCollecting) {
            if (this.collectProgress === undefined) this.collectProgress = 0;
            this.collectProgress += 0.04;
        }    
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
        const p = this.collectProgress = (this.collectProgress ?? 0) + 0.04;
        const base = 22 / this.width;
        const phase = p < 1 ? p : p < 2 ? p - 1 : 0;
        const pulse = p < 2 ? 1 + base * Math.abs(Math.sin(phase * Math.PI * 2)) : 2.3;
        const alpha = p < 1 ? 1 : p < 2 ? Math.max(0, 1 - phase) : 0;
        ctx.globalAlpha = alpha;
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
        ctx.scale(pulse, pulse);
        ctx.drawImage(this.img, -this.width / 2, -this.height / 2, this.width, this.height);
        ctx.restore();
    }
}
    
    
    
    
    
    



