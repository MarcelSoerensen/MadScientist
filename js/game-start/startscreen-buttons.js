/**
 * Sets up the start screen button event listeners.
 */
function setupStartScreenButtons() {
    const buttons = Array.from(document.querySelectorAll('.start-screen-btn-group button'));
    buttons.forEach(btn => {
        const clone = btn.cloneNode(true);
        btn.replaceWith(clone);
        clone.disabled = false;
    });
    const freshButtons = Array.from(document.querySelectorAll('.start-screen-btn-group button'));
    const [storyBtn, controlsBtn, playBtn] = freshButtons;
    setupPlayButton(playBtn, storyBtn, controlsBtn);
    setupStoryButton(storyBtn, playBtn, controlsBtn);
    setupControlsButton(controlsBtn, playBtn, storyBtn);
}

/**
 * Disables all start screen buttons to prevent multiple clicks and race conditions.
 */
function disableStartScreenButtons(playBtn, storyBtn, controlsBtn) {
    if (playBtn) playBtn.disabled = true;
    if (storyBtn) storyBtn.disabled = true;
    if (controlsBtn) controlsBtn.disabled = true;
}

/**
 * Sets up the event listener for the play button.
 */
function setupPlayButton(playBtn, storyBtn, controlsBtn) {
    if (!playBtn) return;
    playBtn.addEventListener('mousedown', function() {
        disableStartScreenButtons(playBtn, storyBtn, controlsBtn);
        animateLaser('play', function() {
            stopStartScreenLaser();
            showAndFadeCountdown(handleGameStart, false);
        });
    });
}

/**
 * Sets up the event listener for the story button.
 */
function setupStoryButton(storyBtn, playBtn, controlsBtn) {
    if (!storyBtn) return;
    storyBtn.addEventListener('mousedown', function() {
        disableStartScreenButtons(playBtn, storyBtn, controlsBtn);
        animateLaser('story', function() {
            stopStartScreenLaser();
            showStoryScreen();
        });
    });
}

/**
 * Sets up the event listener for the controls button.
 */
function setupControlsButton(controlsBtn, playBtn, storyBtn) {
    if (!controlsBtn) return;
    controlsBtn.addEventListener('mousedown', function() {
        disableStartScreenButtons(playBtn, storyBtn, controlsBtn);
        animateLaser('controls', function() {
            stopStartScreenLaser();
            showControlScreen();
        });
    });
}

/**
 * Clones and resets all buttons in the given selector group.
 */
function cloneAndResetButtons(selector) {
    const buttons = Array.from(document.querySelectorAll(selector));
    buttons.forEach(btn => {
        const clone = btn.cloneNode(true);
        btn.replaceWith(clone);
        clone.disabled = false;
    });
    return Array.from(document.querySelectorAll(selector));
}