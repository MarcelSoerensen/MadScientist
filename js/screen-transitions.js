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

function transitionFromStartScreenToCanvas(startScreen, canvas) {
    if (!startScreen || !canvas) return;
    startScreen.style.filter = 'brightness(0)';
    window.prepareAndTransitionToScreen(startScreen, canvas);
    canvas.addEventListener('transitionend', function handler(event) {
        if (event.propertyName === 'filter') {
            if (typeof window.showSystemButtons === 'function') window.showSystemButtons();
            startScreen.style.filter = '';
            canvas.classList.remove('fade-in');
            canvas.removeEventListener('transitionend', handler);
        }
    });
}


window.transitionFromStartScreenToCanvas = transitionFromStartScreenToCanvas;


function transitionFromCanvasToScreen(canvas, targetScreen) {
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
    void targetScreen.offsetWidth;
    targetScreen.classList.remove('pre-fade');
    targetScreen.classList.add('fade-in');
    canvas.style.filter = 'brightness(0)';
    canvas.style.pointerEvents = 'none';
    canvas.addEventListener('transitionend', function handler(event) {
        if (event.propertyName === 'filter') {
            canvas.classList.remove('fade-out');
            canvas.classList.remove('canvas-visible');
            canvas.removeEventListener('transitionend', handler);
        }
    });
    targetScreen.addEventListener('transitionend', function handler(event) {
        if (event.propertyName === 'filter') {
            targetScreen.classList.remove('fade-in');
            targetScreen.classList.remove('d-none');
            targetScreen.style.display = '';
            targetScreen.removeEventListener('transitionend', handler);
            if (targetScreen.id === 'start_screen' && typeof window.setupStartScreenButtons === 'function') {
                window.setupStartScreenButtons();
            }
            if (targetScreen.id === 'canvas' && typeof window.showSystemButtons === 'function') {
                window.showSystemButtons();
            }
        }
    });
}

window.transitionFromCanvasToScreen = transitionFromCanvasToScreen;

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
    fromScreen.addEventListener('transitionend', function handler(event) {
        if (event.propertyName === 'filter') {
            fromScreen.classList.add('d-none');
            fromScreen.classList.remove('fade-out');
            fromScreen.style.display = '';
            fromScreen.removeEventListener('transitionend', handler);
        }
    });
    startScreen.addEventListener('transitionend', function handler(event) {
        if (event.propertyName === 'filter') {
            startScreen.classList.remove('fade-in');
            startScreen.classList.remove('d-none');
            startScreen.style.display = '';
            startScreen.removeEventListener('transitionend', handler);
            if (typeof window.setupStartScreenButtons === 'function') window.setupStartScreenButtons();
        }
    });
}
window.transitionToStartScreen = transitionToStartScreen;
