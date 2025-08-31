/**
 * @class EnemyTwo
 * @extends MovableObject
 * @classdesc Vertical-moving enemy using EnemyOne's animation, placed in the center of the level.
 */
class EnemyTwo extends MovableObject {
    IMAGES_WALKING = [
        'img/Enemy Characters/Enemy Character10/Moving and Idle/Moving and Idle_0.png',
        'img/Enemy Characters/Enemy Character10/Moving and Idle/Moving and Idle_1.png',
        'img/Enemy Characters/Enemy Character10/Moving and Idle/Moving and Idle_2.png',
        'img/Enemy Characters/Enemy Character10/Moving and Idle/Moving and Idle_3.png',
        'img/Enemy Characters/Enemy Character10/Moving and Idle/Moving and Idle_4.png',
        'img/Enemy Characters/Enemy Character10/Moving and Idle/Moving and Idle_5.png',
        'img/Enemy Characters/Enemy Character10/Moving and Idle/Moving and Idle_6.png'
    ];

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
     * Creates a new EnemyTwo instance
     * Enemy moves vertically in the center of the level
     */
    constructor(levelHeight = 480) {
        super().loadImage('img/Enemy Characters/Enemy Character01/Walk/Walk_00.png');
        this.loadImages(this.IMAGES_WALKING);
    this.x = 1600;
    this.y = Math.random() * 100 - 100;
    this.speed = 2.0 + Math.random() * 1.0;
    this.verticalDirection = Math.random() < 0.5 ? 1 : -1;
        this.loadImages(this.IMAGES_GET_ELECTRIC);
        this.loadImages(this.IMAGES_DEATH);
        this.visible = true;
        this.animate();
    }

    /**
     * Starts enemy animation and vertical movement
     */
    animate() {
        this.moveInterval = setInterval(() => {
            this.moveVertically();
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
     * Moves the enemy vertically, bouncing at top/bottom bounds
     */
    moveVertically() {
        this.y += this.speed * this.verticalDirection;
        
        if (this.y <= -80) {
            this.y = -80;
            this.verticalDirection = 1;
        } else if (this.y >= 150) {
            this.y = 150;
            this.verticalDirection = -1;
        }
    }

    /**
     * Registers an electric laser hit
     * @param {number} [force=1] - Number of hits
     */
    triggerElectricHurt(force = 1) {
        const now = Date.now();
        if (this.laserHitCount >= 3) return;
        if (force === 1 && (now - this.lastHitTime < 500)) return;
        this.lastHitTime = now;
        this.laserHitCount += force;
        if (this.laserHitCount > 3) this.laserHitCount = 3;
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

    /**
     * Starts blinking effect after death
     */
    startBlinking() {
        this.blinkInterval = setInterval(() => {
            this.visible = !this.visible;
        }, 200);
    }

    /**
     * Removes the enemy from the game
     */
    removeEnemy() {
        this.visible = false;
        if (this.blinkInterval) {
            clearInterval(this.blinkInterval);
            this.blinkInterval = null;
        }
    }
}
