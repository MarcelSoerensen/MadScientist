/**
 * MobileOrientationManager
 */
class MobileOrientationManager {
    /**
     * Initializes the orientation manager and sets up event listeners.
     */
    constructor() {
        this.isPortrait = false;
        this.isMobile = false;
        document.body.appendChild(
            document.querySelector('.mobile-controls-container') ||
            Object.assign(document.createElement('div'), { className: 'mobile-controls-container' })
        );
        document.body.appendChild(
            document.querySelector('.weapon-controls-container') ||
            Object.assign(document.createElement('div'), { className: 'weapon-controls-container' })
        );
        this.init();
    }

    /**
     * Sets up initial orientation and resize event listener.
     */
    init() {
        setTimeout(() => {
            this.updateOrientation();
        }, 250);

        window.addEventListener('resize', () => {
            this.updateOrientation();
        });
    }

    /**
     * Updates orientation and device type, shows or hides controls accordingly.
     */
    updateOrientation() {
    const isMobileWidth = window.innerWidth < 720;
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    this.isMobile = isTouch;
        this.isPortrait = window.innerHeight > window.innerWidth;
        if (this.isMobile) {
            this.repositionControls();
        } else {
            // Desktop: niemals Turn-Display-Overlay zeigen
            this.hideControls();
            this.hideOrientationOverlay();
        }
    }

    /**
     * Positions and shows/hides the control containers based on orientation and device type.
     */
    repositionControls() {
        let mobileContainer = document.querySelector('.mobile-controls-container');
        let weaponContainer = document.querySelector('.weapon-controls-container');
        if (!this.isMobile) {
            this.hideControls();
            this.hideOrientationOverlay();
            return;
        }
        if (window.PauseButtonManager?.isPaused || window.isPaused) {
            this.hideControls();
            return;
        }
        if (this.isPortrait) {
            if (window.innerWidth > 480) {
                this.setPortraitLayout(mobileContainer, weaponContainer);
                this.setControlsVisibility(true);
                this.hideOrientationOverlay();
            } else {
                this.showOrientationOverlay();
                this.hideControls();
                return;
            }
        } else {
            this.setLandscapeLayout(mobileContainer, weaponContainer);
            this.setControlsVisibility(true);
            this.hideOrientationOverlay();
        }
    }

    /**
     * Positions the control containers below the canvas for portrait mode.
     */
    setPortraitLayout(mobileContainer, weaponContainer) {
        if (mobileContainer.parentElement !== document.body) {
            document.body.appendChild(mobileContainer);
        }
        if (weaponContainer.parentElement !== document.body) {
            document.body.appendChild(weaponContainer);
        }
        const canvas = document.querySelector('canvas');
        if (canvas) {
            const canvasRect = canvas.getBoundingClientRect();
            const canvasBottom = canvasRect.bottom + window.scrollY;
            const canvasLeft = canvasRect.left + window.scrollX;
            const canvasRight = canvasRect.right + window.scrollX;
            const halfCanvasWidth = Math.max(0, Math.floor(canvasRect.width / 2) - 10);
            mobileContainer.style.top = `${canvasBottom + 10}px`;
            mobileContainer.style.left = `${canvasLeft}px`;
            mobileContainer.style.maxWidth = `${halfCanvasWidth}px`;
            weaponContainer.style.top = `${canvasBottom + 10}px`;
            const rightOffset = Math.max(0, window.innerWidth - canvasRight);
            weaponContainer.style.right = `${rightOffset}px`;
            weaponContainer.style.maxWidth = `${halfCanvasWidth}px`;
        }
        document.body.classList.add('mobile-portrait');
        document.body.classList.remove('mobile-landscape');
    }

    /**
     * Positions the control containers at the sides of the canvas for landscape mode.
     */
    setLandscapeLayout(mobileContainer, weaponContainer) {
        const canvas = document.querySelector('canvas');
        if (canvas && canvas.parentElement) {
            if (mobileContainer.parentElement !== canvas.parentElement) {
                canvas.parentElement.appendChild(mobileContainer);
            }
            if (weaponContainer.parentElement !== canvas.parentElement) {
                canvas.parentElement.appendChild(weaponContainer);
            }
        }
        ['top','left','right','maxWidth'].forEach(prop => {
            if (mobileContainer && mobileContainer.style[prop] !== undefined) mobileContainer.style[prop] = '';
            if (weaponContainer && weaponContainer.style[prop] !== undefined) weaponContainer.style[prop] = '';
        });

        document.body.classList.add('mobile-landscape');
        document.body.classList.remove('mobile-portrait');
    }

    /**
     * Hides the control containers and removes mobile-specific classes from the body.
     */
    hideControls() {
        const mobileContainer = document.querySelector('.mobile-controls-container');
        const weaponContainer = document.querySelector('.weapon-controls-container');
        if (mobileContainer && weaponContainer) {
            this.setControlsVisibility(false);
            document.body.classList.remove('mobile-portrait', 'mobile-landscape');
        }
    }

    /**
     * Toggle visibility classes on control containers to use CSS for display handling.
     */
    setControlsVisibility(visible) {
        const mobileContainer = document.querySelector('.mobile-controls-container');
        const weaponContainer = document.querySelector('.weapon-controls-container');
        const add = (el, cls) => el && el.classList.add(cls);
        const remove = (el, cls) => el && el.classList.remove(cls);
        if (visible) {
            remove(mobileContainer, 'controls-hidden');
            add(mobileContainer, 'controls-visible');
            remove(weaponContainer, 'controls-hidden');
            add(weaponContainer, 'controls-visible');
        } else {
            remove(mobileContainer, 'controls-visible');
            add(mobileContainer, 'controls-hidden');
            remove(weaponContainer, 'controls-visible');
            add(weaponContainer, 'controls-hidden');
        }
    }

    /**
     * Show the phone portrait rotate overlay.
     */
    showOrientationOverlay() {
        const overlay = document.getElementById('orientation-overlay');
        if (overlay) overlay.classList.remove('d-none');
        try { if (typeof SystemButtonManager !== 'undefined') SystemButtonManager.updateSystemButtonsVisibility(); } catch {}
    }

    /**
     * Hide the phone portrait rotate overlay.
     */
    hideOrientationOverlay() {
        const overlay = document.getElementById('orientation-overlay');
        if (overlay) overlay.classList.add('d-none');
        try { if (typeof SystemButtonManager !== 'undefined') SystemButtonManager.updateSystemButtonsVisibility(); } catch {}
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (typeof window !== 'undefined') {
        window.mobileOrientationManager = new MobileOrientationManager();
    }
});