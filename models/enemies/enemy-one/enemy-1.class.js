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
    handler = new EnemyOneHandling();
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
    * Creates and plays the collision sound for EnemyOne
    */
    collisionSoundCreation(force) {
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
    * Creates and plays the death sound for EnemyOne
    */
    deathSoundCreation() {
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

    /**
     * Starts blinking animation (toggles visibility).
     */
    startBlinking() {
        this.blinkInterval = setInterval(() => {
            this.visible = !this.visible;
        }, 200);
    }

    /**
     * Removes the enemy and stops blinking.
     */
    removeEnemy() {
        this.visible = false;
        if (this.blinkInterval) {
            clearInterval(this.blinkInterval);
            this.blinkInterval = null;
        }
    }
}

