/**
 * Represents the Endboss enemy in the game world, including movement, animation, sound, and collision logic.
 */
class Endboss extends CollidableObject {
    x = (1952 * 2 - 900);
    y = -60;
    width = 600;
    height = 600;
    offset = { top: 280, left: 245, right: 225, bottom: 160 };
    visible = true;
    collidable = true;
    character = null;
    laserHitCount = 0;
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
        this.checkProximityInterval = setInterval(() => {
            if (this.character && !this.animationStarted) {
                const dist = Math.abs(this.x - this.character.x);
                if (dist <= 500) {
                    this.animationStarted = true;
                    this.handler.animateEndboss(this);
                    clearInterval(this.checkProximityInterval);
                }
            }
        }, 100);
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
        if (this.blinkInterval) {
            clearInterval(this.blinkInterval);
            this.blinkInterval = null;
        }
    }

    /**
     * Draws the main collision frame for the Endboss on the canvas.
     */
    drawCollisionFrameEndboss(ctx) {
        if (!this.collidable) return;
        let leftOffset = this.offset.left;
        ctx.save();
        ctx.strokeStyle = 'rgba(0,0,0,0)';
        ctx.lineWidth = 2;
        let yPos = this.y + this.offset.top;
        if (this.jumpOffsetY !== undefined) {
            yPos += this.jumpOffsetY * 1.5;
        }
        ctx.strokeRect(
            this.x + leftOffset,
            yPos,
            this.width - leftOffset - this.offset.right,
            this.height - this.offset.top - this.offset.bottom
        );
        ctx.restore();
    }

    /**
     * Draws the collision frame for the Endboss stick on the canvas (during hit animation).
     */
    drawCollisionFrameStick(ctx) {
        if (!this.collidable || this.animState !== 'hit') return;
        const hitFrame = this.hitFrame || 0;
        let stickX = this.x + this.width - 60 - 350;
        let stickY = this.y + this.height / 2;
        let growFrame = Math.max(0, hitFrame - 4);
        let stickWidth = 2 + growFrame * 10;
        let stickHeight = 100;
        ctx.save();
        ctx.strokeStyle = 'rgba(0,0,0,0)';
        ctx.lineWidth = 2;
        ctx.strokeRect(stickX - (stickWidth - 2 - 60), stickY, stickWidth, stickHeight);
        ctx.restore();
    }
}
