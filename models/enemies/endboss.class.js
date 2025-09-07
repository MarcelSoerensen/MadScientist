
const endbossAnimations = new EndbossAnimations();

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
    this.loadImages(endbossAnimations.IMAGES_IDLE);
    this.loadImages(endbossAnimations.IMAGES_WALKING);
        this.x = (1952 * 2 - 900);
    this.loadImages(endbossAnimations.IMAGES_GET_ELECTRIC);
    this.loadImages(endbossAnimations.IMAGES_DEATH);
        this.visible = true;
    this.loadImages(endbossAnimations.IMAGES_HIT);
        
        this.checkProximityInterval = setInterval(() => {
            if (this.character && !this.animationStarted) {
                const dist = Math.abs(this.x - this.character.x);
                if (dist <= 500) {
                    this.animationStarted = true;
                    this.endbossAnimation();
                    clearInterval(this.checkProximityInterval);
                }
            }
        }, 100);
    }

    endbossAnimation() {
        this.startEndbossAnimationIntervals();
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
            this.handleAnimState();
        }, 50);
    }
    handleAnimState() {
        switch (this.animState) {
            case 'idle': this.handleIdle(); break;
            case 'walkingLeft': this.handleWalkingLeft(); break;
            case 'hit': this.handleHit(); break;
            case 'idle2': this.handleIdle2(); break;
            case 'walkingRight': this.handleWalkingRight(); break;
        }
    }

    handleIdle() {
        this.idleAnimation();
        this.animTimer += 50;
        if (this.animTimer >= 2000) {
            this.animState = 'walkingLeft';
            this.animTimer = 0;
        }
    }

    handleWalkingLeft() {
        this.walkingLeftAnimation(this.leftTargetX, this.animTimer);
        this.animTimer += 50;
        if (this.x <= this.leftTargetX || this.animTimer >= 5000) {
            this.animState = 'hit';
            this.animTimer = 0;
            this.hitFrame = 0;
        }
    }

    handleHit() {
        this.hitAnimation(this.animTimer);
        this.animTimer += 50;
        if (this.hitFrame >= endbossAnimations.IMAGES_HIT.length) {
            this.animState = 'idle2';
            this.animTimer = 0;
        }
    }

    handleIdle2() {
        this.idleAnimation();
        this.animTimer += 50;
        if (this.animTimer >= 2000) {
            this.animState = 'walkingRight';
            this.animTimer = 0;
        }
    }

    handleWalkingRight() {
        this.walkingRightAnimation(this.startX, this.animTimer);
        this.animTimer += 50;
        if (this.x >= this.startX || this.animTimer >= 5000) {
            this.x = this.startX;
            this.animState = 'idle';
            this.animTimer = 0;
        }
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
        this.playAnimation(endbossAnimations.IMAGES_IDLE);
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
        this.playAnimation(endbossAnimations.IMAGES_WALKING);
        if (this.x > leftTargetX) {
            this.moveLeft(Math.min(4, this.x - leftTargetX));
        }
    }

    hitAnimation(animTimer) {
        this.img = this.imageCache[endbossAnimations.IMAGES_HIT[this.hitFrame % endbossAnimations.IMAGES_HIT.length]];
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
        this.playAnimation(endbossAnimations.IMAGES_WALKING);
        if (this.x < startX) {
            this.moveRight(Math.min(4, startX - this.x));
        }
    }

    deathAnimation(deathFrame, deathDone) {
        if (!deathDone) {
            this.img = this.imageCache[endbossAnimations.IMAGES_DEATH[deathFrame]];
            deathFrame++;
            if (deathFrame >= endbossAnimations.IMAGES_DEATH.length) {
                deathFrame = endbossAnimations.IMAGES_DEATH.length - 1;
                deathDone = true;
            }
        } else {
            this.img = this.imageCache[endbossAnimations.IMAGES_DEATH[endbossAnimations.IMAGES_DEATH.length - 1]];
        }
    }

    electricHurtAnimation() {
        this.playAnimation(endbossAnimations.IMAGES_GET_ELECTRIC);
    }
    
    
    triggerElectricHurt(force = 1) {
    
    let now = Date.now();
    if (!this.lastHitSoundTime || now - this.lastHitSoundTime > 1000) {
        try {
            const hitSound = new Audio('sounds/endboss-collided.mp3');
            hitSound.volume = 0.7;
            hitSound.play();
            this.lastHitSoundTime = now;
        } catch (e) {
    
        }
    }
        if (this.laserHitCount >= 25) return;
        if (this.isElectricHurt) return;
        if (force === 5) {
            if (!this.lastSuperShotTime) this.lastSuperShotTime = 0;
            if (now - this.lastSuperShotTime < 500) return;
        }
        if (force === 1 && (now - this.lastHitTime < 500)) return;
        if (force === 1) this.lastHitTime = now;
        this.laserHitCount += force;
        if (force === 5) this.lastSuperShotTime = now;
    if (this.laserHitCount > 25) this.laserHitCount = 25;
        if (this.electricHurtTimeout) {
            clearTimeout(this.electricHurtTimeout);
        }
        this.isElectricHurt = true;
        let hurtDuration = (force === 5) ? 1000 : 500;
        this.electricHurtTimeout = setTimeout(() => {
            this.isElectricHurt = false;
            this.electricHurtTimeout = null;
            if (this.laserHitCount === 25) {
                this.handleDeathAnimation();
            }
        }, hurtDuration);
    }


    /**
     * Handler für die Endboss-Todesanimation (Schema & Stil wie bei Character)
     */
    handleDeathAnimation() {
        this.stopStepSounds();
        this.playEndbossDeathSound();
        this.collidable = false;
        this.isDeadAnimationPlaying = true;
        this.currentImage = 0;
        window.endbossDefeated = true;
        if (this.animInterval) {
            clearInterval(this.animInterval);
            this.animInterval = null;
        }
        this.deathAnimation();
        setTimeout(() => this.startBlinking(), 2500);
        setTimeout(() => this.removeEnemy(), 4000);
    }

    /**
     * Stoppt alle Schritt-Sounds des Endboss
     */
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

    /**
     * Spielt den Endboss-Todes-Sound mit Fade-Out
     */
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
            if (deathFrame < endbossAnimations.IMAGES_DEATH.length) {
                this.img = this.imageCache[endbossAnimations.IMAGES_DEATH[deathFrame]];
                deathFrame++;
            } else {
                this.img = this.imageCache[endbossAnimations.IMAGES_DEATH[endbossAnimations.IMAGES_DEATH.length - 1]];
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
