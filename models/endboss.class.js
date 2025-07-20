/**
 * Represents the end boss enemy
 * @extends CollidableObject
 */
class Endboss extends CollidableObject {
    /** @type {number} Height of the endboss */
    height = 600;
    /** @type {number} Width of the endboss */
    width = 600;
    /** @type {number} Y position of the endboss */
    y = -60;

    /**
     * @type {Object} Collision offset values for precise hit detection
     * @property {number} top - Top offset in pixels
     * @property {number} left - Left offset in pixels
     * @property {number} right - Right offset in pixels
     * @property {number} bottom - Bottom offset in pixels
     */
    offset = {
        top: 280,
        left: 245,
        right: 225,
        bottom: 160
    };

    /** @type {string[]} Array of idle animation image paths */
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

    IMAGE_GET_ELECTRIC = [
        'img/Enemy Characters/Enemy Character07/Get Electric/Get Electric_0.png',
        'img/Enemy Characters/Enemy Character07/Get Electric/Get Electric_1.png',
        'img/Enemy Characters/Enemy Character07/Get Electric/Get Electric_2.png',
    ];
    
    /**
     * Indicates if the endboss is currently hit by a laser
     * @type {boolean}
     */
    isElectricHurt = false;
    
    /**
     * Timeout handler for electric hurt animation
     * @type {number|null}
     */
    electricHurtTimeout = null;


    /**
     * Creates a new Endboss instance
     * Initializes position and starts animation
     */
    constructor() {
        super().loadImage('img/Enemy Characters/Enemy Character07/Walk/Walk_00.png');
        this.loadImages(this.IMAGES_WALKING);
        this.x = (1952 * 2 - 900);
        this.loadImages(this.IMAGE_GET_ELECTRIC);
        this.animate();
    }

    /**
     * Starts the endboss idle animation
     * Sets up interval for cycling through idle frames
     */
    animate() {
        setInterval(() => {
            if (this.isElectricHurt) {
                this.playAnimation(this.IMAGE_GET_ELECTRIC);
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
