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
            if (typeof window !== 'undefined') {
                if (!window.enemy1CollidedSound) {
                    window.enemy1CollidedSound = new Audio('sounds/enemy1-collided.mp3');
                    window.enemy1CollidedSound.volume = 1.0;
                }
                window.enemy1CollidedSound.currentTime = 0;
                window.enemy1CollidedSound.volume = 1.0;
                window.enemy1CollidedSound.play();
            }
            enemy.lastHitSoundTime = now;
        }
    }

    /**
     * Plays the death sound for EnemyOne
     */
    deathSoundCreation(enemy) {
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
}