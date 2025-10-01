/**
* PauseButtonManager Class
 */
class PauseButtonManager {
    static isPaused = false;
    static prevAudioWasOn = null;

    /**
     * Initialize the pause button and its event listener
     */
    static init() {
        const pauseBtn = document.getElementById('pause-btn');
        if (pauseBtn) {
            pauseBtn.addEventListener('click', PauseButtonManager.togglePause);
        }
    }

    /**
     * Toggle the paused state of the game
     */
    static togglePause() {
        PauseButtonManager.isPaused = !PauseButtonManager.isPaused;
        if (PauseButtonManager.isPaused) {
            PauseButtonManager.pauseGame();
        } else {
            PauseButtonManager.resumeGame();
        }
    }

    /**
     * Pause the game and related activities
     */
    static pauseGame() {
        AudioButtonManager.configs.forEach(cfg => {
            const btn = document.getElementById(cfg.btnId);
            if (btn) btn.setAttribute('disabled', 'disabled');
        });
        window.isPaused = true;
        PauseButtonManager.prevAudioWasOn = !AudioButtonManager.muted;
        if (PauseButtonManager.prevAudioWasOn) {
            AudioButtonManager.setMutedAll(true);
        }
        if (window.character && typeof window.character.setIdle === 'function') {
            window.character.setIdle();
        }
    }

    /**
     * Resume the game and related activities
     */
    static resumeGame() {
        AudioButtonManager.configs.forEach(cfg => {
            const btn = document.getElementById(cfg.btnId);
            if (btn) btn.removeAttribute('disabled');
        });
        window.isPaused = false;
        if (PauseButtonManager.prevAudioWasOn) {
            AudioButtonManager.setMutedAll(false);
        }
    }
}

document.addEventListener('DOMContentLoaded', PauseButtonManager.init);
window.PauseButtonManager = PauseButtonManager;
