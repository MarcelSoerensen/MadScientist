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
        for (let i = this.bombs.length - 1; i >= 0; i--) {
            const bomb = this.bombs[i];
            if (character && bomb.isColliding(character)) {
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
    }

}

