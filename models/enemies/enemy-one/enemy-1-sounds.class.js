/**
 * Handles all sound effects for EnemyOne (analog EndbossSounds)
 */
class EnemyOneSounds {
    /**
     * Plays the collision sound for EnemyOne
     */
    collisionSoundCreation(enemy, force) {
        const now = Date.now();
        if (!enemy.lastHitSoundTime || now - enemy.lastHitSoundTime > 1000) {
            try {
                const sound = SoundCacheManager.getAudio('sounds/enemy1-collided.mp3');
                sound.currentTime = 0;
                sound.volume = 1.0;
                sound.play();
            } catch (e) {}
            enemy.lastHitSoundTime = now;
        }
    }

    /**
     * Plays the death sound for EnemyOne
     */
    deathSoundCreation(enemy) {
        try {
            const sound = SoundCacheManager.getAudio('sounds/enemy1-death.mp3');
            sound.currentTime = 0;
            sound.volume = 1.0;
            sound.play();
        } catch (e) {}
    }
}