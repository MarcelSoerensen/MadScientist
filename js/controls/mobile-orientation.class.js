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
        const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        this.isMobile = isMobileDevice || isMobileWidth;
        this.isPortrait = window.innerHeight > window.innerWidth;
        if (this.isMobile) {
            this.repositionControls();
        } else {
            this.hideControls();
        }
    }

    /**
     * Positions and shows/hides the control containers based on orientation and device type.
     */
    repositionControls() {
        let mobileContainer = document.querySelector('.mobile-controls-container');
        let weaponContainer = document.querySelector('.weapon-controls-container');
        if (!mobileContainer) {
            mobileContainer = document.createElement('div');
            mobileContainer.className = 'mobile-controls-container';
            document.body.appendChild(mobileContainer);
        }
        if (!weaponContainer) {
            weaponContainer = document.createElement('div');
            weaponContainer.className = 'weapon-controls-container';
            document.body.appendChild(weaponContainer);
        }
        if (!this.isMobile) {
            this.hideControls();
            return;
        }
        if (this.isPortrait) {
            this.setPortraitLayout(mobileContainer, weaponContainer);
        } else {
            this.setLandscapeLayout(mobileContainer, weaponContainer);
        }
        mobileContainer.style.display = 'flex';
        weaponContainer.style.display = 'flex';
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
            mobileContainer.style.left = '';
            mobileContainer.style.right = '';
            mobileContainer.style.transform = '';
            weaponContainer.style.left = '';
            weaponContainer.style.right = '';
            weaponContainer.style.transform = '';
            mobileContainer.style.position = 'absolute';
            mobileContainer.style.top = `${canvasBottom + 10}px`;
            mobileContainer.style.left = '10px';
            mobileContainer.style.flexDirection = 'row';
            mobileContainer.style.gap = '0.3em';
            mobileContainer.style.zIndex = '99999';
            weaponContainer.style.position = 'absolute';
            weaponContainer.style.top = `${canvasBottom + 10}px`;
            weaponContainer.style.right = '10px';
            weaponContainer.style.flexDirection = 'row';
            weaponContainer.style.gap = '0.3em';
            weaponContainer.style.zIndex = '99999';
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
        mobileContainer.style.left = '';
        mobileContainer.style.right = '';
        mobileContainer.style.transform = '';
        mobileContainer.style.top = '';
        mobileContainer.style.bottom = '';
        weaponContainer.style.left = '';
        weaponContainer.style.right = '';
        weaponContainer.style.transform = '';
        weaponContainer.style.top = '';
        weaponContainer.style.bottom = '';
        mobileContainer.style.position = 'absolute';
        mobileContainer.style.bottom = '2vh';
        mobileContainer.style.left = '2vw';
        mobileContainer.style.flexDirection = 'row';
        mobileContainer.style.gap = '1vw';
        mobileContainer.style.zIndex = '99999';
        weaponContainer.style.position = 'absolute';
        weaponContainer.style.bottom = '2vh';
        weaponContainer.style.right = '2vw';
        weaponContainer.style.flexDirection = 'row';
        weaponContainer.style.gap = '1vw';
        weaponContainer.style.zIndex = '99999';
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
            mobileContainer.style.display = 'none';
            weaponContainer.style.display = 'none';
            document.body.classList.remove('mobile-portrait', 'mobile-landscape');
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (typeof window !== 'undefined') {
        window.mobileOrientationManager = new MobileOrientationManager();
    }
});