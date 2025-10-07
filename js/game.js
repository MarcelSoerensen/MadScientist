let canvas;
let world;
if (typeof window !== 'undefined') {
    window.world = world;
}
let keyboard = new Keyboard(); 
if (typeof window !== 'undefined' && typeof window.inputDisabled === 'undefined') {
    window.inputDisabled = false;
}

/**
 * disables game input (e.g. on game over / win screen / other overlays)
 */
function disableInput() {
    if (typeof window !== 'undefined') {
        window.inputDisabled = true;
    }
    if (typeof resetKeyboard === 'function') {
        resetKeyboard();
    }
}

/**
 * Activates game input again (e.g. when canvas becomes visible)
 */
function enableInput() {
    if (typeof window !== 'undefined') {
        window.inputDisabled = false;
    }
}
if (typeof window !== 'undefined') {
    window.disableInput = disableInput;
    window.enableInput = enableInput;
}

/**
 * Initializes the game, canvas and world.
 */
function init() {
    canvas = document.getElementById('canvas');
    world = new World(canvas, keyboard);
    if (typeof window !== 'undefined') {
        window.world = world;
        world.setWorldReferenceForEnemies();
        initBackgroundMusic();
        enableInput(); // Falls vorher deaktiviert
    }
}

/**
 * Initializes and plays the background music, and sets up a listener for mute changes.
 */
function initBackgroundMusic() {
    const bgMusic = window.backgroundMusic = SoundCacheManager.getBackgroundMusic();
    bgMusic.currentTime = 0;
    bgMusic.muted = SoundCacheManager.muted;
    bgMusic.volume = bgMusic.muted ? 0 : 0.08;
    bgMusic.play().catch(()=>{});
    addMuteListener();
}

/**
 * Adds a listener for changes to the audio mute state.
 */
function addMuteListener() {
    if (window._bgMusicMuteListenerAdded) return;
    window.addEventListener('audio-mute-changed', e => {
        if (!window.backgroundMusic) return;
        const muted = e.detail && e.detail.muted;
        window.backgroundMusic.muted = !!muted;
        window.backgroundMusic.volume = muted ? 0 : 0.08;
        if (!muted) window.backgroundMusic.play().catch(()=>{});
    });
    window._bgMusicMuteListenerAdded = true;
}

/**
 * Restarts the game by cleaning up the old world and creating a new one.
 */
function restartGame() {
    cleanup();
    createNewGame();
    resetKeyboard();
}

/**
 * Cleans up the current game state by destroying the world and resetting variables.
 */
function cleanup() {
    if (world) {
        world.performCleanup();
        world = null;
    }
    if (canvas) {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    window.endbossDefeated = false;
    if (window.enemySpawnPositions) {
        window.enemySpawnPositions = [];
    }
}

/**
 * Creates a new game by generating a fresh level and initializing the world.
 */
function createNewGame() {
    if (typeof createLevel1 === 'function') {
        level1 = createLevel1();
    }
    init();
}

/**
 * Resets all keyboard input flags to false.
 */
function resetKeyboard() {
    Object.assign(keyboard, {
        LEFT: false, RIGHT: false, UP: false, DOWN: false,
        SPACE: false, D: false, Y: false, S: false
    });
}

/**
 * Event listener for keydown. Sets the corresponding keyboard flags.
 */
window.addEventListener('keydown', (event) => {
    if (window.isPaused) return;
    if (window.inputDisabled && !['d', 'y', 's'].includes(event.key)) {
        return;
    }
    if (world && world.gameOver) {
        if (!['d', 'y', 's'].includes(event.key)) return;
    }
    if (event.key === 'ArrowLeft') {
        keyboard.LEFT = true;
    }
    if (event.key === 'ArrowRight') {
        keyboard.RIGHT = true;
    }
    if (event.key === 'ArrowUp') {
        keyboard.UP = true;
    }
    if (event.key === 'ArrowDown') {
        keyboard.DOWN = true;
    }
    if (event.key === ' ') {
        keyboard.SPACE = true;
    }
    if (event.key === 'd') {
        keyboard.D = true;
    }
    if (event.key === 'y') {
        keyboard.Y = true;
    }
    if (event.key === 's') {
        keyboard.S = true;
    }
});

/**
 * Event listener for keyup. Resets the corresponding keyboard flags.
 */
window.addEventListener('keyup', (event) => {
    if (window.inputDisabled) return;
    if (event.key === 'ArrowLeft') {
        keyboard.LEFT = false;
    }

    if (event.key === 'ArrowRight') {
        keyboard.RIGHT = false;
        
    }

    if (event.key === 'ArrowUp') {
        keyboard.UP = false;
    }

    if (event.key === 'ArrowDown') {
        keyboard.DOWN = false;
    }

    if (event.key === ' ') {
        keyboard.SPACE = false;
    }

    if (event.key === 'd') {
        keyboard.D = false;
    }

    if (event.key === 'y') {
        keyboard.Y = false;
    }

    if (event.key === 's') {
        keyboard.S = false;
    }

});
