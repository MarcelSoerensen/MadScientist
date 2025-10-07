/**
 * Shows and fades in the countdown overlay, then triggers the transition.
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
            window.transitionFromStartScreenToCanvas(document.getElementById('start_screen'), canvas);
        }
        fadeOutOverlay(overlay, callback);
    });
}

/**
 * Shows the countdown overlay and starts the countdown animation.
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
 * Handles fade-out of the start screen and runs the countdown.
 */
function handleCountdownFadeOut(overlay, numberSpan, callback) {
    const startScreen = document.getElementById('start_screen');
    setTimeout(() => {
        if (!startScreen) return;
        startScreen.classList.remove('d-none', 'fade-out');
        startScreen.style.opacity = '';
        void startScreen.offsetWidth;
        startScreen.classList.add('fade-out');
        setTimeout(() => {
            startScreen.classList.add('d-none');
            startScreen.classList.remove('fade-out');
            startScreen.style.opacity = '';
        }, 2000);
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
 * Animates the countdown number visually and plays sound.
 */
function animateCountdownNumber(numberSpan, count) {
    numberSpan.textContent = count;
    numberSpan.style.transition = 'none';
    numberSpan.style.opacity = 0;
    numberSpan.style.transform = 'scale(1)';
    void numberSpan.offsetWidth;
    numberSpan.style.transition = '';
    try {
        SoundCacheManager.getAudio('sounds/counter.mp3').play();
    } catch (e) {}
    setTimeout(() => { numberSpan.style.opacity = 1; numberSpan.style.transform = 'scale(1)'; }, 10);
    setTimeout(() => numberSpan.style.transform = 'scale(2)', 200);
    setTimeout(() => numberSpan.style.opacity = 0, 900);
}

/**
 * Hides the countdown overlay and calls the callback.
 */
function hideCountdownOverlay(overlay, callback) {
    overlay.classList.add('d-none');
    if (callback) callback();
}

/**
 * Fades out the overlay with animation and calls the callback.
 */
function fadeOutOverlay(overlay, callback) {
    overlay.classList.add('fade-out');
    setTimeout(() => {
        overlay.classList.remove('fade-out');
        overlay.classList.add('d-none');
        if (callback) callback();
    }, 700);
}
