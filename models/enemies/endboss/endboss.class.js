/**
 * Represents the Endboss enemy in the game world, including movement, animation, sound, and collision logic.
 */
class Endboss extends CollidableObject {
    /**
     * The X position where the Endboss starts in the game world.
     */
    x = (1952 * 2 - 900);
    y = -60;
    width = 600;
    height = 600;
    offset = { top: 280, left: 245, right: 225, bottom: 160 };
    visible = true;
    collidable = true;
    character = null;
    hurtCount = 0;
    isDeadAnimationPlaying = false;
    isElectricHurt = false;
    electricHurtTimeout = null;
    animationStarted = false;
    lastHitSoundTime = 0;
    stepSoundAudioRight = null;
    isStepSoundPlayingRight = false;
    stepSoundAudio = null;
    isStepSoundPlaying = false;
    
    /**
     * Initializes the Endboss and its dependencies.
     */
    constructor() {
        super().loadImage('img/Enemy Characters/Enemy Character07/Idle/Idle_00.png');
        this.anim = new EndbossAnimations();
        this.sounds = new EndbossSounds();
        this.loadImages(this.anim.IMAGES_IDLE);
        this.loadImages(this.anim.IMAGES_WALKING);
        this.loadImages(this.anim.IMAGES_GET_ELECTRIC);
        this.loadImages(this.anim.IMAGES_DEATH);
        this.loadImages(this.anim.IMAGES_HIT);
        this.handler = new EndbossHandling();
        this.startProximityCheck();
    }

    /**
     * Sets the character reference for proximity checks.
     */
    setCharacter(character) {
        this.character = character;
    }   

    /**
     * Starts the walking-left animation and sound for the Endboss.
     */
    playWalkingLeftAnimation(leftTargetX, animTimer) {
        this.sounds.walkingLeftSoundCreation(this);
        this.anim.walkingLeftMovement(this, leftTargetX);
        if (this.x <= leftTargetX || animTimer >= 5000) {
            this.sounds.walkingLeftStepSoundStop(this);
        }
    }

    /**
     * Starts the walking-right animation and sound for the Endboss.
     */
    playWalkingRightAnimation(startX, animTimer) {
        this.sounds.walkingRightSoundCreation(this);
        this.sounds.walkingRightStepSoundStop(this);
        this.anim.walkingRightMovement(this, startX);
    }

    /**
     * Returns the collision rectangle for the Endboss stick during hit animation.
     */
    getStickCollisionRect() {
        if (this.animState !== 'hit') return null;
        const hitFrame = this.hitFrame || 0;
        let stickX = this.x + this.width - 60 - 350;
        let stickY = this.y + this.height / 2;
        let growFrame = Math.max(0, hitFrame - 4);
        let stickWidth = 2 + growFrame * 10;
        let stickHeight = 100;
        let left = stickX - (stickWidth - 2 - 60);
        return {
            x: left,
            y: stickY,
            width: stickWidth,
            height: stickHeight
        };
    }

    /**
     * Removes the Endboss from the game (sets invisible and non-collidable).
     */
    removeEnemy() {
        this.visible = false;
        this.collidable = false;
        this.clearIntervals?.();
        Object.assign(this, {
            animationStarted: false,
            deathDone: true,
            isDeadAnimationPlaying: false,
            _deathAnimationStarted: false
        });
    }

    /**
     * (Re)starts the proximity check to trigger the endboss animation once the character is close enough.
     */
    startProximityCheck() {
        if (this.animationStarted) return;
        if (this.checkProximityInterval) return;
        this.checkProximityInterval = setInterval(() => {
            if (this.character && !this.animationStarted) {
                const dist = Math.abs(this.x - this.character.x);
                if (dist <= 500) {
                    this.animationStarted = true;
                    this.handler.animateEndboss(this);
                    clearInterval(this.checkProximityInterval);
                    this.checkProximityInterval = null;
                }
            }
        }, 100);
    }

    /**
     * Draws the main collision frame for the Endboss on the canvas.
     */
    drawCollisionFrameEndboss(ctx) {
        if (!this.collidable) return;
        const { left, right, top, bottom } = this.offset;
        const yPos = this.y + top + (this.jumpOffsetY ? this.jumpOffsetY * 1.5 : 0);
        ctx.save();
        ctx.strokeStyle = 'rgba(0,0,0,0)';
        ctx.lineWidth = 2;
        ctx.strokeRect(this.x + left, yPos, this.width - left - right, this.height - top - bottom);
        ctx.restore();
    }

    /**
     * Draws the collision frame for the Endboss stick on the canvas (during hit animation).
     */
    drawCollisionFrameStick(ctx) {
        if (!this.collidable || this.animState !== 'hit') return;
        const hit = this.hitFrame || 0;
        const grow = Math.max(0, hit - 4);
        const width = 2 + grow * 10;
        const height = 100;
        const x = this.x + this.width - 60 - 350 - (width - 2 - 60);
        const y = this.y + this.height / 2;
        ctx.save();
        ctx.strokeStyle = 'rgba(0,0,0,0)';
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, width, height);
        ctx.restore();
    }

    /**
     * Stops all relevant intervals and timers for Endboss
     */
    clearIntervals() {
        ['animInterval', 'deathAnimInterval', 'blinkInterval', 'checkProximityInterval'].forEach(interval => {
            if (this[interval]) {
                clearInterval(this[interval]);
                this[interval] = null;
            }
        });
        if (this.electricHurtTimeout) {
            clearTimeout(this.electricHurtTimeout);
            this.electricHurtTimeout = null;
        }
    }
}
