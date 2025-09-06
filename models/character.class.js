/**
 * Represents the main character that the player controls
 * @extends CollidableObject
 */
class Character extends CollidableObject {
    /**
     * Gibt das Kollisionsrechteck des Charakters zurück
     * @returns {{x:number, y:number, width:number, height:number}}
     */
    getCollisionRect() {
        let x = this.x + (this.offset?.left || 0);
        let y = this.y + (this.offset?.top || 0);
        if (this.jumpOffsetY !== undefined) {
            y += this.jumpOffsetY * 1.5;
        }
        let width = this.width - ((this.offset?.left || 0) + (this.offset?.right || 0));
        let height = this.height - ((this.offset?.top || 0) + (this.offset?.bottom || 0));
        return { x, y, width, height };
    }
    _jumpSoundPlayed = false;
    _stepSoundEndHandler = null;
    stepSoundAudio = null;
    isStepSoundPlaying = false;
    /**
     * Moves the character to the right by the given speed
     * @param {number} speed - Movement speed
     */
    /**
     * Moves the character to the left by the given speed
     * @param {number} speed - Movement speed
     */
    /**
     * Checks if the character is dead
     * @returns {boolean}
     */
    /**
     * Checks if the character is above ground
     * @returns {boolean}
     */
    /**
     * Checks if the character is hurt
     * @returns {boolean}
     */
    /**
     * Plays the specified animation sequence
     * @param {string[]} images - Array of image paths
     */
    /**
     * Y position of the character
     * @type {number}
     */
    y= 110;
    /**
     * Height of the character
     * @type {number}
     */
    height = 380;
    /**
     * Width of the character
     * @type {number}
     */
    width = 250;
    /**
     * Movement speed of the character
     * @type {number}
     */
    speed = 2;

    /**
     * Collision offset values for the character
     * @type {{top: number, left: number, right: number, bottom: number}}
     */
    offset = {
    top: 185,
    left: 80,
    right: 110,
    bottom: 110
    };

    /**
     * Array of walking animation image paths
     * @type {string[]}
     */
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

    /**
     * Array of jumping animation image paths
     * @type {string[]}
     */
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

    /**
     * Array of death animation image paths
     * @type {string[]}
     */
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

    /**
     * Array of hurt animation image paths
     * @type {string[]}
     */
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

    /**
     * Array of idle animation image paths
     * @type {string[]}
     */
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
    
    /**
     * Array of throw bomb animation image paths
     * @type {string[]}
     */
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

    /**
     * Reference to the game world
     * @type {World}
     */
    world;
    /**
     * Last played animation name
     * @type {string}
     */
    lastAnimation = '';
    /**
     * Current animation frame index
     * @type {number}
     */
    currentImage = 0;
    /**
     * Whether the character is currently above ground
     * @type {boolean}
     */
    isAboveGroundActive = false;
    /**
     * X position where the jump started
     * @type {number}
     */
    startJumpX = 0;
    /**
     * Y offset for jump animation
     * @type {number}
     */
    jumpOffsetY = 0;
    /**
     * Flag to track if death animation has been played
     * @type {boolean}
     */
    deathAnimationPlayed = false;
    /**
     * Flag to track if throw animation is currently playing
     * @type {boolean}
     */
    throwAnimationPlaying = false;
    /**
     * Array of delays for jump animation frames
     * @type {number[]}
     */
    JUMP_DELAYS = [10, 15, 25, 35, 55, 70, 85, 55, 22, 15];
    /**
     * Reversed jump delays for downward animation
     * @type {number[]}
     */
    JUMP_DELAYS_DOWN = [...this.JUMP_DELAYS].reverse();

    /**
     * Creates a new Character instance
     * Initializes images and starts animation
     */
    constructor() {
        super().loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_JUMPING);
        this.loadImages(this.IMAGES_DEAD);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_IDLE);
        this.loadImages(this.IMAGES_THROW_BOMB);
        this.x = 0;
        this.isAboveGroundActive = false;
        this.animate();
    }

    /**
     * Starts and manages all character animations and movement
     * Sets up intervals for movement, animation, and state management
     */
    animate() {
        setInterval(() => {
            if (this.isDead()) {
                return;
            }

            
            if (window.endbossDefeated) {
                if (!this._isDoubled && !this._isDoublingAnimRunning) {
                    this._isDoublingAnimRunning = true;
                    const startHeight = this.height;
                    const startWidth = this.width;
                    const startY = this.y;
                    const startX = this.x;
                    const targetHeight = startHeight * 2;
                    const targetWidth = startWidth * 2;
                    const targetY = startY - 280;
                    const targetX = startX - 100;
                    const steps = 40;
                    let step = 0;
                    const heightStep = (targetHeight - startHeight) / steps;
                    const widthStep = (targetWidth - startWidth) / steps;
                    const yStep = (targetY - startY) / steps;
                    const xStep = (targetX - startX) / steps;
                    this._doubleAnimInterval = setInterval(() => {
                        if (step < steps) {
                            this.height += heightStep;
                            this.width += widthStep;
                            this.y += yStep;
                            this.x += xStep;
                            step++;
                        } else {
                            this.height = targetHeight;
                            this.width = targetWidth;
                            this.y = targetY;
                            this.x = targetX;
                            clearInterval(this._doubleAnimInterval);
                            this._isDoubled = true;
                        }
                    }, 40);
                }
                return;
            }

            let moveSpeed = this.speed;
            if (this.isAboveGround() && this.world.keyboard.UP) {
                moveSpeed = this.speed * 1.5; 
            }
            if (this.world.keyboard.RIGHT && this.x < 3250) {
                this.moveRight(moveSpeed);
                this.otherDirection = false;
            }
            if (this.world.keyboard.LEFT && this.x > 0 ) {
                this.moveLeft(moveSpeed);
                this.otherDirection = true;
            }
            let targetCameraX;
            if (this.otherDirection) {
                targetCameraX = -this.x + 400;
            } else {
                targetCameraX = -this.x;
            }
            const canvasWidth = 1100;
            const charWidth = this.width;
            const maxCameraX = -(this.world.level.level_end_x - canvasWidth + charWidth);
            if (targetCameraX < maxCameraX) {
                targetCameraX = maxCameraX;
            }
            const cameraSpeed = 0.02;
            this.world.camera_x += (targetCameraX - this.world.camera_x) * cameraSpeed;
            if (this.world.keyboard.UP && !this.isAboveGround()) {
                this.isAboveGroundActive = true;
                this.currentImage = 0;
                this.playJumpAnimation();
            }
        }, 1000 / 60);

        setInterval(() => {
            if (!this.isDead() && !this.isAboveGround() && !this.throwAnimationPlaying) {
                if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
                    this.playAnimation(this.IMAGES_WALKING);
                    this.lastAnimation = 'walk';
                } else {
                    this.playAnimation(this.IMAGES_IDLE);
                    this.lastAnimation = 'idle';
                }
            }
            
            const isWalking = this.world.keyboard.RIGHT || this.world.keyboard.LEFT;
            const isJumping = this.world.keyboard.UP;

            
            if (isJumping && !this._jumpSoundPlayed) {
                try {
                    const jumpSound = new Audio('sounds/character-jump.mp3');
                    jumpSound.volume = 0.2;
                    jumpSound.play();
                } catch (e) {}
                this._jumpSoundPlayed = true;
            }
            if (!isJumping) {
                this._jumpSoundPlayed = false;
            }
            if (isWalking && !isJumping && !this.isStepSoundPlaying) {
                try {
                    this.stepSoundAudio = new Audio('sounds/character-steps.mp3');
                    this.stepSoundAudio.loop = true;
                    this.stepSoundAudio.volume = 0.3;
                    this.stepSoundAudio.playbackRate = 2.3;
                    this.stepSoundAudio.currentTime = 0;
                    this.stepSoundAudio.play();
                    this.isStepSoundPlaying = true;
                } catch (e) {
                    
                }
            }
            if ((!isWalking || isJumping) && this.isStepSoundPlaying && this.stepSoundAudio) {
                try {
                    this.stepSoundAudio.pause();
                    this.stepSoundAudio.currentTime = 0;
                } catch (e) {}
                this.isStepSoundPlaying = false;
                this.stepSoundAudio = null;
            }
        }, 60);

        setInterval(() => {
            if (this.isDead() && !this.deathAnimationPlayed) {
                this.playDeathAnimation();
                this.deathAnimationPlayed = true;
            } else if (this.isHurt()) {
                this.playAnimation(this.IMAGES_HURT);
            }
        }, 30);
    }

    /**
     * Plays the jumping animation with physics simulation
     * Handles upward motion, hovering at peak, and downward motion
     */
    playJumpAnimation() {
        if (!this.isAboveGround()) return;
        this.startJumpX = this.x;
        let frame = 0;
        const self = this;
        const maxJumpHeight = 100;
        const totalFrames = this.IMAGES_JUMPING.length;

        /**
         * Animates the character moving upward during a jump
         * @private
         */
        function animateUp() {
            self.img = self.imageCache[self.IMAGES_JUMPING[frame]];
            
            self.jumpOffsetY = -(frame / totalFrames) * maxJumpHeight;
            
            let delay = self.JUMP_DELAYS[frame] || 60;
            frame++;
            if (frame < self.IMAGES_JUMPING.length) {
                setTimeout(animateUp, delay);
            } else {
                frame = self.IMAGES_JUMPING.length - 1;
                holdOnTop();
            }
        }

        /**
         * Holds the character at the peak of the jump, allowing extended hovering
         * @private
         */
        function holdOnTop() {
            const maxJumpDistance = 150;
            const distance = Math.abs(self.x - self.startJumpX);
            const isMoving = self.world.keyboard.RIGHT || self.world.keyboard.LEFT;

            self.jumpOffsetY = -maxJumpHeight / 1.5;

            if (self.world.keyboard.UP && isMoving && distance < maxJumpDistance) {
                setTimeout(holdOnTop, 20);
            } else {
                animateDown();
            }
        }

        /**
         * Animates the character falling down from the jump peak
         * @private
         */
        function animateDown() {
            let delay = self.JUMP_DELAYS.slice().reverse()[self.IMAGES_JUMPING.length - 1 - frame] || 60;
            self.img = self.imageCache[self.IMAGES_JUMPING[frame]];
            self.jumpOffsetY = -(frame / totalFrames) * maxJumpHeight;
            
            frame--;
            if (frame >= 0) {
                setTimeout(animateDown, delay);
            } else {
                self.isAboveGroundActive = false;
                self.currentImage = 0;
                self.lastAnimation = '';
                self.jumpOffsetY = 0; 
            }
        }

        animateUp();
    }

    /**
     * Plays the death animation once
     * Animation plays through all frames and stops at the last frame
     */
    playDeathAnimation() {
        let frame = 0;
        const self = this;
        const delays = new Array(this.IMAGES_DEAD.length).fill(30);

            
        try {
            const deathSound = new Audio('sounds/character-death.mp3');
            deathSound.volume = 0.7;
            deathSound.play();
    } catch (e) {
            
        }

        /**
         * Animates the character's death sequence frame by frame
         * @private
         */
        function animateFrame() {
            if (frame < self.IMAGES_DEAD.length) {
                self.img = self.imageCache[self.IMAGES_DEAD[frame]];
                let delay = delays[frame];
                frame++;
                setTimeout(animateFrame, delay);
            } else {
                self.lastAnimation = 'dead';
            }
        }

        animateFrame();
    }

    /**
     * Plays the throw bomb animation once
     * Animation plays through all frames with 30ms delay
     */
    playThrowBombAnimation() {
        if (this.throwAnimationPlaying) return;

        setTimeout(() => {
            try {
                const bombSound = new Audio('sounds/hit-bomb.mp3');
                bombSound.volume = 0.25;
                bombSound.play();
            } catch (e) {}
        }, 500);

        this.throwAnimationPlaying = true;
        let frame = 0;
        const self = this;
        const delays = new Array(this.IMAGES_THROW_BOMB.length).fill(30);

        /**
         * Animates the character's throw bomb sequence frame by frame
         * @private
         */
        function animateFrame() {
            if (frame < self.IMAGES_THROW_BOMB.length) {
                self.img = self.imageCache[self.IMAGES_THROW_BOMB[frame]];
                let delay = delays[frame];
                frame++;
                setTimeout(animateFrame, delay);
            } else {
                self.lastAnimation = 'throw';
                self.throwAnimationPlaying = false;
            }
        }

        animateFrame();
    }
}
