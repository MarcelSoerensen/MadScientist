/**
 * Mobile laser weapon control for Mad Scientist game
 */
class LaserButton {
    constructor() {
        this.laserButton = null;
        this.laserButtonContainer = null;
        this.keyboard = null;
        
        this.isUsingLaser = false;
        this.laserInterval = null;
        
        this.lastTapTime = 0;
        this.doubleTapDelay = 300;
        this.singleTapTimeout = null;
        
        this.isGameRunning = false;
        
        this.init();
    }

    /**
     * Initialize the laser weapon button system
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
            this.showLaserButton();
            this.isGameRunning = true;
        } else if (!isCanvasVisible && this.isGameRunning) {
            this.hideLaserButton();
            this.isGameRunning = false;
        }
    }

    /**
     * Creates and shows the laser weapon button
     */
    showLaserButton() {
        if (this.laserButton) return;
        
        const canvas = document.getElementById('canvas');
        if (!canvas) return;
        
        this.createLaserButton();
        
        let weaponControlsContainer = document.querySelector('.weapon-controls-container');
        if (!weaponControlsContainer) {
            weaponControlsContainer = document.createElement('div');
            weaponControlsContainer.className = 'weapon-controls-container';
            canvas.parentElement.appendChild(weaponControlsContainer);
        }
        
        weaponControlsContainer.insertBefore(this.laserButtonContainer, weaponControlsContainer.firstChild);
    }

    /**
     * Create the laser weapon button
     */
    createLaserButton() {
        this.laserButtonContainer = document.createElement('div');
        this.laserButtonContainer.className = 'weapon-button-container laser-container';
        
        this.laserButton = document.createElement('button');
        this.laserButton.className = 'weapon-btn laser-btn';
        this.laserButton.title = 'Fire Laser (Hold to fire)';
        this.laserButton.setAttribute('aria-label', 'Fire laser button');
        
        this.laserButton.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        `;
        
        setInterval(() => {
            this.updateSuperlaserVisuals();
        }, 500);
        
        this.laserButton.addEventListener('touchstart', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.laserButton.classList.add('pressed');
        }, { passive: false });

        this.laserButton.addEventListener('touchend', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.laserButton.classList.remove('pressed');
            this.handleTap();
        }, { passive: false });

        this.laserButton.addEventListener('touchcancel', (e) => {
            e.preventDefault();
            this.laserButton.classList.remove('pressed');
            if (this.singleTapTimeout) {
                clearTimeout(this.singleTapTimeout);
                this.singleTapTimeout = null;
            }
        }, { passive: false });

        this.laserButton.addEventListener('mousedown', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.laserButton.classList.add('pressed');
        });

        this.laserButton.addEventListener('mouseup', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.laserButton.classList.remove('pressed');
            this.handleTap();
        });

        this.laserButton.addEventListener('mouseleave', (e) => {
            this.laserButton.classList.remove('pressed');
            if (this.singleTapTimeout) {
                clearTimeout(this.singleTapTimeout);
                this.singleTapTimeout = null;
            }
        });

        this.laserButton.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });
        
        this.laserButtonContainer.appendChild(this.laserButton);
    }

    /**
     * Update superlaser visuals using existing SuperShotBar
     */
    updateSuperlaserVisuals() {
        if (!this.laserButton) return;
        
        try {
            let worldRef = null;
            
            if (typeof world !== 'undefined') {
                worldRef = world;
            } else if (window.world) {
                worldRef = window.world;
            }
            
            if (worldRef && worldRef.superShotBar) {
                const superShots = worldRef.superShotBar.getSuperShots();
                
                if (superShots > 0) {
                    this.laserButton.classList.add('superlaser-ready');
                    this.laserButton.title = `Fire Laser (Tap=Normal, Double-tap=SUPERLASER! ${superShots} available)`;
                } else {
                    this.laserButton.classList.remove('superlaser-ready');
                    this.laserButton.title = 'Fire Laser (Tap=Normal, collect 3 energy balls for superlaser)';
                }
            }
        } catch (error) {
            
        }
    }

    /**
     * Hides and removes the laser weapon button
     */
    hideLaserButton() {
        if (this.laserButtonContainer && this.laserButtonContainer.parentElement) {
            this.laserButtonContainer.parentElement.removeChild(this.laserButtonContainer);
            this.laserButtonContainer = null;
            this.laserButton = null;
            this.stopUsingLaser();
        }
    }

    /**
     * Handle tap/click to detect single vs double tap
     */
    handleTap() {
        const currentTime = Date.now();
        const timeSinceLastTap = currentTime - this.lastTapTime;

        if (timeSinceLastTap < this.doubleTapDelay && this.singleTapTimeout) {
            clearTimeout(this.singleTapTimeout);
            this.singleTapTimeout = null;
            this.fireSuperlaser();
        } else {
            this.singleTapTimeout = setTimeout(() => {
                this.fireLaser();
                this.singleTapTimeout = null;
            }, this.doubleTapDelay);
        }
        
        this.lastTapTime = currentTime;
    }

    /**
     * Fire normal laser
     */
    fireLaser() {
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
            this.triggerLaserManually();
            return;
        }
        
        this.keyboard.Y = true;
        
        setTimeout(() => {
            if (this.keyboard) {
                this.keyboard.Y = false;
            }
        }, 100);
    }

    /**
     * Fire superlaser
     */
    fireSuperlaser() {
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
            this.triggerSuperlaserManually();
            return;
        }
        
        this.keyboard.S = true;
        
        setTimeout(() => {
            if (this.keyboard) {
                this.keyboard.S = false;
            }
        }, 100);
    }

    /**
     * Fallback method to trigger laser manually if keyboard is not available
     */
    triggerLaserManually() {
        try {
            let worldRef = null;
            
            if (typeof world !== 'undefined') {
                worldRef = world;
            } else if (window.world) {
                worldRef = window.world;
            }
            
            if (worldRef && worldRef.worldCheck) {
                const worldCheck = worldRef.worldCheck;
                
                if (worldCheck && typeof worldCheck.createLaserBeam === 'function' && 
                    worldRef.energyBallManager?.collectedCount > 0 && 
                    worldRef.laserBeams?.length === 0) {
                    const laser = worldCheck.createLaserBeam();
                    worldCheck.activateLaserBeam(laser);
                }
            }
        } catch (error) {
        }
    }

    /**
     * Fallback method to trigger superlaser manually if keyboard is not available
     */
    triggerSuperlaserManually() {
        try {
            let worldRef = null;
            
            if (typeof world !== 'undefined') {
                worldRef = world;
            } else if (window.world) {
                worldRef = window.world;
            }
            
            if (worldRef && worldRef.worldCheck) {
                const worldCheck = worldRef.worldCheck;
                
                if (worldCheck && typeof worldCheck.createSuperlaserBeam === 'function' && 
                    worldRef.energyBallManager?.collectedCount >= 3 && 
                    worldRef.laserBeams?.length === 0) {
                    const superlaser = worldCheck.createSuperlaserBeam();
                    worldCheck.activateSuperlaser(superlaser);
                } else if (worldCheck && typeof worldCheck.triggerSuperlaser === 'function' && 
                          worldRef.energyBallManager?.collectedCount >= 3) {
                    worldCheck.triggerSuperlaser();
                }
            }
        } catch (error) {
        }
    }

    /**
     * Stop laser usage and clear any intervals
     */
    stopUsingLaser() {
        this.isUsingLaser = false;
        
        if (this.laserInterval) {
            clearInterval(this.laserInterval);
            this.laserInterval = null;
        }
        
        if (this.singleTapTimeout) {
            clearTimeout(this.singleTapTimeout);
            this.singleTapTimeout = null;
        }
    }

}

document.addEventListener('DOMContentLoaded', () => {
    if (typeof window !== 'undefined') {
        window.laserButton = new LaserButton();
    }
});