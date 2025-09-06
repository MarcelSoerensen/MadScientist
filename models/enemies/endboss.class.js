/**
 * Represents the end boss enemy in the game. Handles all logic, animation, and collision for the boss.
 * Extends CollidableObject.
 *
 * @class Endboss
 * @extends CollidableObject
 */
class Endboss extends CollidableObject {
    stepSoundAudioRight = null;
    isStepSoundPlayingRight = false;
    
    stepSoundAudio = null;
    isStepSoundPlaying = false;
    
    animationStarted = false;
    
    checkProximityInterval = null;
    
    playThrowAnimation() {
        if (this.throwAnimationPlaying) return;

        setTimeout(() => {
            try {
                const bombSound = new Audio('sounds/endboss-hit.wav');
                bombSound.volume = 0.25;
                bombSound.play();
            } catch (e) {}
        }, 500);
    }
    lastHitSoundTime = 0;
    /**
     * Indicates if the Endboss is collidable (for collision detection)
     * @type {boolean}
     */
    collidable = true;
    /**
     * Returns the current stick collision rectangle during hit animation.
     * The rectangle matches the visible blue stick frame.
     * @returns {{x: number, y: number, width: number, height: number}|null}
     */
    getStickCollisionRect() {
        if (this.animState !== 'hit') return null;
        const hitFrame = this.hitFrame || 0;
        let stickX = this.x + this.width - 60 - 350;
        let stickY = this.y + this.height / 2;
        let growFrame = Math.max(0, hitFrame - 4);
        let stickWidth = 2 + growFrame * 10;
        let stickHeight = 100;
        let left = stickX - (stickWidth - 2 - 60);
        return {
            x: left,
            y: stickY,
            width: stickWidth,
            height: stickHeight
        };
    }

    /**
     * Draws the collision frame for the Endboss.
     * Draws a red rectangle for the main body and a blue rectangle for the stick during hit animation.
     * @param {CanvasRenderingContext2D} ctx - The 2D rendering context
     * @returns {void}
     */
    drawCollisionFrame(ctx) {
        if (!this.collidable) return;
        let leftOffset = this.offset.left;
        const isHitAnim = this.animState === 'hit';
        ctx.save();
        ctx.strokeStyle = 'rgba(0,0,0,0)';
        ctx.lineWidth = 2;
        let yPos = this.y + this.offset.top;
        if (this.jumpOffsetY !== undefined) {
            yPos += this.jumpOffsetY * 1.5;
        }
        ctx.strokeRect(
            this.x + leftOffset,
            yPos,
            this.width - leftOffset - this.offset.right,
            this.height - this.offset.top - this.offset.bottom
        );
        if (isHitAnim) {
            const hitFrame = this.hitFrame || 0;
            let stickX = this.x + this.width - 60 - 350;
            let stickY = this.y + this.height / 2;
            let growFrame = Math.max(0, hitFrame - 4);
            let stickWidth = 2 + growFrame * 10;
            let stickHeight = 100;
            ctx.strokeStyle = 'rgba(0,0,0,0)';
            ctx.lineWidth = 2;
            ctx.strokeRect(stickX - (stickWidth - 2 - 60), stickY, stickWidth, stickHeight);
        }
        ctx.restore();
    }
    /**
     * Reference to the character instance.
     * @type {Character|null}
     */
    character = null;

    /**
     * Sets the character reference for the Endboss.
     * @param {Character} character - The character instance
     */
    setCharacter(character) {
        this.character = character;
    }
    /**
     * Array of idle animation image paths.
     * @type {string[]}
     */
    IMAGES_IDLE = [
        'img/Enemy Characters/Enemy Character07/Idle/Idle_00.png',
        'img/Enemy Characters/Enemy Character07/Idle/Idle_01.png',
        'img/Enemy Characters/Enemy Character07/Idle/Idle_02.png',
        'img/Enemy Characters/Enemy Character07/Idle/Idle_03.png',
        'img/Enemy Characters/Enemy Character07/Idle/Idle_04.png',
        'img/Enemy Characters/Enemy Character07/Idle/Idle_05.png',
        'img/Enemy Characters/Enemy Character07/Idle/Idle_06.png',
        'img/Enemy Characters/Enemy Character07/Idle/Idle_07.png',
        'img/Enemy Characters/Enemy Character07/Idle/Idle_08.png',
        'img/Enemy Characters/Enemy Character07/Idle/Idle_09.png',
        'img/Enemy Characters/Enemy Character07/Idle/Idle_10.png',
        'img/Enemy Characters/Enemy Character07/Idle/Idle_11.png',
        'img/Enemy Characters/Enemy Character07/Idle/Idle_12.png',
        'img/Enemy Characters/Enemy Character07/Idle/Idle_13.png',
    ];
    /**
     * Number of times the Endboss was hit by a laser.
     * @type {number}
     */
    laserHitCount = 0;

    /**
     * Indicates if the death animation is currently playing.
     * @type {boolean}
     */
    isDeadAnimationPlaying = false;
    /**
     * Height of the Endboss.
     * @type {number}
     */
    height = 600;
    /**
     * Width of the Endboss.
     * @type {number}
     */
    width = 600;
    /**
     * Y position of the Endboss.
     * @type {number}
     */
    y = -60;

    /**
     * Collision offset values for precise hit detection.
     * @type {{top: number, left: number, right: number, bottom: number}}
     */
    offset = {
        top: 280,
        left: 245,
        right: 225,
        bottom: 160
    };

    /**
     * Array of walking animation image paths.
     * @type {string[]}
     */
    IMAGES_WALKING = [
        'img/Enemy Characters/Enemy Character07/Idle/Idle_00.png',
        'img/Enemy Characters/Enemy Character07/Idle/Idle_01.png',
        'img/Enemy Characters/Enemy Character07/Idle/Idle_02.png',
        'img/Enemy Characters/Enemy Character07/Idle/Idle_03.png',
        'img/Enemy Characters/Enemy Character07/Idle/Idle_04.png',
        'img/Enemy Characters/Enemy Character07/Idle/Idle_05.png',
        'img/Enemy Characters/Enemy Character07/Idle/Idle_06.png',
        'img/Enemy Characters/Enemy Character07/Idle/Idle_07.png',
        'img/Enemy Characters/Enemy Character07/Idle/Idle_08.png',
        'img/Enemy Characters/Enemy Character07/Idle/Idle_09.png',
        'img/Enemy Characters/Enemy Character07/Idle/Idle_10.png',
        'img/Enemy Characters/Enemy Character07/Idle/Idle_11.png',
        'img/Enemy Characters/Enemy Character07/Idle/Idle_12.png',
        'img/Enemy Characters/Enemy Character07/Idle/Idle_13.png',
    ];

    /**
     * Array of hit animation image paths.
     * @type {string[]}
     */
    IMAGES_HIT = [
        'img/Enemy Characters/Enemy Character07/Hit/Hit_00.png',
        'img/Enemy Characters/Enemy Character07/Hit/Hit_01.png',
        'img/Enemy Characters/Enemy Character07/Hit/Hit_02.png',
        'img/Enemy Characters/Enemy Character07/Hit/Hit_03.png',
        'img/Enemy Characters/Enemy Character07/Hit/Hit_04.png',
        'img/Enemy Characters/Enemy Character07/Hit/Hit_05.png',
        'img/Enemy Characters/Enemy Character07/Hit/Hit_06.png',
        'img/Enemy Characters/Enemy Character07/Hit/Hit_07.png',
        'img/Enemy Characters/Enemy Character07/Hit/Hit_08.png',
        'img/Enemy Characters/Enemy Character07/Hit/Hit_09.png',
        'img/Enemy Characters/Enemy Character07/Hit/Hit_10.png',
        'img/Enemy Characters/Enemy Character07/Hit/Hit_11.png',
        'img/Enemy Characters/Enemy Character07/Hit/Hit_12.png',
        'img/Enemy Characters/Enemy Character07/Hit/Hit_13.png',
    ];

    /**
     * Array of electric hurt animation image paths.
     * @type {string[]}
     */
    IMAGES_GET_ELECTRIC = [
        'img/Enemy Characters/Enemy Character07/Get Electric/Get Electric_0.png',
        'img/Enemy Characters/Enemy Character07/Get Electric/Get Electric_1.png',
        'img/Enemy Characters/Enemy Character07/Get Electric/Get Electric_2.png',
    ];

    /**
     * Array of death animation image paths.
     * @type {string[]}
     */
    IMAGES_DEATH = [
        'img/Enemy Characters/Enemy Character07/Death/Death_00.png',
        'img/Enemy Characters/Enemy Character07/Death/Death_01.png',
        'img/Enemy Characters/Enemy Character07/Death/Death_02.png',
        'img/Enemy Characters/Enemy Character07/Death/Death_03.png',
        'img/Enemy Characters/Enemy Character07/Death/Death_04.png',
        'img/Enemy Characters/Enemy Character07/Death/Death_05.png',
        'img/Enemy Characters/Enemy Character07/Death/Death_06.png',    
        'img/Enemy Characters/Enemy Character07/Death/Death_07.png',
        'img/Enemy Characters/Enemy Character07/Death/Death_08.png',
        'img/Enemy Characters/Enemy Character07/Death/Death_09.png',
        'img/Enemy Characters/Enemy Character07/Death/Death_10.png',
        'img/Enemy Characters/Enemy Character07/Death/Death_11.png',
        'img/Enemy Characters/Enemy Character07/Death/Death_12.png',
        'img/Enemy Characters/Enemy Character07/Death/Death_13.png',
        'img/Enemy Characters/Enemy Character07/Death/Death_14.png',
        'img/Enemy Characters/Enemy Character07/Death/Death_15.png',
        'img/Enemy Characters/Enemy Character07/Death/Death_16.png',        
        'img/Enemy Characters/Enemy Character07/Death/Death_17.png',
        'img/Enemy Characters/Enemy Character07/Death/Death_18.png',
        'img/Enemy Characters/Enemy Character07/Death/Death_19.png',    
        'img/Enemy Characters/Enemy Character07/Death/Death_20.png',
        'img/Enemy Characters/Enemy Character07/Death/Death_21.png',
        'img/Enemy Characters/Enemy Character07/Death/Death_22.png',
        'img/Enemy Characters/Enemy Character07/Death/Death_23.png',
    ];  

    /**
     * Array of walking animation image paths.
     * @type {string[]}
     */
    IMAGES_WALKING = [
        'img/Enemy Characters/Enemy Character07/Walk/Walk_00.png',
        'img/Enemy Characters/Enemy Character07/Walk/Walk_01.png',
        'img/Enemy Characters/Enemy Character07/Walk/Walk_02.png',
        'img/Enemy Characters/Enemy Character07/Walk/Walk_03.png',
        'img/Enemy Characters/Enemy Character07/Walk/Walk_04.png',
        'img/Enemy Characters/Enemy Character07/Walk/Walk_05.png',
        'img/Enemy Characters/Enemy Character07/Walk/Walk_06.png',
        'img/Enemy Characters/Enemy Character07/Walk/Walk_07.png',
        'img/Enemy Characters/Enemy Character07/Walk/Walk_08.png',
        'img/Enemy Characters/Enemy Character07/Walk/Walk_09.png',
        'img/Enemy Characters/Enemy Character07/Walk/Walk_10.png',  
        'img/Enemy Characters/Enemy Character07/Walk/Walk_11.png',
        'img/Enemy Characters/Enemy Character07/Walk/Walk_12.png',
        'img/Enemy Characters/Enemy Character07/Walk/Walk_13.png',
    ];
    
    /**
     * Indicates if the Endboss is currently hit by a laser.
     * @type {boolean}
     */
    isElectricHurt = false;
    
    /**
     * Timeout handler for electric hurt animation.
     * @type {number|null}
     */
    electricHurtTimeout = null;


    /**
     * Creates a new Endboss instance.
     * Initializes position and starts animation.
     */
    constructor() {
        super().loadImage('img/Enemy Characters/Enemy Character07/Idle/Idle_00.png');
        this.loadImages(this.IMAGES_IDLE);
        this.loadImages(this.IMAGES_WALKING);
        this.x = (1952 * 2 - 900);
        this.loadImages(this.IMAGES_GET_ELECTRIC);
        this.loadImages(this.IMAGES_DEATH);
        this.visible = true;
        this.loadImages(this.IMAGES_HIT);
        
        this.checkProximityInterval = setInterval(() => {
            if (this.character && !this.animationStarted) {
                const dist = Math.abs(this.x - this.character.x);
                if (dist <= 500) {
                    this.animationStarted = true;
                    this.animate();
                    clearInterval(this.checkProximityInterval);
                }
            }
        }, 100);
    }

    /**
     * Starts the Endboss idle animation and movement.
     * Sets up intervals for animation and death logic.
     */
    animate() {
        let deathFrame = 0;
        let deathDone = false;
        this.animState = 'idle'; 
        let animTimer = 0;
        this.hitFrame = 0;
        let startX = this.x;
        let leftTargetX = startX - 200;
        this.animInterval = setInterval(() => {
            if (!this.animationStarted) {
                this.img = this.imageCache[this.IMAGES_IDLE[0]];
                return;
            }
            if (this.laserHitCount >= 25 && !this.isElectricHurt) {
                if (!deathDone) {
                    this.img = this.imageCache[this.IMAGES_DEATH[deathFrame]];
                    deathFrame++;
                    if (deathFrame >= this.IMAGES_DEATH.length) {
                        deathFrame = this.IMAGES_DEATH.length - 1;
                        deathDone = true;
                    }
                } else {
                    this.img = this.imageCache[this.IMAGES_DEATH[this.IMAGES_DEATH.length - 1]];
                }
                return;
            }
            if (this.isElectricHurt) {
                this.playAnimation(this.IMAGES_GET_ELECTRIC);
                return;
            }
            switch (this.animState) {
                case 'idle':
                    
                    if (this.isStepSoundPlayingRight && this.stepSoundAudioRight) {
                        try {
                            this.stepSoundAudioRight.pause();
                            this.stepSoundAudioRight.currentTime = 0.5;
                        } catch (e) {}
                        this.isStepSoundPlayingRight = false;
                        this.stepSoundAudioRight = null;
                    }
                    this.playAnimation(this.IMAGES_IDLE);
                    animTimer += 50;
                    if (animTimer >= 2000) {
                        this.animState = 'walkingLeft';
                        animTimer = 0;
                    }
                    break;
                case 'walkingLeft':
                    
                    if (!this.isStepSoundPlaying) {
                        try {
                            this.stepSoundAudio = new Audio('sounds/endboss-steps-left.wav');
                            this.stepSoundAudio.loop = true;
                            this.stepSoundAudio.volume = 0.4;
                            this.stepSoundAudio.playbackRate = 1.5;
                            this.stepSoundAudio.currentTime = 0.5;
                            this.stepSoundAudio.play();
                            this.isStepSoundPlaying = true;
                        } catch (e) {}
                    }
                    this.playAnimation(this.IMAGES_WALKING);
                    if (this.x > leftTargetX) {
                        this.moveLeft(Math.min(4, this.x - leftTargetX));
                    }
                    animTimer += 50;
                    if (this.x <= leftTargetX || animTimer >= 5000) {
                        this.animState = 'hit';
                        animTimer = 0;
                        this.hitFrame = 0;
                        if (this.isStepSoundPlaying && this.stepSoundAudio) {
                            try {
                                this.stepSoundAudio.pause();
                                this.stepSoundAudio.currentTime = 0.5;
                            } catch (e) {}
                            this.isStepSoundPlaying = false;
                            this.stepSoundAudio = null;
                        }
                        setTimeout(() => {
                            try {
                                const hitStickSound = new Audio('sounds/endboss-hit.wav');
                                hitStickSound.volume = 0.25;
                                hitStickSound.playbackRate = 1.35;
                                hitStickSound.play();
                            } catch (e) {}
                        }, 100);
                    }
                    break;
                case 'hit':
                    this.img = this.imageCache[this.IMAGES_HIT[this.hitFrame % this.IMAGES_HIT.length]];
                    this.hitFrame++;
                    animTimer += 50;
                    if (this.hitFrame >= this.IMAGES_HIT.length) {
                        this.animState = 'idle2';
                        animTimer = 0;
                    }
                    break;
                case 'idle2':
                    this.playAnimation(this.IMAGES_IDLE);
                    animTimer += 50;
                    if (animTimer >= 2000) {
                        this.animState = 'walkingRight';
                        animTimer = 0;
                    }
                    break;
                case 'walkingRight':
                    
                    if (!this.isStepSoundPlayingRight) {
                        try {
                            this.stepSoundAudioRight = new Audio('sounds/endboss-steps-right.mp3');
                            this.stepSoundAudioRight.loop = true;
                            this.stepSoundAudioRight.volume = 0.15;
                            this.stepSoundAudioRight.playbackRate = 1.5;
                            this.stepSoundAudioRight.currentTime = 0.5;
                            this.stepSoundAudioRight.play();
                            this.isStepSoundPlayingRight = true;
                        } catch (e) {}
                    }
                    
                    if (this.isStepSoundPlaying && this.stepSoundAudio) {
                        try {
                            this.stepSoundAudio.pause();
                            this.stepSoundAudio.currentTime = 0.5;
                        } catch (e) {}
                        this.isStepSoundPlaying = false;
                        this.stepSoundAudio = null;
                    }
                    
                    if (this.isStepSoundPlaying && this.stepSoundAudio) {
                        try {
                            this.stepSoundAudio.pause();
                            this.stepSoundAudio.currentTime = 0.5;
                        } catch (e) {}
                        this.isStepSoundPlaying = false;
                        this.stepSoundAudio = null;
                    }
                    this.playAnimation(this.IMAGES_WALKING);
                    if (this.x < startX) {
                        this.moveRight(Math.min(4, startX - this.x));
                    }
                    animTimer += 50;
                    if (this.x >= startX || animTimer >= 5000) {
                        this.x = startX;
                        this.animState = 'idle';
                        animTimer = 0;
                    }
                    break;
            }
        }, 50);
    }
    
    /**
     * Registers an electric laser hit and triggers the electric hurt animation.
     * Animation runs for 500ms (normal) or 1000ms (supershot) and then returns to normal state.
     * @param {number} [force=1] - Number of hits to apply (1=normal shot, 5=supershot)
     */
    triggerElectricHurt(force = 1) {
    /**
     * Registers an electric laser hit and triggers the electric hurt animation and sound.
     * Plays hit sound only every 1 second. Triggers death animation at 25 hits.
     * @param {number} [force=1] - Number of hits to apply (1=normal shot, 5=supershot)
     * @returns {void}
     */
    let now = Date.now();
    if (!this.lastHitSoundTime || now - this.lastHitSoundTime > 1000) {
        try {
            const hitSound = new Audio('sounds/endboss-collided.wav');
            hitSound.volume = 0.7;
            hitSound.play();
            this.lastHitSoundTime = now;
        } catch (e) {
    
        }
    }
        if (this.laserHitCount >= 25) return;
        if (this.isElectricHurt) return;
        if (force === 5) {
            if (!this.lastSuperShotTime) this.lastSuperShotTime = 0;
            if (now - this.lastSuperShotTime < 500) return;
        }
        if (force === 1 && (now - this.lastHitTime < 500)) return;
        if (force === 1) this.lastHitTime = now;
        this.laserHitCount += force;
        if (force === 5) this.lastSuperShotTime = now;
    if (this.laserHitCount > 25) this.laserHitCount = 25;
        if (this.electricHurtTimeout) {
            clearTimeout(this.electricHurtTimeout);
        }
        this.isElectricHurt = true;
        let hurtDuration = (force === 5) ? 1000 : 500;
        this.electricHurtTimeout = setTimeout(() => {
            this.isElectricHurt = false;
            this.electricHurtTimeout = null;
            if (this.laserHitCount === 25) {
                this.startDeathAnimation();
            }
        }, hurtDuration);
    }

    /**
     * Starts the death animation for the Endboss.
     */
    startDeathAnimation() {
    if (this.isStepSoundPlaying && this.stepSoundAudio) {
        try {
            this.stepSoundAudio.pause();
            this.stepSoundAudio.currentTime = 0.5;
        } catch (e) {}
        this.isStepSoundPlaying = false;
        this.stepSoundAudio = null;
    }
    if (this.isStepSoundPlayingRight && this.stepSoundAudioRight) {
        try {
            this.stepSoundAudioRight.pause();
            this.stepSoundAudioRight.currentTime = 0.5;
        } catch (e) {}
        this.isStepSoundPlayingRight = false;
        this.stepSoundAudioRight = null;
    }
    /**
     * Starts the death animation for the Endboss and plays the death sound with fade-out.
     * Sets collidable to false and marks the boss as defeated.
     * @returns {void}
     */
    try {
        const deathSound = new Audio('sounds/endboss-death.wav');
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
    } catch (e) {
    
    }
    this.collidable = false;
    this.isDeadAnimationPlaying = true;
    this.currentImage = 0;
    window.endbossDefeated = true;
        if (this.animInterval) {
            clearInterval(this.animInterval);
            this.animInterval = null;
        }
        let deathFrame = 0;
        this.deathAnimInterval = setInterval(() => {
            if (deathFrame < this.IMAGES_DEATH.length) {
                this.img = this.imageCache[this.IMAGES_DEATH[deathFrame]];
                deathFrame++;
            } else {
                this.img = this.imageCache[this.IMAGES_DEATH[this.IMAGES_DEATH.length - 1]];
                clearInterval(this.deathAnimInterval);
            }
        }, 50);

        setTimeout(() => {
            this.startBlinking();
        }, 2500);
        setTimeout(() => {
            this.removeEnemy();
        }, 4000);
    }

    /**
     * Starts blinking animation after death.
     */
    startBlinking() {
        this.blinkInterval = setInterval(() => {
            this.visible = !this.visible;
        }, 200);
    }

    /**
     * Removes the Endboss from the game.
     */
    removeEnemy() {
        this.visible = false;
        this.collidable = false;
        if (this.blinkInterval) {
            clearInterval(this.blinkInterval);
            this.blinkInterval = null;
        }
    }
}
