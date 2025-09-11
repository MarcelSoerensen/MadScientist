/**
Vertical-moving enemy using EnemyOne's animation, placed in the center of the level.
 */
class EnemyTwo extends CollidableObject {
    /**
     * EnemyTwo properties
     */
    lastHitTime = 0;
    laserHitCount = 0;
    isDeadAnimationPlaying = false;
    offset = {
        top: 140,
        left: 103,
        right: 115,
        bottom: 80
    };
    animations = new EnemyTwoAnimations();
    handler = new EnemyTwoHandling();
    sounds = new EnemyTwoSounds();

    /**
     * Creates a new EnemyTwo instance
     */
    constructor(levelHeight = 480) {
        super().loadImage('img/Enemy Characters/Enemy Character01/Walk/Walk_00.png');
        this.loadImages(this.animations.IMAGES_WALKING);
        this.x = 1800;
        this.y = Math.random() * 100 - 100;
        this.speed = 1.99 + Math.random() * 1.0;
        this.verticalDirection = Math.random() < 0.5 ? 1 : -1;
        this.loadImages(this.animations.IMAGES_GET_ELECTRIC);
        this.loadImages(this.animations.IMAGES_DEATH);
        this.visible = true;
        this.handler.animateEnemyTwo(this);
        if (typeof window !== 'undefined' && window.world) {
            this.world = window.world;
        }
    }

    /**
     * Proximity sound logic
     */
    playProximitySound() {
        this.sounds.playProximitySound(this);
    }

    /**
     * Movement and status logic
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
                this.handler.handleDeathAnimation(this);
            }
        }, 700);
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
