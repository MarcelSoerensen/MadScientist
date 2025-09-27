/**
 * Handles cleanup operations for the World class.
 */
class WorldCleanup {
    /**
     * Creates a new WorldCleanup instance.
     */
    constructor(world) {
        this.world = world;
    }

    /**
     * Performs complete cleanup of the world by clearing all intervals and references.
     */
    cleanup() {
        this.cleanupIntervals();
        this.cleanupAnimations();
        this.cleanupCharacter();
        this.cleanupEnemies();
        this.cleanupManagers();
        this.cleanupCanvas();
        this.stopAllCollectibleSounds();
        if (this.world.throwableObjects) this.world.throwableObjects = [];
        if (this.world.laserBeams) this.world.laserBeams = [];
        if (this.world.enemies) this.world.enemies = [];
        if (this.world.endboss) this.world.endboss = null;
    }

    /**
     * Stoppt alle laufenden Sammelgeräusche (Bomben, Energie-Bälle, Herzen).
     */
    stopAllCollectibleSounds() {
        if (typeof window !== 'undefined') {
            if (window.CollectibleBomb && typeof window.CollectibleBomb.stopAllCollectingSounds === 'function') {
                window.CollectibleBomb.stopAllCollectingSounds();
            }
            if (window.EnergyBall && typeof window.EnergyBall.stopAllCollectingSounds === 'function') {
                window.EnergyBall.stopAllCollectingSounds();
            }
            if (window.CollectibleHeart && typeof window.CollectibleHeart.stopAllCollectingSounds === 'function') {
                window.CollectibleHeart.stopAllCollectingSounds();
            }
        }
    }

    /**
     * Cleans up all main game intervals.
     */
    cleanupIntervals() {
        this.world.gameIntervals.forEach(interval => {
            clearInterval(interval);
        });
        this.world.gameIntervals = [];
    }

    /**
     * Cleans up animation frames and drawing loops.
     */
    cleanupAnimations() {
        if (this.world.worldDraw && this.world.worldDraw.animationFrameId) {
            cancelAnimationFrame(this.world.worldDraw.animationFrameId);
        }
    }

    /**
     * Cleans up character-related intervals.
     */
    cleanupCharacter() {
        if (this.world.character && this.world.character.handler && typeof this.world.character.handler.clearAllIntervals === 'function') {
            this.world.character.handler.clearAllIntervals();
        }
        if (this.world.character && typeof this.world.character.removeCharacter === 'function') {
            this.world.character.removeCharacter();
        }
    }

    /**
     * Cleans up all enemy intervals and references.
     */
    cleanupEnemies() {
        this.cleanupEnemyOne();
        this.cleanupEnemyTwo();
        this.cleanupEndboss();
    }

    /**
     * Cleans up Enemy One intervals and references.
     */
    cleanupEnemyOne() {
        this.world.enemies?.forEach(enemy => {
            if (enemy.constructor.name === 'EnemyOne') {
                enemy.clearIntervals?.();
                ['moveInterval', 'animInterval', 'deathAnimInterval', 'blinkInterval'].forEach(interval => {
                    if (enemy[interval]) {
                        clearInterval(enemy[interval]);
                        enemy[interval] = null;
                    }
                });
                this.cleanupEnemySounds(enemy);
            }
        });
    }

    /**
     * Cleans up Enemy Two intervals and references.
     */
    cleanupEnemyTwo() {
        this.world.enemies?.forEach(enemy => {
            if (enemy.constructor.name === 'EnemyTwo') {
                enemy.clearIntervals?.();
                ['moveInterval', 'animInterval', 'deathAnimInterval', 'checkProximityInterval'].forEach(interval => {
                    if (enemy[interval]) {
                        clearInterval(enemy[interval]);
                        enemy[interval] = null;
                    }
                });
                this.cleanupEnemySounds(enemy);
            }
        });
    }

    /**
     * Cleans up sound intervals for an enemy.
     */
    cleanupEnemySounds(enemy) {
        if (enemy.sounds) {
            if (enemy.sounds.fadeInterval) {
                clearInterval(enemy.sounds.fadeInterval);
                enemy.sounds.fadeInterval = null;
            }
            if (enemy.sounds.fadeOutInterval) {
                clearInterval(enemy.sounds.fadeOutInterval);
                enemy.sounds.fadeOutInterval = null;
            }
        }
    }

    /**
     * Cleans up endboss-specific intervals and references.
     */
    cleanupEndboss() {
        if (this.world.endboss) {
            if (this.world.endboss.checkProximityInterval) {
                clearInterval(this.world.endboss.checkProximityInterval);
                this.world.endboss.checkProximityInterval = null;
            }
            if (this.world.endboss.blinkInterval) {
                clearInterval(this.world.endboss.blinkInterval);
                this.world.endboss.blinkInterval = null;
            }
            
            this.cleanupEnemySounds(this.world.endboss);
        }
    }

    /**
     * Cleans up manager references and their intervals.
     */
    cleanupManagers() {
        if (this.world.energyBallManager) this.world.energyBallManager = null;
        if (this.world.bombManager) this.world.bombManager = null;
        if (this.world.heartsManager) this.world.heartsManager = null;
        
        if (this.world.gameAlerts && this.world.gameAlerts.alertAnim) {
            clearInterval(this.world.gameAlerts.alertAnim);
            this.world.gameAlerts.alertAnim = null;
        }
        if (this.world.gameAlerts) this.world.gameAlerts = null;
    }

    /**
     * Cleans up canvas content.
     */
    cleanupCanvas() {
        if (this.world.ctx) {
            this.world.ctx.clearRect(0, 0, this.world.canvas.width, this.world.canvas.height);
        }
    }

    /**
     * Stops all Endboss sounds and removes the Endboss from the game.
     */
    stopAndRemoveEndboss(endboss) {
        if (endboss && endboss.sounds && typeof endboss.sounds.stopAllEndbossSounds === 'function') {
            endboss.sounds.stopAllEndbossSounds(endboss);
        }
        if (typeof endboss.removeEnemy === 'function') {
            endboss.removeEnemy();
        }
    }

    /**
     * Stops all EnemyTwo sounds and removes EnemyTwo from the game.
     */
    stopAndRemoveEnemyTwo(enemy) {
        if (enemy.sounds && typeof enemy.sounds.stopAllEnemyTwoSounds === 'function') {
            enemy.sounds.stopAllEnemyTwoSounds(enemy);
        }
        if (typeof enemy.removeEnemy === 'function') {
            enemy.removeEnemy();
        }
    }
}