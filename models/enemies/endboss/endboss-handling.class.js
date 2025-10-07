/**
 * Handles endboss logic (Animation, State, Status etc.)
 */
class EndbossHandling {
    /**
     * Starts all endboss animation intervals.
     */
    animateEndboss(endboss) {
        this.startEndbossAnimationIntervals(endboss);
        this.startEndbossMainLoop(endboss);
    }

    /**
     * Prepares / resets base animation state for the endboss.
     */
    startEndbossAnimationIntervals(endboss) {
        for (const key of ['animInterval','deathAnimInterval']) {
            if (endboss[key]) { clearInterval(endboss[key]); endboss[key] = null; }
        }
        if (endboss.deathDone || endboss.isDeadAnimationPlaying) return false;
        Object.assign(endboss, {
            deathFrame: 0,
            deathDone: false,
            animTimer: 0,
            animState: 'idle',
            hitFrame: 0,
            startX: endboss.x,
            leftTargetX: endboss.x - 200
        });
        return true;
    }

    /**
     * Starts the main animation loop interval (movement & state machine).
     */
    startEndbossMainLoop(endboss) {
        if (endboss.deathDone || endboss.isDeadAnimationPlaying) return;
        endboss.animInterval = setInterval(() => {
            if (endboss.deathDone || endboss.isDeadAnimationPlaying) return;
            if (!endboss.animationStarted) return this.handleIdle(endboss);
            if (endboss.hurtCount >= 25 && !endboss.isElectricHurt) {
                endboss.deathDone = true;
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
        if (endboss.deathDone || endboss.isDeadAnimationPlaying) return;
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
            endboss.sounds.hitStickSound(endboss);
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
    if (endboss.deathDone || endboss.isDeadAnimationPlaying) return;
    this.handleHurtSound(endboss, force);
    if (endboss.hurtCount >= 25) return;
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
                const hitSound = SoundCacheManager.getAudio('sounds/endboss-collided.mp3');
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
        endboss.hurtCount += force;
            if (force === 5) endboss.lastSuperShotTime = now;
            if (endboss.hurtCount > 25) endboss.hurtCount = 25;
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
            if (endboss.hurtCount >= 25) {
                return;
            }
        }, hurtDuration);
    }

    /**
     * Runs the death animation sequence for the Endboss.
     */
    handleDeathAnimation(endboss) {
        if (endboss.deathAnimInterval || endboss._deathAnimationStarted) return;
        endboss._deathAnimationStarted = true;
        const frames = endboss.anim.IMAGES_DEATH;
        let i = 0, lastIndex = frames.length - 1;
        endboss.deathAnimInterval = setInterval(() => {
            endboss.img = endboss.imageCache[frames[i <= lastIndex ? i : lastIndex]];
            if (i++ > lastIndex) {
                clearInterval(endboss.deathAnimInterval);
                endboss.deathAnimInterval = null;
            }
        }, 50);
        setTimeout(() => endboss.removeEnemy(), 4000);
    }

    /**
     * Plays the death sound of the Endboss.
     */
    handleDeathSound(endboss) {
    endboss.sounds.stopAllEndbossSounds(endboss);
    endboss.sounds.endbossDeathSound();
    }

    /**
     * Sets status and variables for Endboss death.
     */
    handleDeathStatus(endboss) {
        endboss.collidable = false;
        endboss.isDeadAnimationPlaying = true;
        endboss.animState = 'dead';
        endboss.currentImage = 0;
        window.endbossDefeated = true;
        this.stopEndbossIntervals(endboss);
    }

    /**
     * Stops all endboss animation intervals.
     */
    stopEndbossIntervals(endboss) {
        for (const key of ['animInterval','deathAnimInterval','checkProximityInterval']) {
            if (endboss[key]) {
                clearInterval(endboss[key]);
                endboss[key] = null;
            }
        }
    }

    /**
     * Resumes the main animation interval for the endboss without resetting states.
     */
    resumeEndbossAnimationIntervals(endboss) {
        this.stopEndbossIntervals(endboss);
        if (endboss.deathDone || endboss.isDeadAnimationPlaying) return; // nach Tod nicht fortsetzen
        this.startEndbossMainLoop(endboss);
    }
}