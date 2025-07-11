/**
 * Represents the main character that the player controls
 * @extends CollidableObject
 */
class Character extends CollidableObject {
    /** @type {number} Y position of the character */
    y= 110;
    /** @type {number} Height of the character */
    height = 380;
    /** @type {number} Movement speed of the character */
    speed = 2;

    /** 
     * @type {Object} Collision offset values for the character
     * @property {number} top - Top offset in pixels
     * @property {number} left - Left offset in pixels
     * @property {number} right - Right offset in pixels
     * @property {number} bottom - Bottom offset in pixels
     */
    offset = {
        top: 185,
        left: 100,
        right: 130,
        bottom: 110
    };

    /** @type {string[]} Array of walking animation image paths */
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

    /** @type {string[]} Array of jumping animation image paths */
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

    /** @type {string[]} Array of death animation image paths */
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

    /** @type {string[]} Array of hurt animation image paths */
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

    /** @type {string[]} Array of idle animation image paths */
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
    
    /** @type {string[]} Array of throw bomb animation image paths */
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


    /** @type {World} Reference to the game world */
    world;
    /** @type {string} Last played animation name */
    lastAnimation = '';
    /** @type {number} Current animation frame index */
    currentImage = 0;
    /** @type {boolean} Whether the character is currently above ground */
    isAboveGroundActive = false;
    /** @type {number} X position where the jump started */
    startJumpX = 0;
    /** @type {number} Y offset for jump animation */
    jumpOffsetY = 0;
    /** @type {boolean} Flag to track if death animation has been played */
    deathAnimationPlayed = false;
    /** @type {boolean} Flag to track if throw animation is currently playing */
    throwAnimationPlaying = false;
    /** @type {number[]} Array of delays for jump animation frames */
    JUMP_DELAYS = [10, 15, 25, 35, 55, 70, 85, 55, 22, 15];
    /** @type {number[]} Reversed jump delays for downward animation */
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

            let moveSpeed = this.speed;

            if (this.isAboveGround() && this.world.keyboard.UP) {
                moveSpeed = this.speed * 1.5; 
            }

            if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x - 100) {
                this.moveRight(moveSpeed);
                this.otherDirection = false;
            }
            if (this.world.keyboard.LEFT && this.x > 0 ) {
                this.moveLeft(moveSpeed);
                this.otherDirection = true;
            }

            this.world.camera_x = -this.x;

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
         * Holds the character at the peak of the jump
         * Allows extended hovering while moving and UP key is held
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
         * Plays jump frames in reverse order with corresponding delays
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
        
        this.throwAnimationPlaying = true;
        let frame = 0;
        const self = this;
        const delays = new Array(this.IMAGES_THROW_BOMB.length).fill(30);

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
