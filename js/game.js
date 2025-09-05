let canvas;
let world;
let keyboard = new Keyboard(); 

function init() {
    canvas = document.getElementById('canvas');
    world = new World(canvas, keyboard);
    world.setWorldReferenceForEnemies();

    if (typeof window !== 'undefined') {
        if (!window.backgroundMusic) {
            window.backgroundMusic = new Audio('sounds/background-sound.flac');
            window.backgroundMusic.loop = true;
            window.backgroundMusic.volume = 0.08;
        }
        window.backgroundMusic.currentTime = 0;
        const playMusic = () => {
            window.backgroundMusic.play();
            canvas.removeEventListener('click', playMusic);
        };
        canvas.addEventListener('click', playMusic);
    }

    console.log('my character is', world.character);
    console.log('my enemies are', world.enemies);
}

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
