/**
 * Represents an energy ball that can be collected and used for shooting.
 * Handles pulse animation and drawing.
 * @extends CollidableObject
 */
class EnergyBall extends CollidableObject {
    /**
     * Creates an EnergyBall instance.
     * @param {number} x - The x position of the energy ball.
     * @param {number} y - The y position of the energy ball.
     */
    constructor(x, y) {
        super();
        this.x = x;
        this.y = y;
        this.baseSize = 20;
        this.maxSize = 30;
        this.width = this.baseSize;
        this.height = this.baseSize;
        this.pulseUp = true;
        this.img = new Image();
        this.img.src = 'img/Projectile/Other/7.png';

        this.offset = {
            top: 0,
            left: 0,
            right: 0,
            bottom: 0
        };
    }

    /**
     * Updates the pulse animation for the energy ball.
     */
    updatePulse() {
        const step = 0.2;
        if (this.pulseUp) {
            this.width += step;
            this.height += step;
            if (this.width >= this.maxSize) this.pulseUp = false;
        } else {
            this.width -= step;
            this.height -= step;
            if (this.width <= this.baseSize) this.pulseUp = true;
        }
    }

    /**
     * Draws the energy ball on the canvas.
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
     */
    draw(ctx) {
        const offsetX = (this.baseSize - this.width) / 2;
        const offsetY = (this.baseSize - this.height) / 2;

        ctx.save();
        let t = performance.now() * 0.005;
        let randomAngle = Math.random() * Math.PI * 2;
        let randomRotation = Math.random() * Math.PI * 2;
        let radius = (this.width + this.height) / 8;
        let xOffset = Math.cos(randomAngle + t) * radius;
        let yOffset = Math.sin(randomAngle + t) * radius;
        ctx.translate(this.x + this.width / 2 + xOffset - 3, this.y + this.height / 2 + yOffset - 3);
        ctx.rotate(randomRotation);
        let flash = Math.abs(Math.sin(performance.now() * 0.12));
        ctx.globalAlpha = 0.2 + 0.8 * flash;
        let pulseScale = this.width / this.baseSize;
        let scale = pulseScale * 0.7;
        ctx.beginPath();
        ctx.ellipse(0, 0, this.baseSize * scale * 0.7, this.baseSize * 0.13 * scale * 0.7, 0, 0, 2 * Math.PI);
        ctx.fillStyle = 'white';
        ctx.shadowColor = 'white';
        ctx.shadowBlur = 15;
        ctx.fill();
        ctx.restore();

        ctx.drawImage(this.img, this.x + offsetX, this.y + offsetY, this.width, this.height);
    }
}

/**
 * Manages all energy balls in the game world. Handles placement, collection, and rendering.
 * @class EnergyBallManager
 */
class EnergyBallManager {
    /**
     * Creates an EnergyBallManager instance.
     * @param {number} worldWidth - The width of the game world.
     * @param {number} worldHeight - The height of the game world.
     * @param {object} character - The main character object.
     * @param {Array} enemies - Array of enemy objects.
     */
    /**
     * Initializes energy balls in the world at random positions, avoiding overlap and enemies.
     * @param {number} worldWidth - The width of the game world.
     * @param {number} worldHeight - The height of the game world.
     * @param {object} character - The main character object.
     * @param {Array} enemies - Array of enemy objects.
     */
    constructor(worldWidth, worldHeight, character, enemies = []) {
        this.balls = [];
        this.collectedCount = 0;
        this.maxBalls = 20;
        const minDist = 60;
        let tries = 0;

        let jumpHeight = character && typeof character.jumpHeight === 'number' ? character.jumpHeight : 100;
        let ballsToPlace = 20;
        let lowerCount = Math.floor(ballsToPlace / 2);
        let lowerY = 330;
        let upperY = 170 + jumpHeight / 2;
        let minX = character && typeof character.x === 'number' && typeof character.width === 'number'
            ? Math.max(character.x + character.width + 100, 50)
            : 50;

        while (this.balls.length < ballsToPlace && tries < 1000) {
            let x;
            if (this.balls.length === 0) {
                x = 300 + Math.random() * 30;
            } else if (this.balls.length === 1) {
                x = 350 + Math.random() * 150;
            } else if (this.balls.length === 2) {
                x = 520 + Math.random() * 80;
            } else {
                x = minX + Math.random() * Math.max(0, worldWidth - minX - 1000);
            }
            let y;
            if (this.balls.length < lowerCount) {
                y = lowerY + Math.random() * 10 - 5;
            } else {
                y = upperY + Math.random() * 10 - 5;
            }
            let tooClose = this.balls.some(b => {
                let dx = b.x - x;
                let dy = b.y - y;
                return Math.sqrt(dx*dx + dy*dy) < minDist;
            });
            let ball = new EnergyBall(x, y);
            let collidesWithEnemy = enemies.some(enemy => ball.isColliding(enemy));
            if (!tooClose && !collidesWithEnemy) {
                this.balls.push(ball);
            }
            tries++;
        }
    }

    /**
     * Updates all energy balls and handles collection by the character.
     * @param {object} character - The main character object.
     */
    /**
     * Updates all energy balls and handles collection by the character.
     * @param {object} character - The main character object.
     */
    update(character) {
        for (let i = this.balls.length - 1; i >= 0; i--) {
            const ball = this.balls[i];
            ball.updatePulse();
            if (character && ball.isColliding(character)) {
                if (this.collectedCount < this.maxBalls) {
                    this.balls.splice(i, 1);
                    this.collectedCount++;
                }
            }
        }
    }

    /**
     * Draws all energy balls managed by this manager.
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
     */
    /**
     * Draws all energy balls managed by this manager.
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
     */
    draw(ctx) {
        this.balls.forEach(ball => ball.draw(ctx));
    }
}