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
		const isMuted = window.SoundCacheManager ? SoundCacheManager.muted : false;
		if (dist <= 350) {
			if (!this.proximitySoundAudio) {
				this.proximitySoundAudio = new Audio('sounds/enemy2.mp3');
				this.proximitySoundAudio.loop = true;
				this.proximitySoundAudio.playbackRate = 0.9;
				this.proximitySoundAudio.volume = isMuted ? 0 : 0.5;
				this.proximitySoundAudio.play();
			} else if (this.proximitySoundAudio.paused) {
				this.proximitySoundAudio.currentTime = 0;
				this.proximitySoundAudio.volume = isMuted ? 0 : 0.5;
				this.proximitySoundAudio.play();
			} else {
				this.proximitySoundAudio.volume = isMuted ? 0 : 0.5;
			}
			if (!isMuted && dist > 250) this.fadeOutProximitySound(250, 350, dist);
		} else if (this.proximitySoundAudio) {
			this.stopProximitySound();
		}
	}

	/**
	 * Fades out the proximity sound
	 */
	fadeOutProximitySound(start, end, dist) {
		if (!this.proximitySoundAudio) return;
		let targetVolume = 0.5 * (1 - (dist - start) / (end - start));
		targetVolume = Math.max(0, Math.min(0.5, targetVolume));
		this.proximitySoundAudio.volume = targetVolume;
	}

	/**
	 * Stops the proximity sound
	 */
	stopProximitySound() {
		if (this.proximitySoundAudio) {
			this.proximitySoundAudio.pause();
			this.proximitySoundAudio.currentTime = 0;
			this.proximitySoundAudio = null;
		}
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

	proximitySoundAudio = null;
}
