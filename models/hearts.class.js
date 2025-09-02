/**
 * Represents a collectible heart in the game.
 * @class CollectibleHeart
 * @extends CollidableObject
 */
class CollectibleHeart extends CollidableObject {
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
    draw(ctx) {
        if (this.collected && !this.isCollecting) return;
        ctx.save();
        ctx.globalAlpha = 1;
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
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
    }
}

/**
 * Manages all hearts in the game. Handles placement, collection, and drawing.
 * @class HeartsManager
 * @extends DrawableObject
 */
class HeartsManager extends DrawableObject {
    /**
     * Creates a HeartsManager instance and places hearts randomly in the level.
     * @param {number} worldWidth - The width of the world
     * @param {number} worldHeight - The height of the world
     * @param {Character} character - The main character
     * @param {Array} enemies - Array of enemy objects
     */
    constructor(worldWidth, worldHeight, character, enemies = []) {
        super();
        this.hearts = [];
        this.collectedCount = 0;
        this.maxHearts = 5;
        const minDist = 80;
        let tries = 0;
        let jumpHeight = character && typeof character.jumpHeight === 'number' ? character.jumpHeight : 100;
        let heartsToPlace = 5;
        let lowerCount = Math.floor(heartsToPlace / 2);
        let lowerY = 330;
        let upperY = 170 + jumpHeight / 2;
        let minX = character && typeof character.x === 'number' && typeof character.width === 'number'
            ? Math.max(character.x + character.width + 100, 50)
            : 50;
        while (this.hearts.length < heartsToPlace && tries < 1000) {
            let x;
            if (this.hearts.length === 0) {
                if (
                    character &&
                    typeof character.x === 'number' &&
                    typeof character.width === 'number' &&
                    character.offset &&
                    typeof character.offset.right === 'number'
                ) {
                    x = character.x + character.width - character.offset.right + 100;
                } else {
                    x = 200;
                }
            } else {
                x = minX + Math.random() * Math.max(0, worldWidth - minX - 1000);
            }
            let y;
            if (this.hearts.length < lowerCount) {
                y = lowerY + Math.random() * 10 - 5;
            } else {
                y = upperY + Math.random() * 10 - 5;
            }
            let tooClose = this.hearts.some(h => {
                let dx = h.x - x;
                let dy = h.y - y;
                return Math.sqrt(dx*dx + dy*dy) < minDist;
            });
            let heart = new CollectibleHeart(x, y);
            let collidesWithEnemy = enemies.some(enemy => heart.isColliding(enemy));
            if (!tooClose && !collidesWithEnemy) {
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
            heart.updatePulse();
            if (!heart.isCollecting && character && heart.isColliding(character)) {
                if (this.collectedCount < this.maxHearts) {
                    heart.collected = true;
                    character.energy = Math.min(character.energy + 20, 100);
                    if (character.world && character.world.statusBar) {
                        character.world.statusBar.setPercentage(character.energy);
                    }
                    this.hearts.splice(i, 1);
                    this.collectedCount++;
                }
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


