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
        setTimeout(() => this.updateOrientation(), 250);
        ['resize','orientationchange'].forEach(ev => window.addEventListener(ev, () => this.updateOrientation()));
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
            this.hideControls();
            this.hideOrientationOverlay();
        }
    }

    /**
     * Positions and shows/hides the control containers based on orientation and device type.
     */
    repositionControls() {
        const mobileContainer = document.querySelector('.mobile-controls-container');
        const weaponContainer = document.querySelector('.weapon-controls-container');
        if (!this.isMobile || window.PauseButtonManager?.isPaused || window.isPaused)
            return this.hideControls(), this.hideOrientationOverlay();
        if (this.isPortrait && window.innerWidth <= 480)
            return this.showOrientationOverlay(), this.hideControls();
        (this.isPortrait ? this.setPortraitLayout : this.setLandscapeLayout)(mobileContainer, weaponContainer);
        this.setControlsVisibility(true);
        this.hideOrientationOverlay();
    }

    /**
     * Positions the control containers below the canvas for portrait mode.
     */
    setPortraitLayout(mobileContainer, weaponContainer) {
        [mobileContainer, weaponContainer].forEach(c => c.parentElement !== document.body && document.body.appendChild(c));
        const canvas = document.querySelector('canvas');
        if (canvas) {
            const rect = canvas.getBoundingClientRect();
            const canvasBottom = rect.bottom + window.scrollY;
            const canvasLeft = rect.left + window.scrollX;
            const canvasRight = rect.right + window.scrollX;
            const halfCanvasWidth = Math.max(0, Math.floor(rect.width / 2) - 10);
            Object.assign(mobileContainer.style, { top: `${canvasBottom + 10}px`, left: `${canvasLeft}px`, maxWidth: `${halfCanvasWidth}px` });
            Object.assign(weaponContainer.style, { top: `${canvasBottom + 10}px`, right: `${Math.max(0, window.innerWidth - canvasRight)}px`, maxWidth: `${halfCanvasWidth}px` });
        }
        document.body.classList.add('mobile-portrait');
        document.body.classList.remove('mobile-landscape');
    }

    /**
     * Positions the control containers at the sides of the canvas for landscape mode.
     */
    setLandscapeLayout(mobileContainer, weaponContainer) {
        const canvas = document.querySelector('canvas');
        if (canvas?.parentElement) {
            [mobileContainer, weaponContainer].forEach(c => c.parentElement !== canvas.parentElement && canvas.parentElement.appendChild(c));
        }
        ['top','left','right','maxWidth'].forEach(prop => {
            [mobileContainer, weaponContainer].forEach(c => c?.style[prop] !== undefined && (c.style[prop] = ''));
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

/**
 * Initialize MobileOrientationManager when DOM is ready
 */
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.mobileOrientationManager = new MobileOrientationManager();
    });
} else {
    window.mobileOrientationManager = new MobileOrientationManager();
}