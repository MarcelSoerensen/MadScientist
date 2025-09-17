/**
 * Fades out the start screen and shows the story screen.
 */
function showStoryScreen() {
    const startScreen = document.getElementById('start_screen');
    const storyScreen = document.getElementById('story_screen');
    animateLaser('story', () => {
        const laserImg = document.querySelector('.start-screen-laser img');
        if (laserImg) laserImg.style.display = 'none';
        if (typeof window.fadeOutStartScreen === 'function') {
            window.fadeOutStartScreen();
        }
    });
}

/**
 * Fades out the story screen and shows the start screen again.
 */
function hideStoryScreen() {
    const storyScreen = document.getElementById('story_screen');
    const startScreen = document.getElementById('start_screen');
    startScreen.style.display = 'flex';
    startScreen.classList.add('crossfade-in');
    storyScreen.classList.add('crossfade-out');
    setTimeout(() => {
        storyScreen.style.display = 'none';
        storyScreen.classList.remove('crossfade-out');
        startScreen.classList.remove('crossfade-in');
    }, 800);
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
 * Sets up the 'Story' button by reattaching the click event for showing the story screen.
 */
function setupStoryButton() {
    const storyBtn = getStoryButton();
    if (storyBtn) {
        storyBtn.replaceWith(storyBtn.cloneNode(true));
        const newStoryBtn = getStoryButton();
        if (newStoryBtn) newStoryBtn.addEventListener('click', showStoryScreen);
    }
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
    setupStoryButton();
    setupRepeatButton();
});
