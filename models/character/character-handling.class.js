/**
 * Handles character logic (Animation, Movement, Sound, Status etc.)
 */
class CharacterHandling {
    /**
     * Starts all character animation intervals.
     */
    animateCharacter(character) {
        setInterval(() => {
            if (character.isDead()) return;
            if (this.handleLevelCompleteAnimation(character)) return;
            this.handleMovement(character);
            this.handleCamera(character);
            this.handleJumpAnimation(character);
        }, 1000 / 60);

        setInterval(() => {
            this.handleIdleAnimation(character);
            this.handleWalkingAnimation(character);
            this.handleJumpSound(character);
            this.handleStepSound(character);
        }, 60);

        setInterval(() => {
            this.handleDeathAnimation(character);
            this.handleHurtAnimation(character);
        }, 30);
    }

    /**
     * Handles the level complete animation (endboss transform).
     */
    handleLevelCompleteAnimation(character) {
        if (window.endbossDefeated) {
            if (!character._isDoubled && !character._isDoublingAnimRunning) {
                character._isDoublingAnimRunning = true;
                const params = this.getLevelCompleteAnimationParams(character);
                this.startLevelCompleteAnimation(character, params);
            }
            return true;
        }
        return false;
    }

    /**
     * Calculates animation parameters for level complete.
     */
    getLevelCompleteAnimationParams(character) {
        return {
            startHeight: character.height,
            startWidth: character.width,
            startY: character.y,
            startX: character.x,
            targetHeight: character.height * 2,
            targetWidth: character.width * 2,
            targetY: character.y - 280,
            targetX: character.x - 100,
            steps: 40
        };
    }

    /**
     * Starts the level complete grow animation.
     */
    startLevelCompleteAnimation(character, params) {
        let step = 0;
        const heightStep = (params.targetHeight - params.startHeight) / params.steps;
        const widthStep = (params.targetWidth - params.startWidth) / params.steps;
        const yStep = (params.targetY - params.startY) / params.steps;
        const xStep = (params.targetX - params.startX) / params.steps;
        character._doubleAnimInterval = setInterval(() => {
            if (step < params.steps) {
                character.height += heightStep;
                character.width += widthStep;
                character.y += yStep;
                character.x += xStep;
                step++;
            } else {
                character.height = params.targetHeight;
                character.width = params.targetWidth;
                character.y = params.targetY;
                character.x = params.targetX;
                clearInterval(character._doubleAnimInterval);
                character._isDoubled = true;
            }
        }, 40);
    }

    /**
     * Handles character movement (left/right).
     */
    handleMovement(character) {
        let moveSpeed = character.speed;
        if (character.isAboveGround() && character.world.keyboard.UP) moveSpeed = character.speed * 1.5;
        if (character.world.keyboard.RIGHT && character.x < 3250) {
            character.moveRight(moveSpeed);
            character.otherDirection = false;
        }
        if (character.world.keyboard.LEFT && character.x > 0) {
            character.moveLeft(moveSpeed);
            character.otherDirection = true;
        }
    }

    /**
     * Handles camera movement.
     */
    handleCamera(character) {
        let targetCameraX = character.otherDirection ? -character.x + 400 : -character.x;
        const canvasWidth = 1100;
        const charWidth = character.width;
        const maxCameraX = -(character.world.level.level_end_x - canvasWidth + charWidth);
        if (targetCameraX < maxCameraX) targetCameraX = maxCameraX;
        const cameraSpeed = 0.02;
        character.world.camera_x += (targetCameraX - character.world.camera_x) * cameraSpeed;
    }

    /**
     * Handles jump animation trigger.
     */
    handleJumpAnimation(character) {
        if (character.world.keyboard.UP && !character.isAboveGround()) {
            character.isAboveGroundActive = true;
            character.currentImage = 0;
            character.playJumpAnimation();
        }
    }

    /**
     * Handles idle animation.
     */
    handleIdleAnimation(character) {
        if (!character.isDead() && !character.isAboveGround() && !character.throwAnimationPlaying && !(character.world.keyboard.RIGHT || character.world.keyboard.LEFT)) {
            character.playAnimation(character.anim.IMAGES_IDLE);
            character.lastAnimation = 'idle';
        }
    }

    /**
     * Handles walking animation.
     */
    handleWalkingAnimation(character) {
        if (!character.isDead() && !character.isAboveGround() && !character.throwAnimationPlaying && (character.world.keyboard.RIGHT || character.world.keyboard.LEFT)) {
            character.playAnimation(character.anim.IMAGES_WALKING);
            character.lastAnimation = 'walk';
        }
    }

    /**
     * Handles jump sound effect.
     */
    handleJumpSound(character) {
        const isJumping = character.world.keyboard.UP;
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
     * Handles step sound effect.
     */
    handleStepSound(character) {
        const isWalking = character.world.keyboard.RIGHT || character.world.keyboard.LEFT;
        const isJumping = character.world.keyboard.UP;
        if (isWalking && !isJumping) {
            this.startStepSound(character);
        } else {
            this.stopStepSound(character);
        }
    }

    /**
     * Starts the step sound effect.
     */
    startStepSound(character) {
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
     * Stops the step sound effect.
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
     * Handles death animation.
     */
    handleDeathAnimation(character) {
        if (character.isDead() && !character.deathAnimationPlayed) {
            character.playDeathAnimation();
            character.deathAnimationPlayed = true;
        }
    }

    /**
     * Handles hurt animation.
     */
    handleHurtAnimation(character) {
        if (character.isHurt()) {
            character.playAnimation(character.anim.IMAGES_HURT);
        }
    }
}
