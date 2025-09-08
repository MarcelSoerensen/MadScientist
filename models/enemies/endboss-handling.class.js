/**
 * Handles endboss logic (Animation, State, Status etc.)
 */
class EndbossHandling {
    /**
     * Starts all endboss animation intervals.
     */
    animateEndboss(endboss) {
        endboss.startEndbossAnimationIntervals();
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
            if (endboss.laserHitCount >= 25 && !endboss.isElectricHurt) return endboss.deathAnimation(endboss.deathFrame, endboss.deathDone);
            if (endboss.isElectricHurt) return endboss.electricHurtAnimation();
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
        endboss.idleAnimation();
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
        endboss.walkingLeftAnimation(endboss.leftTargetX, endboss.animTimer);
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
        endboss.hitAnimation(endboss.animTimer);
        endboss.animTimer += 50;
        if (endboss.hitFrame >= endboss.anim.IMAGES_HIT.length) {
            endboss.animState = 'idle2';
            endboss.animTimer = 0;
        }
    }

    /**
     * Handles the second idle animation state.
     */
    handleIdle2(endboss) {
        endboss.idleAnimation();
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
        endboss.walkingRightAnimation(endboss.startX, endboss.animTimer);
        endboss.animTimer += 50;
        if (endboss.x >= endboss.startX || endboss.animTimer >= 5000) {
            endboss.x = endboss.startX;
            endboss.animState = 'idle';
            endboss.animTimer = 0;
        }
    }

    /**
     * Handles the death animation and related effects.
     */
    handleDeathAnimation(endboss) {
        endboss.stopStepSounds();
        endboss.playEndbossDeathSound();
        endboss.collidable = false;
        endboss.isDeadAnimationPlaying = true;
        endboss.currentImage = 0;
        window.endbossDefeated = true;
        if (endboss.animInterval) {
            clearInterval(endboss.animInterval);
            endboss.animInterval = null;
        }
        endboss.deathAnimation();
        setTimeout(() => endboss.startBlinking(), 2500);
        setTimeout(() => endboss.removeEnemy(), 4000);
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
                this.handleDeathAnimation(endboss);
            }
        }, hurtDuration);
    }
}