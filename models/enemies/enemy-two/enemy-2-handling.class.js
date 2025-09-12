/**
 * Handles logic and animation for EnemyTwo (analogous to EnemyOneHandling)
 */
class EnemyTwoHandling {
    /**
     * Starts the animation and movement of EnemyTwo
     */
    animateEnemyTwo(enemy) {
        this.startEnemyTwoAnimationIntervals(enemy);
    }

    /**
     * Initializes and starts the main animation intervals for EnemyTwo
     */
    startEnemyTwoAnimationIntervals(enemy) {
        enemy.moveInterval = setInterval(() => {
            enemy.moveVertically();
        }, 1000 / 60);
        enemy.deathFrame = 0;
        enemy.deathDone = false;
        enemy.animInterval = setInterval(() => {
            if (enemy.laserHitCount >= 3 && !enemy.isElectricHurt) {
                this.handleDeathAnimationFrame(enemy);
                return;
            }
            if (enemy.isElectricHurt) {
                enemy.playAnimation(enemy.animations.IMAGES_GET_ELECTRIC);
                return;
            }
            enemy.playAnimation(enemy.animations.IMAGES_WALKING);
            enemy.playProximitySound();
        }, 50);
    }

    /**
     * Handles the hurt animation and status logic
     */
    handleHurtAnimation(enemy, force = 1) {
        if (enemy.laserHitCount >= 3) return;
        if (enemy.isElectricHurt) return;
        this.handleHurtStatus(enemy, force);
        this.handleHurtTimeout(enemy, force);
    }

    /**
     * Updates the hurt status and counters for EnemyTwo
     */
    handleHurtStatus(enemy, force) {
        const now = Date.now();
        if (force === 1 && (now - enemy.lastHitTime < 500)) return;
        enemy.lastHitTime = now;
        enemy.laserHitCount += force;
        if (enemy.laserHitCount > 3) enemy.laserHitCount = 3;
        enemy.isElectricHurt = true;
    }

    /**
     * Manages the hurt timeout and triggers death if needed
     */
    handleHurtTimeout(enemy, force) {
        if (enemy.electricHurtTimeout) {
            clearTimeout(enemy.electricHurtTimeout);
        }
        const hurtDuration = (force === 5) ? 1000 : 700;
        enemy.electricHurtTimeout = setTimeout(() => {
            enemy.isElectricHurt = false;
            enemy.electricHurtTimeout = null;
            if (enemy.laserHitCount === 3) {
                this.handleDeathAnimation(enemy);
            }
        }, hurtDuration);
    }

    /**
     * Starts the death animation for EnemyTwo
     */
    handleDeathAnimation(enemy) {
        this.handleDeathStatus(enemy);
        enemy.sounds.stopProximitySound();
        enemy.sounds.deathSoundCreation(enemy);
        let deathFrame = 0;
        enemy.deathAnimInterval = setInterval(() => {
            if (deathFrame < enemy.animations.IMAGES_DEATH.length) {
                enemy.img = enemy.imageCache[enemy.animations.IMAGES_DEATH[deathFrame]];
                deathFrame++;
            } else {
                enemy.img = enemy.imageCache[enemy.animations.IMAGES_DEATH[enemy.animations.IMAGES_DEATH.length - 1]];
                clearInterval(enemy.deathAnimInterval);
                enemy.removeEnemy();
            }
        }, 50);
    }

    /**
     * Handles the death animation frame (analogous zu EnemyOne)
     */
    handleDeathAnimationFrame(enemy) {
        if (!enemy.deathDone) {
            enemy.img = enemy.imageCache[enemy.animations.IMAGES_DEATH[enemy.deathFrame]];
            enemy.deathFrame++;
            if (enemy.deathFrame >= enemy.animations.IMAGES_DEATH.length) {
                enemy.deathFrame = enemy.animations.IMAGES_DEATH.length - 1;
                enemy.deathDone = true;
            }
        } else {
            enemy.img = enemy.imageCache[enemy.animations.IMAGES_DEATH[enemy.animations.IMAGES_DEATH.length - 1]];
        }
    }

    /**
     * Sets status and variables for EnemyTwo death
     */
    handleDeathStatus(enemy) {
        enemy.isDeadAnimationPlaying = true;
        enemy.currentImage = 0;
        enemy.collidable = false;
        if (enemy.moveInterval) {
            clearInterval(enemy.moveInterval);
            enemy.moveInterval = null;
        }
        if (enemy.animInterval) {
            clearInterval(enemy.animInterval);
            enemy.animInterval = null;
        }
    }

}
