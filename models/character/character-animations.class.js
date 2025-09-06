class CharacterAnimations {
    IMAGES_IDLE = [
        'img/Main Characters/Gun01/Idle/Idle_00.png',
        'img/Main Characters/Gun01/Idle/Idle_01.png',
        'img/Main Characters/Gun01/Idle/Idle_02.png',
        'img/Main Characters/Gun01/Idle/Idle_03.png',
        'img/Main Characters/Gun01/Idle/Idle_04.png',
        'img/Main Characters/Gun01/Idle/Idle_05.png',
        'img/Main Characters/Gun01/Idle/Idle_06.png',
        'img/Main Characters/Gun01/Idle/Idle_07.png',
        'img/Main Characters/Gun01/Idle/Idle_08.png',
        'img/Main Characters/Gun01/Idle/Idle_09.png',
        'img/Main Characters/Gun01/Idle/Idle_10.png',
        'img/Main Characters/Gun01/Idle/Idle_11.png',
        'img/Main Characters/Gun01/Idle/Idle_12.png',
        'img/Main Characters/Gun01/Idle/Idle_13.png',
    ];
    
    IMAGES_WALKING = [
        'img/Main Characters/Gun01/Walk/Walk_00.png',
        'img/Main Characters/Gun01/Walk/Walk_01.png',
        'img/Main Characters/Gun01/Walk/Walk_02.png',
        'img/Main Characters/Gun01/Walk/Walk_03.png',
        'img/Main Characters/Gun01/Walk/Walk_04.png',
        'img/Main Characters/Gun01/Walk/Walk_05.png',
        'img/Main Characters/Gun01/Walk/Walk_06.png',
        'img/Main Characters/Gun01/Walk/Walk_07.png',
        'img/Main Characters/Gun01/Walk/Walk_08.png',
        'img/Main Characters/Gun01/Walk/Walk_09.png',
        'img/Main Characters/Gun01/Walk/Walk_10.png',
        'img/Main Characters/Gun01/Walk/Walk_11.png',
        'img/Main Characters/Gun01/Walk/Walk_12.png',
        'img/Main Characters/Gun01/Walk/Walk_13.png',
    ];

    jumpAnimation(character) {
        character.jumpFrame = 0;
        character.maxJumpHeight = 100;
        character.totalJumpFrames = this.IMAGES_JUMPING.length;
        this.animateJumpUp(character, this.IMAGES_JUMPING);
    }

    animateJumpUp(character, imageArray) {
        character.img = character.imageCache[imageArray[character.jumpFrame]];
        character.jumpOffsetY = -(character.jumpFrame / character.totalJumpFrames) * character.maxJumpHeight;
        let delay = this.JUMP_DELAYS[character.jumpFrame] || 60;
        character.jumpFrame++;
        if (character.jumpFrame < imageArray.length) {
            setTimeout(() => this.animateJumpUp(character, imageArray), delay);
        } else {
            character.jumpFrame = imageArray.length - 1;
            this.holdJumpOnTop(character, imageArray);
        }
    }

    holdJumpOnTop(character, imageArray) {
        const maxJumpDistance = 150;
        const distance = Math.abs(character.x - character.startJumpX);
        const isMoving = character.world.keyboard.RIGHT || character.world.keyboard.LEFT;
        character.jumpOffsetY = -character.maxJumpHeight / 1.5;
        if (character.world.keyboard.UP && isMoving && distance < maxJumpDistance) {
            setTimeout(() => this.holdJumpOnTop(character, imageArray), 20);
        } else {
            this.animateJumpDown(character, imageArray);
        }
    }

    animateJumpDown(character, imageArray) {
        let delay = this.JUMP_DELAYS_DOWN[imageArray.length - 1 - character.jumpFrame] || 60;
        character.img = character.imageCache[imageArray[character.jumpFrame]];
        character.jumpOffsetY = -(character.jumpFrame / character.totalJumpFrames) * character.maxJumpHeight;
        character.jumpFrame--;
        if (character.jumpFrame >= 0) {
            setTimeout(() => this.animateJumpDown(character, imageArray), delay);
        } else {
            character.isAboveGroundActive = false;
            character.currentImage = 0;
            character.lastAnimation = '';
            character.jumpOffsetY = 0;
        }
    }


    IMAGES_JUMPING = [
        'img/Main Characters/Gun01/Jump/Jump_00.png',
        'img/Main Characters/Gun01/Jump/Jump_01.png',
        'img/Main Characters/Gun01/Jump/Jump_02.png',
        'img/Main Characters/Gun01/Jump/Jump_03.png',
        'img/Main Characters/Gun01/Jump/Jump_04.png',
        'img/Main Characters/Gun01/Jump/Jump_05.png',
        'img/Main Characters/Gun01/Jump/Jump_06.png',
        'img/Main Characters/Gun01/Jump/Jump_07.png',
        'img/Main Characters/Gun01/Jump/Jump_08.png',
        'img/Main Characters/Gun01/Jump/Jump_09.png',
    ];

    deathAnimation(character) {
            let frame = 0;
            const delays = new Array(this.IMAGES_DEAD.length).fill(30);
            const animateDeathFrame = () => {
                if (frame < this.IMAGES_DEAD.length) {
                    character.img = character.imageCache[this.IMAGES_DEAD[frame]];
                    let delay = delays[frame];
                    frame++;
                    setTimeout(animateDeathFrame, delay);
                } else {
                    character.lastAnimation = 'dead';
                }
            };
            animateDeathFrame();
        }

    IMAGES_DEAD = [
        'img/Main Characters/Gun01/Death/Death_00.png',
        'img/Main Characters/Gun01/Death/Death_01.png',
        'img/Main Characters/Gun01/Death/Death_02.png',
        'img/Main Characters/Gun01/Death/Death_03.png',
        'img/Main Characters/Gun01/Death/Death_04.png',
        'img/Main Characters/Gun01/Death/Death_05.png',
        'img/Main Characters/Gun01/Death/Death_06.png',
        'img/Main Characters/Gun01/Death/Death_07.png',
        'img/Main Characters/Gun01/Death/Death_08.png',
        'img/Main Characters/Gun01/Death/Death_09.png',
        'img/Main Characters/Gun01/Death/Death_10.png',
        'img/Main Characters/Gun01/Death/Death_11.png',
        'img/Main Characters/Gun01/Death/Death_12.png',
        'img/Main Characters/Gun01/Death/Death_13.png',
        'img/Main Characters/Gun01/Death/Death_14.png',
        'img/Main Characters/Gun01/Death/Death_15.png',
        'img/Main Characters/Gun01/Death/Death_16.png',
        'img/Main Characters/Gun01/Death/Death_17.png',
        'img/Main Characters/Gun01/Death/Death_18.png',
        'img/Main Characters/Gun01/Death/Death_19.png',
        'img/Main Characters/Gun01/Death/Death_20.png',
        'img/Main Characters/Gun01/Death/Death_21.png',
        'img/Main Characters/Gun01/Death/Death_22.png',
        'img/Main Characters/Gun01/Death/Death_23.png',
        'img/Main Characters/Gun01/Death/Death_24.png',
        'img/Main Characters/Gun01/Death/Death_25.png',
        'img/Main Characters/Gun01/Death/Death_26.png',
        'img/Main Characters/Gun01/Death/Death_27.png',
        'img/Main Characters/Gun01/Death/Death_28.png',
        'img/Main Characters/Gun01/Death/Death_29.png',
        'img/Main Characters/Gun01/Death/Death_30.png',
        'img/Main Characters/Gun01/Death/Death_31.png',
        'img/Main Characters/Gun01/Death/Death_32.png',
        'img/Main Characters/Gun01/Death/Death_33.png',
        'img/Main Characters/Gun01/Death/Death_34.png',
        'img/Main Characters/Gun01/Death/Death_35.png',
        'img/Main Characters/Gun01/Death/Death_36.png',
        'img/Main Characters/Gun01/Death/Death_37.png',
        'img/Main Characters/Gun01/Death/Death_38.png',
        'img/Main Characters/Gun01/Death/Death_39.png',
        'img/Main Characters/Gun01/Death/Death_40.png',
        'img/Main Characters/Gun01/Death/Death_41.png',
        'img/Main Characters/Gun01/Death/Death_42.png',
        'img/Main Characters/Gun01/Death/Death_43.png',
    ];
    IMAGES_HURT = [
        'img/Main Characters/Gun01/Get Hit/Get Hit_00.png',
        'img/Main Characters/Gun01/Get Hit/Get Hit_01.png',
        'img/Main Characters/Gun01/Get Hit/Get Hit_02.png',
        'img/Main Characters/Gun01/Get Hit/Get Hit_03.png',
        'img/Main Characters/Gun01/Get Hit/Get Hit_04.png',
        'img/Main Characters/Gun01/Get Hit/Get Hit_05.png',
        'img/Main Characters/Gun01/Get Hit/Get Hit_06.png',
        'img/Main Characters/Gun01/Get Hit/Get Hit_07.png',
        'img/Main Characters/Gun01/Get Hit/Get Hit_08.png',
        'img/Main Characters/Gun01/Get Hit/Get Hit_09.png',
    ];

    throwBombAnimation(character) {
        let frame = 0;
        const delays = new Array(this.IMAGES_THROW_BOMB.length).fill(30);
        const animateBombFrame = () => {
            if (frame < this.IMAGES_THROW_BOMB.length) {
                character.img = character.imageCache[this.IMAGES_THROW_BOMB[frame]];
                let delay = delays[frame];
                frame++;
                setTimeout(animateBombFrame, delay);
            } else {
                character.lastAnimation = 'throw';
                character.throwAnimationPlaying = false;
            }
        };
        animateBombFrame();
    }


    IMAGES_THROW_BOMB = [
        'img/Main Characters/Gun01/Throw bomb/Throw bomb_00.png',
        'img/Main Characters/Gun01/Throw bomb/Throw bomb_01.png',
        'img/Main Characters/Gun01/Throw bomb/Throw bomb_02.png',
        'img/Main Characters/Gun01/Throw bomb/Throw bomb_03.png',
        'img/Main Characters/Gun01/Throw bomb/Throw bomb_04.png',
        'img/Main Characters/Gun01/Throw bomb/Throw bomb_05.png',
        'img/Main Characters/Gun01/Throw bomb/Throw bomb_06.png',
        'img/Main Characters/Gun01/Throw bomb/Throw bomb_07.png',
        'img/Main Characters/Gun01/Throw bomb/Throw bomb_08.png',
        'img/Main Characters/Gun01/Throw bomb/Throw bomb_09.png',
        'img/Main Characters/Gun01/Throw bomb/Throw bomb_10.png',
        'img/Main Characters/Gun01/Throw bomb/Throw bomb_11.png',
        'img/Main Characters/Gun01/Throw bomb/Throw bomb_12.png',
        'img/Main Characters/Gun01/Throw bomb/Throw bomb_13.png',
        'img/Main Characters/Gun01/Throw bomb/Throw bomb_14.png',
        'img/Main Characters/Gun01/Throw bomb/Throw bomb_15.png',
        'img/Main Characters/Gun01/Throw bomb/Throw bomb_16.png',
        'img/Main Characters/Gun01/Throw bomb/Throw bomb_17.png',
        'img/Main Characters/Gun01/Throw bomb/Throw bomb_18.png',
        'img/Main Characters/Gun01/Throw bomb/Throw bomb_19.png',
    ];
    JUMP_DELAYS = [10, 15, 25, 35, 55, 70, 85, 55, 22, 15];
    JUMP_DELAYS_DOWN = [...this.JUMP_DELAYS].reverse();
}