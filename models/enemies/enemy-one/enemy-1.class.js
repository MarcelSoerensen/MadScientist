/**
 * Represents the first type of enemy character
 */
class EnemyOne extends CollidableObject {
    lastHitTime = 0;
    laserHitCount = 0;
    isDeadAnimationPlaying = false;
    offset = {
        top: 140,
        left: 103,
        right: 115,
        bottom: 80
    };
    
    animations = new EnemyOneAnimations();
    isElectricHurt = false;
    electricHurtTimeout = null;

    /**
     * Creates a new EnemyOne instance
     */
    constructor(isFirstEnemy = false, levelStartX = -400, activateAt = 300) {
        super().loadImage('img/Enemy Characters/Enemy Character01/Walk/Walk_00.png');
        this.loadImages(this.animations.IMAGES_WALKING);
        this.initEnemyOnePosition(activateAt);
        this.loadImages(this.animations.IMAGES_GET_ELECTRIC);
        this.loadImages(this.animations.IMAGES_DEATH);
        this.visible = false;
        this._waitingForCharacter = true;
        this._activateAt = activateAt;
    }

    /**
     * Initializes position and speed for EnemyOne
     */
    initEnemyOnePosition(activateAt) {
        if (!window.enemySpawnPositions) {
            window.enemySpawnPositions = [];
        }
        const { minX, maxX } = this.getEnemyOneSpawnRange(activateAt);
        const x = this.calculateEnemyOnePosition(minX, maxX);
        window.enemySpawnPositions.push(x);
        this.x = x;
        this.y = 160 + Math.random() * 10;
        this.speed = 0.15 + Math.random() * 0.25;
    }

    /**
     * Calculates spawn range for EnemyOne
     */
    getEnemyOneSpawnRange(activateAt) {
        const canvasWidth = window?.gameCanvas?.width || 800;
        if (activateAt === 1800) {
            return {
                minX: activateAt + canvasWidth / 2,
                maxX: 3000
            };
        } else {
            return {
                minX: 800,
                maxX: 2000
            };
        }
    }

    /**
     * Calculates a valid X position for EnemyOne (no collision with other enemies)
     */
    calculateEnemyOnePosition(minX, maxX) {
        let x;
        let tries = 0;
        do {
            x = minX + Math.random() * (maxX - minX);
            x += (Math.random() - 0.5) * 120;
            x = Math.max(minX, Math.min(maxX, x));
            tries++;
        } while (
            window.enemySpawnPositions.some(pos => Math.abs(pos - x) < 80)
            && tries < 20
        );
        return x;
    }


    /**
     * Starts EnemyOne animation and movement
     */
    animateEnemyOne() {
        this.startEnemyOneAnimationIntervals();
    }

    /**
     * Startet das Animations-Interval und steuert die Animationen und Zustände von EnemyOne
     */
    startEnemyOneAnimationIntervals() {
        this.moveInterval = setInterval(() => {
            this.moveLeft();
        }, 1000 / 60);

        this.deathFrame = 0;
        this.deathDone = false;
        this.animInterval = setInterval(() => {
            if (this.laserHitCount >= 3 && !this.isElectricHurt) {
                this.handleEnemyOneDeathAnimation();
                return;
            }
            if (this.isElectricHurt) {
                this.playAnimation(this.animations.IMAGES_GET_ELECTRIC);
                return;
            }
            this.playAnimation(this.animations.IMAGES_WALKING);
        }, 50);
    }

    /**
     * Handhabt die Todesanimation von EnemyOne
     */
    handleEnemyOneDeathAnimation() {
        if (!this.deathDone) {
            this.img = this.imageCache[this.animations.IMAGES_DEATH[this.deathFrame]];
            this.deathFrame++;
            if (this.deathFrame >= this.animations.IMAGES_DEATH.length) {
                this.deathFrame = this.animations.IMAGES_DEATH.length - 1;
                this.deathDone = true;
            }
        } else {
            this.img = this.imageCache[this.animations.IMAGES_DEATH[this.animations.IMAGES_DEATH.length - 1]];
        }
    }
    
    /**
     * Handles the hurt animation and status logic (analog Endboss)
     */
    handleHurtAnimation(force = 1) {
        this.handleHurtSound(force);
        if (this.laserHitCount >= 3) return;
        if (this.isElectricHurt) return;
        this.handleHurtStatus(force);
        this.handleHurtTimeout(force);
    }

    /**
     * Plays the hurt sound effect for EnemyOne
     */
    handleHurtSound(force) {
        const now = Date.now();
        if (!this.lastHitSoundTime || now - this.lastHitSoundTime > 1000) {
            if (typeof window !== 'undefined') {
                if (!window.enemy1CollidedSound) {
                    window.enemy1CollidedSound = new Audio('sounds/enemy1-collided.mp3');
                    window.enemy1CollidedSound.volume = 1.0;
                }
                window.enemy1CollidedSound.currentTime = 0;
                window.enemy1CollidedSound.volume = 1.0;
                window.enemy1CollidedSound.play();
            }
            this.lastHitSoundTime = now;
        }
    }

    /**
     * Updates the hurt status and counters for EnemyOne
     */
    handleHurtStatus(force) {
        const now = Date.now();
        if (force === 1 && (now - this.lastHitTime < 500)) return;
        this.lastHitTime = now;
        this.laserHitCount += force;
        if (this.laserHitCount > 3) this.laserHitCount = 3;
        this.isElectricHurt = true;
    }

    /**
     * Manages the hurt timeout and triggers death if needed
     */
    handleHurtTimeout(force) {
        if (this.electricHurtTimeout) {
            clearTimeout(this.electricHurtTimeout);
        }
        const hurtDuration = (force === 5) ? 1000 : 700;
        this.electricHurtTimeout = setTimeout(() => {
            this.isElectricHurt = false;
            this.electricHurtTimeout = null;
            if (this.laserHitCount === 3) {
                this.handleDeathAnimation();
            }
        }, hurtDuration);
    }

    /**
     * Starts the death animation for the enemy
     */
    handleDeathAnimation() {
        this.handleDeathStatus();
        this.handleDeathSound();
        let deathFrame = 0;
        this.deathAnimInterval = setInterval(() => {
            if (deathFrame < this.animations.IMAGES_DEATH.length) {
                this.img = this.imageCache[this.animations.IMAGES_DEATH[deathFrame]];
                deathFrame++;
            } else {
                this.img = this.imageCache[this.animations.IMAGES_DEATH[this.animations.IMAGES_DEATH.length - 1]];
                clearInterval(this.deathAnimInterval);
            }
        }, 50);
        setTimeout(() => this.startBlinking(), 2500);
        setTimeout(() => this.removeEnemy(), 4000);
    }

    /**
     * Sets status and variables for EnemyOne death
     */
    handleDeathStatus() {
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
    }

    /**
     * Plays the death sound of EnemyOne
     */
    handleDeathSound() {
        if (typeof window !== 'undefined') {
            if (!window.enemy1DeathSound) {
                window.enemy1DeathSound = new Audio('sounds/enemy1-death.mp3');
                window.enemy1DeathSound.volume = 1.0;
            }
            window.enemy1DeathSound.currentTime = 0;
            window.enemy1DeathSound.volume = 1.0;
            window.enemy1DeathSound.play();
        }
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

