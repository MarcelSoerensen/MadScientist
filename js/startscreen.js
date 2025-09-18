/**
 * Fades out the start screen and shows the canvas.
 */
function fadeToCanvas(canvas) {
    const startScreen = document.getElementById('start_screen');
    if (startScreen) {
        setTimeout(() => {
            startScreen.classList.remove('d-none');
            startScreen.style.opacity = '';
            void startScreen.offsetWidth;
            startScreen.classList.add('fade-out');
            if (canvas) canvas.classList.add('canvas-visible');
            function onFadeOutEnd(e) {
                if (e.propertyName === 'filter') {
                    startScreen.classList.add('d-none');
                    startScreen.classList.remove('fade-out');
                    startScreen.style.opacity = '';
                    startScreen.removeEventListener('transitionend', onFadeOutEnd);
                }
            }
            startScreen.addEventListener('transitionend', onFadeOutEnd);
        }, 150);
    }
}

/**
 * Shows countdown overlay and handles transition.
 */
function showAndFadeCountdown(callback, showStoryScreen) {
    const overlay = document.getElementById('countdown-overlay');
    if (!overlay) return callback && callback();
    overlay.classList.remove('d-none');
    void overlay.offsetWidth;
    overlay.classList.add('fade-in');
    setTimeout(() => {
        showCountdownOverlay(() => {
            if (showStoryScreen) {
                showStoryScreen();
            } else {
                const canvas = document.getElementById('canvas');
                fadeToCanvas(canvas);
            }
            fadeOutOverlay(overlay, callback);
        });
    }, 400);
}

/**
 * Shows the countdown overlay and starts countdown.
 */
function showCountdownOverlay(callback) {
    const overlay = document.getElementById('countdown-overlay');
    const numberSpan = document.getElementById('countdown-number');
    if (!overlay || !numberSpan) return callback && callback();
    overlay.classList.remove('d-none');
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
 * Sets up the start screen button event listeners.
 */
function setupStartScreenButtons() {
    let [storyBtn, controlsBtn, playBtn] = document.querySelectorAll('.start-screen-btn-group button');
    // Alle Buttons beim Betreten aktivieren
    [storyBtn, controlsBtn, playBtn].forEach(btn => { if (btn) btn.disabled = false; });

    if (playBtn) {
        playBtn.replaceWith(playBtn.cloneNode(true));
    }
    if (storyBtn) {
        storyBtn.replaceWith(storyBtn.cloneNode(true));
    }
    if (controlsBtn) {
        controlsBtn.replaceWith(controlsBtn.cloneNode(true));
    }
    // Nach dem Ersetzen: neue Referenzen holen
    [storyBtn, controlsBtn, playBtn] = document.querySelectorAll('.start-screen-btn-group button');
    [storyBtn, controlsBtn, playBtn].forEach(btn => { if (btn) btn.disabled = false; });
    function disableAll() {
        [storyBtn, controlsBtn, playBtn].forEach(btn => { if (btn) btn.disabled = true; });
    }
    if (playBtn) {
        playBtn.addEventListener('mousedown', () => {
            disableAll();
            animateLaser('play', () => {
                stopStartScreenLaser();
                showAndFadeCountdown(handleGameStart, false);
            });
        });
    }
    if (storyBtn) {
        storyBtn.addEventListener('mousedown', () => {
            disableAll();
            animateLaser('story', () => {
                stopStartScreenLaser();
                showStoryScreen();
            });
        });
    }
    if (controlsBtn) {
        controlsBtn.addEventListener('mousedown', () => {
            disableAll();
            animateLaser('controls', () => {
                stopStartScreenLaser();
                showControlScreen();
            });
        });
    }
}

document.addEventListener('DOMContentLoaded', function() {
    setBodyTitleVisible(false);
    animateStartScreenCharacter();
    const startScreen = document.getElementById('start_screen');
    if (startScreen && !startScreen.classList.contains('d-none')) {
        setupStartScreenButtons();
    }
    const storyScreen = document.getElementById('story_screen');
    if (storyScreen) storyScreen.style.display = 'none';
});

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
    if (canvas) {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    if (typeof window !== 'undefined') {
        if (!window.backgroundMusic) {
            window.backgroundMusic = new Audio('sounds/background-sound.mp3');
            window.backgroundMusic.loop = true;
            window.backgroundMusic.volume = 0.08;
        }
        window.backgroundMusic.currentTime = 0;
        window.backgroundMusic.play().catch(() => {});
    }
    if (typeof init === 'function') init();
    const bodyTitle = document.querySelector('.body-title');
    if (bodyTitle) {
        bodyTitle.style.opacity = 1;
        bodyTitle.style.pointerEvents = 'auto';
    }
    setTimeout(() => {
        if (canvas) canvas.classList.remove('fade-in-canvas');
    }, 1000);
}

const LASER_FRAMES = [
    'img/Projectile/Laser/skeleton-animation_0.png',
    'img/Projectile/Laser/skeleton-animation_1.png',
    'img/Projectile/Laser/skeleton-animation_2.png',
    'img/Projectile/Laser/skeleton-animation_3.png',
    'img/Projectile/Laser/skeleton-animation_4.png',
];
let laserFrame = 0;
let laserInterval;

window.setupStartScreenButtons = setupStartScreenButtons;


