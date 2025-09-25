let canvas;
let world;
let keyboard = new Keyboard(); 

/**
 * Initializes the game, canvas and world.
 */
function init() {
    canvas = document.getElementById('canvas');
    world = new World(canvas, keyboard);
    world.setWorldReferenceForEnemies();

    if (typeof window !== 'undefined') {
        if (!window.backgroundMusic) {
            window.backgroundMusic = new Audio('sounds/background-sound.mp3');
            window.backgroundMusic.loop = true;
            window.backgroundMusic.volume = 0.08;
        }
        window.backgroundMusic.currentTime = 0;
    }
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
        world.cleanup();
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
    if (world && world.gameOver) {
        if (['d', 'y', 's'].includes(event.key)) return;
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
