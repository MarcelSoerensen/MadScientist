/**
 * Handles logic and animation for EnemyOne (analog EndbossHandling)
 */
class EnemyOneHandling {
	/**
	 * Starts the animation and movement of EnemyOne (analogous to animateEndboss)
	 */
	animateEnemyOne(enemy) {
		this.startEnemyOneAnimationIntervals(enemy);
	}

	/**
	 * Initializes and starts the main animation interval for EnemyOne (analogous to Endboss)
	 */
	startEnemyOneAnimationIntervals(enemy) {
		enemy.moveInterval = setInterval(() => {
			enemy.moveLeft();
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
		}, 50);
	}

    /**
	 * Handles the hurt animation and status logic
	 */
	handleHurtAnimation(enemy, force = 1) {
	enemy.sounds?.collisionSoundCreation?.(enemy, force);
		if (enemy.laserHitCount >= 3) return;
		if (enemy.isElectricHurt) return;
		this.handleHurtStatus(enemy, force);
		this.handleHurtTimeout(enemy, force);
	}

	/**
	 * Updates the hurt status and counters for EnemyOne
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
	 * Starts the death animation for the enemy
	 */
	handleDeathAnimation(enemy) {
		this.handleDeathStatus(enemy);
	enemy.sounds?.deathSoundCreation?.(enemy);
		let deathFrame = 0;
		enemy.deathAnimInterval = setInterval(() => {
			if (deathFrame < enemy.animations.IMAGES_DEATH.length) {
				enemy.img = enemy.imageCache[enemy.animations.IMAGES_DEATH[deathFrame]];
				deathFrame++;
			} else {
				enemy.img = enemy.imageCache[enemy.animations.IMAGES_DEATH[enemy.animations.IMAGES_DEATH.length - 1]];
				clearInterval(enemy.deathAnimInterval);
			}
		}, 50);
		setTimeout(() => enemy.startBlinking(), 2500);
		setTimeout(() => enemy.removeEnemy(), 4000);
	}

	/**
	 * Sets status and variables for EnemyOne death
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

    /**
	 * Handles the death animation frame (analogous to Endboss)
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
}
