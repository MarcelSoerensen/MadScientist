/**
 * Manages collectible bombs in the level, similar to energy balls.
 * Handles bomb placement, collection, and inventory logic.
 * @class BombManager
 * @extends DrawableObject
 */
class BombManager extends DrawableObject {
    /**
     * Creates a BombManager instance and places bombs randomly in the level.
     * @param {number} levelWidth - The width of the level
     * @param {number} levelHeight - The height of the level
     * @param {Character} character - The main character
     */
    constructor(levelWidth, levelHeight, character) {
        super();
        this.bombs = [];
        this.collectedCount = 0;
        this.maxBombs = 5;
        this.character = character;
        this.placeBombs(levelWidth, levelHeight);
    }

    /**
     * Places bombs randomly in the level.
     * @param {number} levelWidth
     * @param {number} levelHeight
     */
    placeBombs(levelWidth, levelHeight) {
        let tries = 0;
        let bombsToPlace = this.maxBombs;
        let lowerCount = Math.floor(bombsToPlace / 2);
        let lowerY = 330;
        let upperY = 170 + (this.character && typeof this.character.jumpHeight === 'number' ? this.character.jumpHeight / 2 : 50);
        let minX = this.character && typeof this.character.x === 'number' && typeof this.character.width === 'number'
            ? Math.max(this.character.x + this.character.width + 100, 50)
            : 50;

        while (this.bombs.length < bombsToPlace && tries < 1000) {
            let x;
            if (this.bombs.length === 0) {
                if (
                    this.character &&
                    typeof this.character.x === 'number' &&
                    typeof this.character.width === 'number' &&
                    this.character.offset &&
                    typeof this.character.offset.right === 'number'
                ) {
                    x = this.character.x + this.character.width - this.character.offset.right + 100;
                } else {
                    x = 200;
                }
            } else {
                x = minX + Math.random() * Math.max(0, levelWidth - minX - 1000);
            }
            let y;
            if (this.bombs.length < lowerCount) {
                y = lowerY + Math.random() * 10 - 5;
            } else {
                y = upperY + Math.random() * 10 - 5;
            }
            let tooClose = this.bombs.some(b => {
                let dx = b.x - x;
                let dy = b.y - y;
                return Math.sqrt(dx*dx + dy*dy) < 80;
            });
            let bomb = new CollectibleBomb(x, y);
            if (!tooClose) {
                this.bombs.push(bomb);
            }
            tries++;
        }
    }

    /**
     * Updates all bombs and handles collection by the character.
     * @param {object} character - The main character object.
     */
    update(character) {
        // Zielkoordinaten der BombsBar (müssen ggf. angepasst werden)
        const barY = 50;
        for (let i = this.bombs.length - 1; i >= 0; i--) {
            const bomb = this.bombs[i];
            if (typeof bomb.update === 'function') {
                bomb.update();
            }
            if (
                typeof bomb.startCollecting === 'function' &&
                !bomb.isCollecting && character && bomb.isColliding(character)
            ) {
                // Ziel-x = Start-x - 100, Ziel-y = 50 (nach links und oben)
                bomb.startCollecting(bomb.originX - 100, barY);
            }
            if (bomb.isCollecting && bomb.collectProgress >= 1) {
                this.bombs.splice(i, 1);
                this.collectedCount++;
            }
        }
    }

    /**
     * Draws all bombs on the canvas.
     * @param {CanvasRenderingContext2D} ctx
     */
    draw(ctx) {
        this.bombs.forEach(bomb => bomb.draw(ctx));
    }
}

/**
 * Represents a collectible bomb in the level.
 * @class CollectibleBomb
 * @extends DrawableObject
 */
class CollectibleBomb extends CollidableObject {
    /**
     * Creates a CollectibleBomb instance.
     * @param {number} x - The x position
     * @param {number} y - The y position
     */
    constructor(x, y) {
        super();
    this.x = x;
    this.y = y;
    this.width = 40;
    this.height = 40;
    this.img = new Image();
    this.img.src = 'img/Projectile/Other/1.png';
    this.offset = { top: 0, left: 0, right: 0, bottom: 0 };
    this.originX = x;
    this.originY = y;
    this.isCollecting = false;
    this.collectProgress = 0;
    this.startX = x;
    this.startY = y;
    this.targetX = x;
    this.targetY = y;
    this.startWidth = this.width;
    this.startHeight = this.height;
    }

    /**
     * Starts the collect animation to the bombs bar
     */
    startCollecting(targetX, targetY) {
        if (this.isCollecting) return;
        this.isCollecting = true;
        this.collectProgress = 0;
        this.startX = this.originX;
        this.startY = this.originY;
        this.targetX = targetX;
        this.targetY = targetY;
        this.startWidth = 40;
        this.startHeight = 40;
        const dx = this.targetX - this.startX;
        const dy = this.targetY - this.startY;
        this.distance = Math.sqrt(dx*dx + dy*dy);
        this.speed = 10;
        this.duration = this.distance / this.speed;
        if (this.duration < 1) this.duration = 1;
    }

    /**
     * Updates the animation if the bomb is being collected
     */
    update() {
        if (this.isCollecting) {
            if (!this.duration) this.duration = 1;
            this.collectProgress += 1 / this.duration;
            if (this.collectProgress >= 1) {
                this.x = this.targetX;
                this.y = this.targetY;
                this.width = this.startWidth * 0.4;
                this.height = this.startHeight * 0.4;
                if (!this._animationDone) {
                    this._animationDone = true;
                }
            } else {
                this.x = this.startX + (this.targetX - this.startX) * this.collectProgress;
                this.y = this.startY + (this.targetY - this.startY) * this.collectProgress;
                const shrink = 1 - 0.6 * this.collectProgress;
                this.width = this.startWidth * shrink;
                this.height = this.startHeight * shrink;
            }
        }
    }

    /**
     * Draws the bomb (including animation)
     */
    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = 1;
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
        ctx.restore();
    }

}

