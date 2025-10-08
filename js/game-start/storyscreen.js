/**
 * Fades out the start screen and shows the story screen.
 */
function showStoryScreen() {
    window.addEventListener('resize', () => checkBodyTitleSpace());
    setBodyTitleVisible(true);
    checkBodyTitleSpace();
    const startScreen = document.getElementById('start_screen');
    const storyScreen = document.getElementById('story_screen');
    const controlScreen = document.getElementById('control_screen');
    if (controlScreen) controlScreen.classList.add('d-none');
    if (!startScreen || !storyScreen) return;
    const storyText = document.querySelector('#story_textbox p');
    if (storyText) resetAndStartStoryTextAnimation(storyText);

    window.prepareAndTransitionToScreen(startScreen, storyScreen);
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
 * Returns the 'Back' button element from the story screen.
 */
function getButton(className, text) {
    return Array.from(document.getElementsByClassName(className))
        .find(btn => btn.textContent.trim().toLowerCase() === text.toLowerCase());
}

/**
 * Replaces the 'Back' button and registers the event handler.
 */
function setupBackButton() {
    const oldBackBtn = getButton('story-screen-btn', 'back');
    if (oldBackBtn) {
        const newBackBtn = oldBackBtn.cloneNode(true);
        oldBackBtn.replaceWith(newBackBtn);
        newBackBtn.addEventListener('click', function() {
            const storyScreen = document.getElementById('story_screen');
            if (storyScreen) window.transitionToStartScreen(storyScreen);
                setBodyTitleVisible(false);

        });
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
const storyScrollState = { el: null, from: 0, to: 0, duration: 0, start: 0, onDone: null };
function animateStoryTextDown(storyText, fromPercent, toPercent, duration, onDone) {
    if (!storyText) return;
    storyText.style.animation = 'none';
    storyScrollState.el = storyText;
    storyScrollState.from = fromPercent;
    storyScrollState.to = toPercent;
    storyScrollState.duration = duration;
    storyScrollState.start = performance.now();
    storyScrollState.onDone = typeof onDone === 'function' ? onDone : null;
    requestAnimationFrame(animateStoryTextDownFrame);
}

/**
 *  Animation frame handler for animating the story text down.
 */
function animateStoryTextDownFrame(ts) {
    const s = storyScrollState;
    if (!s.el) return;
    const progress = Math.min((ts - s.start) / s.duration, 1);
    const newPercent = s.from + (s.to - s.from) * progress;
    s.el.style.transform = `translateY(${newPercent}%)`;
    if (progress < 1) {
        requestAnimationFrame(animateStoryTextDownFrame);
    } else {
        const cb = s.onDone;
        s.el = null;
        if (cb) cb();
    }
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

/**
 * Exposes the showStoryScreen function globally so it can be called from other scripts or HTML.
 */
window.showStoryScreen = showStoryScreen;
