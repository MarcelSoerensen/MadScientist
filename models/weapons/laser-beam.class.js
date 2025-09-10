/**
 * Represents a laser beam projectile that can be shot by the character
 */
class LaserBeam extends CollidableObject {
    offset = {
        top: 5,
        left: 10,
        right: 10,
        bottom: 5
    };
    speedX = 15;
    damage = 25;
    animationInterval = null;
    positionInterval = null;
    character = null;
    offsetX = 190;
    offsetY = 205;
    /** 
     *  Array of laser beam animation image paths 
    */
    IMAGES_LASER_BEAM = [
        'img/Projectile/Laser/skeleton-animation_0.png',
        'img/Projectile/Laser/skeleton-animation_1.png',
        'img/Projectile/Laser/skeleton-animation_2.png',
        'img/Projectile/Laser/skeleton-animation_3.png',
        'img/Projectile/Laser/skeleton-animation_4.png',
    ];

    /**
     * Creates a new LaserBeam instance
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
    this.animateLaserBeam();
        this.followCharacter();
    }

    /**
     * Initiates the shooting movement for the laser beam
     */
    shoot() {
        try {
            const laserSound = new Audio('sounds/laser-shot.mp3');
            laserSound.volume = 0.5;
            laserSound.play();
        } catch (e) {}
        setInterval(() => {
            if (this.otherDirection) {
                this.x -= this.speedX;
            } else {
                this.x += this.speedX;
            }
        }, 1000 / 60);
    }

    /**
     * Makes the laser follow the character's position
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
     * Starts the laser beam animation
     */
    animateLaserBeam() {
        this.animationInterval = setInterval(() => {
            this.playAnimation(this.IMAGES_LASER_BEAM);
        }, 80);
    }

    /**
     * Stops the laser beam animation
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

    animateLaserBeam() {
    }

    /**
     * Draws the laser beam
     */
    draw(ctx) {
        if (this.visible === false) return;
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }
}
