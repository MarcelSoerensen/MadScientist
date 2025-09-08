/**
 * Handles all sound effects for the Endboss.
 */
class EndbossSounds {
    /**
     * Creates and plays the left step sound for the Endboss.
     */
    walkingLeftSoundCreation(endboss) {
        if (!endboss.isStepSoundPlaying) {
            try {
                endboss.stepSoundAudio = new Audio('sounds/endboss-steps-left.mp3');
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
     * Creates and plays the right step sound for the Endboss.
     */
    walkingRightSoundCreation(endboss) {
        if (!endboss.isStepSoundPlayingRight) {
            try {
                endboss.stepSoundAudioRight = new Audio('sounds/endboss-steps-right.mp3');
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
}
