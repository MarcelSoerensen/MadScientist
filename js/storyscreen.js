/**
 * Returns the 'Back' button element from the story screen.
 */
function getBackButton() {
    return Array.from(document.getElementsByClassName('story-screen-btn'))
        .find(btn => btn.textContent.trim().toLowerCase() === 'back');
}

/**
 * Sets up the 'Back' button to fade back to the start screen on click.
 */
function setupBackButton() {
    const backBtn = getBackButton();
    if (backBtn) {
        backBtn.replaceWith(backBtn.cloneNode(true));
        const newBackBtn = getBackButton();
        if (newBackBtn) newBackBtn.addEventListener('click', fadeToStartScreen);
    }
}
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
    storyScreen.classList.remove('fade-in', 'fade-out', 'pre-fade');
    startScreen.classList.remove('d-none', 'fade-in', 'fade-out', 'pre-fade');
    storyScreen.classList.add('pre-fade');
    startScreen.style.display = storyScreen.style.display = 'flex';
    void storyScreen.offsetWidth;
    storyScreen.classList.remove('pre-fade');
    startScreen.classList.add('fade-out');
    startScreen.addEventListener('transitionend', function handler(e) {
        if (e.propertyName === 'filter') {
            startScreen.removeEventListener('transitionend', handler);
            startScreen.classList.add('d-none');
            startScreen.classList.remove('fade-out');
            storyScreen.classList.remove('d-none');
            storyScreen.classList.add('fade-in');
        }
    });
    storyScreen.addEventListener('transitionend', function handler(e) {
        if (e.propertyName === 'filter') {
            storyScreen.classList.remove('fade-in');
            storyScreen.removeEventListener('transitionend', handler);
        }
    });
}

window.showStoryScreen = showStoryScreen;

/**
 * Fades from story screen back to start screen, using the same fade classes as the forward transition.
 */
function fadeToStartScreen() {
    const storyBtn = getStoryButton();
    if (storyBtn) storyBtn.disabled = true;
    const startScreen = document.getElementById('start_screen');
    const storyScreen = document.getElementById('story_screen');
    if (!startScreen || !storyScreen) return;
    const storyText = document.querySelector('#story_textbox p');
    if (storyText) {
        const currentPercent = getCurrentStoryTextPercent(storyText);
        storyText.style.animation = 'none';
        storyText.style.transform = `translateY(${currentPercent}%)`;
    }
    startScreen.classList.remove('d-none', 'fade-in', 'fade-out', 'pre-fade');
    storyScreen.classList.remove('d-none', 'fade-in', 'fade-out', 'pre-fade');
    startScreen.style.display = 'flex';
    storyScreen.style.display = 'flex';
    void storyScreen.offsetWidth;
    startScreen.classList.add('fade-in');
    storyScreen.classList.add('fade-out');
    function onStartFadeInEnd(e) {
        if (e.propertyName === 'filter') {
            startScreen.classList.remove('fade-in');
            startScreen.style.display = '';
            startScreen.removeEventListener('transitionend', onStartFadeInEnd);
            if (typeof window.setupStartScreenButtons === 'function') window.setupStartScreenButtons();
        }
    }
    function onStoryFadeOutEnd(e) {
        if (e.propertyName === 'filter') {
            storyScreen.classList.add('d-none');
            storyScreen.classList.remove('fade-out');
            storyScreen.style.display = '';
            if (storyBtn) storyBtn.disabled = false;
            storyScreen.removeEventListener('transitionend', onStoryFadeOutEnd);
        }
    }
    startScreen.addEventListener('transitionend', onStartFadeInEnd);
    storyScreen.addEventListener('transitionend', onStoryFadeOutEnd);
}

/**
 * Returns the 'Story' button element from the start screen.
 */
function getStoryButton() {
    return Array.from(document.getElementsByClassName('start-screen-btn'))
        .find(btn => btn.textContent.trim().toLowerCase() === 'story');
}
/**
 * Returns the 'Repeat' button element from the story screen.
 */
function getRepeatButton() {
    return Array.from(document.getElementsByClassName('story-screen-btn'))
        .find(btn => btn.textContent.trim().toLowerCase() === 'repeat');
}

/**
 * Sets up the 'Repeat' button to animate the story text down and restart the scroll animation on click.
 */
function setupRepeatButton() {
    const repeatBtn = getRepeatButton();
    if (repeatBtn) {
        repeatBtn.addEventListener('click', () => {
            const storyText = document.querySelector('#story_textbox p');
            if (storyText) {
                const currentPercent = getCurrentStoryTextPercent(storyText);
                const targetPercent = 30;
                if (currentPercent >= targetPercent - 1) {
                    resetAndStartStoryTextAnimation(storyText);
                    return;
                }
                animateStoryTextDown(storyText, currentPercent, targetPercent, 400, () => {
                    resetAndStartStoryTextAnimation(storyText);
                });
            }
        });
    }
}

/**
 * Calculates the current translateY percentage of the story text for animation purposes.
 */
function getCurrentStoryTextPercent(storyText) {
    let currentPercent = -100;
    const match = storyText.style.transform.match(/translateY\((-?\d+(?:\.\d+)?)%\)/);
    if (match) {
        currentPercent = parseFloat(match[1]);
    } else {
        const style = window.getComputedStyle(storyText);
        const anim = style.animationName;
        if (anim === 'story-scroll-up') {
            const duration = 60000;
            const elapsed = (performance.now() - (storyText._storyAnimStart || 0));
            currentPercent = 30 - 130 * (elapsed / duration);
            if (currentPercent < -100) currentPercent = -100;
            if (currentPercent > 30) currentPercent = 30;
        } else if (anim === 'story-scroll-down-reverse') {
            currentPercent = 30;
        }
    }
    return currentPercent;
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
 * Initializes the story screen buttons when the DOM is loaded.
 */
window.addEventListener('DOMContentLoaded', () => {
    setupRepeatButton();
    setupBackButton();
});
