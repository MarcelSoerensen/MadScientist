/**
 * Mobile left movement control for Mad Scientist game
 */
class LeftButton {
    /**
     * Initializes the left movement button and its functionality.
     */
    constructor() {
        this.leftButton = null;
        this.leftButtonContainer = null;
        this.keyboard = null;
        this.isMovingLeft = false;
        this.leftInterval = null;
        this.isGameRunning = false;
        this.init();
    }

    /**
     * Initialize the left movement button system
     */
    init() {
        this.tryGetKeyboard();
        this.setupGameStateListeners();
    }

    /**
     * Try to get keyboard reference with multiple attempts
     */
    tryGetKeyboard() {
        const grab = () => {
            this.keyboard ||= window.keyboard || (window.world && window.world.keyboard) || null;
            return !!this.keyboard;
        };
        if (grab()) return;
        [100, 500, 1000, 2000, 3000].forEach(ms => setTimeout(grab, ms));
    }

    /**
     * Setup listeners to detect when game starts/ends
     */
    setupGameStateListeners() {
        const canvas = document.getElementById('canvas');
        if (!canvas) return;
        new MutationObserver(() => this.checkGameState())
            .observe(canvas, { attributes: true, attributeFilter: ['style'] });
    }

    /**
     * Check if game is running and show/hide button accordingly
     */
    checkGameState() {
        const canvas = document.getElementById('canvas');
        const isCanvasVisible = canvas && 
                               canvas.classList.contains('canvas-visible') &&
                               canvas.style.pointerEvents === 'auto';
        if (isCanvasVisible && !this.isGameRunning) {
            this.showLeftButton();
            this.isGameRunning = true;
        } else if (!isCanvasVisible && this.isGameRunning) {
            this.hideLeftButton();
            this.isGameRunning = false;
        }
    }

    /**
     * Creates and shows the left movement button
     */
    showLeftButton() {
        if (this.leftButton) return;
        const canvas = document.getElementById('canvas');
        if (!canvas) return;
        this.createLeftButton();
        let mobileControlsContainer = document.querySelector('.mobile-controls-container');
        if (!mobileControlsContainer) {
            mobileControlsContainer = document.createElement('div');
            mobileControlsContainer.className = 'mobile-controls-container';
            canvas.parentElement.appendChild(mobileControlsContainer);
        }
        mobileControlsContainer.insertBefore(this.leftButtonContainer, mobileControlsContainer.firstChild);
    }

    /**
     * Create the left movement button
     */
    createLeftButton() {
        this.leftButtonContainer = document.createElement('div');
        this.leftButtonContainer.className = 'move-button-container move-left-container';
        this.leftButton = document.createElement('button');
        this.leftButton.className = 'move-btn move-left-btn';
        this.leftButton.title = 'Move Left (Hold to move)';
        this.leftButton.setAttribute('aria-label', 'Move left button');
        this.leftButton.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                <path d="M15 18L9 12L15 6" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        `;
        this.addLeftTouchListeners();
        this.leftButtonContainer.appendChild(this.leftButton);
    }

    /**
     * Hides and removes the left movement button
     */
    hideLeftButton() {
        if (this.leftButtonContainer && this.leftButtonContainer.parentElement) {
            this.leftButtonContainer.parentElement.removeChild(this.leftButtonContainer);
            this.leftButtonContainer = null;
            this.leftButton = null;
            this.stopMovingLeft();
        }
    }

    /**
     * Add touch event listeners for left button
     */
    addLeftTouchListeners() {
        if (!this.leftButton) return;
        const btn = this.leftButton;
        const press = e => { if (e.cancelable) e.preventDefault(); e.stopPropagation(); btn.classList.add('pressed'); this.startMovingLeft(); };
        const release = e => { if (e.cancelable) e.preventDefault(); e.stopPropagation(); btn.classList.remove('pressed'); this.stopMovingLeft(); };
        ['touchstart','mousedown'].forEach(ev => btn.addEventListener(ev, press, { passive:false }));
        ['touchend','touchcancel','mouseup','mouseleave'].forEach(ev => btn.addEventListener(ev, release, { passive:false }));
    }

    /**
     * Start moving left while button is held
     */
    startMovingLeft() {
        if (this.isMovingLeft) return;
        this.keyboard ||= window.keyboard || (window.world && window.world.keyboard) || null;
        this.isMovingLeft = true;
        this.leftButton && this.leftButton.classList.add('moving');
        if (this.keyboard) this.keyboard.LEFT = true; 
            else 
                this.triggerLeftManually();
        if (this.leftInterval) 
            clearInterval(this.leftInterval);
        this.leftInterval = setInterval(() => { 
            if (this.keyboard) this.keyboard.LEFT = true; }, 16);
    }

    /**
     * Stop moving left
     */
    stopMovingLeft() {
        if (!this.isMovingLeft) return;
        this.isMovingLeft = false;
        this.leftButton && this.leftButton.classList.remove('moving');
        if (this.leftInterval) { clearInterval(this.leftInterval); this.leftInterval = null; }
        if (this.keyboard) {
            this.keyboard.LEFT = false;
        } else {
            try {
                window.dispatchEvent(new KeyboardEvent('keyup', {
                    key: 'ArrowLeft', code: 'ArrowLeft', keyCode: 37, which: 37, bubbles: true
                }));
            } catch (_) {}
        }
    }

    /**
     * Fallback method to trigger left movement manually if keyboard is not available
     */
    triggerLeftManually() {
        const char = window.world?.character;
        if (char?.moveLeft) char.moveLeft();
        else this.simulateLeftKeyboardEvent();
    }

    /**
     * Simulate left keyboard event as final fallback
     */
    simulateLeftKeyboardEvent() {
        try {
            const keyEvent = new KeyboardEvent('keydown', {
                key: 'ArrowLeft',
                code: 'ArrowLeft',
                keyCode: 37,
                which: 37,
                bubbles: true
            });
            window.dispatchEvent(keyEvent);
        } catch (error) {
        }
    }
}

/** 
 * Initialize LeftButton when DOM is ready
 */
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.leftButton = new LeftButton();
    });
} else {
    window.leftButton = new LeftButton();
}