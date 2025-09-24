/**
 * Fades out the start screen and shows the control screen.
 */
function showControlScreen() {
    const startScreen = document.getElementById('start_screen');
    const controlScreen = document.getElementById('control_screen');
    const storyScreen = document.getElementById('story_screen');
    if (storyScreen) storyScreen.classList.add('d-none');
    if (!startScreen || !controlScreen) return;
        prepareControlScreenTransition(startScreen, controlScreen);
        handleControlScreenTransition(startScreen, controlScreen);
}

/**
 * Prepares the transition classes and styles for showing the control screen and hiding the start screen.
 */
function prepareControlScreenTransition(startScreen, controlScreen) {
    controlScreen.classList.remove('fade-in', 'fade-out', 'pre-fade');
    startScreen.classList.remove('d-none', 'fade-in', 'fade-out', 'pre-fade');
    controlScreen.classList.add('pre-fade');
    startScreen.style.display = controlScreen.style.display = 'flex';
    void controlScreen.offsetWidth;
    controlScreen.classList.remove('pre-fade');
    startScreen.classList.add('fade-out');
}

/**
 * Handles the two-phase transition from start screen to control screen (fade out, then fade in).
 */
function handleControlScreenTransition(startScreen, controlScreen) {
    let phase = 0;
    const handler = event => {
        if (event.propertyName !== 'filter') return;
        if (!phase++) {
            startScreen.removeEventListener('transitionend', handler);
            startScreen.classList.add('d-none');
            startScreen.classList.remove('fade-out');
            controlScreen.classList.remove('d-none');
            controlScreen.classList.add('fade-in');
            controlScreen.addEventListener('transitionend', handler);
        } else {
            controlScreen.classList.remove('fade-in');
            controlScreen.removeEventListener('transitionend', handler);
        }
    };
    startScreen.addEventListener('transitionend', handler);
}

window.showControlScreen = showControlScreen;

/**
 * Handles the fade transition classes for both start and control screens (backwards).
 */
function controlToStartFade(startScreen, controlScreen) {
    startScreen.classList.remove('d-none', 'fade-in', 'fade-out', 'pre-fade');
    controlScreen.classList.remove('fade-in', 'fade-out', 'pre-fade');
    startScreen.classList.add('pre-fade');
    startScreen.style.display = 'flex';
    controlScreen.style.display = 'flex';
    void startScreen.offsetWidth;
    startScreen.classList.remove('pre-fade');
    controlScreen.classList.add('fade-out');
    startScreen.classList.add('fade-in');
}

/**
 * Handles the two-phase transition from control screen back to start screen (fade out, then fade in).
 */
function controlToStartFadeOut(controlScreen) {
    function handler(event) {
        if (event.propertyName === 'filter') {
            controlScreen.classList.add('d-none');
            controlScreen.classList.remove('fade-out');
            controlScreen.style.display = '';
            controlScreen.removeEventListener('transitionend', handler);
        }
    }
    controlScreen.addEventListener('transitionend', handler);
}

/**
 * Handles the fade-in transition for the start screen (backwards from control screen).
 */
function controlToStartFadeIn(startScreen) {
    function handler(event) {
        if (event.propertyName === 'filter') {
            startScreen.classList.remove('fade-in');
            startScreen.style.display = '';
            startScreen.removeEventListener('transitionend', handler);
            if (typeof window.setupStartScreenButtons === 'function') window.setupStartScreenButtons();
        }
    }
    startScreen.addEventListener('transitionend', handler);
}

/**
 * Sets up the back button on the control screen to transition back to the start screen.
 */
function setupControlScreenBackButton() {
    const backBtn = document.querySelector('#control_screen .control-screen-btn');
    if (!backBtn) return;
    backBtn.addEventListener('mousedown', function() {
        const startScreen = document.getElementById('start_screen');
        const controlScreen = document.getElementById('control_screen');
        if (!startScreen || !controlScreen) return;
        controlToStartFade(startScreen, controlScreen);
        controlToStartFadeIn(startScreen);
        controlToStartFadeOut(controlScreen);
    });
}

document.addEventListener('DOMContentLoaded', setupControlScreenBackButton);
