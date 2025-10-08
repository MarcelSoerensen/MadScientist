/**
 * Prepares both screens for transition and runs the central transition logic.
 */
function prepareAndTransitionToScreen(fromScreen, toScreen) {
    toScreen.classList.remove('fade-in', 'fade-out', 'pre-fade');
    fromScreen.classList.remove('d-none', 'fade-in', 'fade-out', 'pre-fade');
    toScreen.classList.add('pre-fade');
    fromScreen.style.display = toScreen.style.display = 'flex';
    void toScreen.offsetWidth;
    toScreen.classList.remove('pre-fade');
    fromScreen.classList.add('fade-out');
    window.handleScreenTransition(fromScreen, toScreen);
}

window.prepareAndTransitionToScreen = prepareAndTransitionToScreen;

/**
 * Handles a fade transition from one screen to another.
 */
function handleScreenTransition(fromScreen, toScreen) {
    fromScreen.addEventListener('transitionend', function handler1(event) {
        if (event.propertyName !== 'filter') return;
        fromScreen.removeEventListener('transitionend', handler1);
        fromScreen.classList.add('d-none');
        fromScreen.classList.remove('fade-out');
        toScreen.classList.remove('d-none');
        toScreen.classList.add('fade-in');
        toScreen.addEventListener('transitionend', function handler2(event) {
            if (event.propertyName !== 'filter') return;
            toScreen.classList.remove('fade-in');
            toScreen.removeEventListener('transitionend', handler2);
        });
    });
}

window.handleScreenTransition = handleScreenTransition;

/**
 * Transitions from the start screen to the canvas.
 */
function transitionFromStartScreenToCanvas(startScreen, canvas) {
    window.addEventListener('resize', checkBodyTitleSpace);
    setBodyTitleVisible(true);
    checkBodyTitleSpace();
    if (!startScreen || !canvas) return;
    startScreen.style.filter = 'brightness(0)';
    window.prepareAndTransitionToScreen(startScreen, canvas);
    canvas.addEventListener('transitionend', function handler(event) {
        if (event.propertyName === 'filter') {
            if (typeof window.showSystemButtons === 'function') window.showSystemButtons();
            startScreen.style.filter = '';
            canvas.classList.remove('fade-in');
            canvas.removeEventListener('transitionend', handler);
            if (typeof window.enableInput === 'function') window.enableInput();
        }
    });
}

window.transitionFromStartScreenToCanvas = transitionFromStartScreenToCanvas;

/**
 * Transitions from the canvas (game view) to a target overlay screen.
 */
function transitionFromCanvasToScreen(canvas, targetScreen) {
    if (!canvas || !targetScreen) return;
    initCanvasToScreenState(canvas, targetScreen);
    void targetScreen.offsetWidth;
    targetScreen.classList.remove('pre-fade');
    targetScreen.classList.add('fade-in');
    canvas.style.filter = 'brightness(0)';
    canvas.style.pointerEvents = 'none';    
    canvas.addEventListener('transitionend', handleCanvasFadeOut);
    targetScreen.addEventListener('transitionend', handleTargetScreenFadeIn);
    if (typeof window.disableInput === 'function') window.disableInput();
}

window.transitionFromCanvasToScreen = transitionFromCanvasToScreen;

/**
 * Initialises DOM state and classes for a canvas -> screen transition (no reflow yet).
 */
function initCanvasToScreenState(canvas, targetScreen) {
    targetScreen.classList.remove('fade-in', 'fade-out', 'pre-fade');
    canvas.classList.remove('canvas-visible');
    targetScreen.style.display = 'flex';
    targetScreen.classList.remove('d-none');
    targetScreen.classList.add('pre-fade');
    canvas.classList.add('fade-out');
    if (typeof window.hideSystemButtons === 'function') {
        window.hideSystemButtons();
    } else {
        const controls = document.querySelector('.system-controls-container');
        if (controls) controls.classList.add('d-none');
    }
}

window.initCanvasToScreenState = initCanvasToScreenState;

/**
 * Handles the fade-out of the canvas (game view) once the filter transition ends.
 */
function handleCanvasFadeOut(event) {
    if (event.propertyName !== 'filter') return;
    const canvas = event.currentTarget;
    canvas.removeEventListener('transitionend', handleCanvasFadeOut);
    canvas.classList.remove('fade-out');
    canvas.classList.remove('canvas-visible');
}

window.handleCanvasFadeOut = handleCanvasFadeOut;

/**
 * Handles the fade-in completion of a target overlay screen.
 */
function handleTargetScreenFadeIn(event) {
    if (event.propertyName !== 'filter') return;
    const screen = event.currentTarget;
    screen.removeEventListener('transitionend', handleTargetScreenFadeIn);
    screen.classList.remove('fade-in');
    screen.classList.remove('d-none');
    screen.style.display = '';
    if (screen.id === 'start_screen' && typeof window.setupStartScreenButtons === 'function') {
        window.setupStartScreenButtons();
    }
    if (screen.id === 'canvas' && typeof window.showSystemButtons === 'function') {
        window.showSystemButtons();
        if (typeof window.enableInput === 'function') window.enableInput();
    }
}
window.handleTargetScreenFadeIn = handleTargetScreenFadeIn;

/** 
 * Transitions from any screen back to the start screen.
 */
function transitionToStartScreen(fromScreen) {
    const startScreen = document.getElementById('start_screen');
    if (!startScreen || !fromScreen) return;
    startScreen.classList.remove('d-none', 'fade-in', 'fade-out', 'pre-fade');
    fromScreen.classList.remove('fade-in', 'fade-out', 'pre-fade');
    startScreen.classList.add('pre-fade');
    startScreen.style.display = 'flex';
    fromScreen.style.display = 'flex';
    void startScreen.offsetWidth;
    startScreen.classList.remove('pre-fade');
    fromScreen.classList.add('fade-out');
    startScreen.classList.add('fade-in');
    fromScreen.addEventListener('transitionend', handlePreviousScreenFadeOut);
    startScreen.addEventListener('transitionend', handleStartScreenFadeIn);
}

window.transitionToStartScreen = transitionToStartScreen;

/**
 * Handles the fade-out completion of the previous screen.
 */
function handlePreviousScreenFadeOut(event) {
    if (event.propertyName !== 'filter') return;
    const el = event.currentTarget;
    el.removeEventListener('transitionend', handlePreviousScreenFadeOut);
    el.classList.add('d-none');
    el.classList.remove('fade-out');
    el.style.display = '';
}

window.handlePreviousScreenFadeOut = handlePreviousScreenFadeOut;

/**
 * Handles the fade-in completion of the start screen.
 */
function handleStartScreenFadeIn(event) {
    if (event.propertyName !== 'filter') return;
    const el = event.currentTarget;
    el.removeEventListener('transitionend', handleStartScreenFadeIn);
    el.classList.remove('fade-in', 'd-none');
    el.style.display = '';
    if (typeof window.setupStartScreenButtons === 'function') {
        window.setupStartScreenButtons();
    }
}

window.handleStartScreenFadeIn = handleStartScreenFadeIn;
