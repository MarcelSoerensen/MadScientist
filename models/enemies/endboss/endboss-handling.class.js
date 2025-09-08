/**
 * Handles endboss logic (Animation, State, Status etc.)
 */
class EndbossHandling {
    /**
     * Starts all endboss animation intervals.
     */
    animateEndboss(endboss) {
    this.startEndbossAnimationIntervals(endboss);
    }

    /**
     * Initializes and starts the main animation interval for the endboss.
     */
    startEndbossAnimationIntervals(endboss) {
        endboss.deathFrame = 0;
        endboss.deathDone = false;
        endboss.animTimer = 0;
        endboss.animState = 'idle';
        endboss.hitFrame = 0;
        endboss.startX = endboss.x;
        endboss.leftTargetX = endboss.startX - 200;
        endboss.animInterval = setInterval(() => {
            if (!endboss.animationStarted) return this.handleIdle(endboss);
            if (endboss.laserHitCount >= 25 && !endboss.isElectricHurt) {
                this.handleDeathSound(endboss);
                this.handleDeathStatus(endboss);
                return this.handleDeathAnimation(endboss);
            }
            if (endboss.isElectricHurt) return endboss.anim.electricHurtAnimation(endboss);
            this.handleAnimState(endboss);
        }, 50);
    }

    /**
     * Handles the current animation state of the endboss.
     */
    handleAnimState(endboss) {
        switch (endboss.animState) {
            case 'idle': this.handleIdle(endboss); break;
            case 'walkingLeft': this.handleWalkingLeft(endboss); break;
            case 'hit': this.handleHit(endboss); break;
            case 'idle2': this.handleIdle2(endboss); break;
            case 'walkingRight': this.handleWalkingRight(endboss); break;
        }
    }

    /**
     * Handles the idle animation state.
     */
    handleIdle(endboss) {
    endboss.anim.idleAnimation(endboss);
        endboss.animTimer += 50;
        if (endboss.animTimer >= 2000) {
            endboss.animState = 'walkingLeft';
            endboss.animTimer = 0;
        }
    }

    /**
     * Handles the walking left animation state.
     */
    handleWalkingLeft(endboss) {
    endboss.playWalkingLeftAnimation(endboss.leftTargetX, endboss.animTimer);
        endboss.animTimer += 50;
        if (endboss.x <= endboss.leftTargetX || endboss.animTimer >= 5000) {
            endboss.animState = 'hit';
            endboss.animTimer = 0;
            endboss.hitFrame = 0;
        }
    }

    /**
     * Handles the hit animation state.
     */
    handleHit(endboss) {
    endboss.anim.hitAnimation(endboss, endboss.animTimer);
        endboss.animTimer += 50;
        if (endboss.hitFrame >= endboss.anim.IMAGES_HIT.length) {
            endboss.animState = 'idle2';
            endboss.animTimer = 0;
        }
    }

    /**
     * Plays the hit sound for the Endboss.
     */
    handleHitSound(endboss) {
        if (endboss.throwAnimationPlaying) return;
        setTimeout(() => {
            try {
                const bombSound = new Audio('sounds/endboss-hit.mp3');
                bombSound.volume = 0.25;
                bombSound.play();
            } catch (e) {}
        }, 500);
    }

    /**
     * Handles the second idle animation state.
     */
    handleIdle2(endboss) {
    endboss.anim.idleAnimation(endboss);
        endboss.animTimer += 50;
        if (endboss.animTimer >= 2000) {
            endboss.animState = 'walkingRight';
            endboss.animTimer = 0;
        }
    }

    /**
     * Handles the walking right animation state.
     */
    handleWalkingRight(endboss) {
    endboss.playWalkingRightAnimation(endboss.startX, endboss.animTimer);
        endboss.animTimer += 50;
        if (endboss.x >= endboss.startX || endboss.animTimer >= 5000) {
            endboss.x = endboss.startX;
            endboss.animState = 'idle';
            endboss.animTimer = 0;
        }
    }

    /**
     * Handles the hurt animation and status logic.
     */
    handleHurtAnimation(endboss, force = 1) {
        this.handleHurtSound(endboss, force);
        if (endboss.laserHitCount >= 25) return;
        if (endboss.isElectricHurt) return;
        this.handleHurtStatus(endboss, force);
        this.handleHurtTimeout(endboss, force);
    }

    /**
     * Plays the hurt sound effect for the endboss.
     */
    handleHurtSound(endboss, force) {
        let now = Date.now();
        if (!endboss.lastHitSoundTime || now - endboss.lastHitSoundTime > 1000) {
            try {
                const hitSound = new Audio('sounds/endboss-collided.mp3');
                hitSound.volume = 0.7;
                hitSound.play();
                endboss.lastHitSoundTime = now;
            } catch (e) {}
        }
    }

    /**
     * Updates the hurt status and counters for the endboss.
     */
    handleHurtStatus(endboss, force) {
        let now = Date.now();
        if (force === 5) {
            if (!endboss.lastSuperShotTime) endboss.lastSuperShotTime = 0;
            if (now - endboss.lastSuperShotTime < 500) return;
        }
        if (force === 1 && (now - endboss.lastHitTime < 500)) return;
        if (force === 1) endboss.lastHitTime = now;
        endboss.laserHitCount += force;
        if (force === 5) endboss.lastSuperShotTime = now;
        if (endboss.laserHitCount > 25) endboss.laserHitCount = 25;
        endboss.isElectricHurt = true;
    }

    /**
     * Manages the hurt timeout and triggers death if needed.
     */
    handleHurtTimeout(endboss, force) {
        if (endboss.electricHurtTimeout) {
            clearTimeout(endboss.electricHurtTimeout);
        }
        let hurtDuration = (force === 5) ? 1000 : 500;
        endboss.electricHurtTimeout = setTimeout(() => {
            endboss.isElectricHurt = false;
            endboss.electricHurtTimeout = null;
            if (endboss.laserHitCount === 25) {
                this.handleDeathSound(endboss);
                this.handleDeathStatus(endboss);
                this.handleDeathAnimation(endboss);
            }
        }, hurtDuration);
    }

    /**
     * Runs the death animation sequence for the Endboss.
     */
    handleDeathAnimation(endboss) {
        let deathFrame = 0;
        endboss.deathAnimInterval = setInterval(() => {
            if (deathFrame < endboss.anim.IMAGES_DEATH.length) {
                endboss.img = endboss.imageCache[endboss.anim.IMAGES_DEATH[deathFrame]];
                deathFrame++;
            } else {
                endboss.img = endboss.imageCache[endboss.anim.IMAGES_DEATH[endboss.anim.IMAGES_DEATH.length - 1]];
                clearInterval(endboss.deathAnimInterval);
            }
        }, 50);
        setTimeout(() => endboss.startBlinking(), 2500);
        setTimeout(() => endboss.removeEnemy(), 4000);
    }

    /**
     * Plays the death sound of the Endboss.
     */
    handleDeathSound(endboss) {
    endboss.sounds.stopStepSounds(endboss);
    endboss.sounds.endbossDeathSound();
    }

    /**
     * Sets status and variables for Endboss death.
     */
    handleDeathStatus(endboss) {
        endboss.collidable = false;
        endboss.isDeadAnimationPlaying = true;
        endboss.currentImage = 0;
        window.endbossDefeated = true;
        if (endboss.animInterval) {
            clearInterval(endboss.animInterval);
            endboss.animInterval = null;
        }
    }
}