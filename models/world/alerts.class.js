/**
 * Manages and animates all game alert text overlays (Superlaser, Level Complete, Game Over).
 * Usage: Instantiate in World, call showAlert(type, text, options) and draw(ctx) in World.draw().
 */
class GameAlerts {
    constructor(canvas) {
        this.canvas = canvas;
        this.activeAlert = null;
        this.alertAnim = null;
    }

    /**
     * Returns the style object for a given alert type, merged with custom options.
     * @param {string} type - The type of alert (e.g. 'superlaser', 'levelComplete', 'gameOver', 'fullEnergy').
     * @param {object} [options] - Custom style options to override defaults.
     * @returns {object} The style object for the alert.
     */
    getAlertStyle(type, options = {}) {
        const defaultStyles = {
            superlaser: {
                font: 'bold 50px "Comic Sans MS", "Comic Sans", cursive, sans-serif',
                duration: 1500
            },
            levelComplete: {
                font: 'bold 60px "Comic Sans MS", "Comic Sans", cursive, sans-serif',
                duration: 2000
            },
            gameOver: {
                font: 'bold 60px Arial, sans-serif',
                duration: 2500
            },
            fullEnergy: {
                font: 'bold 50px "Comic Sans MS", "Comic Sans", cursive, sans-serif',
                duration: 1500
            }
        };
        return { ...defaultStyles[type], ...options };
    }

    /**
     * Starts the interval for animating the current alert overlay.
     * Handles scaling and fading of the alert text.
     * Clears the interval when the animation is finished.
     * @returns {void}
     */
    startAlertAnimation() {
        if (this.alertAnim) clearInterval(this.alertAnim);
        this.alertAnim = setInterval(() => {
            if (this.activeAlert) {
                const elapsed = Date.now() - this.activeAlert.start;
                this.activeAlert.scale = 1 + elapsed / 700;
                this.activeAlert.alpha = Math.max(0, 1 - elapsed / this.activeAlert.duration);
                if (elapsed > this.activeAlert.duration) {
                    this.activeAlert = null;
                    clearInterval(this.alertAnim);
                    this.alertAnim = null;
                }
            }
        }, 30);
    }

    /**
     * Shows a new alert overlay with animation and styling.
     * @param {string} type - The type of alert (e.g. 'superlaser', 'levelComplete', 'gameOver', 'fullEnergy').
     * @param {string} text - The text to display in the alert.
     * @param {object} [options] - Custom style options to override defaults.
     * @returns {void}
     */
    showAlert(type, text, options = {}) {
        const style = this.getAlertStyle(type, options);
        this.activeAlert = {
            type,
            text,
            font: style.font,
            x: this.canvas.width / 2,
            y: this.canvas.height / 2,
            scale: 1,
            alpha: 1,
            duration: style.duration,
            start: Date.now()
        };
        this.startAlertAnimation();
    }

    /**
     * Triggers the Full Energy alert with animation and sound.
     * @returns {void}
     */
    triggerFullEnergy() {
        this.showAlert('fullEnergy', 'Full Energy', {
            font: 'bold 50px "Comic Sans MS", "Comic Sans", cursive, sans-serif',
            duration: 1500
        });
        try {
            const fullEnergySound = new Audio('sounds/full-energy.flac');
            fullEnergySound.volume = 0.5;
            fullEnergySound.play();
        } catch (e) {}
    }

    /**
     * Triggers the Superlaser alert with animation and sound.
     * @param {number} superShots - Number of available superlasers.
     * @returns {void}
     */
    triggerSuperlaser(superShots) {
        this.showAlert('superlaser', `Superlaser ${superShots}`);
        try {
            const availableSound = new Audio('sounds/available-superlaser.wav');
            availableSound.volume = 0.3;
            availableSound.play();
        } catch (e) {}
    }

    /**
     * Draws the current alert overlay if active.
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
     * @returns {void}
     */
    draw(ctx) {
        if (!this.activeAlert) return;
        ctx.save();
        ctx.font = this.activeAlert.font;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.globalAlpha = this.activeAlert.alpha;
        ctx.translate(this.activeAlert.x, this.activeAlert.y);
        ctx.scale(this.activeAlert.scale, this.activeAlert.scale);
        ctx.lineWidth = 6;
        ctx.strokeStyle = 'black';
        ctx.strokeText(this.activeAlert.text, 0, 0);
        ctx.fillStyle = 'rgba(255,255,255,1)';
        ctx.fillText(this.activeAlert.text, 0, 0);
        ctx.restore();
    }
}

window.GameAlerts = GameAlerts;
