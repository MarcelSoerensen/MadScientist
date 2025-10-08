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

/**
 * Global laser animation state variables.
 */
const idleFrameCount = 14;
const idlePath = 'img/Main Characters/Gun01/Idle/Idle_';
const idleExt = '.png';
let idleFrame = 0;
let idleInterval;
let laserInterval;
let laserFrame = 0;

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
    laserImg.src = ImageCacheManager.getImage(LASER_FRAMES[0]).src;
}

/**
 * Animates the laser image frame by frame.
 */
function animateLaserFrames(img, frames, interval, done) {
    if (laserInterval) clearInterval(laserInterval);
    let i = 0;
    laserInterval = setInterval(() => {
        img.src = ImageCacheManager.getImage(LASER_FRAMES[laserFrame]).src;
        void img.offsetWidth;
        laserFrame = (laserFrame + 1) % LASER_FRAMES.length;
        if (++i >= frames) {
            clearInterval(laserInterval);
            if (done) done();
        }
    }, interval);
}

/**
 * Plays the laser shot sound effect.
 */
function playLaserSound() {
    try {
        SoundCacheManager.getAudio('sounds/laser-shot.mp3').play().catch(e => {
            if (e.name !== 'AbortError') console.error(e);
        });
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

/**
 * Animates the start screen character idle loop.
 */
function animateStartScreenCharacter() {
    const charImg = document.querySelector('.start-screen-character img');
    if (!charImg) return;
    idleInterval = setInterval(() => {
        const framePath = `${idlePath}${idleFrame.toString().padStart(2, '0')}${idleExt}`;
        const cachedSrc = ImageCacheManager.getImage(framePath).src;
        if (charImg.src !== cachedSrc) {
            charImg.src = cachedSrc;
        }
        idleFrame = (idleFrame + 1) % idleFrameCount;
    }, 80);
}

/**
 * Sets the visibility of the body title.
 */
function setBodyTitleVisible(visible) {
    const bodyTitle = document.querySelector('.body-title');
    const startScreen = document.getElementById('start_screen');
    const startScreenVisible = startScreen && !startScreen.classList.contains('d-none') && startScreen.style.display !== 'none';
    if (bodyTitle) {
        const showTitle = visible && !startScreenVisible;
        bodyTitle.style.opacity = showTitle ? 1 : 0;
        bodyTitle.style.pointerEvents = showTitle ? 'auto' : 'none';
    }
}

/**
 * Updates the visibility of the body title based on the available space above the canvas.
 */
function updateBodyTitleVisibilityBySpace(minSpacePx = 60) {
    const bodyTitle = document.querySelector('.body-title');
    const canvas = document.getElementById('canvas');
    if (!bodyTitle || !canvas) return;
    const canvasRect = canvas.getBoundingClientRect();
    const spaceAboveCanvas = canvasRect.top;
    const fontSize = parseFloat(window.getComputedStyle(bodyTitle).fontSize) || minSpacePx;
    const requiredSpace = fontSize * 2.2;
    const titleRect = bodyTitle.getBoundingClientRect();
    const titleFullyVisible = titleRect.top >= 0 && titleRect.bottom <= window.innerHeight;
    setBodyTitleVisible(spaceAboveCanvas > requiredSpace && titleFullyVisible);
}

/**
 * Initializes the start screen and related UI elements on DOMContentLoaded.
 */
function initStartScreen() {
    updateBodyTitleVisibilityBySpace();
    animateStartScreenCharacter();
    const startScreen = document.getElementById('start_screen');
    if (startScreen && !startScreen.classList.contains('d-none')) {
        setupStartScreenButtons();
    }
    const storyScreen = document.getElementById('story_screen');
    if (storyScreen) storyScreen.style.display = 'none';
    window.addEventListener('resize', () => updateBodyTitleVisibilityBySpace());
}

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
 * Prepares the canvas and initializes the game for starting.
 */
function prepareGameStart(canvas) {
    if (canvas) {
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
        canvas.style.filter = 'brightness(0)';
        canvas.style.pointerEvents = 'none';
        showCanvas(canvas);
        showBodyTitle();
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
        window.backgroundMusic = SoundCacheManager.getBackgroundMusic();
        window.backgroundMusic.loop = true; // redundanter safeguard
        window.backgroundMusic.volume = window.backgroundMusic.muted ? 0 : 0.08;
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
 * Sets up the buttons on the start screen.
 */
document.addEventListener('DOMContentLoaded', initStartScreen);





