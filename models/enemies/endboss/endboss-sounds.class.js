/**
 * Handles all sound effects for the Endboss.
 */
class EndbossSounds {
    /**
     * Plays and fades the Endboss proximity sound (counter.mp3) based on the character's X position.
     */
    playXPositionSound(endboss) {
        if (!endboss.world?.character) return;
        const charX = endboss.world.character.x;
        const isMuted = window.SoundCacheManager ? SoundCacheManager.muted : false;
        if (charX >= 2300) {
            this.pauseBackgroundMusic();
            this.playEndbossMelody(isMuted);
            this.playCounterSound(isMuted);
            if (!isMuted && charX < 2300 && charX > 2250)
                this.fadeOutXPositionSound(2250, 2300, charX);
        } else {
            this.pauseEndbossMelody();
            this.stopXPositionSound();
        }
    }

    /**
     * Pauses the background music.
     */
    pauseBackgroundMusic() {
        if (window.backgroundMusic) {
            window.backgroundMusic.pause();
            window.backgroundMusic.currentTime = 0;
        }
    }

    /**
     * Plays the Endboss melody in a loop.
     */
    playEndbossMelody(isMuted) {
        if (!window.endbossMelody) {
            window.endbossMelody = new Audio('sounds/endboss-melody.mp3');
            window.endbossMelody.loop = true;
        }
        window.endbossMelody.volume = isMuted ? 0 : 0.08;
        if (window.endbossMelody.paused) {
            window.endbossMelody.currentTime = 0;
            window.endbossMelody.play();
        }
    }

    /**
     * Pauses the Endboss melody.
     */
    pauseEndbossMelody() {
        if (window.endbossMelody) {
            window.endbossMelody.pause();
            window.endbossMelody.currentTime = 0;
        }
    }

    /**
     * Plays the counter sound for the Endboss based on the character's X position.
     */
    playCounterSound(isMuted) {
        if (!this.xPositionSoundAudio) {
            this.xPositionSoundAudio = new Audio('sounds/counter.mp3');
            this.xPositionSoundAudio.loop = true;
            this.xPositionSoundAudio.playbackRate = 1.2;
        }
        this.xPositionSoundAudio.volume = isMuted ? 0 : 0.7;
        if (this.xPositionSoundAudio.paused) {
            this.xPositionSoundAudio.currentTime = 0;
            this.xPositionSoundAudio.play();
        }
    }

    /**
     * Fades out the X-position sound
     */
    fadeOutXPositionSound(start, end, charX) {
        if (!this.xPositionSoundAudio) return;
        let targetVolume = 0.7 * (charX - start) / (end - start);
        targetVolume = Math.max(0, Math.min(0.7, targetVolume));
        this.xPositionSoundAudio.volume = targetVolume;
    }

    /**
     * Stops the X-position sound immediately
     */
    stopXPositionSound() {
        if (this.xPositionSoundAudio) {
            try {
                this.xPositionSoundAudio.pause();
                this.xPositionSoundAudio.currentTime = 0;
            } catch (e) {}
            this.xPositionSoundAudio = null;
        }
    }

    xPositionSoundAudio = null;

    /**
     * Creates and plays the left step sound for the Endboss.
     */
    walkingLeftSoundCreation(endboss) {
        const isMuted = window.SoundCacheManager ? SoundCacheManager.muted : false;
        if (!endboss.stepSoundAudio) {
            endboss.stepSoundAudio = new Audio('sounds/endboss-steps-left.mp3');
            endboss.stepSoundAudio.loop = true;
            endboss.stepSoundAudio.playbackRate = 1.5;
            endboss.stepSoundAudio.currentTime = 0.5;
        }
        endboss.stepSoundAudio.volume = isMuted ? 0 : 0.4;
        if (endboss.stepSoundAudio.paused) {
            endboss.stepSoundAudio.play();
        }
        endboss.isStepSoundPlaying = true;
    }
    
    /**
     * Stops the left step sound for the Endboss.
     */
    walkingLeftStepSoundStop(endboss) {
        if (endboss.isStepSoundPlaying && endboss.stepSoundAudio) {
            try {
                endboss.stepSoundAudio.pause();
                endboss.stepSoundAudio.currentTime = 0.5;
            } catch (e) {}
            endboss.isStepSoundPlaying = false;
            endboss.stepSoundAudio = null;
        }
    }

    /**
     * Plays the hit/stick sound for the Endboss.
     */
    hitStickSound(endboss, options = {}) {
        try {
            if (endboss.hitSoundAudio && typeof endboss.hitSoundAudio.pause === 'function') {
                endboss.hitSoundAudio.pause();
            }
            endboss.hitSoundAudio = SoundCacheManager.getAudio('sounds/endboss-hit.mp3');
            endboss.hitSoundAudio.volume = options.volume ?? 0.25;
            if (options.playbackRate) endboss.hitSoundAudio.playbackRate = options.playbackRate;
            endboss.hitSoundAudio.play();
        } catch (e) {}
    }

    /**
     * Creates and plays the right step sound for the Endboss.
     */
    walkingRightSoundCreation(endboss) {
        const isMuted = window.SoundCacheManager ? SoundCacheManager.muted : false;
        if (!endboss.stepSoundAudioRight) {
            endboss.stepSoundAudioRight = new Audio('sounds/endboss-steps-right.mp3');
            endboss.stepSoundAudioRight.loop = true;
            endboss.stepSoundAudioRight.playbackRate = 1.5;
            endboss.stepSoundAudioRight.currentTime = 0.5;
        }
        endboss.stepSoundAudioRight.volume = isMuted ? 0 : 0.15;
        if (endboss.stepSoundAudioRight.paused) {
            endboss.stepSoundAudioRight.play();
        }
        endboss.isStepSoundPlayingRight = true;
    }

    /**
    * Stops the right step sound for the Endboss.
    */
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

    /**
     * Plays the death sound for the Endboss.
     */
    endbossDeathSound() {
        try {
            const deathSound = SoundCacheManager.getAudio('sounds/endboss-death.mp3');
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

    /**
     * Stops all Endboss sounds including the X-position sound
     */
    stopAllEndbossSounds(endboss) {
        this.stopEndbossMelody();
        this.stopStepSoundsLeft(endboss);
        this.stopStepSoundsRight(endboss);
        this.stopHitSound(endboss);
        this.stopXPositionSound();
    }

    /**
     * Stops the Endboss melody.
     */
    stopEndbossMelody() {
        if (window.endbossMelody) {
            try {
                window.endbossMelody.pause();
                window.endbossMelody.currentTime = 0;
            } catch (e) {}
            window.endbossMelody = null;
        }
    }

    /**
     * Stops the left step sounds for the Endboss.
     */
    stopStepSoundsLeft(endboss) {
        if (endboss.isStepSoundPlaying && endboss.stepSoundAudio) {
            try {
                endboss.stepSoundAudio.pause();
                endboss.stepSoundAudio.currentTime = 0.5;
            } catch (e) {}
            endboss.isStepSoundPlaying = false;
            endboss.stepSoundAudio = null;
        }
    }

    /**
     * Stops the right step sounds for the Endboss.
     */
    stopStepSoundsRight(endboss) {
        if (endboss.isStepSoundPlayingRight && endboss.stepSoundAudioRight) {
            try {
                endboss.stepSoundAudioRight.pause();
                endboss.stepSoundAudioRight.currentTime = 0.5;
            } catch (e) {}
            endboss.isStepSoundPlayingRight = false;
            endboss.stepSoundAudioRight = null;
        }
    }

    /**
     * Stops the hit/stick sound for the Endboss.
     */
    stopHitSound(endboss) {
        if (endboss.hitSoundAudio) {
            try {
                endboss.hitSoundAudio.pause();
                endboss.hitSoundAudio.currentTime = 0;
            } catch (e) {}
            endboss.hitSoundAudio = null;
        }
    }
}
