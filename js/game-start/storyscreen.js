/**
 * Fades out the start screen and shows the story screen.
 */
function showStoryScreen() {
    const startScreen = document.getElementById('start_screen');
    const storyScreen = document.getElementById('story_screen');
    const controlScreen = document.getElementById('control_screen');
    if (controlScreen) controlScreen.classList.add('d-none');
    if (!startScreen || !storyScreen) return;
    const storyText = document.querySelector('#story_textbox p');
    if (storyText) resetAndStartStoryTextAnimation(storyText);

    prepareStoryScreenTransition(startScreen, storyScreen);
    handleStoryScreenTransition(startScreen, storyScreen);
}

/**
 * Prepares the transition classes and styles for showing the story screen and hiding the start screen.
 */
function prepareStoryScreenTransition(startScreen, storyScreen) {
    storyScreen.classList.remove('fade-in', 'fade-out', 'pre-fade');
    startScreen.classList.remove('d-none', 'fade-in', 'fade-out', 'pre-fade');
    storyScreen.classList.add('pre-fade');
    startScreen.style.display = storyScreen.style.display = 'flex';
    void storyScreen.offsetWidth;
    storyScreen.classList.remove('pre-fade');
    startScreen.classList.add('fade-out');
}

/**
 * Handles the two-phase transition from start screen to story screen (fade out, then fade in).
 */
function handleStoryScreenTransition(startScreen, storyScreen) {
    let phase = 0;
    const handler = event => {
        if (event.propertyName !== 'filter') return;
        if (!phase++) {
            startScreen.removeEventListener('transitionend', handler);
            startScreen.classList.add('d-none');
            startScreen.classList.remove('fade-out');
            storyScreen.classList.remove('d-none');
            storyScreen.classList.add('fade-in');
            storyScreen.addEventListener('transitionend', handler);
        } else {
            storyScreen.classList.remove('fade-in');
            storyScreen.removeEventListener('transitionend', handler);
        }
    };
    startScreen.addEventListener('transitionend', handler);
}

window.showStoryScreen = showStoryScreen;

/**
 * Handles the transition from the story screen back to the start screen.
 */
function storyToStartScreen() {
    const storyBtn = getStoryButton();
    if (storyBtn) storyBtn.disabled = true;
    const startScreen = document.getElementById('start_screen');
    const storyScreen = document.getElementById('story_screen');
    if (!startScreen || !storyScreen) return;
    storyToStartFreeze();
    storyToStartFade(startScreen, storyScreen);
    storyToStartFadeIn(startScreen);
    storyToStartFadeOut(storyScreen, storyBtn);
}

/**
 * Freezes the current story text animation and stores its position.
 */
function storyToStartFreeze() {
    const storyText = document.querySelector('#story_textbox p');
    if (storyText) {
        const currentPercent = getCurrentStoryTextPercent(storyText);
        storyText.style.animation = 'none';
        storyText.style.transform = `translateY(${currentPercent}%)`;
    }
}

/**
 * Handles the fade transition classes for both start and story screens.
 */
function storyToStartFade(startScreen, storyScreen) {
    startScreen.classList.remove('d-none', 'fade-in', 'fade-out', 'pre-fade');
    storyScreen.classList.remove('d-none', 'fade-in', 'fade-out', 'pre-fade');
    startScreen.style.display = 'flex';
    storyScreen.style.display = 'flex';
    void storyScreen.offsetWidth;
    startScreen.classList.add('fade-in');
    storyScreen.classList.add('fade-out');
}


/**
 * Handles the fade-in transition for the start screen.
 */
function storyToStartFadeIn(startScreen) {
    function handler(e) {
        if (e.propertyName === 'filter') {
            startScreen.classList.remove('fade-in');
            startScreen.style.display = '';
            startScreen.removeEventListener('transitionend', handler);
            if (typeof window.setupStartScreenButtons === 'function') window.setupStartScreenButtons();
        }
    }
    startScreen.addEventListener('transitionend', handler);
}

/**
 * Handles the fade-out transition for the story screen.
 */
function storyToStartFadeOut(storyScreen, storyBtn) {
    function handler(e) {
        if (e.propertyName === 'filter') {
            storyScreen.classList.add('d-none');
            storyScreen.classList.remove('fade-out');
            storyScreen.style.display = '';
            if (storyBtn) storyBtn.disabled = false;
            storyScreen.removeEventListener('transitionend', handler);
        }
    }
    storyScreen.addEventListener('transitionend', handler);
}

/**
 * Returns the 'Back' button element from the story screen.
 */
function getButton(className, text) {
    return Array.from(document.getElementsByClassName(className))
        .find(btn => btn.textContent.trim().toLowerCase() === text.toLowerCase());
}

/**
 * Returns the 'Story' button element from the start screen.
 */
function getStoryButton() {
    return getButton('start-screen-btn', 'story');
}

/**
 * Replaces the 'Back' button and registers the event handler.
 */
function setupBackButton() {
    const oldBackBtn = getButton('story-screen-btn', 'back');
    if (oldBackBtn) {
        const newBackBtn = oldBackBtn.cloneNode(true);
        oldBackBtn.replaceWith(newBackBtn);
        newBackBtn.addEventListener('click', storyToStartScreen);
    }
}

/**
 * Sets up the 'Repeat' button to animate the story text down and restart the scroll animation on click.
 */
function setupRepeatButton() {
    const btn = Array.from(document.getElementsByClassName('story-screen-btn'))
        .find(btn => btn.textContent.trim().toLowerCase() === 'repeat');
    if (!btn) return;
    btn.addEventListener('click', () => {
        const storyText = document.querySelector('#story_textbox p');
        if (!storyText) return;
        const percent = getCurrentStoryTextPercent(storyText);
        if (percent >= 29) return resetAndStartStoryTextAnimation(storyText);
        animateStoryTextDown(storyText, percent, 30, 400, () => resetAndStartStoryTextAnimation(storyText));
    });
}

/**
 * Calculates the current translateY percentage of the story text for animation purposes.
 */
function getCurrentStoryTextPercent(storyText) {
    const match = storyText.style.transform.match(/translateY\((-?\d+(?:\.\d+)?)%\)/);
    if (match) return parseFloat(match[1]);
    const anim = window.getComputedStyle(storyText).animationName;
    if (anim === 'story-scroll-up') {
        const duration = 60000;
        const elapsed = performance.now() - (storyText._storyAnimStart || 0);
        return Math.max(-100, Math.min(30 - 130 * (elapsed / duration), 30));
    }
    if (anim === 'story-scroll-down-reverse') return 30;
    return -100;
}

/**
 * Animates the story text smoothly from its current Y position down to the start position.
 */
function animateStoryTextDown(storyText, fromPercent, toPercent, duration, onDone) {
    let start = null;
    function animateDown(ts) {
        if (!start) start = ts;
        const elapsed = ts - start;
        const progress = Math.min(elapsed / duration, 1);
        const newPercent = fromPercent + (toPercent - fromPercent) * progress;
        storyText.style.transform = `translateY(${newPercent}%)`;
        if (progress < 1) {
            requestAnimationFrame(animateDown);
        } else {
            if (typeof onDone === 'function') onDone();
        }
    }
    storyText.style.animation = 'none';
    requestAnimationFrame(animateDown);
}

/**
 * Resets and restarts the story text scroll animation from the beginning.
 */
function resetAndStartStoryTextAnimation(storyText) {
    storyText.style.animation = 'none';
    storyText.style.transform = '';
    void storyText.offsetWidth;
    storyText.style.animation = '';
    storyText._storyAnimStart = performance.now();
}

/**
 * Replaces a button (by class and text) and registers a click handler.
 */
function replaceButtonWithHandler(className, text, handler) {
    const oldBtn = Array.from(document.getElementsByClassName(className))
        .find(btn => btn.textContent.trim().toLowerCase() === text.toLowerCase());
    if (oldBtn) {
        const newBtn = oldBtn.cloneNode(true);
        oldBtn.replaceWith(newBtn);
        newBtn.addEventListener('click', handler);
    }
}

/**
 * Initializes the story screen buttons when the DOM is loaded.
 */
window.addEventListener('DOMContentLoaded', () => {
    setupRepeatButton();
    setupBackButton();
});
