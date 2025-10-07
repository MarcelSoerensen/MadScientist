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
		if (!enemy?.world?.character) return;
		const dist = Math.abs(enemy.world.character.x - enemy.x);
		if (dist > 350) return this.stopProximitySound();
		const isMuted = window.SoundCacheManager ? SoundCacheManager.muted : false;
		const audio = this.prepareProximityAudio(isMuted);
		this.applyProximityVolumeAndFade(audio, dist, isMuted);
	}

	/**
	 * Prepares the proximity audio for EnemyTwo
	 */
	prepareProximityAudio(isMuted) {
		let a = this.proximitySoundAudio;
		if (!a) {
			a = this.proximitySoundAudio = new Audio('sounds/enemy2.mp3');
			a.loop = true;
			a.playbackRate = 0.9;
			a.volume = isMuted ? 0 : 0.5;
			a.play();
		} else if (a.paused) {
			a.currentTime = 0;
			a.play();
		}
		return a;
	}

	/**
	 * Sets volume and optional fade-out based on distance
	 */
	applyProximityVolumeAndFade(audio, dist, isMuted) {
		audio.volume = isMuted ? 0 : 0.5;
		if (!isMuted && dist > 250) this.fadeOutProximitySound(250, 350, dist);
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
		this.stopProximitySound();
		if (enemy?.deathSoundAudio) {
			try {
				enemy.deathSoundAudio.pause();
				enemy.deathSoundAudio.currentTime = 0;
			} catch (e) {}
			enemy.deathSoundAudio = null;
		}
	}

	proximitySoundAudio = null;
}
