/**
* PauseButtonManager Class
 */
class PauseButtonManager {
    static isPaused = false;
    static prevAudioWasOn = null;
    static prevMobileControlsVisible = null;

    /**
     * Initialize the pause button and its event listener
     */
    static init() {
        const pauseBtn = document.getElementById('pause-btn');
        if (pauseBtn) {
            pauseBtn.addEventListener('click', PauseButtonManager.togglePause);
            PauseButtonManager.updatePauseButtonIcon();
        }
    }

    /**
     * Toggle the paused state of the game
     */
    static togglePause() {
        PauseButtonManager.isPaused = !PauseButtonManager.isPaused;
        if (PauseButtonManager.isPaused) {
            PauseButtonManager.pauseGame();
            PauseButtonManager.updatePauseButtonIcon();
        } else {
            PauseButtonManager.resumeGame();
            PauseButtonManager.updatePauseButtonIcon();
        }
    }
   
    /**
     * Update the pause button icon based on the current paused state
     */
    static updatePauseButtonIcon() {
        const pauseBtn = document.getElementById('pause-btn');
        if (!pauseBtn) return;
        const svg = pauseBtn.querySelector('svg');
        if (!svg) return;
        const pauseIcon = svg.querySelector('#pause-icon');
        const playIcon = svg.querySelector('#play-icon');
        if (!pauseIcon || !playIcon) return;
        if (PauseButtonManager.isPaused) {
            pauseIcon.style.display = 'none';
            playIcon.style.display = '';
        } else {
            pauseIcon.style.display = '';
            playIcon.style.display = 'none';
        }
    }

    /**
     * Pause the game and related activities
     */
    static pauseGame() {
        ['pauseEndboss', 'pauseEnemyTwo', 'pauseEnemyOne'].forEach(m => PauseButtonManager[m]());
        AudioButtonManager.configs.forEach(cfg => document.getElementById(cfg.btnId)?.setAttribute('disabled', 'disabled'));
        document.getElementById('back-btn')?.setAttribute('disabled', 'disabled');
        window.isPaused = true;
        PauseButtonManager.prevAudioWasOn = !AudioButtonManager.muted;
        if (PauseButtonManager.prevAudioWasOn) AudioButtonManager.setMutedAll(true);
        window.character?.setIdle?.();
        try {
            const mobile = document.querySelector('.mobile-controls-container');
            const weapon = document.querySelector('.weapon-controls-container');
            const anyVisible = mobile?.classList.contains('controls-visible') || weapon?.classList.contains('controls-visible');
            PauseButtonManager.prevMobileControlsVisible = anyVisible;
            if (anyVisible) window.mobileOrientationManager?.setControlsVisibility(false);
        } catch {}
    }

    /**
     * Pause the enemy one animations
     */
    static pauseEnemyOne() {
        if (window.world?.level?.enemies) {
            window.world.level.enemies.forEach(enemy => {
                if (enemy?.constructor?.name === 'EnemyOne' && typeof enemy.clearIntervals === 'function') {
                    enemy.clearIntervals();
                }
            });
        }
    }

    /**
     * Pause the enemy two animations
     */
    static pauseEnemyTwo() {
        if (window.world?.level?.enemies) {
            window.world.level.enemies.forEach(enemy => {
                if (enemy?.constructor?.name === 'EnemyTwo' && typeof enemy.clearIntervals === 'function') {
                    enemy.clearIntervals();
                    if (enemy.sounds?.stopProximitySound) {
                        enemy.sounds.stopProximitySound();
                    }
                }
            });
        }
    }

    /**
     * Pause the endboss animations
     */
    static pauseEndboss() {
        if (window.world?.level?.enemies) {
            window.world.level.enemies.forEach(enemy => {
                if (enemy?.constructor?.name === 'Endboss') {
                    if (enemy.handler?.stopEndbossIntervals) {
                        enemy.handler.stopEndbossIntervals(enemy);
                    } else if (typeof enemy.clearIntervals === 'function') {
                        enemy.clearIntervals();
                    }
                }
            });
        }
    }

    /**
     * Resume the game and related activities
     */
    static resumeGame() {
        ['resumeEndboss', 'resumeEnemyTwo', 'resumeEnemyOne'].forEach(m => PauseButtonManager[m]());
        AudioButtonManager.configs.forEach(cfg => document.getElementById(cfg.btnId)?.removeAttribute('disabled'));
        document.getElementById('back-btn')?.removeAttribute('disabled');
        window.isPaused = false;
        if (PauseButtonManager.prevAudioWasOn) AudioButtonManager.setMutedAll(false);
        if (PauseButtonManager.prevMobileControlsVisible && window.mobileOrientationManager) {
            try { window.mobileOrientationManager.updateOrientation(); } catch {}
        }
    }

    /**
     * Resume the enemy one animations
     */
    static resumeEnemyOne() {
        if (window.world?.level?.enemies) {
            window.world.level.enemies.forEach(enemy => {
                if (enemy?.constructor?.name === 'EnemyOne' && !enemy.deathDone) {
                    if (!enemy.animationStarted && enemy.handler?.startEnemyOneAnimationIntervals) {
                        enemy.handler.startEnemyOneAnimationIntervals(enemy);
                    }
                }
            });
        }
    }

    /**
     * Resume the enemy two animations
     */
    static resumeEnemyTwo() {
        if (window.world?.level?.enemies) {
            window.world.level.enemies.forEach(enemy => {
                if (enemy?.constructor?.name === 'EnemyTwo' && !enemy.deathDone) {
                    if (!enemy.animationStarted && enemy.handler?.startEnemyTwoAnimationIntervals) {
                        enemy.handler.startEnemyTwoAnimationIntervals(enemy);
                    }
                }
            });
        }
    }

    /**
     * Resume the endboss animations
     */
    static resumeEndboss() {
        if (window.world?.level?.enemies) {
            window.world.level.enemies.forEach(enemy => {
                if (enemy?.constructor?.name === 'Endboss' && !enemy.deathDone) {
                    if (!enemy.animationStarted) {
                        if (typeof enemy.startProximityCheck === 'function') enemy.startProximityCheck();
                    } else if (enemy.handler?.resumeEndbossAnimationIntervals) {
                        enemy.handler.resumeEndbossAnimationIntervals(enemy);
                    }
                }
            });
        }
    }
}

document.addEventListener('DOMContentLoaded', PauseButtonManager.init);
window.PauseButtonManager = PauseButtonManager;
