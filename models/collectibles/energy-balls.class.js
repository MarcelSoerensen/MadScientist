/**
 * Represents an energy ball that can be collected and used for shooting.
 * Handles pulse animation and drawing.
 * @extends CollidableObject
 */
class EnergyBall extends CollidableObject {
    isCollecting = false;
    collectProgress = 0;
    startX = 0;
    startY = 0;
    targetX = 0;
    targetY = 0;
    startWidth = 0;
    startHeight = 0;
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
    this.startX = x;
    this.startY = y;
    this.startWidth = this.width;
    this.startHeight = this.height;
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
        if (this.isCollecting) {
            if (!this.duration) this.duration = 1;
            this.collectProgress += 1 / this.duration;
            if (this.collectProgress >= 1) {
                this.x = this.targetX;
                this.y = this.targetY;
                this.width = this.startWidth * 0.4;
                this.height = this.startHeight * 0.4;
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
     * Draws the energy ball on the canvas.
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
     */
    draw(ctx) {
    let offsetX = (this.baseSize - this.width) / 2;
    let offsetY = (this.baseSize - this.height) / 2;
    let scale = this.width / this.baseSize;
    let alpha = 1;
    if (this.isCollecting) {
        scale = 1 - 0.6 * this.collectProgress;
        alpha = 1 - 0.8 * this.collectProgress;
        offsetX = (this.baseSize - this.baseSize * scale) / 2;
        offsetY = (this.baseSize - this.baseSize * scale) / 2;
    }
    ctx.save();
    let t = performance.now() * 0.005;
    let randomAngle = Math.random() * Math.PI * 2;
    let randomRotation = Math.random() * Math.PI * 2;
    let radius = (this.width + this.height) / 8;
    let xOffset = Math.cos(randomAngle + t) * radius;
    let yOffset = Math.sin(randomAngle + t) * radius;
    ctx.translate(this.x + this.baseSize / 2 + xOffset - 3, this.y + this.baseSize / 2 + yOffset - 3);
    ctx.rotate(randomRotation);
    let flash = Math.abs(Math.sin(performance.now() * 0.12));
    ctx.globalAlpha = alpha * (0.2 + 0.8 * flash);
    ctx.beginPath();
    ctx.ellipse(0, 0, this.baseSize * scale * 0.7, this.baseSize * 0.13 * scale * 0.7, 0, 0, 2 * Math.PI);
    ctx.fillStyle = 'white';
    ctx.shadowColor = 'white';
    ctx.shadowBlur = 15;
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.drawImage(this.img, this.x + offsetX, this.y + offsetY, this.baseSize * scale, this.baseSize * scale);
    ctx.restore();
    }

    /**
     * Starts the collect animation towards the bar
     */
    startCollecting(targetX, targetY) {
        if (this.isCollecting) return;
        this.isCollecting = true;
        this.collectProgress = 0;
        this.startX = this.x;
        this.startY = this.y;
        this.targetX = targetX;
        this.targetY = targetY;
        this.startWidth = this.width;
        this.startHeight = this.height;
        const dx = this.targetX - this.startX;
        const dy = this.targetY - this.startY;
        this.distance = Math.sqrt(dx*dx + dy*dy);
        this.speed = 10;
        this.duration = this.distance / this.speed;
        if (this.duration < 1) this.duration = 1;
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
    const minDist = 100;
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
            let x = minX + Math.random() * Math.max(0, worldWidth - minX - 1000);
            let y = (this.balls.length < lowerCount)
                ? lowerY + Math.random() * 10 - 5
                : upperY + Math.random() * 10 - 5;
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
        const barY = 50; 
        for (let i = this.balls.length - 1; i >= 0; i--) {
            const ball = this.balls[i];
            ball.updatePulse();
            if (
                character && ball.isColliding(character) &&
                !ball.isCollecting && this.collectedCount < this.maxBalls
            ) {
                ball.startCollecting(ball.x - 100, barY);
            }
            if (ball.isCollecting && ball.collectProgress >= 1) {
                this.balls.splice(i, 1);
                this.collectedCount++;
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