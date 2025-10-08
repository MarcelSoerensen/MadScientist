/**
 * Fades out the start screen and shows the control screen.
 */
function showControlScreen() {
    window.addEventListener('resize', () => checkBodyTitleSpace());
    setBodyTitleVisible(true);
    checkBodyTitleSpace();
    const startScreen = document.getElementById('start_screen');
    const controlScreen = document.getElementById('control_screen');
    const storyScreen = document.getElementById('story_screen');
    if (storyScreen) storyScreen.classList.add('d-none');
    if (!startScreen || !controlScreen) return;
        prepareControlScreenTransition(startScreen, controlScreen);
            window.handleScreenTransition(startScreen, controlScreen);
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
 * Sets up the back button on the control screen to transition back to the start screen.
 */
function setupControlScreenBackButton() {
    const backBtn = document.querySelector('#control_screen .control-screen-btn');
    if (!backBtn) return;
    backBtn.addEventListener('mousedown', function() {
        const controlScreen = document.getElementById('control_screen');
        if (!controlScreen) return;
        window.transitionToStartScreen(controlScreen);
            setBodyTitleVisible(false);

    });
}

/**
 * Initializes the event listener for the control screen back button as soon as the DOM is fully loaded.
 */
document.addEventListener('DOMContentLoaded', setupControlScreenBackButton);

/**
 * Exposes the showControlScreen function globally so it can be called from other scripts or HTML.
 */
window.showControlScreen = showControlScreen;