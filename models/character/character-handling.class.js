/**
 * Handles character logic (Animation, Movement, Sound, Status etc.)
 */
class CharacterHandling {
    /**
     * Starts all character animation intervals.
     */
    animateCharacter(character) {
        this.handleMovementLoop(character);
        this.handleAnimationLoop(character);
        this.handleStateLoop(character);
    }

    /** 
     * Movement & camera/jump loop 
     */
    handleMovementLoop(character) {
        character.movementInterval = setInterval(() => {
            if (character.deathAnimationPlayed) return;
            if (this.handleLevelCompleteAnimation(character)) return;
            this.handleMovement(character);
            this.handleCamera(character);
            this.handleJumpAnimation(character);
        }, 1000 / 60);
    }

    /** 
     * Idle / walk animations + sounds 
     */
    handleAnimationLoop(character) {
        character.animationInterval = setInterval(() => {
            if (character.isAnimationLocked && character.lastAnimation === 'hurt') return; // do not override hurt sequence
            this.handleIdleAnimation(character);
            this.handleWalkingAnimation(character);
            (this.sounds ??= new CharacterSounds()).jumpSound(character);
            this.handleStepSound(character);
        }, 60);
    }

    /** 
     * Death & hurt checks (fast) 
     */
    handleStateLoop(character) {
        character.stateInterval = setInterval(() => {
            this.handleDeathAnimation(character);
        }, 30);
    }

    /**
     * Handles the level complete animation (endboss transform).
     */
    handleLevelCompleteAnimation(character) {
        if (window.endbossDefeated) {
            if (!character.isDoubled && !character.isDoublingAnimRunning) {
                character.isDoublingAnimRunning = true;
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
        const {startHeight, startWidth, startY, startX, targetHeight, targetWidth, targetY, targetX, steps} = params;
        let step = 0;
        const heightStep = (targetHeight - startHeight) / steps;
        const widthStep  = (targetWidth  - startWidth)  / steps;
        const yStep      = (targetY      - startY)      / steps;
        const xStep      = (targetX      - startX)      / steps;
        character.doubleAnimInterval = setInterval(() => step < steps
            ? (character.height += heightStep, character.width += widthStep, character.y += yStep, character.x += xStep, step++)
            : (character.height = targetHeight, character.width = targetWidth, character.y = targetY, character.x = targetX,
               clearInterval(character.doubleAnimInterval), character.isDoubled = true), 40);
    }

    /**
     * Handles character movement (left/right).
     */
    handleMovement(character) {
        if (character.lastAnimation === 'hurt' || character.lastAnimation === 'dead') return;
        const keyboard = character.world.keyboard;
        const moveSpeed = (character.isAboveGround() && keyboard.UP) ? character.speed * 1.5 : character.speed;
            if (!character.enteredEndbossZone && character.x >= 2600) character.enteredEndbossZone = true;
            const minX = character.enteredEndbossZone ? 2600 : 0;
        if (keyboard.RIGHT && character.x < 3250) {
            typeof character.moveRight === 'function' ? character.moveRight(moveSpeed) : (character.x += moveSpeed);
            character.otherDirection = false;
        } else if (keyboard.LEFT && character.x > minX) {
            typeof character.moveLeft === 'function' ? character.moveLeft(moveSpeed) : (character.x -= moveSpeed);
            character.otherDirection = true;
        }
        if (character.x < minX) character.x = minX;
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
        if (character.lastAnimation === 'hurt' || character.lastAnimation === 'dead') return;
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
        if (character.lastAnimation === 'hurt' || character.lastAnimation === 'dead') return;
        if (!character.deathAnimationPlayed && !character.isAboveGround() && !character.throwAnimationPlaying && !(character.world.keyboard.RIGHT || character.world.keyboard.LEFT)) {
            character.playAnimation(character.anim.IMAGES_IDLE);
            character.lastAnimation = 'idle';
        }
    }

    /**
     * Handles walking animation.
     */
    handleWalkingAnimation(character) {
        if (character.lastAnimation === 'hurt' || character.lastAnimation === 'dead') return;
        if (!character.deathAnimationPlayed && !character.isAboveGround() && !character.throwAnimationPlaying && (character.world.keyboard.RIGHT || character.world.keyboard.LEFT)) {
            character.playAnimation(character.anim.IMAGES_WALKING);
            character.lastAnimation = 'walk';
        }
    }

    /**
     * Handles step sound effect.
     */
    handleStepSound(character) {
        const isWalking = character.world.keyboard.RIGHT || character.world.keyboard.LEFT;
        const isJumping = character.world.keyboard.UP;
        if (!this.sounds) this.sounds = new CharacterSounds();
        if (isWalking && !isJumping) {
            this.sounds.stepSound(character);
        } else {
            this.sounds.stopStepSound(character);
        }
    }

    /**
     * Handles death animation.
     */
    handleDeathAnimation(character) {
        if (typeof character.energy === 'number' && character.energy <= 0 && !character.deathAnimationPlayed && !character.isAnimationLocked) {
            if (!character.world?.gameOver) {
                character.isAnimationLocked = true;
                character.deathAnimationPlayed = true;
                character.lastAnimation = 'dead';
                character.playDeathAnimation();
            }
        }
    }
}
