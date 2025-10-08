/**
 * Touch Jump Button for Mobile Devices
 */
class JumpButton {
    /**
     * Initializes the jump button and its functionality.
     */
    constructor() {
        this.jumpButton = null;
        this.jumpButtonContainer = null;
        this.isJumping = false;
        this.jumpInterval = null;
        this.keyboard = null;
        this.isGameRunning = false;
        this.init();
    }

    /**
     * Initialize jump button (but don't show it yet)
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
     * Check if game is currently running based on canvas visibility
     */
    checkGameState() {
        const canvas = document.getElementById('canvas');
        const isCanvasVisible = canvas && 
                               canvas.classList.contains('canvas-visible') &&
                               canvas.style.pointerEvents === 'auto';
        if (isCanvasVisible && !this.isGameRunning) {
            this.showJumpButton();
            this.isGameRunning = true;
        } else if (!isCanvasVisible && this.isGameRunning) {
            this.hideJumpButton();
            this.isGameRunning = false;
        }
    }

    /**
     * Creates and shows the jump button
     */
    showJumpButton() {
        if (this.jumpButton) return;
        const canvas = document.getElementById('canvas');
        if (!canvas) return;
        this.createJumpButton();
        let mobileControlsContainer = document.querySelector('.mobile-controls-container');
        if (!mobileControlsContainer) {
            mobileControlsContainer = document.createElement('div');
            mobileControlsContainer.className = 'mobile-controls-container';
            canvas.parentElement.appendChild(mobileControlsContainer);
        }
        mobileControlsContainer.appendChild(this.jumpButtonContainer);
    }

    /**
     * Create the jump button
     */
    createJumpButton() {
        this.jumpButtonContainer = document.createElement('div');
        this.jumpButtonContainer.className = 'jump-button-container';
        this.jumpButton = document.createElement('button');
        this.jumpButton.className = 'jump-btn';
        this.jumpButton.title = 'Jump (Hold to jump longer)';
        this.jumpButton.setAttribute('aria-label', 'Jump button');
        this.jumpButton.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                <path d="M18 15L12 9L6 15" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        `;
        this.addTouchListeners();
        this.jumpButtonContainer.appendChild(this.jumpButton);
    }

    /**
     * Hides and removes the jump button
     */
    hideJumpButton() {
        if (this.jumpButtonContainer && this.jumpButtonContainer.parentElement) {
            this.jumpButtonContainer.parentElement.removeChild(this.jumpButtonContainer);
            this.jumpButtonContainer = null;
            this.jumpButton = null;
            this.stopJumping();
            const mobileControlsContainer = document.querySelector('.mobile-controls-container');
            if (mobileControlsContainer && mobileControlsContainer.children.length === 0) {
                mobileControlsContainer.parentElement.removeChild(mobileControlsContainer);
            }
        }
    }

    /**
     * Add touch event listeners for jump functionality
     */
    addTouchListeners() {
        if (!this.jumpButton) return;
        const btn = this.jumpButton;
        const press = e => { if (e.cancelable) e.preventDefault(); e.stopPropagation(); btn.classList.add('pressed'); this.startJumping(); };
        const release = e => { if (e.cancelable) e.preventDefault(); e.stopPropagation(); btn.classList.remove('pressed'); this.stopJumping(); };
        ['touchstart','mousedown'].forEach(ev => btn.addEventListener(ev, press, { passive:false }));
        ['touchend','touchcancel','mouseup','mouseleave'].forEach(ev => btn.addEventListener(ev, release, { passive:false }));
    }

    /**
     * Start continuous jumping while button is held
     */
    startJumping() {
        if (this.isJumping) return;
        this.keyboard ||= window.keyboard || (window.world && window.world.keyboard) || null;
        this.isJumping = true;
        this.jumpButton && this.jumpButton.classList.add('jumping');
        if (this.keyboard) this.keyboard.UP = true; 
            else 
                this.triggerJumpManually();
        if (this.jumpInterval) 
            clearInterval(this.jumpInterval);
        this.jumpInterval = setInterval(() => { 
            if (this.keyboard) this.keyboard.UP = true; }, 16);
    }

    /**
     * Stop jumping
     */
    stopJumping() {
        if (!this.isJumping) return;
        this.isJumping = false;
        this.jumpButton && this.jumpButton.classList.remove('jumping');
        if (this.jumpInterval) { clearInterval(this.jumpInterval); this.jumpInterval = null; }
        if (this.keyboard) {
            this.keyboard.UP = false;
        } else {
            try {
                window.dispatchEvent(new KeyboardEvent('keyup', {
                    key: 'ArrowUp', code: 'ArrowUp', keyCode: 38, which: 38, bubbles: true
                }));
            } catch (_) {}
        }
    }

    /**
     * Fallback method to trigger jump manually if keyboard is not available
     */
    triggerJumpManually() {
        const character = window.world?.character;
        if (character && !character.isAboveGround() && typeof character.playJumpAnimation === 'function') {
            character.isAboveGroundActive = true;
            character.currentImage = 0;
            character.playJumpAnimation();
        } else {
            this.simulateKeyboardEvent();
        }
    }

    /**
     * Simulate keyboard event as final fallback
     */
    simulateKeyboardEvent() {
        try {
            const keyEvent = new KeyboardEvent('keydown', {
                key: 'ArrowUp',
                code: 'ArrowUp',
                keyCode: 38,
                which: 38,
                bubbles: true
            });
            window.dispatchEvent(keyEvent);
        } catch (error) {
        }
    }
}


/** 
 * Initialize JumpButton when DOM is ready
 */
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.jumpButton = new JumpButton();
    });
} else {
    window.jumpButton = new JumpButton();
}

window.JumpButton = JumpButton;