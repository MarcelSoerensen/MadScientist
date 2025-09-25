/**
 * Mobile right movement control for Mad Scientist game
 */
class RightButton {
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
        if (window.keyboard) {
            this.keyboard = window.keyboard;
            return;
        }

        const attempts = [100, 500, 1000, 2000, 3000];
        
        attempts.forEach(delay => {
            setTimeout(() => {
                if (!this.keyboard) {
                    if (window.keyboard) {
                        this.keyboard = window.keyboard;
                    } else if (window.world && window.world.keyboard) {
                        this.keyboard = window.world.keyboard;
                    }
                }
            }, delay);
        });
    }

    /**
     * Setup listeners to detect when game starts/ends
     */
    setupGameStateListeners() {
        const canvas = document.getElementById('canvas');
        if (canvas) {
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === 'attributes' && 
                        mutation.attributeName === 'style') {
                        this.checkGameState();
                    }
                });
            });

            observer.observe(canvas, {
                attributes: true,
                attributeFilter: ['style']
            });
        }
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
        
        // Create or find the mobile controls container
        let mobileControlsContainer = document.querySelector('.mobile-controls-container');
        if (!mobileControlsContainer) {
            mobileControlsContainer = document.createElement('div');
            mobileControlsContainer.className = 'mobile-controls-container';
            canvas.parentElement.appendChild(mobileControlsContainer);
        }
        
        // Append at the end (right position)
        mobileControlsContainer.appendChild(this.rightButtonContainer);
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

        this.rightButton.addEventListener('touchstart', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.rightButton.classList.add('pressed');
            this.startMovingRight();
        });

        this.rightButton.addEventListener('touchend', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.rightButton.classList.remove('pressed');
            this.stopMovingRight();
        });

        this.rightButton.addEventListener('touchcancel', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.rightButton.classList.remove('pressed');
            this.stopMovingRight();
        });

        this.rightButton.addEventListener('mousedown', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.rightButton.classList.add('pressed');
            this.startMovingRight();
        });

        this.rightButton.addEventListener('mouseup', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.rightButton.classList.remove('pressed');
            this.stopMovingRight();
        });

        this.rightButton.addEventListener('mouseleave', (e) => {
            this.rightButton.classList.remove('pressed');
            this.stopMovingRight();
        });
    }

    /**
     * Start moving right while button is held
     */
    startMovingRight() {
        if (this.isMovingRight) return;
        
        if (!this.keyboard) {
            if (window.keyboard) {
                this.keyboard = window.keyboard;
            } else if (window.world && window.world.keyboard) {
                this.keyboard = window.world.keyboard;
            }
        }
        
        this.isMovingRight = true;
        this.rightButton.classList.add('moving');
        
        if (this.keyboard) {
            this.keyboard.RIGHT = true;
        } else {
            this.triggerRightManually();
        }
        
        this.rightInterval = setInterval(() => {
            if (this.keyboard) {
                this.keyboard.RIGHT = true;
            }
        }, 16);
    }

    /**
     * Stop moving right
     */
    stopMovingRight() {
        if (!this.isMovingRight) return;
        
        this.isMovingRight = false;
        
        if (this.rightButton) {
            this.rightButton.classList.remove('moving');
        }
        
        if (this.rightInterval) {
            clearInterval(this.rightInterval);
            this.rightInterval = null;
        }
        
        if (this.keyboard) {
            this.keyboard.RIGHT = false;
        } else {
            try {
                const keyUpEvent = new KeyboardEvent('keyup', {
                    key: 'ArrowRight',
                    code: 'ArrowRight',
                    keyCode: 39,
                    which: 39,
                    bubbles: true
                });
                window.dispatchEvent(keyUpEvent);
            } catch (error) {
                // Silent fallback
            }
        }
    }

    /**
     * Fallback method to trigger right movement manually if keyboard is not available
     */
    triggerRightManually() {
        try {
            if (window.world && window.world.character) {
                const character = window.world.character;
                
                if (character && typeof character.moveRight === 'function') {
                    character.moveRight();
                } else {
                    this.simulateRightKeyboardEvent();
                }
            } else {
                this.simulateRightKeyboardEvent();
            }
        } catch (error) {
            this.simulateRightKeyboardEvent();
        }
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
            // Silent fallback
        }
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.rightButton = new RightButton();
    });
} else {
    window.rightButton = new RightButton();
}