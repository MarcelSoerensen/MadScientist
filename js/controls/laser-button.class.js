/**
 * Mobile laser weapon control for Mad Scientist game
 */
class LaserButton {
    /**
     * Initializes the laser weapon button and its functionality.
     */
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
        this.addLaserTouchListeners();
        this.laserButtonContainer.appendChild(this.laserButton);
    }

    /**
     * Add touch/mouse event listeners for laser button
     */
    addLaserTouchListeners() {
        if (!this.laserButton) return;
        const btn = this.laserButton;
        const press = e => { if (e.cancelable) e.preventDefault(); e.stopPropagation(); btn.classList.add('pressed'); };
        const release = e => { if (e.cancelable) e.preventDefault(); e.stopPropagation(); btn.classList.remove('pressed'); this.handleTap(); };
        ['touchstart','mousedown'].forEach(ev => btn.addEventListener(ev, press, { passive:false }));
        ['touchend','touchcancel','mouseup','mouseleave'].forEach(ev => btn.addEventListener(ev, release, { passive:false }));
        btn.addEventListener('contextmenu', e => e.preventDefault());
    }

    /**
     * Update superlaser visuals using existing SuperShotBar
     */
    updateSuperlaserVisuals() {
        if (!this.laserButton) return;
        const worldRef = window.world;
        const superShots = worldRef?.superShotBar?.getSuperShots?.();
        if (superShots > 0) {
            this.laserButton.classList.add('superlaser-ready');
            this.laserButton.title = `Fire Laser (Tap=Normal, Double-tap=SUPERLASER! ${superShots} available)`;
        } else {
            this.laserButton.classList.remove('superlaser-ready');
            this.laserButton.title = 'Fire Laser (Tap=Normal, collect 3 energy balls for superlaser)';
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
        const worldRef = window.world;
        const superShots = worldRef?.superShotBar?.getSuperShots?.() || 0;
        if (superShots > 0) {
            this.handleTapWithSuperlaser();
        } else {
            this.fireLaser();
            this.lastTapTime = Date.now();        }
    }

    /**
     * Handle tap with superlaser available (single vs double tap)
     */
    handleTapWithSuperlaser() {
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
        this.keyboard ||= window.keyboard || (window.world && window.world.keyboard) || null;
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
        this.keyboard ||= window.keyboard || (window.world && window.world.keyboard) || null;
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
        const worldRef = window.world ?? (typeof world !== 'undefined' ? world : null);
        const worldCheck = worldRef?.worldCheck;
        if (
            typeof worldCheck?.createLaserBeam === 'function' &&
            worldRef?.energyBallManager?.collectedCount > 0 &&
            worldRef?.laserBeams?.length === 0
        ) {
            worldCheck.activateLaserBeam(worldCheck.createLaserBeam());
        }
    }

    /**
     * Fallback method to trigger superlaser manually if keyboard is not available
     */
    triggerSuperlaserManually() {
        const worldRef = window.world ?? (typeof world !== 'undefined' ? world : null);
        const worldCheck = worldRef?.worldCheck;
        if (
            typeof worldCheck?.createSuperlaserBeam === 'function' &&
            worldRef?.energyBallManager?.collectedCount >= 3 &&
            worldRef?.laserBeams?.length === 0
        ) {
            worldCheck.activateSuperlaser(worldCheck.createSuperlaserBeam());
        } else if (
            typeof worldCheck?.triggerSuperlaser === 'function' &&
            worldRef?.energyBallManager?.collectedCount >= 3
        ) {
            worldCheck.triggerSuperlaser();
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

/**
 * Initialize LaserButton when DOM is ready
 */
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.laserButton = new LaserButton();
    });
} else {
    window.laserButton = new LaserButton();
}