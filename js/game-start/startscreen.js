/**
 * Global laser animation frames and state variables.
 */
const LASER_FRAMES = [
    'img/Projectile/Laser/skeleton-animation_0.png',
    'img/Projectile/Laser/skeleton-animation_1.png',
    'img/Projectile/Laser/skeleton-animation_2.png',
    'img/Projectile/Laser/skeleton-animation_3.png',
    'img/Projectile/Laser/skeleton-animation_4.png',
];
let laserFrame = 0;
let laserInterval;

/**
 * Fades out the start screen and shows the canvas.
 */
function fadeToCanvas(canvas) {
    const startScreen = document.getElementById('start_screen');
    if (!startScreen) return;
    
    startScreen.classList.remove('d-none');
    startScreen.style.opacity = '';
    void startScreen.offsetWidth;
    startScreen.classList.add('fade-out');
    fadeOutStartScreen(startScreen);
}

/**
 * Handles the fade-out transition for the start screen (to canvas).
 */
function fadeOutStartScreen(startScreen) {
    const handler = event => {
        if (event.propertyName !== 'filter') return;
        startScreen.classList.add('d-none');
        startScreen.classList.remove('fade-out');
        startScreen.style.opacity = '';
        startScreen.removeEventListener('transitionend', handler);
    };
    startScreen.addEventListener('transitionend', handler);
}

/**
 * Shows and fades in the countdown overlay.
 */
function showAndFadeCountdown(onCountdownEnd, showStoryScreen) {
    const overlay = document.getElementById('countdown-overlay');
    if (!overlay) return onCountdownEnd && onCountdownEnd();
    overlay.classList.remove('d-none');
    void overlay.offsetWidth;
    overlay.classList.add('fade-in');
    setTimeout(() => {
        handleCountdownTransition(overlay, onCountdownEnd, showStoryScreen);
    }, 400);
}

/**
 * Handles the transition after the countdown overlay.
 */
function handleCountdownTransition(overlay, callback, showStoryScreen) {
    showCountdownOverlay(() => {
        if (showStoryScreen) {
            showStoryScreen();
        } else {
            const canvas = document.getElementById('canvas');
            fadeToCanvas(canvas);
        }
        fadeOutOverlay(overlay, callback);
    });
}

/**
 * Shows and fades in the countdown overlay, then starts the countdown and handles the start screen fade-out.
 */
function showCountdownOverlay(callback) {
    const overlay = document.getElementById('countdown-overlay');
    const numberSpan = document.getElementById('countdown-number');
    if (!overlay || !numberSpan) return callback && callback();
    overlay.classList.remove('d-none');
    setTimeout(() => {
        handleCountdownFadeOut(overlay, numberSpan, callback);
    }, 0);
}

/**
 * Handles the fade-out of the start screen and runs the countdown.
 */
function handleCountdownFadeOut(overlay, numberSpan, callback) {
    const startScreen = document.getElementById('start_screen');
    setTimeout(() => {
        if (startScreen) {
            startScreen.classList.remove('d-none');
            startScreen.style.opacity = '';
            void startScreen.offsetWidth;
            startScreen.classList.add('fade-out');
            setTimeout(() => {
                startScreen.classList.add('d-none');
                startScreen.classList.remove('fade-out');
                startScreen.style.opacity = '';
            }, 1000);
        }
    }, 2900);
    runCountdown(numberSpan, 3, () => hideCountdownOverlay(overlay, callback));
}

/**
 * Runs the countdown sequence recursively.
 */
function runCountdown(numberSpan, count, onDone) {
    animateCountdownNumber(numberSpan, count);
    if (count > 1) {
        setTimeout(() => runCountdown(numberSpan, count - 1, onDone), 1200);
    } else {
        setTimeout(onDone, 1200);
    }
}

/**
 * Animates the countdown number.
 */
function animateCountdownNumber(numberSpan, count) {
    numberSpan.textContent = count;
    numberSpan.style.transition = 'none';
    numberSpan.style.opacity = 0;
    numberSpan.style.transform = 'scale(1)';
    void numberSpan.offsetWidth;
    numberSpan.style.transition = '';
    new Audio('sounds/counter.mp3').play().catch(() => {});
    setTimeout(() => { numberSpan.style.opacity = 1; numberSpan.style.transform = 'scale(1)'; }, 10);
    setTimeout(() => numberSpan.style.transform = 'scale(2)', 200);
    setTimeout(() => numberSpan.style.opacity = 0, 900);
}

/**
 * Hides the countdown overlay.
 */
function hideCountdownOverlay(overlay, callback) {
    overlay.classList.add('d-none');
    if (callback) callback();
}

/**
 * Fades out the overlay with animation.
 */
function fadeOutOverlay(overlay, callback) {
    overlay.classList.add('fade-out');
    setTimeout(() => {
        overlay.classList.remove('fade-out');
        overlay.classList.add('d-none');
        if (callback) callback();
    }, 700);
}

/**
 * Runs the full laser animation for the given mode.
 */
function animateLaser(mode, callback) {
    const laserImg = document.querySelector('.start-screen-laser img');
    const charImg = document.querySelector('.start-screen-character img');
    if (!laserImg) return;
    resetLaserImg(laserImg, mode);
    playLaserSound();
    if (charImg) charImg.style.visibility = 'visible';
    animateLaserFrames(laserImg, 6, 167, () => {
        laserImg.classList.remove('laser-play-button', 'laser-controls-button', 'laser-story-button');
        if (mode === 'play') {
            laserImg.style.display = 'none';
        }
        if (typeof callback === 'function') callback();
    });
}

/**
 * Resets the laser image for the given mode.
 */
function resetLaserImg(laserImg, mode) {
    laserImg.alt = '';
    laserImg.style.display = 'inline-block';
    laserImg.classList.remove('laser-play-button', 'laser-controls-button', 'laser-story-button');
    if (mode === 'play') laserImg.classList.add('laser-play-button');
    if (mode === 'story') laserImg.classList.add('laser-story-button');
    if (mode === 'controls') laserImg.classList.add('laser-controls-button');
    laserFrame = 0;
    laserImg.src = LASER_FRAMES[0];
}

/**
 * Animates the laser image frame by frame.
 */
function animateLaserFrames(laserImg, frames, interval, onDone) {
    let frameCount = 0;
    if (laserInterval) clearInterval(laserInterval);
    laserInterval = setInterval(() => {
        laserImg.src = LASER_FRAMES[laserFrame];
        void laserImg.offsetWidth;
        laserFrame = (laserFrame + 1) % LASER_FRAMES.length;
        frameCount++;
        if (frameCount >= frames) {
            clearInterval(laserInterval);
            if (typeof onDone === 'function') onDone();
        }
    }, interval);
}

/**
 * Plays the laser shot sound effect.
 */
function playLaserSound() {
    try {
        new Audio('sounds/laser-shot.mp3').play();
    } catch (e) {}
}

/**
 * Adds or removes a CSS class on the laser image.
 */
function toggleLaserClass(laserImg, className, add) {
    if (laserImg) laserImg.classList[add ? 'add' : 'remove'](className);
}

/**
 * Stops and hides the laser animation.
 */
function stopStartScreenLaser() {
    const laserImg = document.querySelector('.start-screen-laser img');
    const charImg = document.querySelector('.start-screen-character img');
    if (laserImg) laserImg.style.display = 'none';
    if (charImg) charImg.style.display = 'block';
    if (laserInterval) clearInterval(laserInterval);
}


const idleFrameCount = 14;
const idlePath = 'img/Main Characters/Gun01/Idle/Idle_';
const idleExt = '.png';
let idleFrame = 0;
let idleInterval;

/**
 * Animates the start screen character idle loop.
 */
function animateStartScreenCharacter() {
    const charImg = document.querySelector('.start-screen-character img');
    if (!charImg) return;
    idleInterval = setInterval(() => {
        charImg.src = `${idlePath}${idleFrame.toString().padStart(2, '0')}${idleExt}`;
        idleFrame = (idleFrame + 1) % idleFrameCount;
    }, 80);
}

/**
 * Sets the visibility of the body title.
 */
function setBodyTitleVisible(visible) {
    const bodyTitle = document.querySelector('.body-title');
    if (bodyTitle) {
        bodyTitle.style.opacity = visible ? 1 : 0;
        bodyTitle.style.pointerEvents = visible ? 'auto' : 'none';
    }
}


/**
 * Initializes the start screen and related UI elements on DOMContentLoaded.
 */
function initStartScreen() {
    setBodyTitleVisible(false);
    animateStartScreenCharacter();
    const startScreen = document.getElementById('start_screen');
    if (startScreen && !startScreen.classList.contains('d-none')) {
        setupStartScreenButtons();
    }
    const storyScreen = document.getElementById('story_screen');
    if (storyScreen) storyScreen.style.display = 'none';
}

document.addEventListener('DOMContentLoaded', initStartScreen);

/**
 * Updates the event listeners for the start and story screen buttons depending on which screen is visible.
 */
function updateScreenButtonListeners() {
    const startScreen = document.getElementById('start_screen');
    const storyScreen = document.getElementById('story_screen');
    if (startScreen && !startScreen.classList.contains('d-none')) {
        setupStartScreenButtons();
    }
    if (storyScreen && !storyScreen.classList.contains('d-none')) {
        if (window.setupBackButton) window.setupBackButton();
    }
}

/**
 * Handles the start of the game after the countdown.
 */
function handleGameStart() {
    const canvas = document.getElementById('canvas');
        prepareGameStart(canvas);
        showCanvas(canvas);
        showBodyTitle();
        removeCanvasFadeIn(canvas);
}

/**
 * Prepares the canvas and initializes the game for starting.
 */
function prepareGameStart(canvas) {
    if (canvas) {
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
        canvas.style.filter = 'brightness(0)';
        canvas.style.pointerEvents = 'none';
    }
        startBackgroundMusic();
        runGameInit();
}

/**
 * Makes the canvas visible with brightness transition.
 */
function showCanvas(canvas) {
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
 * Clears the game canvas.
 */
function resetGameCanvas(canvas) {
    if (canvas) {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
}

/**
 * Starts or restarts the background music.
 */
function startBackgroundMusic() {
    if (typeof window === 'undefined') return;
    if (!window.backgroundMusic) {
        window.backgroundMusic = new Audio('sounds/background-sound.mp3');
        window.backgroundMusic.loop = true;
        window.backgroundMusic.volume = 0.08;
    }
    window.backgroundMusic.currentTime = 0;
    window.backgroundMusic.play().catch(() => {});
}

/**
 * Calls the global game init function if available.
 */
function runGameInit() {
    if (typeof window.restartGame === 'function') {
        window.restartGame();
    } else if (typeof init === 'function') {
        init();
    }
}

/**
 * Shows the body title by setting its opacity and pointer events.
 */
function showBodyTitle() {
    const bodyTitle = document.querySelector('.body-title');
    if (bodyTitle) {
        bodyTitle.style.opacity = 1;
        bodyTitle.style.pointerEvents = 'auto';
    }
}

/**
 * Removes the fade-in-canvas class from the canvas after a delay.
 */
function removeCanvasFadeIn(canvas) {
    setTimeout(() => {
        if (canvas) {
            canvas.classList.remove('fade-in-canvas');
        }
    }, 1000);
}




