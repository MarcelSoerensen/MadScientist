/**
 * Mobile right movement control for Mad Scientist game
 */
class RightButton {
    /**
     * Initializes the right movement button and its functionality.
     */
    constructor() {
        this.rightButton = null;
        this.rightButtonContainer = null;
        this.keyboard = null;
        this.isMovingRight = false;
        this.rightInterval = null;
        this.isGameRunning = false;
        this.init();
    }

    /**
     * Initialize the right movement button system
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
            this.showRightButton();
            this.isGameRunning = true;
        } else if (!isCanvasVisible && this.isGameRunning) {
            this.hideRightButton();
            this.isGameRunning = false;
        }
    }

    /**
     * Creates and shows the right movement button
     */
    showRightButton() {
        if (this.rightButton) return;
        const canvas = document.getElementById('canvas');
        if (!canvas) return;
        this.createRightButton();
        let container = document.querySelector('.mobile-controls-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'mobile-controls-container';
            canvas.parentElement.appendChild(container);
        }
        container.appendChild(this.rightButtonContainer);
    }

    /**
     * Create the right movement button
     */
    createRightButton() {
        this.rightButtonContainer = document.createElement('div');
        this.rightButtonContainer.className = 'move-button-container move-right-container';
        this.rightButton = document.createElement('button');
        this.rightButton.className = 'move-btn move-right-btn';
        this.rightButton.title = 'Move Right (Hold to move)';
        this.rightButton.setAttribute('aria-label', 'Move right button');
        this.rightButton.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                <path d="M9 18L15 12L9 6" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        `;
        this.addRightTouchListeners();
        this.rightButtonContainer.appendChild(this.rightButton);
    }

    /**
     * Hides and removes the right movement button
     */
    hideRightButton() {
        if (this.rightButtonContainer && this.rightButtonContainer.parentElement) {
            this.rightButtonContainer.parentElement.removeChild(this.rightButtonContainer);
            this.rightButtonContainer = null;
            this.rightButton = null;
            this.stopMovingRight();
        }
    }

    /**
     * Add touch event listeners for right button
     */
    addRightTouchListeners() {
        if (!this.rightButton) return;
        const btn = this.rightButton;
        const press = e => { e.preventDefault(); e.stopPropagation(); btn.classList.add('pressed'); this.startMovingRight(); };
        const release = e => { e.preventDefault(); e.stopPropagation(); btn.classList.remove('pressed'); this.stopMovingRight(); };
        ['touchstart','mousedown'].forEach(ev => btn.addEventListener(ev, press, { passive:false }));
        ['touchend','touchcancel','mouseup','mouseleave'].forEach(ev => btn.addEventListener(ev, release, { passive:false }));
    }

    /**
     * Start moving right while button is held
     */
    startMovingRight() {
        if (this.isMovingRight) return;
        this.keyboard ||= window.keyboard || (window.world && window.world.keyboard) || null;
        this.isMovingRight = true;
        this.rightButton && this.rightButton.classList.add('moving');
        if (this.keyboard) this.keyboard.RIGHT = true; 
            else 
                this.triggerRightManually();
        if (this.rightInterval) 
            clearInterval(this.rightInterval);
        this.rightInterval = setInterval(() => { 
            if (this.keyboard) this.keyboard.RIGHT = true; }, 16);
    }

    /**
     * Stop moving right
     */
    stopMovingRight() {
        if (!this.isMovingRight) return;
        this.isMovingRight = false;
        this.rightButton && this.rightButton.classList.remove('moving');
        if (this.rightInterval) { clearInterval(this.rightInterval); this.rightInterval = null; }
        if (this.keyboard) {
            this.keyboard.RIGHT = false;
        } else {
            try {
                window.dispatchEvent(new KeyboardEvent('keyup', {
                    key: 'ArrowRight', code: 'ArrowRight', keyCode: 39, which: 39, bubbles: true
                }));
            } catch (_) {}
        }
    }

    /**
     * Fallback method to trigger right movement manually if keyboard is not available
     */
    triggerRightManually() {
        const char = window.world?.character;
        if (char?.moveRight) char.moveRight();
        else this.simulateRightKeyboardEvent();
    }

    /**
     * Simulate right keyboard event as final fallback
     */
    simulateRightKeyboardEvent() {
        try {
            const keyEvent = new KeyboardEvent('keydown', {
                key: 'ArrowRight',
                code: 'ArrowRight',
                keyCode: 39,
                which: 39,
                bubbles: true
            });
            window.dispatchEvent(keyEvent);
        } catch (error) {
        }
    }
}

/** 
 * Initialize RightButton when DOM is ready
 */
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.rightButton = new RightButton();
    });
} else {
    window.rightButton = new RightButton();
}