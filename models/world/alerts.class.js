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
                levelComplete: 'sounds/endboss-death.mp3',
                gameOver: 'sounds/character-death.mp3'
            };
            if (sounds[type]) {
                const audio = new Audio(sounds[type]);
                audio.volume = 0.5;
                audio.play();
            }
        }

    /**
     * Shows an alert overlay with animation and sound.
     */
    showAlert(type, text, options = {}) {
            const style = this.getAlertStyle(type, options);
            this.activeAlert = {
                type,
                text,
                start: Date.now(),
                duration: style.duration,
                font: style.font,
                scale: 1,
                alpha: 1
            };
            this.playSound(type);
            this.startAlertAnimation();
        }

    /**
     * Triggers the Superlaser alert with the current number of available supershots.
     */
    triggerSuperlaser(superShots) {
        this.showAlert('superlaser', `Superlaser ${superShots}`);
        this.playSound('superlaser');
    }

    /**
     * Triggers the Full Energy alert.
     */
    triggerFullEnergy() {
        this.showAlert('fullEnergy', 'Volle Energie!');
        this.playSound('fullEnergy');
    }

    /**
     * Triggers the Level Complete alert.
     */
    triggerLevelComplete() {
        this.showAlert('levelComplete', 'Level Complete');
        this.playSound('levelComplete');
    }

    /**
     * Triggers the Game Over alert and shows the game over screen after the alert.
     */
    triggerGameOver() {
        this.showAlert('gameOver', 'Game Over');
        this.playSound('gameOver');
        
        setTimeout(() => {
            if (typeof window.showGameOverScreen === 'function') {
                window.showGameOverScreen();
            }
        }, 2500); 
    }

    /**
     * Returns the style object for a given alert type.
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
        this.startAlertAnimation();
    }

    /**
     * Triggers the Full Energy alert with animation and sound.
     */
    triggerFullEnergy() {
        this.showAlert('fullEnergy', 'Full Energy', {
            font: 'bold 50px "Comic Sans MS", "Comic Sans", cursive, sans-serif',
            duration: 1500
        });
        try {
            const fullEnergySound = new Audio('sounds/full-energy.mp3');
            fullEnergySound.volume = 0.5;
            fullEnergySound.play();
        } catch (e) {}
    }

    /**
     * Triggers the Superlaser alert with animation and sound.
     */
    triggerSuperlaser(superShots) {
        this.showAlert('superlaser', `Superlaser ${superShots}`);
        try {
            const availableSound = new Audio('sounds/available-superlaser.mp3');
            availableSound.volume = 0.3;
            availableSound.play();
        } catch (e) {}
    }

    /**
     * Triggers the Level Complete alert with animation and sound, then shows win screen.
     */
    triggerLevelComplete() {
        this.showAlert('levelComplete', 'Level Complete', {
            font: 'bold 60px "Comic Sans MS", "Comic Sans", cursive, sans-serif',
            duration: 2000
        });
        
        this.playLevelCompleteSound();
        
        const scoreData = this.getScoreData();
        
        setTimeout(() => {
            if (typeof window.showWinScreen === 'function') {
                window.showWinScreen(scoreData);
            }
        }, 2500); 
    }

    /**
     * Plays the level complete sound effect with fade out.
     */
    playLevelCompleteSound() {
        try {
            const levelCompleteSound = new Audio('sounds/endboss-death.mp3');
            levelCompleteSound.volume = 0.5;
            levelCompleteSound.play();
            
            const startVolume = 0.5;
            const fadeStep = startVolume / (2000 / 50); // Update every 50ms
            
            const fadeInterval = setInterval(() => {
                if (levelCompleteSound.volume > 0.01) {
                    levelCompleteSound.volume = Math.max(0, levelCompleteSound.volume - fadeStep);
                } else {
                    levelCompleteSound.volume = 0;
                    levelCompleteSound.pause();
                    clearInterval(fadeInterval);
                }
            }, 50);
        } catch (e) {}
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
