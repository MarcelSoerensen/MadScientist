/**
 * Mobile bomb weapon control for Mad Scientist game
 */
class BombButton {
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
        
        this.bombButton.addEventListener('touchstart', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.bombButton.classList.add('pressed');
        }, { passive: false });

        this.bombButton.addEventListener('touchend', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.bombButton.classList.remove('pressed');
            this.throwBomb();
        }, { passive: false });

        this.bombButton.addEventListener('touchcancel', (e) => {
            e.preventDefault();
            this.bombButton.classList.remove('pressed');
        }, { passive: false });

        this.bombButton.addEventListener('mousedown', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.bombButton.classList.add('pressed');
        });

        this.bombButton.addEventListener('mouseup', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.bombButton.classList.remove('pressed');
            this.throwBomb();
        });

        this.bombButton.addEventListener('mouseleave', (e) => {
            this.bombButton.classList.remove('pressed');
        });

        this.bombButton.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });
        
        this.bombButtonContainer.appendChild(this.bombButton);
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
        if (!this.keyboard) {
            if (typeof keyboard !== 'undefined') {
                this.keyboard = keyboard;
            } else if (window.keyboard) {
                this.keyboard = window.keyboard;
            } else if (window.world && window.world.keyboard) {
                this.keyboard = window.world.keyboard;
            }
        }
        
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
        try {
            let worldRef = null;
            
            if (typeof world !== 'undefined') {
                worldRef = world;
            } else if (window.world) {
                worldRef = window.world;
            }
            
            if (worldRef && worldRef.worldCheck && worldRef.bombManager?.collectedCount > 0) {
                if (!worldRef.character.throwAnimationPlaying) {
                    worldRef.character.playThrowBombAnimation();
                    setTimeout(() => {
                        let bombX = worldRef.character.otherDirection ? worldRef.character.x + 100 : worldRef.character.x + 160;
                        if (typeof ThrowableObjects !== 'undefined' && ThrowableObjects.createThrowableObject) {
                            let bomb = ThrowableObjects.createThrowableObject(
                                'bomb',
                                bombX,
                                worldRef.character.y + 100
                            );
                            worldRef.throwableObjects.push(bomb);
                            worldRef.bombManager.collectedCount = Math.max(0, worldRef.bombManager.collectedCount - 1);
                        }
                    }, 100);
                }
            }
        } catch (error) {
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

document.addEventListener('DOMContentLoaded', () => {
    if (typeof window !== 'undefined') {
        window.bombButton = new BombButton();
    }
});