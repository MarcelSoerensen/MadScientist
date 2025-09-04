    _lastNoHeartSoundTime = 0;
/**
 * Represents a collectible heart in the game.
 * @class CollectibleHeart
 * @extends CollidableObject
 */
class CollectibleHeart extends CollidableObject {
    /**
     * Triggers a bounce animation when the heart cannot be collected.
     */
    triggerBounce() {
        this.bounceActive = true;
        this.bounceProgress = 0;
    }
    /**
     * Creates a CollectibleHeart instance.
     * @param {number} x - The x position
     * @param {number} y - The y position
     */
    constructor(x, y) {
        super();
        this.x = x;
        this.y = y;
        this.width = 32;
        this.height = 32;
        this.img = new Image();
        this.img.src = 'img/User Interfaces/HpICon.png';
        this.collected = false;
        this.baseSize = 32;
        this.pulse = 0;
        this.isCollecting = false;
        this.collectProgress = 0;
        this.pulseCount = 0;
        this.maxPulses = 2;
        this.fadeAlpha = 1;
    }

    /**
     * Checks collision with the character using the character's collision rectangle.
     * @param {Character} character - The main character
     * @returns {boolean} True if colliding, else false
     */
    isColliding(character) {
        const charLeft = character.x + (character.offset?.left || 0);
        const charRight = character.x + character.width - (character.offset?.right || 0);
        let charTop = character.y + (character.offset?.top || 0);
        if (character.jumpOffsetY !== undefined) {
            charTop += character.jumpOffsetY * 1.5;
        }
        const charBottom = charTop + character.height - (character.offset?.top || 0) - (character.offset?.bottom || 0);
        return (
            this.x < charRight &&
            this.x + this.width > charLeft &&
            this.y < charBottom &&
            this.y + this.height > charTop
        );
    }

    /**
     * Updates the pulse animation for the heart (static, no animation).
     */
    updatePulse() {
        this.fadeScale = 1;
    }

    /**
     * Draws the heart on the canvas.
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
     */
    /**
     * Draws the heart with animation (pulsing and diagonal movement).
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
     */
    draw(ctx) {
        if (this.collected && !this.isCollecting) return;
        ctx.save();
        if (this.bounceActive) {
            this.bounceProgress = (this.bounceProgress || 0) + 0.08;
            let scale = 1 - 0.7 * Math.sin(Math.PI * Math.min(this.bounceProgress, 1));
            let alpha = 0.5 + 0.5 * Math.abs(Math.sin(Math.PI * Math.min(this.bounceProgress, 1)));
            ctx.globalAlpha = alpha;
            ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
            ctx.scale(scale, scale);
            ctx.drawImage(this.img, -this.width / 2, -this.height / 2, this.width, this.height);
            ctx.globalAlpha = 1;
            if (this.bounceProgress >= 1) {
                this.bounceActive = false;
                this.bounceProgress = 0;
            }
        } else if (!this.isCollecting) {
            let t = performance.now() * 0.004;
            let move = Math.sin(t);
            ctx.translate(this.x + move + this.width / 2, this.y + move + this.height / 2);
            ctx.drawImage(this.img, -this.width / 2, -this.height / 2, this.width, this.height);
        } else {
            if (this.collectProgress === undefined) this.collectProgress = 0;
            this.collectProgress += 0.04;
            let pulse = 1;
            let alpha = 1;
            if (this.collectProgress < 1) {
                pulse = 1 + 22 / this.width * Math.abs(Math.sin(this.collectProgress * Math.PI * 2));
                alpha = 1;
            } else if (this.collectProgress < 2) {
                pulse = 1 + 22 / this.width * Math.abs(Math.sin((this.collectProgress - 1) * Math.PI * 2));
                alpha = Math.max(0, 1 - (this.collectProgress - 1));
            } else {
                pulse = 2.3;
                alpha = 0;
            }
            ctx.globalAlpha = alpha;
            ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
            ctx.scale(pulse, pulse);
            ctx.drawImage(this.img, -this.width / 2, -this.height / 2, this.width, this.height);
        }
        ctx.restore();
    }
    /**
     * Starts the collect animation for the heart.
     */
    startCollecting() {
        if (this.isCollecting) return;
        this.isCollecting = true;
        this.pulse = 0;
        this.pulseCount = 0;
        this.fadeAlpha = 1;
        this.collectProgress = 0;
        try {
            const heartSound = new Audio('sounds/heartbeat.wav');
            heartSound.volume = 0.7;
            heartSound.play();
            setTimeout(() => {
                heartSound.pause();
                heartSound.currentTime = 0;
            }, 500);
        } catch (e) {
        }
    }
}

/**
 * Manages all hearts in the game. Handles placement, collection, and drawing.
 * @class HeartsManager
 * @extends DrawableObject
 */
class HeartsManager extends DrawableObject {
    _lastFullEnergy = false;
    /**
     * Creates a HeartsManager instance and places hearts randomly in the level.
     * @param {number} worldWidth - The width of the world
     * @param {number} worldHeight - The height of the world
     * @param {Character} character - The main character
     * @param {Array} enemies - Array of enemy objects
     */
    constructor(worldWidth, worldHeight, character, enemies = [], energyBalls = [], bombs = []) {
        super();
        this.hearts = [];
        this.collectedCount = 0;
        this.maxHearts = 3;
        const minDist = 100;
        let tries = 0;
        let jumpHeight = character && typeof character.jumpHeight === 'number' ? character.jumpHeight : 100;
        let heartsToPlace = 3;
        let lowerCount = Math.floor(heartsToPlace / 2);
        let lowerY = 330;
        let upperY = 170 + jumpHeight / 2;
        let minX = Math.max(1200, character && typeof character.x === 'number' && typeof character.width === 'number'
            ? character.x + character.width + 100
            : 50);
        while (this.hearts.length < heartsToPlace && tries < 1000) {
            let x = minX + Math.random() * Math.max(0, worldWidth - minX - 1000);
            let y = (this.hearts.length < lowerCount)
                ? lowerY + Math.random() * 10 - 5
                : upperY + Math.random() * 10 - 5;
            let tooCloseHearts = this.hearts.some(h => {
                let dx = h.x - x;
                let dy = h.y - y;
                return Math.sqrt(dx*dx + dy*dy) < minDist;
            });
            let tooCloseEnergy = energyBalls.some(e => {
                let dx = e.x - x;
                let dy = e.y - y;
                return Math.sqrt(dx*dx + dy*dy) < minDist;
            });
            let tooCloseBombs = bombs.some(b => {
                let dx = b.x - x;
                let dy = b.y - y;
                return Math.sqrt(dx*dx + dy*dy) < minDist;
            });
            let heart = new CollectibleHeart(x, y);
            let collidesWithEnemy = enemies.some(enemy => heart.isColliding(enemy));
            if (!tooCloseHearts && !tooCloseEnergy && !tooCloseBombs && !collidesWithEnemy) {
                this.hearts.push(heart);
            }
            tries++;
        }
    }

    /**
     * Updates all hearts and handles collection by the character.
     * @param {Character} character - The main character
     */
    update(character) {
        for (let i = this.hearts.length - 1; i >= 0; i--) {
            const heart = this.hearts[i];
            if (typeof heart.update === 'function') heart.update();
            if (!heart.isCollecting && character && heart.isColliding(character)) {
                if (this.collectedCount < this.maxHearts && character.energy < 100) {
                    heart.collected = true;
                    const beforeEnergy = character.energy;
                    character.energy = Math.min(character.energy + 33, 100);
                    if (character.world && character.world.statusBar) {
                        character.world.statusBar.setPercentage(character.energy);
                    }
                    heart.startCollecting(heart.x, heart.y - 50);
                    if (beforeEnergy < 100 && character.energy === 100 && character.world && typeof character.world._superlaserText !== 'undefined') {
                        character.world._superlaserText = {
                            text: 'Full Energy',
                            font: 'bold 50px "Comic Sans MS", "Comic Sans", cursive, sans-serif',
                            x: character.world.canvas.width / 2,
                            y: character.world.canvas.height / 2,
                            scale: 1,
                            alpha: 1,
                            duration: 1500,
                            start: Date.now()
                        };
                        try {
                            const fullEnergySound = new Audio('sounds/full-energy.flac');
                            fullEnergySound.volume = 0.5;
                            fullEnergySound.play();
                        } catch (e) {}
                        if (character.world._superlaserTextAnim) {
                            clearInterval(character.world._superlaserTextAnim);
                        }
                        character.world._superlaserTextAnim = setInterval(() => {
                            if (character.world._superlaserText) {
                                const elapsed = Date.now() - character.world._superlaserText.start;
                                character.world._superlaserText.scale = 1 + elapsed / 700;
                                character.world._superlaserText.alpha = Math.max(0, 1 - elapsed / character.world._superlaserText.duration);
                                if (elapsed > character.world._superlaserText.duration) {
                                    character.world._superlaserText = null;
                                    clearInterval(character.world._superlaserTextAnim);
                                    character.world._superlaserTextAnim = null;
                                }
                            }
                        }, 30);
                    }
                } else if (character.energy >= 100) {
                    if (!heart.bounceActive) heart.triggerBounce();
                    const now = Date.now();
                    if (!this._lastNoHeartSoundTime || now - this._lastNoHeartSoundTime > 2000) {
                        try {
                            const noHeartSound = new Audio('sounds/no-heart.wav');
                            noHeartSound.volume = 0.2;
                            noHeartSound.play();
                            this._lastNoHeartSoundTime = now;
                        } catch (e) {}
                    }
                }
            }
            if (heart.isCollecting && heart.collectProgress >= 1) {
                this.hearts.splice(i, 1);
                this.collectedCount++;
            }
        }
    }

    /**
     * Draws all hearts on the canvas.
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
     */
    draw(ctx) {
        this.hearts.forEach(heart => heart.draw(ctx));
    }
}


