/**
 * Touch Jump Button for Mobile Devices
 */
class JumpButton {
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
            
            // Remove mobile controls container if it's empty
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

        this.jumpButton.addEventListener('touchstart', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.jumpButton.classList.add('pressed');
            this.startJumping();
        });

        this.jumpButton.addEventListener('touchend', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.jumpButton.classList.remove('pressed');
            this.stopJumping();
        });

        this.jumpButton.addEventListener('touchcancel', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.jumpButton.classList.remove('pressed');
            this.stopJumping();
        });

        this.jumpButton.addEventListener('mousedown', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.jumpButton.classList.add('pressed');
            this.startJumping();
        });

        this.jumpButton.addEventListener('mouseup', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.jumpButton.classList.remove('pressed');
            this.stopJumping();
        });

        this.jumpButton.addEventListener('mouseleave', (e) => {
            this.jumpButton.classList.remove('pressed');
            this.stopJumping();
        });
    }

    /**
     * Start continuous jumping while button is held
     */
    startJumping() {
        if (this.isJumping) return;
        
        if (!this.keyboard) {
            if (window.keyboard) {
                this.keyboard = window.keyboard;
            } else if (window.world && window.world.keyboard) {
                this.keyboard = window.world.keyboard;
            }
        }
        
        this.isJumping = true;
        this.jumpButton.classList.add('jumping');
        
        if (this.keyboard) {
            this.keyboard.UP = true;
        } else {
            this.triggerJumpManually();
        }
        
        this.jumpInterval = setInterval(() => {
            if (this.keyboard) {
                this.keyboard.UP = true;
            }
        }, 16);
    }

    /**
     * Stop jumping
     */
    stopJumping() {
        if (!this.isJumping) return;
        
        this.isJumping = false;
        
        if (this.jumpButton) {
            this.jumpButton.classList.remove('jumping');
        }
        
        if (this.jumpInterval) {
            clearInterval(this.jumpInterval);
            this.jumpInterval = null;
        }
        
        if (this.keyboard) {
            this.keyboard.UP = false;
        } else {
            try {
                const keyUpEvent = new KeyboardEvent('keyup', {
                    key: 'ArrowUp',
                    code: 'ArrowUp',
                    keyCode: 38,
                    which: 38,
                    bubbles: true
                });
                window.dispatchEvent(keyUpEvent);
            } catch (error) {
            }
        }
    }

    /**
     * Fallback method to trigger jump manually if keyboard is not available
     */
    triggerJumpManually() {
        try {
            if (window.world && window.world.character) {
                const character = window.world.character;
                
                if (character && !character.isAboveGround() && typeof character.playJumpAnimation === 'function') {
                    character.isAboveGroundActive = true;
                    character.currentImage = 0;
                    character.playJumpAnimation();
                } else {
                    this.simulateKeyboardEvent();
                }
            } else {
                this.simulateKeyboardEvent();
            }
        } catch (error) {
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

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.jumpButton = new JumpButton();
    });
} else {
    window.jumpButton = new JumpButton();
}

window.JumpButton = JumpButton;