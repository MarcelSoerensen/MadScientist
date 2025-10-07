/**
 * Manages energy ball collectibles in the game world.
 */
class EnergyBallManager {
    /**
    * Creates an EnergyBallManager instance.
    */
    constructor(worldWidth, worldHeight, character, enemies = [], world = null) {
        this.balls = [];
        this.collectedCount = 0;
        this.totalCollectedCount = 0;
        this.maxBalls = 20;
        this.world = world;
        this.placeEnergyBalls(worldWidth, worldHeight, character, enemies);
    }
    /**
     * Places energy balls in the world at valid positions.
     */
    placeEnergyBalls(worldWidth, worldHeight, character, enemies = []) {
        let tries = 0;
        let ballsToPlace = 20;
        let lowerCount = Math.floor(ballsToPlace / 2);
        while (this.balls.length < ballsToPlace && tries < 1000) {
            const { x, y } = this.generateEnergyBallPosition(worldWidth, character, lowerCount);
            const tooClose = this.checkDistanceToOtherBalls(x, y);
            const collidesWithEnemy = this.checkDistanceToEnemies(x, y, enemies);
            if (!tooClose && !collidesWithEnemy) {
                this.balls.push(new EnergyBall(x, y));
            }
            tries++;
        }
    }

    /**
     * Generates a valid energy ball position.
     */
    generateEnergyBallPosition(worldWidth, character, lowerCount) {
        let jumpHeight = character && typeof character.jumpHeight === 'number' ? character.jumpHeight : 100;
        let lowerY = 330;
        let upperY = 170 + jumpHeight / 2;
        let minX = character && typeof character.x === 'number' && typeof character.width === 'number'
            ? Math.max(character.x + character.width + 100, 50)
            : 50;
        let x = minX + Math.random() * Math.max(0, worldWidth - minX - 1000);
        let y = (this.balls.length < lowerCount)
            ? lowerY + Math.random() * 10 - 5
            : upperY + Math.random() * 10 - 5;
        return { x, y };
    }

    /**
     * Checks if an energy ball is too close to other balls.
     */
    checkDistanceToOtherBalls(x, y) {
        const minDist = 100;
        return this.balls.some(b => this.checkMinDistance(b.x, b.y, x, y, minDist));
    }

    /**
     * Checks if an energy ball collides with enemies.
     */
    checkDistanceToEnemies(x, y, enemies) {
        let tempBall = { x, y, width: 40, height: 40, isColliding: function(enemy) {
            return (
                this.x < enemy.x + enemy.width &&
                this.x + this.width > enemy.x &&
                this.y < enemy.y + enemy.height &&
                this.y + this.height > enemy.y
            );
        }};
        return enemies.some(enemy => tempBall.isColliding(enemy));
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
     * Updates all energy balls (animation, collection).
     */
    update(character) {
        const barY = 50, cap = this.maxBalls; 
        for (let i = this.balls.length - 1; i >= 0; i--) {
            if (this.collectedCount >= cap) break;
            const b = this.balls[i];
            b.updatePulse();
            if (!b.isCollecting && character && b.isColliding(character) && this.collectedCount < cap) {
                b.startCollecting(b.x - 100, barY);
                continue;
            }
            if (b.isCollecting && b.collectProgress >= 1) {
                this.balls.splice(i, 1);
                this.collectedCount++; this.totalCollectedCount++;
                window.gameScoreData = { collected: this.totalCollectedCount, total: cap };
            }
        }
    }

    /**
     * Draws all energy balls on the canvas.
     */
    draw(ctx) {
        this.balls.forEach(ball => ball.draw(ctx));
    }
}
