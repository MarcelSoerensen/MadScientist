/**
 * Handles all sound effects for EnemyTwo (analog EnemyOneSounds)
 */
class EnemyTwoSounds {
	/**
	 * Plays the death sound for EnemyTwo
	 */
	deathSoundCreation(enemy) {
		try {
			const sound = SoundCacheManager.getAudio('sounds/enemy2-death.mp3');
			sound.volume = 0.7;
			sound.playbackRate = 2.0;
			sound.play();
			enemy.deathSoundAudio = sound;
		} catch (e) {}
	}

	/**
	 * Plays the proximity sound for EnemyTwo
	 */
	playProximitySound(enemy) {
		if (!enemy.world?.character) return;
		const dist = Math.abs(enemy.world.character.x - enemy.x);
		if (dist <= 350) {
			if (!this.proximitySoundPlaying) this.initProximitySound();
			if (dist > 250) this.fadeOutProximitySound(250, 350, dist);
		} else if (this.proximitySoundPlaying && this.proximitySoundAudio) {
			this.stopProximitySound();
		}
	}

	/**
	 * Initializes and fades in the proximity sound
	 */
	initProximitySound() {
		this.proximitySoundAudio = SoundCacheManager.getAudio('sounds/enemy2.mp3');
		Object.assign(this.proximitySoundAudio, { loop: true, volume: 0, playbackRate: 0.9 });
		this.proximitySoundAudio.play();
		this.proximitySoundPlaying = true;
		let fadeInterval = setInterval(() => {
			if (!this.proximitySoundAudio) return;
			this.proximitySoundAudio.volume = Math.min(0.5, this.proximitySoundAudio.volume + 0.01);
			if (this.proximitySoundAudio.volume >= 0.5) clearInterval(fadeInterval);
		}, 40);
	}

	/**
	 * Fades out the proximity sound
	 */
	fadeOutProximitySound(start, end, dist) {
		let targetVolume = 0.5 * (1 - (dist - start) / (end - start));
		targetVolume = Math.max(0, Math.min(0.5, targetVolume));
		let fadeOutInterval = setInterval(() => {
			if (!this.proximitySoundAudio) return;
			if (this.proximitySoundAudio.volume <= targetVolume + 0.01) {
				this.proximitySoundAudio.volume = targetVolume;
				clearInterval(fadeOutInterval);
			} else {
				this.proximitySoundAudio.volume -= 0.01;
			}
		}, 40);
	}

	/**
	 * Stops the proximity sound
	 */
	stopProximitySound() {
		Object.assign(this.proximitySoundAudio, { volume: 0, currentTime: 0 });
		this.proximitySoundAudio.pause();
		this.proximitySoundPlaying = false;
	}

	/**
	 * Immediately stops all EnemyTwo sounds (proximity, death, etc.)
	 */
	stopAllEnemyTwoSounds(enemy) {
		if (this.proximitySoundAudio) {
			try {
				this.proximitySoundAudio.pause();
				this.proximitySoundAudio.currentTime = 0;
			} catch (e) {}
			this.proximitySoundPlaying = false;
			this.proximitySoundAudio = null;
		}
		if (enemy && enemy.deathSoundAudio) {
			try {
				enemy.deathSoundAudio.pause();
				enemy.deathSoundAudio.currentTime = 0;
			} catch (e) {}
			enemy.deathSoundAudio = null;
		}
	}

	proximitySoundPlaying = false;
	proximitySoundAudio = null;
}
