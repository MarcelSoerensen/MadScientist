/**
 * Handles all sound effects for the Character.
 */
class CharacterSounds {
    /**
     * Plays the step sound for the character.
     */
    stepSound(character) {
        if (!character.isStepSoundPlaying) {
            try {
                character.stepSoundAudio = new Audio('sounds/character-steps.mp3');
                Object.assign(character.stepSoundAudio, {
                    loop: true,
                    volume: 0.3,
                    playbackRate: 2.3,
                    currentTime: 0
                });
                character.stepSoundAudio.play();
                character.isStepSoundPlaying = true;
            } catch (e) {}
        }
    }

    /**
     * Stops the step sound for the character.
     */
    stopStepSound(character) {
        if (character.isStepSoundPlaying && character.stepSoundAudio) {
            try {
                character.stepSoundAudio.pause();
                character.stepSoundAudio.currentTime = 0;
            } catch (e) {}
            character.isStepSoundPlaying = false;
            character.stepSoundAudio = null;
        }
    }

    /**
     * Plays the jump sound for the character.
     */
    jumpSound(character) {
        const isJumping = character.isAboveGround();
        if (isJumping && !character.jumpSoundPlayed) {
            try {
                const jumpSound = new Audio('sounds/character-jump.mp3');
                jumpSound.volume = 0.2;
                jumpSound.play();
            } catch (e) {}
            character.jumpSoundPlayed = true;
        }
        if (!isJumping) character.jumpSoundPlayed = false;
    }

    /**
     * Plays the throw bomb sound effect for the character.
     */
    throwBombSound(character) {
        try {
            const bombSound = new Audio('sounds/hit-bomb.mp3');
            bombSound.volume = 0.25;
            bombSound.play();
        } catch (e) {}
    }

    /**
     * Plays the hurt/collision sound effect for the character.
     */
    hurtSound(character, world) {
        const now = Date.now();
        if (!world.lastCollisionSoundTime || now - world.lastCollisionSoundTime > 500) {
            try {
                const hurtSound = new Audio('sounds/character-hurt.mp3');
                hurtSound.volume = 0.5;
                hurtSound.play();
                world.lastCollisionSoundTime = now;
            } catch (e) {}
        }
    }

    /**
     * Plays the death sound effect for the character.
     */
    deathSound(character) {
        try {
            const deathSound = new Audio('sounds/character-death.mp3');
            deathSound.volume = 0.7;
            deathSound.play();
        } catch (e) {}
    }
}
