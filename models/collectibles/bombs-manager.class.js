/**
 * Manages bomb collectibles in the game world.
 */
class BombManager extends DrawableObject {
        /**
         * Creates a BombManager instance.
         */   
    constructor(levelWidth, levelHeight, character, energyBalls = [], enemies = []) {
        super();
        this.bombs = [];
        this.collectedCount = 0;
        this.maxBombs = 5;
        this.character = character;
        this.placeBombs(levelWidth, levelHeight, energyBalls, enemies);
    }

        /**
         * Places bombs in the world at valid positions.
         */
    placeBombs(levelWidth, levelHeight, energyBalls = [], enemies = []) {
        let tries = 0;
        let bombsToPlace = this.maxBombs;
        let lowerCount = Math.floor(bombsToPlace / 2);
        while (this.bombs.length < bombsToPlace && tries < 1000) {
            const { x, y } = this.generateBombPosition(levelWidth, lowerCount);
            const tooCloseBombs = this.checkDistanceToOtherBombs(x, y);
            const tooCloseEnergy = this.checkDistanceToEnergyBalls(x, y, energyBalls);
            const collidesWithEnemy = this.checkDistanceToEnemies(x, y, enemies);
            if (!tooCloseBombs && !tooCloseEnergy && !collidesWithEnemy) {
                this.bombs.push(new CollectibleBomb(x, y));
            }
            tries++;
        }
    }

    checkDistanceToEnemies(x, y, enemies) {
        let tempBomb = { x, y, width: 40, height: 40, isColliding: function(enemy) {
            return (
                this.x < enemy.x + enemy.width &&
                this.x + this.width > enemy.x &&
                this.y < enemy.y + enemy.height &&
                this.y + this.height > enemy.y
            );
        }};
        return enemies.some(enemy => tempBomb.isColliding(enemy));
    }

        /**
         * Generates a valid bomb position.
         */
    generateBombPosition(levelWidth, lowerCount) {
        let lowerY = 330;
        let upperY = 170 + (this.character && typeof this.character.jumpHeight === 'number' ? this.character.jumpHeight / 2 : 50);
        let minX = this.character && typeof this.character.x === 'number' && typeof this.character.width === 'number'
            ? Math.max(this.character.x + this.character.width + 100, 50)
            : 50;
        let x = minX + Math.random() * Math.max(0, levelWidth - minX - 1000);
        let y = (this.bombs.length < lowerCount)
            ? lowerY + Math.random() * 10 - 5
            : upperY + Math.random() * 10 - 5;
        return { x, y };
    }

        /**
         * Checks if a bomb is too close to other bombs.
         */
    checkDistanceToOtherBombs(x, y) {
        const minDist = 100;
        return this.bombs.some(b => this.checkMinDistance(b.x, b.y, x, y, minDist));
    }

        /**
         * Checks if a bomb is too close to energy balls.
         */
    checkDistanceToEnergyBalls(x, y, energyBalls) {
        const minDist = 100;
        return energyBalls.some(e => this.checkMinDistance(e.x, e.y, x, y, minDist));
    }

        /**
         * Checks minimum distance between two points.
         */
    checkMinDistance(x1, y1, x2, y2, minDist) {
        const dx = x1 - x2;
        const dy = y1 - y2;
        return Math.sqrt(dx * dx + dy * dy) < minDist;
    }

        /**
         * Updates all bombs (animation, collection).
         */
    update(character) {
        const barY = 50;
        for (let i = this.bombs.length - 1; i >= 0; i--) {
            const bomb = this.bombs[i];
            if (typeof bomb.update === 'function') bomb.update();
            this.checkCollectibleCollision(bomb, character, barY);
            if (bomb.isCollecting && bomb.collectProgress >= 1) {
                this.bombs.splice(i, 1);
                this.collectedCount++;
            }
        }
    }

    
    checkCollectibleCollision(bomb, character, barY) {
        if (typeof bomb.startCollecting === 'function' && !bomb.isCollecting && character && bomb.isColliding(character)) {
            bomb.startCollecting(bomb.originX - 100, barY);
        }
    }
    
        /**
         * Draws all bombs on the canvas.
         */
    draw(ctx) {
        this.bombs.forEach(bomb => bomb.draw(ctx));
    }
}


