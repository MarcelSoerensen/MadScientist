/**
 * Fades out the canvas and shows the win screen.
 */
function showWinScreen(scoreData = null) {
    window.addEventListener('resize', checkBodyTitleSpace);
    setBodyTitleVisible(true);
    checkBodyTitleSpace();
    const canvas = document.getElementById('canvas');
    const winScreen = document.getElementById('win_screen');
    if (!canvas || !winScreen) return;
    [
        'start_screen',
        'control_screen',
        'story_screen'
    ].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.add('d-none');
    });
    updateWinScreenScore(scoreData);
    transitionFromCanvasToScreen(canvas, winScreen);
}

/**
 * Updates the win screen text with the collected energy balls score.
 */
function updateWinScreenScore(scoreData = null) {
    const winTextbox = document.querySelector('#win_textbox p');
    if (!winTextbox) return;
        let collectedBalls = 0;
        let totalBalls = 20;
    if (scoreData) {
        collectedBalls = scoreData.collected || 0;
        totalBalls = scoreData.total || 20;
    } else if (typeof window.world !== 'undefined' && window.world && window.world.energyBallManager) {
        collectedBalls = window.world.energyBallManager.totalCollectedCount || 0;
        totalBalls = window.world.energyBallManager.maxBalls || 20;
    }
    winTextbox.textContent = `Experiment successful! You collected ${collectedBalls}/${totalBalls} energy balls!`;
}

/**
 * Sets up the buttons on the win screen.
 */
function setupWinScreenButtons() {
    const nextLevelBtn = document.querySelector('#win_screen .win-screen-btn:first-of-type');
    const menuBtn = document.querySelector('#win_screen .win-screen-btn:last-of-type');
    if (nextLevelBtn) {
        nextLevelBtn.addEventListener('mousedown', handleNextLevel);
    }
    if (menuBtn) {
        menuBtn.addEventListener('mousedown', function() {
            const winScreen = document.getElementById('win_screen');
            if (!winScreen) return;
            window.transitionToStartScreen(winScreen);
            window.removeEventListener('resize', checkBodyTitleSpace);
            setBodyTitleVisible(false);
        });
    }
}

/**
 * Handles the "Next Level" button click from win screen - fades from win screen back to canvas and restarts the game.
 */
function handleNextLevel() {
    const winScreen = document.getElementById('win_screen');
    const canvas = document.getElementById('canvas');
    if (winScreen) winScreen.classList.add('d-none');
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
 * Handles the fade transition from canvas to a target screen (e.g., win or game over screen).
 */
document.addEventListener('DOMContentLoaded', setupWinScreenButtons);

/**
 * Handles the fade transition from canvas to a target screen (e.g., win or game over screen).
 */
window.showWinScreen = showWinScreen;