/**
 * Fullscreen functionality for the Mad Scientist game
 */
class FullscreenManager {
    /**
     * Initializes the FullscreenManager and sets up the button and event listeners.
     */
    constructor() {
        this.canvas = null;
        this.fullscreenButton = null;
        this.init();
    }

    /**
     * Initialize fullscreen functionality
     */
    init() {
        this.createFullscreenButton();
        this.addEventListeners();
        
        setTimeout(() => {
            this.canvas = document.getElementById('canvas');
        }, 1000);
    }

    /**
     * Creates the fullscreen toggle button with SVG icon
     */
    createFullscreenButton() {
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'fullscreen-button-container';
        this.fullscreenButton = document.createElement('button');
        this.fullscreenButton.className = 'fullscreen-btn';
        this.fullscreenButton.title = 'Toggle Fullscreen (F11)';
        this.fullscreenButton.setAttribute('aria-label', 'Toggle fullscreen mode');
        this.updateButtonIcon(false);
        this.addTouchListeners();
        buttonContainer.appendChild(this.fullscreenButton);
        document.body.appendChild(buttonContainer);
    }

    /**
     * Updates the button icon based on fullscreen state
     */
    updateButtonIcon(isFullscreen) {
        const enterFullscreenSVG = `
            <svg width="36" height="36" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
            </svg>
        `;
        const exitFullscreenSVG = `
            <svg width="36" height="36" viewBox="2 2 20 20" fill="currentColor">
                <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"/>
            </svg>
        `;
        this.fullscreenButton.innerHTML = isFullscreen ? exitFullscreenSVG : enterFullscreenSVG;
        this.fullscreenButton.title = isFullscreen ? 'Exit Fullscreen (ESC)' : 'Enter Fullscreen (F11)';
    }

    /**
     * Add touch event listeners for better mobile experience
     */
    addTouchListeners() {
        if (!this.fullscreenButton) return;
        const btn = this.fullscreenButton;
        const press = e => { if (e.cancelable) e.preventDefault(); e.stopPropagation(); btn.classList.add('pressed'); };
        const release = e => { if (e.cancelable) e.preventDefault(); e.stopPropagation(); btn.classList.remove('pressed'); this.toggleFullscreen(); };
        ['touchstart','mousedown'].forEach(ev => btn.addEventListener(ev, press, { passive:false }));
        ['touchend','touchcancel','mouseup','mouseleave'].forEach(ev => btn.addEventListener(ev, release, { passive:false }));
    }

    /**
     * Add event listeners for fullscreen changes and keyboard shortcuts
     */
    addEventListeners() {
        document.addEventListener('fullscreenchange', () => this.onFullscreenChange());
        document.addEventListener('webkitfullscreenchange', () => this.onFullscreenChange());
        document.addEventListener('mozfullscreenchange', () => this.onFullscreenChange());
        document.addEventListener('MSFullscreenChange', () => this.onFullscreenChange());
        document.addEventListener('keydown', (e) => {
            if (e.key === 'F11') {
                e.preventDefault();
                this.toggleFullscreen();
            }
        });
    }

    /**
     * Handle fullscreen state changes
     */
    onFullscreenChange() {
        const isFullscreen = this.isFullscreen();
        this.updateButtonIcon(isFullscreen);
        if (isFullscreen) {
            document.body.classList.add('fullscreen-mode');
        } else {
            document.body.classList.remove('fullscreen-mode');
        }
    }

    /**
     * Check if currently in fullscreen mode
     */
    isFullscreen() {
        return !!(
            document.fullscreenElement ||
            document.webkitFullscreenElement ||
            document.mozFullScreenElement ||
            document.msFullscreenElement
        );
    }

    /**
     * Enter fullscreen mode
     */
    enterFullscreen() {
        const element = document.documentElement;
        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen();
        } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        } else if (element.msRequestFullscreen) {
            element.msRequestFullscreen();
        }
    }

    /**
     * Exit fullscreen mode
     */
    exitFullscreen() {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    }

    /**
     * Toggle fullscreen mode
     */
    toggleFullscreen() {
        if (this.isFullscreen()) {
            this.exitFullscreen();
        } else {
            this.enterFullscreen();
        }
    }
}

/** 
 * Initialize FullscreenManager when DOM is ready
 */
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.fullscreenManager = new FullscreenManager();
    });
} else {
    window.fullscreenManager = new FullscreenManager();
}

window.FullscreenManager = FullscreenManager;