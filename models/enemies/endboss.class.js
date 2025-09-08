class Endboss extends CollidableObject {
    stepSoundAudioRight = null;
    isStepSoundPlayingRight = false;
    
    stepSoundAudio = null;
    isStepSoundPlaying = false;
    
    animationStarted = false;
    
    checkProximityInterval = null;
    
    playThrowAnimation() {
        if (this.throwAnimationPlaying) return;

        setTimeout(() => {
            try {
                const bombSound = new Audio('sounds/endboss-hit.mp3');
                bombSound.volume = 0.25;
                bombSound.play();
            } catch (e) {}
        }, 500);
    }
    lastHitSoundTime = 0;
   
    collidable = true;
    
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

    
    drawCollisionFrame(ctx) {
        if (!this.collidable) return;
        let leftOffset = this.offset.left;
        const isHitAnim = this.animState === 'hit';
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
        if (isHitAnim) {
            const hitFrame = this.hitFrame || 0;
            let stickX = this.x + this.width - 60 - 350;
            let stickY = this.y + this.height / 2;
            let growFrame = Math.max(0, hitFrame - 4);
            let stickWidth = 2 + growFrame * 10;
            let stickHeight = 100;
            ctx.strokeStyle = 'rgba(0,0,0,0)';
            ctx.lineWidth = 2;
            ctx.strokeRect(stickX - (stickWidth - 2 - 60), stickY, stickWidth, stickHeight);
        }
        ctx.restore();
    }
    
    character = null;

    
    setCharacter(character) {
        this.character = character;
    }
    
    
    laserHitCount = 0;

   
    isDeadAnimationPlaying = false;
    
    height = 600;
   
    width = 600;
    
    y = -60;

   
    offset = {
        top: 280,
        left: 245,
        right: 225,
        bottom: 160
    };

   
    
    
    isElectricHurt = false;
    
    
    electricHurtTimeout = null;


   
    constructor() {
            super().loadImage('img/Enemy Characters/Enemy Character07/Idle/Idle_00.png');
            this.anim = new EndbossAnimations();
            this.loadImages(this.anim.IMAGES_IDLE);
            this.loadImages(this.anim.IMAGES_WALKING);
            this.x = (1952 * 2 - 900);
            this.loadImages(this.anim.IMAGES_GET_ELECTRIC);
            this.loadImages(this.anim.IMAGES_DEATH);
            this.visible = true;
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

    animateEndboss() {
        this.handler.startEndbossAnimationIntervals(this);
    }

    
    startEndbossAnimationIntervals() {
        this.deathFrame = 0;
        this.deathDone = false;
        this.animTimer = 0;
        this.animState = 'idle';
        this.hitFrame = 0;
        this.startX = this.x;
        this.leftTargetX = this.startX - 200;
        this.animInterval = setInterval(() => {
            if (!this.animationStarted) return this.idleAnimation();
            if (this.laserHitCount >= 25 && !this.isElectricHurt) return this.deathAnimation(this.deathFrame, this.deathDone);
            if (this.isElectricHurt) return this.electricHurtAnimation();
            this.handler.handleAnimState(this);
        }, 50);
    }






    idleAnimation() {
        if (this.isStepSoundPlayingRight && this.stepSoundAudioRight) {
            try {
                this.stepSoundAudioRight.pause();
                this.stepSoundAudioRight.currentTime = 0.5;
            } catch (e) {}
            this.isStepSoundPlayingRight = false;
            this.stepSoundAudioRight = null;
        }
    this.playAnimation(this.anim.IMAGES_IDLE);
    }

    walkingLeftAnimation(leftTargetX, animTimer) {
        this.walkingLeftSoundCreation();
        this.walkingLeftMovement(leftTargetX);
        if (this.x <= leftTargetX || animTimer >= 5000) {
            this.walkingLeftStepSoundStop();
        }
    }

    walkingLeftSoundCreation() {
        if (!this.isStepSoundPlaying) {
            try {
                this.stepSoundAudio = new Audio('sounds/endboss-steps-left.mp3');
                this.stepSoundAudio.loop = true;
                this.stepSoundAudio.volume = 0.4;
                this.stepSoundAudio.playbackRate = 1.5;
                this.stepSoundAudio.currentTime = 0.5;
                this.stepSoundAudio.play();
                this.isStepSoundPlaying = true;
            } catch (e) {}
        }
    }

    walkingLeftStepSoundStop() {
        if (this.isStepSoundPlaying && this.stepSoundAudio) {
            try {
                this.stepSoundAudio.pause();
                this.stepSoundAudio.currentTime = 0.5;
            } catch (e) {}
            this.isStepSoundPlaying = false;
            this.stepSoundAudio = null;
        }
    }

    walkingLeftMovement(leftTargetX) {
    this.playAnimation(this.anim.IMAGES_WALKING);
        if (this.x > leftTargetX) {
            this.moveLeft(Math.min(4, this.x - leftTargetX));
        }
    }

    hitAnimation(animTimer) {
    this.img = this.imageCache[this.anim.IMAGES_HIT[this.hitFrame % this.anim.IMAGES_HIT.length]];
        this.hitFrame++;
        if (this.hitFrame === 1) {
            try {
                const hitStickSound = new Audio('sounds/endboss-hit.mp3');
                hitStickSound.volume = 0.25;
                hitStickSound.playbackRate = 1.35;
                hitStickSound.play();
            } catch (e) {}
        }
    }

    walkingRightAnimation(startX, animTimer) {
        this.walkingRightSoundCreation();
        this.walkingRightStepSoundStop();
        this.walkingRightMovement(startX);
    }

    walkingRightSoundCreation() {
        if (!this.isStepSoundPlayingRight) {
            try {
                this.stepSoundAudioRight = new Audio('sounds/endboss-steps-right.mp3');
                this.stepSoundAudioRight.loop = true;
                this.stepSoundAudioRight.volume = 0.15;
                this.stepSoundAudioRight.playbackRate = 1.5;
                this.stepSoundAudioRight.currentTime = 0.5;
                this.stepSoundAudioRight.play();
                this.isStepSoundPlayingRight = true;
            } catch (e) {}
        }
    }

    walkingRightStepSoundStop() {
        if (this.isStepSoundPlaying && this.stepSoundAudio) {
            try {
                this.stepSoundAudio.pause();
                this.stepSoundAudio.currentTime = 0.5;
            } catch (e) {}
            this.isStepSoundPlaying = false;
            this.stepSoundAudio = null;
        }
    }

    walkingRightMovement(startX) {
        this.playAnimation(this.anim.IMAGES_WALKING);
        if (this.x < startX) {
            this.moveRight(Math.min(4, startX - this.x));
        }
    }

    deathAnimation(deathFrame, deathDone) {
        if (!deathDone) {
            this.img = this.imageCache[this.anim.IMAGES_DEATH[deathFrame]];
            deathFrame++;
            if (deathFrame >= this.anim.IMAGES_DEATH.length) {
                deathFrame = this.anim.IMAGES_DEATH.length - 1;
                deathDone = true;
            }
        } else {
            this.img = this.imageCache[this.anim.IMAGES_DEATH[this.anim.IMAGES_DEATH.length - 1]];
        }
    }

    electricHurtAnimation() {
        this.playAnimation(this.anim.IMAGES_GET_ELECTRIC);
    }
    
    


    stopStepSounds() {
        if (this.isStepSoundPlaying && this.stepSoundAudio) {
            try {
                this.stepSoundAudio.pause();
                this.stepSoundAudio.currentTime = 0.5;
            } catch (e) {}
            this.isStepSoundPlaying = false;
            this.stepSoundAudio = null;
        }
        if (this.isStepSoundPlayingRight && this.stepSoundAudioRight) {
            try {
                this.stepSoundAudioRight.pause();
                this.stepSoundAudioRight.currentTime = 0.5;
            } catch (e) {}
            this.isStepSoundPlayingRight = false;
            this.stepSoundAudioRight = null;
        }
    }

    playEndbossDeathSound() {
        try {
            const deathSound = new Audio('sounds/endboss-death.mp3');
            deathSound.volume = 0.4;
            deathSound.play();
            let fadeSteps = 10;
            let fadeInterval = 100;
            let currentStep = 0;
            let fade = setInterval(() => {
                currentStep++;
                deathSound.volume = Math.max(0, 0.4 * (1 - currentStep / fadeSteps));
                if (currentStep >= fadeSteps) {
                    clearInterval(fade);
                }
            }, fadeInterval);
        } catch (e) {}
    }

    
    deathAnimation() {
        let deathFrame = 0;
        this.deathAnimInterval = setInterval(() => {
            if (deathFrame < this.anim.IMAGES_DEATH.length) {
                this.img = this.imageCache[this.anim.IMAGES_DEATH[deathFrame]];
                deathFrame++;
            } else {
                this.img = this.imageCache[this.anim.IMAGES_DEATH[this.anim.IMAGES_DEATH.length - 1]];
                clearInterval(this.deathAnimInterval);
            }
        }, 50);
    }

    
    startBlinking() {
        this.blinkInterval = setInterval(() => {
            this.visible = !this.visible;
        }, 200);
    }

    
    removeEnemy() {
        this.visible = false;
        this.collidable = false;
        if (this.blinkInterval) {
            clearInterval(this.blinkInterval);
            this.blinkInterval = null;
        }
    }
}
