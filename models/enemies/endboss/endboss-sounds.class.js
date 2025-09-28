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
        const fadeInX = 2300;
        const fadeOutX = 2250;
        if (charX >= fadeInX) {
            if (!this.xPositionSoundPlaying) this.initXPositionSound();
        } else if (this.xPositionSoundPlaying && this.xPositionSoundAudio) {
            if (charX < fadeOutX) this.fadeOutXPositionSound(fadeOutX, fadeInX, charX);
        }
        if (charX < fadeOutX && this.xPositionSoundPlaying && this.xPositionSoundAudio && this.xPositionSoundAudio.volume <= 0.01) {
            this.stopXPositionSound();
        }
    }

    /**
     * Initializes and fades in the X-position sound
     */
    initXPositionSound() {
        this.xPositionSoundAudio = SoundCacheManager.getAudio('sounds/counter.mp3');
        Object.assign(this.xPositionSoundAudio, { loop: true, volume: 0, playbackRate: 1.2 });
        this.xPositionSoundAudio.play();
        this.xPositionSoundPlaying = true;
        let fadeInterval = setInterval(() => {
            if (!this.xPositionSoundAudio) return;
            this.xPositionSoundAudio.volume = Math.min(0.7, this.xPositionSoundAudio.volume + 0.01);
            if (this.xPositionSoundAudio.volume >= 0.7) clearInterval(fadeInterval);
        }, 40);
    }

    /**
     * Fades out the X-position sound
     */
    fadeOutXPositionSound(start, end, charX) {
        let targetVolume = 0.5 * (1 - (end - charX) / (end - start));
        targetVolume = Math.max(0, Math.min(0.5, targetVolume));
        let fadeOutInterval = setInterval(() => {
            if (!this.xPositionSoundAudio) return;
            if (this.xPositionSoundAudio.volume <= targetVolume + 0.01) {
                this.xPositionSoundAudio.volume = targetVolume;
                clearInterval(fadeOutInterval);
            } else {
                this.xPositionSoundAudio.volume -= 0.01;
            }
        }, 40);
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
        this.xPositionSoundPlaying = false;
    }

    xPositionSoundPlaying = false;
    xPositionSoundAudio = null;

    /**
     * Creates and plays the left step sound for the Endboss.
     */
    walkingLeftSoundCreation(endboss) {
        if (!endboss.isStepSoundPlaying) {
            try {
                endboss.stepSoundAudio = SoundCacheManager.getAudio('sounds/endboss-steps-left.mp3');
                endboss.stepSoundAudio.loop = true;
                endboss.stepSoundAudio.volume = 0.4;
                endboss.stepSoundAudio.playbackRate = 1.5;
                endboss.stepSoundAudio.currentTime = 0.5;
                endboss.stepSoundAudio.play();
                endboss.isStepSoundPlaying = true;
            } catch (e) {}
        }
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
        if (!endboss.isStepSoundPlayingRight) {
            try {
                endboss.stepSoundAudioRight = SoundCacheManager.getAudio('sounds/endboss-steps-right.mp3');
                endboss.stepSoundAudioRight.loop = true;
                endboss.stepSoundAudioRight.volume = 0.15;
                endboss.stepSoundAudioRight.playbackRate = 1.5;
                endboss.stepSoundAudioRight.currentTime = 0.5;
                endboss.stepSoundAudioRight.play();
                endboss.isStepSoundPlayingRight = true;
            } catch (e) {}
        }
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
     * Stops all step sounds for the Endboss.
     */
    stopStepSounds(endboss) {
        if (endboss.isStepSoundPlaying && endboss.stepSoundAudio) {
            try {
                endboss.stepSoundAudio.pause();
                endboss.stepSoundAudio.currentTime = 0.5;
            } catch (e) {}
            endboss.isStepSoundPlaying = false;
            endboss.stepSoundAudio = null;
        }
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
        if (endboss.isStepSoundPlaying && endboss.stepSoundAudio) {
            try {
                endboss.stepSoundAudio.pause();
                endboss.stepSoundAudio.currentTime = 0.5;
            } catch (e) {}
            endboss.isStepSoundPlaying = false;
            endboss.stepSoundAudio = null;
        }
        if (endboss.isStepSoundPlayingRight && endboss.stepSoundAudioRight) {
            try {
                endboss.stepSoundAudioRight.pause();
                endboss.stepSoundAudioRight.currentTime = 0.5;
            } catch (e) {}
            endboss.isStepSoundPlayingRight = false;
            endboss.stepSoundAudioRight = null;
        }
        if (endboss.hitSoundAudio) {
            try {
                endboss.hitSoundAudio.pause();
                endboss.hitSoundAudio.currentTime = 0;
            } catch (e) {}
            endboss.hitSoundAudio = null;
        }
        this.stopXPositionSound();
    }
    
}
