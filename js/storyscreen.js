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

window.addEventListener('DOMContentLoaded', () => {
    const storyBtn = Array.from(document.getElementsByClassName('start-screen-btn'))
        .find(btn => btn.textContent.trim().toLowerCase() === 'story');
    if (storyBtn) {
        storyBtn.replaceWith(storyBtn.cloneNode(true));
        const newStoryBtn = Array.from(document.getElementsByClassName('start-screen-btn'))
            .find(btn => btn.textContent.trim().toLowerCase() === 'story');
        if (newStoryBtn) newStoryBtn.addEventListener('click', showStoryScreen);
    }
    const backBtn = document.getElementById('story-back-btn');
    if (backBtn) {
        backBtn.addEventListener('click', hideStoryScreen);
    }
});
