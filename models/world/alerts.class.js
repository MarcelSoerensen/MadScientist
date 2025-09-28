/**
 * GameAlerts: game alert management with animated overlays and sound effects.
 */

class GameAlerts {
    /**
     * Creates a new GameAlerts instance for managing animated game alerts.
     */
    constructor(canvas) {
        this.canvas = canvas;
        this.activeAlert = null;
        this.alertAnim = null;
    }

    /**
     * Plays the sound associated with a given alert type.
     */
    playSound(type) {
        const sounds = {
            superlaser: 'sounds/available-superlaser.mp3',
            fullEnergy: 'sounds/full-energy.mp3',
            gameOver: 'sounds/character-death.mp3'
        };
        if (sounds[type]) {
            try {
                const audio = SoundCacheManager.getAudio(sounds[type]);
                audio.volume = 0.5;
                audio.play();
            } catch (err) {
                if (window && window.console) console.warn('Sound konnte nicht abgespielt werden:', err);
            }
        }
    }

    /**
     * Shows a new alert overlay with animation and styling.
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
        this.playSound(type);
        this.startAlertAnimation();
    }

    /**
     * Triggers the Superlaser alert with the current number of available supershots.
     */
    triggerSuperlaser(superShots) {
        this.showAlert('superlaser', `Superlaser ${superShots}`);
    }

    /**
     * Triggers the Full Energy alert.
     */
    triggerFullEnergy() {
        this.showAlert('fullEnergy', 'Full Energy!');
    }

    /**
     * Triggers the Game Over alert and shows the game over screen after the alert.
     */
    triggerGameOver() {
        let callback = null;
        if (arguments.length > 0 && typeof arguments[0] === 'function') {
            callback = arguments[0];
        }
        if (typeof window !== 'undefined' && window.backgroundMusic) {
            window.backgroundMusic.pause();
            window.backgroundMusic.currentTime = 0;
        }
        this.showAlert('gameOver', 'Game Over');
        this.playSound('gameOver');
        setTimeout(() => {
            if (typeof window.showGameOverScreen === 'function') {
                window.showGameOverScreen();
            }
            if (callback) setTimeout(callback, 1000);
        }, 2500);
    }

    /**
     * Returns the style object for a given alert type.
     */
    getAlertStyle(type, options = {}) {
        const baseFont = 'bold 50px "Comic Relief", "Comic Sans MS", "Comic Sans", cursive, sans-serif';
        const styles = {
            superlaser:  { font: baseFont, duration: 1500 },
            fullEnergy:  { font: baseFont, duration: 1500 },
            levelComplete: { font: 'bold 60px "Comic Relief", "Comic Sans MS", "Comic Sans", cursive, sans-serif', duration: 2000 },
            gameOver:    { font: 'bold 60px "Comic Relief", "Comic Sans MS", "Comic Sans", cursive, sans-serif', duration: 2500 }
        };
        return { ...styles[type], ...options };
    }

    /**
     * Starts the animation interval for the current alert overlay.
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
     * Triggers the Level Complete alert with Musik-Stop, animation and Sound.
     */
    triggerLevelComplete() {
        if (typeof window !== 'undefined' && window.backgroundMusic) {
            window.backgroundMusic.pause();
            window.backgroundMusic.currentTime = 0;
        }
        this.showAlert('levelComplete', 'Level Complete', {
            font: 'bold 60px "Comic Relief", "Comic Sans MS", "Comic Sans", cursive, sans-serif',
            duration: 2000
        });
        const scoreData = this.getScoreData();
        setTimeout(() => {
            if (typeof window.showWinScreen === 'function') {
                window.showWinScreen(scoreData);
            }
        }, 2500);
    }

    /**
     * Gets the current score data for win screen display.
     */
    getScoreData() {
        const defaultScore = { collected: 0, total: 20 };
        
        if (this.world?.energyBallManager) {
            return {
                collected: this.world.energyBallManager.totalCollectedCount || 0,
                total: this.world.energyBallManager.maxBalls || 20
            };
        }
        
        return window.gameScoreData ? { ...window.gameScoreData } : defaultScore;
    }

    /**
     * Draws the current alert overlay if active.
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
