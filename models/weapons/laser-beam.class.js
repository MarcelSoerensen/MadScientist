/**
 * Represents a laser beam projectile that can be shot by the character
 * @extends CollidableObject
 */
class LaserBeam extends CollidableObject {

    /** 
     * @type {Object} Collision offset values for the laser beam
     * @property {number} top - Top offset in pixels
     * @property {number} left - Left offset in pixels
     * @property {number} right - Right offset in pixels
     * @property {number} bottom - Bottom offset in pixels
     */
    offset = {
        top: 5,
        left: 10,
        right: 10,
        bottom: 5
    };

    /** @type {string[]} Array of laser beam animation image paths */
    IMAGES_LASER_BEAM = [
        'img/Projectile/Laser/skeleton-animation_0.png',
        'img/Projectile/Laser/skeleton-animation_1.png',
        'img/Projectile/Laser/skeleton-animation_2.png',
        'img/Projectile/Laser/skeleton-animation_3.png',
        'img/Projectile/Laser/skeleton-animation_4.png',
    ];

    /** @type {number} Horizontal speed of the laser beam */
    speedX = 15;
    /** @type {number} Damage dealt by the laser beam */
    damage = 25;
    /** @type {number} Animation interval ID for stopping animation */
    animationInterval = null;
    /** @type {number} Position update interval ID */
    positionInterval = null;
    /** @type {Character} Reference to the character to follow */
    character = null;
    /** @type {number} X offset from character position */
    offsetX = 190;
    /** @type {number} Y offset from character position */
    offsetY = 205;

    /**
     * Creates a new LaserBeam instance
     * @param {number} x - The initial x position
     * @param {number} y - The initial y position
     * @param {boolean} otherDirection - Whether the laser should fly to the left
     * @param {Character} character - Reference to the character to follow
     */
    constructor(x, y, otherDirection = false, character = null) {
        super().loadImage('img/Projectile/Laser/skeleton-animation_0.png');
        this.loadImages(this.IMAGES_LASER_BEAM);
        this.x = x;
        this.y = y;
        this.height = 60;
        this.width = 80;
        this.otherDirection = otherDirection;
        this.character = character;
        if (arguments.length >= 6) {
            this.offsetX = arguments[4] !== undefined ? arguments[4] : 220;
            this.offsetY = arguments[5] !== undefined ? arguments[5] : 205;
        }
        this.animate();
        this.followCharacter();
    }

    /**
     * Starts the laser beam animation
     * Continuously cycles through animation frames
     * @returns {void}
     */
    animate() {
        this.animationInterval = setInterval(() => {
            this.playAnimation(this.IMAGES_LASER_BEAM);
        }, 80);
    }

    /**
     * Stops the laser beam animation
     * @returns {void}
     */
    stopAnimation() {
        if (this.animationInterval) {
            clearInterval(this.animationInterval);
            this.animationInterval = null;
        }
        if (this.positionInterval) {
            clearInterval(this.positionInterval);
            this.positionInterval = null;
        }
    }

    /**
     * Makes the laser follow the character's position
     * Updates position including jump offset
     * @returns {void}
     */
    followCharacter() {
        if (!this.character) return;
        this.positionInterval = setInterval(() => {
            if (this.character.otherDirection) {
                this.x = this.character.x + this.offsetX;
            } else {
                this.x = this.character.x + this.offsetX;
            }
            this.y = this.character.y + this.offsetY;
            if (this.character.jumpOffsetY !== undefined && this.character.jumpOffsetY < 0) {
                this.y += this.character.jumpOffsetY * 1.2 - 25;
            } else if (this.character.jumpOffsetY !== undefined) {
                this.y += this.character.jumpOffsetY * 1.2;
            }
            this.otherDirection = this.character.otherDirection;
        }, 1000 / 120);
    }

    /**
     * Initiates the shooting movement for the laser beam
     * Moves horizontally based on character direction
     * @returns {void}
     */
    shoot() {
        setInterval(() => {
            if (this.otherDirection) {
                this.x -= this.speedX;
            } else {
                this.x += this.speedX;
            }
        }, 1000 / 60);
    }
}
