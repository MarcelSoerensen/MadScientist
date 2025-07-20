/**
 * Represents the first type of enemy character
 * @extends CollidableObject
 */
class EnemyOne extends CollidableObject {
    lastHitTime = 0;
    // ...existing code...
    /**
     * Counts how many times the enemy was hit by a laser
     * @type {number}
     */
    laserHitCount = 0;

    /**
     * Indicates if the death animation is currently playing
     * @type {boolean}
     */
    isDeadAnimationPlaying = false;


    /** 
     * @type {Object} Collision offset values adjusted for enemy proportions
}
     * @property {number} right - Right offset in pixels
     * @property {number} bottom - Bottom offset in pixels
     */
    offset = {
        top: 140,
        left: 103,
        right: 115,
        bottom: 80
    };

    /** @type {string[]} Array of walking animation image paths */
    IMAGES_WALKING = [
        'img/Enemy Characters/Enemy Character01/Walk/Walk_00.png',
        'img/Enemy Characters/Enemy Character01/Walk/Walk_01.png',
        'img/Enemy Characters/Enemy Character01/Walk/Walk_02.png',
        'img/Enemy Characters/Enemy Character01/Walk/Walk_03.png',
        'img/Enemy Characters/Enemy Character01/Walk/Walk_04.png',
        'img/Enemy Characters/Enemy Character01/Walk/Walk_05.png',
        'img/Enemy Characters/Enemy Character01/Walk/Walk_06.png',
        'img/Enemy Characters/Enemy Character01/Walk/Walk_07.png',
        'img/Enemy Characters/Enemy Character01/Walk/Walk_08.png',
        'img/Enemy Characters/Enemy Character01/Walk/Walk_09.png',
        'img/Enemy Characters/Enemy Character01/Walk/Walk_10.png',
        'img/Enemy Characters/Enemy Character01/Walk/Walk_11.png',
        'img/Enemy Characters/Enemy Character01/Walk/Walk_12.png',
        'img/Enemy Characters/Enemy Character01/Walk/Walk_13.png',
    ];

    /**
     * Indicates if the enemy is currently hit by a laser
     * @type {boolean}
     */
    isElectricHurt = false;

    /**
     * Timeout handler for electric hurt animation
     * @type {number|null}
     */
    electricHurtTimeout = null;

    IMAGES_GET_ELECTRIC = [
        'img/Enemy Characters/Enemy Character01/Get Electric/Get Electric_0.png',
        'img/Enemy Characters/Enemy Character01/Get Electric/Get Electric_1.png',
        'img/Enemy Characters/Enemy Character01/Get Electric/Get Electric_2.png',
    ];

    IMAGES_DEATH = [
        'img/Enemy Characters/Enemy Character01/Death/Death_00.png',
        'img/Enemy Characters/Enemy Character01/Death/Death_01.png',
        'img/Enemy Characters/Enemy Character01/Death/Death_02.png',
        'img/Enemy Characters/Enemy Character01/Death/Death_03.png',    
        'img/Enemy Characters/Enemy Character01/Death/Death_04.png',
        'img/Enemy Characters/Enemy Character01/Death/Death_05.png',
        'img/Enemy Characters/Enemy Character01/Death/Death_06.png',
        'img/Enemy Characters/Enemy Character01/Death/Death_07.png',
        'img/Enemy Characters/Enemy Character01/Death/Death_08.png',
        'img/Enemy Characters/Enemy Character01/Death/Death_09.png',
        'img/Enemy Characters/Enemy Character01/Death/Death_10.png',
        'img/Enemy Characters/Enemy Character01/Death/Death_11.png',
        'img/Enemy Characters/Enemy Character01/Death/Death_12.png',            
        'img/Enemy Characters/Enemy Character01/Death/Death_13.png',
        'img/Enemy Characters/Enemy Character01/Death/Death_14.png',
        'img/Enemy Characters/Enemy Character01/Death/Death_15.png',
        'img/Enemy Characters/Enemy Character01/Death/Death_16.png',
        'img/Enemy Characters/Enemy Character01/Death/Death_17.png',
        'img/Enemy Characters/Enemy Character01/Death/Death_18.png',
        'img/Enemy Characters/Enemy Character01/Death/Death_19.png',
        'img/Enemy Characters/Enemy Character01/Death/Death_20.png',
        'img/Enemy Characters/Enemy Character01/Death/Death_21.png',
        'img/Enemy Characters/Enemy Character01/Death/Death_22.png',
        'img/Enemy Characters/Enemy Character01/Death/Death_23.png',
    ];

    /**
     * Creates a new EnemyOne instance
     * Initializes position, speed, and starts animation
     */
    constructor() {
        super().loadImage('img/Enemy Characters/Enemy Character01/Walk/Walk_00.png');
        this.loadImages(this.IMAGES_WALKING);
        this.x = 400 + Math.random() * 720;
        this.y = 160 + Math.random() * 10;

        this.speed = 0.15 + Math.random() * 0.25;

        this.loadImages(this.IMAGES_GET_ELECTRIC);
        this.loadImages(this.IMAGES_DEATH);
        this.visible = true;
        this.animate();
    }

    /**
     * Starts enemy animation and movement
     * Sets up intervals for leftward movement and walking animation
     */
    animate() {
        this.moveInterval = setInterval(() => {
            this.moveLeft();
        }, 1000 / 60);

        let deathFrame = 0;
        let deathDone = false;
        this.animInterval = setInterval(() => {
            if (this.laserHitCount >= 3 && !this.isElectricHurt) {
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
            } else if (this.isElectricHurt) {
                this.playAnimation(this.IMAGES_GET_ELECTRIC);
            } else {
                this.playAnimation(this.IMAGES_WALKING);
            }
        }, 50);
    }

    /**
     * Triggers the electric hurt animation (e.g. on laser collision)
     * Animation runs for 500ms and then returns to normal state
     */
    triggerElectricHurt() {
        const now = Date.now();
        if (this.laserHitCount >= 3) return;
        if (now - this.lastHitTime < 500) return;
        this.lastHitTime = now;
        this.laserHitCount++;
        if (this.electricHurtTimeout) {
            clearTimeout(this.electricHurtTimeout);
        }
        this.isElectricHurt = true;
        this.electricHurtTimeout = setTimeout(() => {
            this.isElectricHurt = false;
            this.electricHurtTimeout = null;
            if (this.laserHitCount === 3) {
                this.startDeathAnimation();
            }
        }, 700);
    }

    /**
     * Starts the death animation for the enemy
     */
    startDeathAnimation() {
        this.isDeadAnimationPlaying = true;
        this.currentImage = 0;
        this.collidable = false;
        if (this.moveInterval) {
            clearInterval(this.moveInterval);
            this.moveInterval = null;
        }
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

    startBlinking() {
        this.blinkInterval = setInterval(() => {
            this.visible = !this.visible;
        }, 200);
    }

    removeEnemy() {
        this.visible = false;
        if (this.blinkInterval) {
            clearInterval(this.blinkInterval);
            this.blinkInterval = null;
        }
    }
}

