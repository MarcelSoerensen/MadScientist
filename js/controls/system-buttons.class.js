/**
 * Manages the visibility and behavior of system control buttons (Pause, Back, Audio) depending on the current game screen.
 */
class SystemButtonManager {
    /**
     * Returns all currently visible overlay screens (not hidden by 'd-none').
     */
    static getOverlayScreens() {
        return [
            document.getElementById('start_screen'),
            document.getElementById('game_over_screen'),
            document.getElementById('win_screen'),
            document.getElementById('story_screen'),
            document.getElementById('control_screen'),
            document.getElementById('legal_notice_screen'),
            document.getElementById('credits_screen'),
            document.getElementById('orientation-overlay')
        ].filter(el => el && !el.classList.contains('d-none'));
    }

    /**
     * Updates the visibility of the system controls container based on canvas and overlay screen visibility.
     */
    static updateSystemButtonsVisibility() {
        const canvas = document.getElementById('canvas');
        const controls = document.querySelector('.system-controls-container');
        if (!canvas || !controls) return;
        const canvasVisible = canvas && !canvas.classList.contains('d-none');
        const anyScreenVisible = SystemButtonManager.getOverlayScreens().length > 0;
        controls.classList.toggle('d-none', !(canvasVisible && !anyScreenVisible));
    }

    /**
     * Sets up MutationObservers to automatically update system button state when relevant screens change.
     */
    static setupSystemButtonManager() {
        SystemButtonManager.updateSystemButtonsVisibility();
        const canvas = document.getElementById('canvas');
        const screens = [
            document.getElementById('start_screen'),
            document.getElementById('game_over_screen'),
            document.getElementById('win_screen'),
            document.getElementById('story_screen'),
            document.getElementById('control_screen')
        ];
        const observer = new MutationObserver(SystemButtonManager.updateSystemButtonsVisibility);
        observer.observe(canvas, { attributes: true, attributeFilter: ['class'] });
        screens.forEach(screen => {
            if (screen) observer.observe(screen, { attributes: true, attributeFilter: ['class'] });
        });
    }

    /**
     * Hides the system controls container.
     */
    static hideSystemButtons() {
        const controls = document.querySelector('.system-controls-container');
        if (controls) controls.classList.add('d-none');
    }

    /**
     * Initializes the Back button event handler.
     */
    static initSystemButtons() {
        const backBtn = document.getElementById('back-btn');
        if (backBtn) {
            backBtn.onclick = () => {
                SystemButtonManager.handleBackToStart();
                setBodyTitleVisible(false);
            };
        }
    }

    /**
     * Shows the system controls container.
     */
    static showSystemButtons() {
        const controls = document.querySelector('.system-controls-container');
        if (controls) controls.classList.remove('d-none');
    }


    /**
     * Cleans up all game state, sounds, and animations (used before returning to start screen).
     */
    static cleanupGameState() {
        const gameWorld = window.world;
        if (gameWorld) {
            gameWorld.gameOver = true;
            gameWorld.cleanup?.cleanupIntervals?.();
            (gameWorld.level?.enemies || []).forEach(enemy => {
                if (enemy instanceof Endboss) gameWorld.cleanup?.stopAndRemoveEndboss?.(enemy);
                else if (enemy.constructor?.name === 'EnemyTwo') gameWorld.cleanup?.stopAndRemoveEnemyTwo?.(enemy);
            });
        }
        window.cleanup?.();
        window.backgroundMusic?.pause();
        if (window.backgroundMusic) window.backgroundMusic.currentTime = 0;
    }

    /**
     * Handles the logic for returning to the start screen via the Back button.
     */
    static handleBackToStart() {
        if (window.PauseButtonManager?.isPaused) return;
        SystemButtonManager.cleanupGameState();
        ['game_over_screen','win_screen','control_screen','story_screen','countdown-overlay','orientation-overlay']
            .forEach(id => document.getElementById(id)?.classList.add('d-none'));
        const canvas = document.getElementById('canvas');
        const startScreen = document.getElementById('start_screen');
        if (canvas && startScreen) window.transitionFromCanvasToScreen(canvas, startScreen);
        SystemButtonManager.hideSystemButtons();
    }
}

/**
 * Initialize SystemButtonManager when DOM is ready
 */
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        SystemButtonManager.setupSystemButtonManager();
        SystemButtonManager.initSystemButtons();
    });
} else {
    SystemButtonManager.setupSystemButtonManager();
    SystemButtonManager.initSystemButtons();
}

window.handleBackToStart = SystemButtonManager.handleBackToStart;
window.hideSystemButtons = SystemButtonManager.hideSystemButtons;
window.showSystemButtons = SystemButtonManager.showSystemButtons;
