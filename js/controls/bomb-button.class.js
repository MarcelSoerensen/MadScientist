/**
 * Mobile bomb weapon control for Mad Scientist game
 */
class BombButton {
    /**
     * Initializes the bomb weapon button and its functionality.
     */
    constructor() {
        this.bombButton = null;
        this.bombButtonContainer = null;
        this.keyboard = null;
        this.isUsingBomb = false;
        this.bombInterval = null;
        this.isGameRunning = false;
        this.init();
    }

    /**
     * Initialize the bomb weapon button system
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
            this.showBombButton();
            this.isGameRunning = true;
        } else if (!isCanvasVisible && this.isGameRunning) {
            this.hideBombButton();
            this.isGameRunning = false;
        }
    }

    /**
     * Creates and shows the bomb weapon button
     */
    showBombButton() {
        if (this.bombButton) return;
        const canvas = document.getElementById('canvas');
        if (!canvas) return;
        this.createBombButton();
        let weaponControlsContainer = document.querySelector('.weapon-controls-container');
        if (!weaponControlsContainer) {
            weaponControlsContainer = document.createElement('div');
            weaponControlsContainer.className = 'weapon-controls-container';
            canvas.parentElement.appendChild(weaponControlsContainer);
        }
        weaponControlsContainer.appendChild(this.bombButtonContainer);
    }

    /**
     * Create the bomb weapon button
     */
    createBombButton() {
        this.bombButtonContainer = document.createElement('div');
        this.bombButtonContainer.className = 'weapon-button-container bomb-container';
        this.bombButton = document.createElement('button');
        this.bombButton.className = 'weapon-btn bomb-btn';
        this.bombButton.title = 'Throw Bomb (Tap to throw)';
        this.bombButton.setAttribute('aria-label', 'Throw bomb button');
        this.bombButton.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                <path d="M12 2L13 9L21 8L15 12L22 18L14 15L12 22L10 15L2 18L9 12L3 8L11 9L12 2Z" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        `;
        this.addBombTouchListeners();
        this.bombButtonContainer.appendChild(this.bombButton);
    }
    /**
     * Add touch/mouse event listeners for bomb button
     */
    addBombTouchListeners() {
        if (!this.bombButton) return;
        const btn = this.bombButton;
        const press = e => { if (e.cancelable) e.preventDefault(); e.stopPropagation(); btn.classList.add('pressed'); };
        const release = e => { if (e.cancelable) e.preventDefault(); e.stopPropagation(); btn.classList.remove('pressed'); this.throwBomb(); };
        ['touchstart','mousedown'].forEach(ev => btn.addEventListener(ev, press, { passive:false }));
        ['touchend','touchcancel','mouseup','mouseleave'].forEach(ev => btn.addEventListener(ev, release, { passive:false }));
        btn.addEventListener('contextmenu', e => { if (e.cancelable) e.preventDefault(); });
    }

    /**
     * Hides and removes the bomb weapon button
     */
    hideBombButton() {
        if (this.bombButtonContainer && this.bombButtonContainer.parentElement) {
            this.bombButtonContainer.parentElement.removeChild(this.bombButtonContainer);
            this.bombButtonContainer = null;
            this.bombButton = null;
            this.stopUsingBomb();
        }
    }

    /**
     * Throw bomb (single tap functionality)
     */
    throwBomb() {
        this.keyboard ||= window.keyboard || (window.world && window.world.keyboard) || null;
        if (!this.keyboard) {
            this.triggerBombManually();
            return;
        }
        this.keyboard.D = true;
        setTimeout(() => {
            if (this.keyboard) {
                this.keyboard.D = false;
            }
        }, 100);
    }

    /**
     * Fallback method to trigger bomb manually if keyboard is not available
     */
    triggerBombManually() {
        const c = window.world?.character;
        const m = window.world?.bombManager;
        if (c && m?.collectedCount > 0 && !c.throwAnimationPlaying) {
            c.playThrowBombAnimation();
            setTimeout(() => {
                if (typeof ThrowableObjects?.createThrowableObject === 'function') {
                    const bombX = c.otherDirection ? c.x + 100 : c.x + 160;
                    const bomb = ThrowableObjects.createThrowableObject('bomb', bombX, c.y + 100);
                    window.world.throwableObjects.push(bomb);
                    m.collectedCount = Math.max(0, m.collectedCount - 1);
                }
            }, 100);
        }
    }

    /**
     * Stop bomb usage and clear any intervals
     */
    stopUsingBomb() {
        this.isUsingBomb = false;
        if (this.bombInterval) {
            clearInterval(this.bombInterval);
            this.bombInterval = null;
        }
        if (this.keyboard) {
            this.keyboard.D = false;
        }
    }

}

/**
 * Initialize BombButton when DOM is ready
 */
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.bombButton = new BombButton();
    });
} else {
    window.bombButton = new BombButton();
}