/**
 * Represents the first type of enemy character
 * @extends CollidableObject
 */
class EnemyOne extends CollidableObject {

    /** 
     * @type {Object} Collision offset values adjusted for enemy proportions
     * @property {number} top - Top offset in pixels
     * @property {number} left - Left offset in pixels
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
        'img/Enemy Characters/Enemy Character01/Get Electric/Get Electric_3.png',
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
        this.animate();
    }

    /**
     * Starts enemy animation and movement
     * Sets up intervals for leftward movement and walking animation
     */
    animate() {
        setInterval(() => {
            this.moveLeft();
        }, 1000 / 60);

        setInterval(() => {
            if (this.isElectricHurt) {
                this.playAnimation(this.IMAGES_GET_ELECTRIC);
            } else {
                this.playAnimation(this.IMAGES_WALKING);
            }
        }, 100);
    }

    /**
     * Triggers the electric hurt animation (e.g. on laser collision)
     * Animation runs for 500ms and then returns to normal state
     */
    triggerElectricHurt() {
        if (this.electricHurtTimeout) {
            clearTimeout(this.electricHurtTimeout);
        }
        this.isElectricHurt = true;
        this.electricHurtTimeout = setTimeout(() => {
            this.isElectricHurt = false;
            this.electricHurtTimeout = null;
        }, 500);
    }

}