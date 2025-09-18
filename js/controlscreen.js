function showControlScreen() {
    const startScreen = document.getElementById('start_screen');
    const controlScreen = document.getElementById('control_screen');
    const storyScreen = document.getElementById('story_screen');
    if (storyScreen) storyScreen.classList.add('d-none');
    if (!startScreen || !controlScreen) return;
    controlScreen.classList.remove('fade-in', 'fade-out', 'pre-fade');
    startScreen.classList.remove('d-none', 'fade-in', 'fade-out', 'pre-fade');
    controlScreen.classList.add('pre-fade');
    startScreen.style.display = controlScreen.style.display = 'flex';
    void controlScreen.offsetWidth;
    controlScreen.classList.remove('pre-fade');
    startScreen.classList.add('fade-out');
    startScreen.addEventListener('transitionend', function handler(e) {
        if (e.propertyName === 'filter') {
            startScreen.removeEventListener('transitionend', handler);
            startScreen.classList.add('d-none');
            startScreen.classList.remove('fade-out');
            controlScreen.classList.remove('d-none');
            controlScreen.classList.add('fade-in');
        }
    });
    controlScreen.addEventListener('transitionend', function handler(e) {
        if (e.propertyName === 'filter') {
            controlScreen.classList.remove('fade-in');
            controlScreen.removeEventListener('transitionend', handler);
        }
    });
}

window.showControlScreen = showControlScreen;

document.addEventListener('DOMContentLoaded', function() {
    const backBtn = document.querySelector('#control_screen .control-screen-btn');
    if (backBtn) {
        backBtn.addEventListener('mousedown', function() {
            const startScreen = document.getElementById('start_screen');
            const controlScreen = document.getElementById('control_screen');
            if (!startScreen || !controlScreen) return;
            startScreen.classList.remove('d-none', 'fade-in', 'fade-out', 'pre-fade');
            controlScreen.classList.remove('fade-in', 'fade-out', 'pre-fade');
            startScreen.classList.add('pre-fade');
            startScreen.style.display = 'flex';
            controlScreen.style.display = 'flex';
            void startScreen.offsetWidth;
            startScreen.classList.remove('pre-fade');
            controlScreen.classList.add('fade-out');
            startScreen.classList.add('fade-in');
            function onControlFadeOutEnd(e) {
                if (e.propertyName === 'filter') {
                    controlScreen.classList.add('d-none');
                    controlScreen.classList.remove('fade-out');
                    controlScreen.style.display = '';
                    controlScreen.removeEventListener('transitionend', onControlFadeOutEnd);
                }
            }
            function onStartFadeInEnd(e) {
                if (e.propertyName === 'filter') {
                    startScreen.classList.remove('fade-in');
                    startScreen.style.display = '';
                    startScreen.removeEventListener('transitionend', onStartFadeInEnd);
                    if (typeof window.setupStartScreenButtons === 'function') window.setupStartScreenButtons();
                }
            }
            controlScreen.addEventListener('transitionend', onControlFadeOutEnd);
            startScreen.addEventListener('transitionend', onStartFadeInEnd);
        });
    }
});
