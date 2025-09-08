/**
 * Contains all animation image arrays for the Endboss.
 */
class EndbossAnimations {
	/**
	 * Plays the idle animation for the Endboss.
	 */
	idleAnimation(endboss) {
		if (endboss.isStepSoundPlayingRight && endboss.stepSoundAudioRight) {
			try {
				endboss.stepSoundAudioRight.pause();
				endboss.stepSoundAudioRight.currentTime = 0.5;
			} catch (e) {}
			endboss.isStepSoundPlayingRight = false;
			endboss.stepSoundAudioRight = null;
		}
		endboss.playAnimation(this.IMAGES_IDLE);
	}
	
	/**
	 * Idle animation image sequence
	 */
	IMAGES_IDLE = [
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

	/**
	 * Executes the walking-left animation for the Endboss.
	 */
	walkingLeftMovement(endboss, leftTargetX) {
		endboss.playAnimation(this.IMAGES_WALKING);
		if (endboss.x > leftTargetX) {
			endboss.moveLeft(Math.min(4, endboss.x - leftTargetX));
		}
	}

	/**
	 * Executes the walking-right animation for the Endboss.
	 */
	walkingRightMovement(endboss, startX) {
		endboss.playAnimation(this.IMAGES_WALKING);
		if (endboss.x < startX) {
			endboss.moveRight(Math.min(4, startX - endboss.x));
		}
	}

	/**
	 * Walking animation image sequence
	 */
	IMAGES_WALKING = [
		'img/Enemy Characters/Enemy Character07/Walk/Walk_00.png',
		'img/Enemy Characters/Enemy Character07/Walk/Walk_01.png',
		'img/Enemy Characters/Enemy Character07/Walk/Walk_02.png',
		'img/Enemy Characters/Enemy Character07/Walk/Walk_03.png',
		'img/Enemy Characters/Enemy Character07/Walk/Walk_04.png',
		'img/Enemy Characters/Enemy Character07/Walk/Walk_05.png',
		'img/Enemy Characters/Enemy Character07/Walk/Walk_06.png',
		'img/Enemy Characters/Enemy Character07/Walk/Walk_07.png',
		'img/Enemy Characters/Enemy Character07/Walk/Walk_08.png',
		'img/Enemy Characters/Enemy Character07/Walk/Walk_09.png',
		'img/Enemy Characters/Enemy Character07/Walk/Walk_10.png',
		'img/Enemy Characters/Enemy Character07/Walk/Walk_11.png',
		'img/Enemy Characters/Enemy Character07/Walk/Walk_12.png',
		'img/Enemy Characters/Enemy Character07/Walk/Walk_13.png',
	];

	/**
	 * Plays the hit animation for the Endboss.
	 */
	hitAnimation(endboss, animTimer) {
		endboss.img = endboss.imageCache[this.IMAGES_HIT[endboss.hitFrame % this.IMAGES_HIT.length]];
		endboss.hitFrame++;
		if (endboss.hitFrame === 1) {
			try {
				const hitStickSound = new Audio('sounds/endboss-hit.mp3');
				hitStickSound.volume = 0.25;
				hitStickSound.playbackRate = 1.35;
				hitStickSound.play();
			} catch (e) {}
		}
	}

	/**
	 * Hit animation image sequence
	 */
	IMAGES_HIT = [
		'img/Enemy Characters/Enemy Character07/Hit/Hit_00.png',
		'img/Enemy Characters/Enemy Character07/Hit/Hit_01.png',
		'img/Enemy Characters/Enemy Character07/Hit/Hit_02.png',
		'img/Enemy Characters/Enemy Character07/Hit/Hit_03.png',
		'img/Enemy Characters/Enemy Character07/Hit/Hit_04.png',
		'img/Enemy Characters/Enemy Character07/Hit/Hit_05.png',
		'img/Enemy Characters/Enemy Character07/Hit/Hit_06.png',
		'img/Enemy Characters/Enemy Character07/Hit/Hit_07.png',
		'img/Enemy Characters/Enemy Character07/Hit/Hit_08.png',
		'img/Enemy Characters/Enemy Character07/Hit/Hit_09.png',
		'img/Enemy Characters/Enemy Character07/Hit/Hit_10.png',
		'img/Enemy Characters/Enemy Character07/Hit/Hit_11.png',
		'img/Enemy Characters/Enemy Character07/Hit/Hit_12.png',
		'img/Enemy Characters/Enemy Character07/Hit/Hit_13.png',
	];

	/**
	 * Plays the electric hurt animation for the Endboss.
	 */
	electricHurtAnimation(endboss) {
		endboss.playAnimation(this.IMAGES_GET_ELECTRIC);
	}

	/**
	 * Electric hurt animation image sequence
	 */
	IMAGES_GET_ELECTRIC = [
		'img/Enemy Characters/Enemy Character07/Get Electric/Get Electric_0.png',
		'img/Enemy Characters/Enemy Character07/Get Electric/Get Electric_1.png',
		'img/Enemy Characters/Enemy Character07/Get Electric/Get Electric_2.png',
	];

	/**
	 * Plays the death animation for the Endboss.
	 */
	deathAnimation(endboss, deathFrame, deathDone) {
		if (!deathDone) {
			endboss.img = endboss.imageCache[this.IMAGES_DEATH[deathFrame]];
			deathFrame++;
			if (deathFrame >= this.IMAGES_DEATH.length) {
				deathFrame = this.IMAGES_DEATH.length - 1;
				deathDone = true;
			}
		} else {
			endboss.img = endboss.imageCache[this.IMAGES_DEATH[this.IMAGES_DEATH.length - 1]];
		}
	}

	/**
	 * Death animation image sequence
	 */
	IMAGES_DEATH = [
		'img/Enemy Characters/Enemy Character07/Death/Death_00.png',
		'img/Enemy Characters/Enemy Character07/Death/Death_01.png',
		'img/Enemy Characters/Enemy Character07/Death/Death_02.png',
		'img/Enemy Characters/Enemy Character07/Death/Death_03.png',
		'img/Enemy Characters/Enemy Character07/Death/Death_04.png',
		'img/Enemy Characters/Enemy Character07/Death/Death_05.png',
		'img/Enemy Characters/Enemy Character07/Death/Death_06.png',    
		'img/Enemy Characters/Enemy Character07/Death/Death_07.png',
		'img/Enemy Characters/Enemy Character07/Death/Death_08.png',
		'img/Enemy Characters/Enemy Character07/Death/Death_09.png',
		'img/Enemy Characters/Enemy Character07/Death/Death_10.png',
		'img/Enemy Characters/Enemy Character07/Death/Death_11.png',
		'img/Enemy Characters/Enemy Character07/Death/Death_12.png',
		'img/Enemy Characters/Enemy Character07/Death/Death_13.png',
		'img/Enemy Characters/Enemy Character07/Death/Death_14.png',
		'img/Enemy Characters/Enemy Character07/Death/Death_15.png',
		'img/Enemy Characters/Enemy Character07/Death/Death_16.png',        
		'img/Enemy Characters/Enemy Character07/Death/Death_17.png',
		'img/Enemy Characters/Enemy Character07/Death/Death_18.png',
		'img/Enemy Characters/Enemy Character07/Death/Death_19.png',    
		'img/Enemy Characters/Enemy Character07/Death/Death_20.png',
		'img/Enemy Characters/Enemy Character07/Death/Death_21.png',
		'img/Enemy Characters/Enemy Character07/Death/Death_22.png',
		'img/Enemy Characters/Enemy Character07/Death/Death_23.png',
	];
}
