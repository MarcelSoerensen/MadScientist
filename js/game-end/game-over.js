/**
 * Fades out the canvas and shows the game over screen.
 */
function showGameOverScreen() {
    window.addEventListener('resize', () => checkBodyTitleSpace());
    setBodyTitleVisible(true);
    checkBodyTitleSpace();
    const canvas = document.getElementById('canvas');
    const gameOverScreen = document.getElementById('game_over_screen');
    if (!canvas || !gameOverScreen) return;
    [
        'start_screen',
        'control_screen',
        'story_screen'
    ].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.add('d-none');
    });
    transitionFromCanvasToScreen(canvas, gameOverScreen);
}

/**
 * Sets up the buttons on the game over screen.
 */
function setupGameOverScreenButtons() {
    const retryBtn = document.querySelector('#game_over_screen .game-over-screen-btn:first-of-type');
    const menuBtn = document.querySelector('#game_over_screen .game-over-screen-btn:last-of-type');
    if (retryBtn) {
        retryBtn.addEventListener('mousedown', handleRetryGame);
    }
    if (menuBtn) {
        menuBtn.addEventListener('mousedown', function() {
            const gameOverScreen = document.getElementById('game_over_screen');
            if (!gameOverScreen) return;
            window.transitionToStartScreen(gameOverScreen);
            setBodyTitleVisible(false);

        });
    }
}

/**
 * Handles the retry functionality - fades from game over screen back to canvas and restarts the game.
 */
function handleRetryGame() {
    const gameOverScreen = document.getElementById('game_over_screen');
    const canvas = document.getElementById('canvas');
    if (gameOverScreen) gameOverScreen.classList.add('d-none');
    if (canvas) {
        canvas.style.filter = 'brightness(1)';
        canvas.style.pointerEvents = 'auto';
        canvas.classList.add('canvas-visible');
    }
    if (typeof window.restartGame === 'function') {
        window.restartGame();
    } else if (typeof window.startGame === 'function') {
        window.startGame();
    }
}

/**
 * Initializes the event listeners for the game over screen buttons
 */
document.addEventListener('DOMContentLoaded', setupGameOverScreenButtons);

/**
 * Handles the fade transition classes for both start and game over screens (backwards).
 */
window.showGameOverScreen = showGameOverScreen;