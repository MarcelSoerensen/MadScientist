/**
 * Fades out the canvas and shows the game over screen.
 */
function showGameOverScreen() {
    const canvas = document.getElementById('canvas');
    const gameOverScreen = document.getElementById('game_over_screen');
    if (!canvas || !gameOverScreen) return;
    
    const startScreen = document.getElementById('start_screen');
    const controlScreen = document.getElementById('control_screen');
    const storyScreen = document.getElementById('story_screen');
    
    if (startScreen) startScreen.classList.add('d-none');
    if (controlScreen) controlScreen.classList.add('d-none');
    if (storyScreen) storyScreen.classList.add('d-none');
    
    prepareGameOverScreenTransition(canvas, gameOverScreen);
    handleGameOverScreenTransition(canvas, gameOverScreen);
}

/**
 * Prepares the transition classes and styles for showing the game over screen and hiding the canvas.
 */
function prepareGameOverScreenTransition(canvas, gameOverScreen) {
    gameOverScreen.classList.remove('fade-in', 'fade-out', 'pre-fade');
    canvas.classList.remove('canvas-visible');
    gameOverScreen.classList.add('pre-fade');
    gameOverScreen.style.display = 'flex';
    void gameOverScreen.offsetWidth;
    gameOverScreen.classList.remove('pre-fade');
    canvas.style.filter = 'brightness(0)';
    canvas.style.pointerEvents = 'none';
}

/**
 * Handles the two-phase transition from canvas to game over screen (fade out canvas, then fade in game over).
 */
function handleGameOverScreenTransition(canvas, gameOverScreen) {
    let phase = 0;
    const handler = event => {
        if (event.propertyName !== 'filter') return;
        if (!phase++) {
            canvas.removeEventListener('transitionend', handler);
            gameOverScreen.classList.remove('d-none');
            gameOverScreen.classList.add('fade-in');
            gameOverScreen.addEventListener('transitionend', handler);
        } else {
            gameOverScreen.classList.remove('fade-in');
            gameOverScreen.removeEventListener('transitionend', handler);
        }
    };
    canvas.addEventListener('transitionend', handler);
}

window.showGameOverScreen = showGameOverScreen;

/**
 * Handles the fade transition classes for both start and game over screens (backwards).
 */
function gameOverToStartFade(startScreen, gameOverScreen) {
    startScreen.classList.remove('d-none', 'fade-in', 'fade-out', 'pre-fade');
    gameOverScreen.classList.remove('fade-in', 'fade-out', 'pre-fade');
    
    startScreen.classList.add('pre-fade');
    startScreen.style.display = 'flex';
    gameOverScreen.style.display = 'flex';
    
    void startScreen.offsetWidth;
    
    startScreen.classList.remove('pre-fade');
    gameOverScreen.classList.add('fade-out');
    startScreen.classList.add('fade-in');
}

/**
 * Handles the two-phase transition from game over screen back to start screen (fade out game over).
 */
function gameOverToStartFadeOut(gameOverScreen) {
    function handler(event) {
        if (event.propertyName === 'filter') {
            gameOverScreen.classList.add('d-none');
            gameOverScreen.classList.remove('fade-out');
            gameOverScreen.style.display = '';
            gameOverScreen.removeEventListener('transitionend', handler);
        }
    }
    gameOverScreen.addEventListener('transitionend', handler);
}

/**
 * Handles the fade-in transition for the start screen (backwards from game over screen).
 */
function gameOverToStartFadeIn(startScreen) {
    function handler(event) {
        if (event.propertyName === 'filter') {
            startScreen.classList.remove('fade-in');
            startScreen.classList.remove('d-none');
            startScreen.style.display = '';
            startScreen.removeEventListener('transitionend', handler);
            if (typeof window.setupStartScreenButtons === 'function') window.setupStartScreenButtons();
        }
    }
    startScreen.addEventListener('transitionend', handler);
}

/**
 * Handles the retry functionality - fades from game over screen back to canvas and restarts the game.
 */
function handleRetryGame() {
    const gameOverScreen = document.getElementById('game_over_screen');
    const canvas = document.getElementById('canvas');
    if (!gameOverScreen || !canvas) return;
    
    if (typeof window.startBackgroundMusic === 'function') {
        window.startBackgroundMusic();
    }
    gameOverToCanvasFade(gameOverScreen, canvas);
    gameOverToCanvasFadeOut(gameOverScreen);
    gameOverToCanvasFadeIn(canvas);
}

/**
 * Handles the fade transition from game over screen to canvas.
 */
function gameOverToCanvasFade(gameOverScreen, canvas) {
    gameOverScreen.classList.remove('fade-in', 'fade-out', 'pre-fade');
    canvas.classList.remove('canvas-visible');
    gameOverScreen.style.display = 'flex';
    canvas.style.filter = 'brightness(0)';
    canvas.style.pointerEvents = 'none';
    void gameOverScreen.offsetWidth;
    gameOverScreen.classList.add('fade-out');
}

/**
 * Handles the two-phase transition from game over screen back to canvas (fade out game over).
 */
function gameOverToCanvasFadeOut(gameOverScreen) {
    function handler(event) {
        if (event.propertyName === 'filter') {
            gameOverScreen.classList.add('d-none');
            gameOverScreen.classList.remove('fade-out');
            gameOverScreen.style.display = '';
            gameOverScreen.removeEventListener('transitionend', handler);
        }
    }
    gameOverScreen.addEventListener('transitionend', handler);
}

/**
 * Prepares the canvas for restart after game over.
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
 * Handles the fade-in transition for the canvas (backwards from game over screen).
 */
function gameOverToCanvasFadeIn(canvas) {
    prepareCanvasRestart(canvas);
    
    canvas.classList.add('canvas-visible');
    canvas.style.filter = 'brightness(1)';
    canvas.style.pointerEvents = 'auto';
    
    canvas.addEventListener('transitionend', function handler(event) {
        if (event.propertyName === 'filter') {
            canvas.removeEventListener('transitionend', handler);
        }
    });
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
            const startScreen = document.getElementById('start_screen');
            const gameOverScreen = document.getElementById('game_over_screen');
            if (!startScreen || !gameOverScreen) return;
            
            gameOverToStartFade(startScreen, gameOverScreen);
            gameOverToStartFadeIn(startScreen);
            gameOverToStartFadeOut(gameOverScreen);
        });
    }
}

document.addEventListener('DOMContentLoaded', setupGameOverScreenButtons);