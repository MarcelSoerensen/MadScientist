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

    const legalNoticeLink = document.getElementById('legal-notice-link');
    const creditsLink = document.getElementById('credits-link');
    if (legalNoticeLink) {
        legalNoticeLink.onclick = function(e) {
            e.preventDefault();
            if (typeof window.hideSystemButtons === 'function') window.hideSystemButtons();
            window.prepareAndTransitionToScreen(
                document.getElementById('start_screen'),
                document.getElementById('legal_notice_screen')
            );
        };
    }
    if (creditsLink) {
        creditsLink.onclick = function(e) {
            e.preventDefault();
            if (typeof window.hideSystemButtons === 'function') window.hideSystemButtons();
            window.prepareAndTransitionToScreen(
                document.getElementById('start_screen'),
                document.getElementById('credits_screen')
            );
        };
    }
}

/**
 * Sets up the back button on the legal-notice screen.
 */
function setupLegalNoticeBackButton() {
    const legalNoticeBackBtn = document.querySelector('#legal_notice_screen .legal-notice-btn');
    if (legalNoticeBackBtn) {
        legalNoticeBackBtn.onclick = function() {
            if (typeof window.hideSystemButtons === 'function') window.hideSystemButtons();
            window.prepareAndTransitionToScreen(
                document.getElementById('legal_notice_screen'),
                document.getElementById('start_screen')
            );
        };
    }
}

/**
 * Sets up the back button on the credits screen.
 */
function setupCreditsBackButton() {
    const creditsBackBtn = document.querySelector('#credits_screen .credits-btn');
    if (creditsBackBtn) {
        creditsBackBtn.onclick = function() {
            if (typeof window.hideSystemButtons === 'function') window.hideSystemButtons();
            window.prepareAndTransitionToScreen(
                document.getElementById('credits_screen'),
                document.getElementById('start_screen')
            );
        };
    }
}

document.addEventListener('DOMContentLoaded', function() {
    setupLegalNoticeBackButton();
    setupCreditsBackButton();
});

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
            showAndFadeCountdown(() => {
                prepareGameStart(document.getElementById('canvas'));
            }, false);
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