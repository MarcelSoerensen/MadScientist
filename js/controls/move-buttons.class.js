/**
 * Mobile movement controls (left/right) for Mad Scientist game
 */
class MoveButtons {
    constructor() {
        this.leftButton = null;
        this.rightButton = null;
        this.leftButtonContainer = null;
        this.rightButtonContainer = null;
        this.keyboard = null;
        
        this.isMovingLeft = false;
        this.isMovingRight = false;
        this.leftInterval = null;
        this.rightInterval = null;
        
        this.isGameRunning = false;
        
        this.init();
    }

    /**
     * Initialize the movement buttons system
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
     * Check if game is running and show/hide buttons accordingly
     */
    checkGameState() {
        const canvas = document.getElementById('canvas');
        const isCanvasVisible = canvas && 
                               canvas.classList.contains('canvas-visible') &&
                               canvas.style.pointerEvents === 'auto';

        if (isCanvasVisible && !this.isGameRunning) {
            this.showMoveButtons();
            this.isGameRunning = true;
        } else if (!isCanvasVisible && this.isGameRunning) {
            this.hideMoveButtons();
            this.isGameRunning = false;
        }
    }

    /**
     * Creates and shows the movement buttons
     */
    showMoveButtons() {
        if (this.leftButton || this.rightButton) return;
        
        const canvas = document.getElementById('canvas');
        if (!canvas) return;
        
        this.createLeftButton();
        this.createRightButton();
        
        canvas.parentElement.appendChild(this.leftButtonContainer);
        canvas.parentElement.appendChild(this.rightButtonContainer);
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
     * Hides and removes the movement buttons
     */
    hideMoveButtons() {
        if (this.leftButtonContainer && this.leftButtonContainer.parentElement) {
            this.leftButtonContainer.parentElement.removeChild(this.leftButtonContainer);
            this.leftButtonContainer = null;
            this.leftButton = null;
            this.stopMovingLeft();
        }
        
        if (this.rightButtonContainer && this.rightButtonContainer.parentElement) {
            this.rightButtonContainer.parentElement.removeChild(this.rightButtonContainer);
            this.rightButtonContainer = null;
            this.rightButton = null;
            this.stopMovingRight();
        }
    }

    /**
     * Add touch event listeners for left button
     */
    addLeftTouchListeners() {
        if (!this.leftButton) return;

        this.leftButton.addEventListener('touchstart', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.leftButton.classList.add('pressed');
            this.startMovingLeft();
        });

        this.leftButton.addEventListener('touchend', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.leftButton.classList.remove('pressed');
            this.stopMovingLeft();
        });

        this.leftButton.addEventListener('touchcancel', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.leftButton.classList.remove('pressed');
            this.stopMovingLeft();
        });

        this.leftButton.addEventListener('mousedown', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.leftButton.classList.add('pressed');
            this.startMovingLeft();
        });

        this.leftButton.addEventListener('mouseup', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.leftButton.classList.remove('pressed');
            this.stopMovingLeft();
        });

        this.leftButton.addEventListener('mouseleave', (e) => {
            this.leftButton.classList.remove('pressed');
            this.stopMovingLeft();
        });
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
     * Start moving left while button is held
     */
    startMovingLeft() {
        if (this.isMovingLeft) return;
        
        if (!this.keyboard) {
            if (window.keyboard) {
                this.keyboard = window.keyboard;
            } else if (window.world && window.world.keyboard) {
                this.keyboard = window.world.keyboard;
            }
        }
        
        this.isMovingLeft = true;
        this.leftButton.classList.add('moving');
        
        if (this.keyboard) {
            this.keyboard.LEFT = true;
        } else {
            this.triggerLeftManually();
        }
        
        this.leftInterval = setInterval(() => {
            if (this.keyboard) {
                this.keyboard.LEFT = true;
            }
        }, 16);
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
     * Stop moving left
     */
    stopMovingLeft() {
        if (!this.isMovingLeft) return;
        
        this.isMovingLeft = false;
        
        if (this.leftButton) {
            this.leftButton.classList.remove('moving');
        }
        
        if (this.leftInterval) {
            clearInterval(this.leftInterval);
            this.leftInterval = null;
        }
        
        if (this.keyboard) {
            this.keyboard.LEFT = false;
        } else {
            try {
                const keyUpEvent = new KeyboardEvent('keyup', {
                    key: 'ArrowLeft',
                    code: 'ArrowLeft',
                    keyCode: 37,
                    which: 37,
                    bubbles: true
                });
                window.dispatchEvent(keyUpEvent);
            } catch (error) {
            }
        }
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
            }
        }
    }

    /**
     * Fallback method to trigger left movement manually if keyboard is not available
     */
    triggerLeftManually() {
        try {
            if (window.world && window.world.character) {
                const character = window.world.character;
                
                if (character && typeof character.moveLeft === 'function') {
                    character.moveLeft();
                } else {
                    this.simulateLeftKeyboardEvent();
                }
            } else {
                this.simulateLeftKeyboardEvent();
            }
        } catch (error) {
            this.simulateLeftKeyboardEvent();
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

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.moveButtons = new MoveButtons();
    });
} else {
    window.moveButtons = new MoveButtons();
}