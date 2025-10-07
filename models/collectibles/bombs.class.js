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
        this.img = ImageCacheManager.getImage('img/Projectile/Other/1.png');
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

    static activeSounds = [];
    /**
     * Starts the collecting animation for the bomb.
     */
    startCollecting(targetX, targetY) {
        if (this.isCollecting) return;
        this.initCollectingState(targetX, targetY);
        this.playCollectingSound();
    }

    /** 
    * Initializes collecting state and parameters.
    */
    initCollectingState(targetX, targetY) {
        Object.assign(this, {
            isCollecting: true,
            collectProgress: 0,
            startX: this.originX,
            startY: this.originY,
            targetX,
            targetY,
            startWidth: 40,
            startHeight: 40
        });
        const dx = targetX - this.startX, dy = targetY - this.startY;
        this.distance = Math.hypot(dx, dy);
        this.speed = 10;
        this.duration = Math.max(1, this.distance / this.speed);
    }

    /** 
    * Plays the collecting sound effect.
    */
    playCollectingSound() {
        try {
            const s = SoundCacheManager.getAudio('sounds/collected-bomb.mp3');
            s.play();
            CollectibleBomb.activeSounds.push(s);
            s.addEventListener('ended', () => {
                const i = CollectibleBomb.activeSounds.indexOf(s);
                if (i !== -1) CollectibleBomb.activeSounds.splice(i, 1);
            });
        } catch (e) {}
    }

    /** 
    * Stops all currently playing collecting sounds.
    */
    static stopAllCollectingSounds() {
        CollectibleBomb.activeSounds.forEach(sound => {
            sound.pause();
            sound.currentTime = 0;
        });
        CollectibleBomb.activeSounds = [];
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
        const collecting = this.isCollecting;
        let xOff = 0, yOff = 0;
        if (!collecting) {
            const t = performance.now() * 0.003;
            const radius = (this.width + this.height) / 32;
            xOff = Math.cos(t) * radius;
            yOff = Math.sin(t) * radius;
        }
        ctx.globalAlpha = 1;
        ctx.drawImage(this.img, this.x + xOff, this.y + yOff, this.width, this.height);
        ctx.restore();
    }
}

