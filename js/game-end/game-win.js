/**
 * Fades out the canvas and shows the win screen.
 */
function showWinScreen(scoreData = null) {
    const canvas = document.getElementById('canvas');
    const winScreen = document.getElementById('win_screen');
    if (!canvas || !winScreen) return;
    
    const startScreen = document.getElementById('start_screen');
    const controlScreen = document.getElementById('control_screen');
    const storyScreen = document.getElementById('story_screen');
    const gameOverScreen = document.getElementById('game_over_screen');
    
    if (startScreen) startScreen.classList.add('d-none');
    if (controlScreen) controlScreen.classList.add('d-none');
    if (storyScreen) storyScreen.classList.add('d-none');
    if (gameOverScreen) gameOverScreen.classList.add('d-none');
    
    updateWinScreenScore(scoreData);
    prepareWinScreenTransition(canvas, winScreen);
    handleWinScreenTransition(canvas, winScreen);
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
 * Prepares the transition classes and styles for showing the win screen and hiding the canvas.
 */
function prepareWinScreenTransition(canvas, winScreen) {
    winScreen.classList.remove('fade-in', 'fade-out', 'pre-fade');
    canvas.classList.remove('canvas-visible');
    winScreen.classList.add('pre-fade');
    winScreen.style.display = 'flex';
    void winScreen.offsetWidth;
    winScreen.classList.remove('pre-fade');
    canvas.style.filter = 'brightness(0)';
    canvas.style.pointerEvents = 'none';
}

/**
 * Handles the two-phase transition from canvas to win screen (fade out canvas, then fade in win screen).
 */
function handleWinScreenTransition(canvas, winScreen) {
    let phase = 0;
    const handler = event => {
        if (event.propertyName !== 'filter') return;
        if (!phase++) {
            canvas.removeEventListener('transitionend', handler);
            winScreen.classList.remove('d-none');
            winScreen.classList.add('fade-in');
            winScreen.addEventListener('transitionend', handler);
        } else {
            winScreen.classList.remove('fade-in');
            winScreen.removeEventListener('transitionend', handler);
        }
    };
    canvas.addEventListener('transitionend', handler);
}

window.showWinScreen = showWinScreen;

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
        menuBtn.addEventListener('mousedown', handleWinToMenu);
    }
}

document.addEventListener('DOMContentLoaded', setupWinScreenButtons);

/**
 * Handles the "Next Level" button click from win screen - fades from win screen back to canvas and restarts the game.
 */
function handleNextLevel() {
    const winScreen = document.getElementById('win_screen');
    const canvas = document.getElementById('canvas');
    if (!winScreen || !canvas) return;
    
    winToCanvasFade(winScreen, canvas);
    winToCanvasFadeOut(winScreen);
    winToCanvasFadeIn(canvas);
}

/**
 * Handles the fade transition from win screen to canvas.
 */
function winToCanvasFade(winScreen, canvas) {
    winScreen.classList.remove('fade-in', 'fade-out', 'pre-fade');
    canvas.classList.remove('canvas-visible');
    winScreen.style.display = 'flex';
    canvas.style.filter = 'brightness(0)';
    canvas.style.pointerEvents = 'none';
    void winScreen.offsetWidth;
    winScreen.classList.add('fade-out');
}

/**
 * Handles the fade-out transition for the win screen.
 */
function winToCanvasFadeOut(winScreen) {
    function handler(event) {
        if (event.propertyName === 'filter') {
            winScreen.classList.add('d-none');
            winScreen.classList.remove('fade-out');
            winScreen.style.display = '';
            winScreen.removeEventListener('transitionend', handler);
        }
    }
    winScreen.addEventListener('transitionend', handler);
}

/**
 * Prepares the canvas for restart from win screen.
 */
function prepareCanvasRestart(canvas) {
    if (canvas) {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    
    if (typeof window.restartGame === 'function') {
        window.restartGame();
    } else if (typeof window.startGame === 'function') {
        window.startGame();
    }
}

/**
 * Handles the fade-in transition for the canvas (backwards from win screen).
 */
function winToCanvasFadeIn(canvas) {
    prepareCanvasRestart(canvas);
    
    canvas.classList.add('canvas-visible');
    canvas.style.filter = 'brightness(1)';
    canvas.style.pointerEvents = 'auto';
}

/**
 * Handles the "Menu" button click from win screen.
 */
function handleWinToMenu() {
    const startScreen = document.getElementById('start_screen');
    const winScreen = document.getElementById('win_screen');
    if (!startScreen || !winScreen) return;
    
    winToStartFade(startScreen, winScreen);
    winToStartFadeIn(startScreen);
    winToStartFadeOut(winScreen);
}

/**
 * Handles the fade transition classes for both start and win screens (backwards).
 */
function winToStartFade(startScreen, winScreen) {
    startScreen.classList.remove('d-none', 'fade-in', 'fade-out', 'pre-fade');
    winScreen.classList.remove('fade-in', 'fade-out', 'pre-fade');
    
    startScreen.classList.add('pre-fade');
    startScreen.style.display = 'flex';
    winScreen.style.display = 'flex';
    
    void startScreen.offsetWidth;
    
    startScreen.classList.remove('pre-fade');
    winScreen.classList.add('fade-out');
    startScreen.classList.add('fade-in');
}

/**
 * Handles the two-phase transition from win screen back to start screen (fade out win screen).
 */
function winToStartFadeOut(winScreen) {
    function handler(event) {
        if (event.propertyName === 'filter') {
            winScreen.classList.add('d-none');
            winScreen.classList.remove('fade-out');
            winScreen.style.display = '';
            winScreen.removeEventListener('transitionend', handler);
        }
    }
    winScreen.addEventListener('transitionend', handler);
}

/**
 * Handles the fade-in transition for the start screen (from win screen).
 */
function winToStartFadeIn(startScreen) {
    function handler(event) {
        if (event.propertyName === 'filter') {
            startScreen.classList.remove('fade-in');
            startScreen.classList.remove('d-none'); // Ensure d-none is removed
            startScreen.style.display = ''; // Reset display style
            startScreen.removeEventListener('transitionend', handler);
            if (typeof window.setupStartScreenButtons === 'function') window.setupStartScreenButtons();
        }
    }
    startScreen.addEventListener('transitionend', handler);
}