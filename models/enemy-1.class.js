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
     * Creates a new EnemyOne instance
     * Initializes position, speed, and starts animation
     */
    constructor() {
        super().loadImage('img/Enemy Characters/Enemy Character01/Walk/Walk_00.png');
        this.loadImages(this.IMAGES_WALKING);
        this.x = 400 + Math.random() * 720;
        this.y = 160 + Math.random() * 10;

        this.speed = 0.15 + Math.random() * 0.25;

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
            this.playAnimation(this.IMAGES_WALKING);
        }, 100);
    }

}