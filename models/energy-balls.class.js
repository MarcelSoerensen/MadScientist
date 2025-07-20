class EnergyBall extends CollidableObject {
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
        // Kollisionslinien entfernt
    }
}

class EnergyBallManager {
    constructor(worldWidth, worldHeight, character, enemies = []) {
        console.log('[EnergyBallManager] Character-Objekt:', character);
        this.balls = [];
        this.collectedCount = 0;
        const minDist = 60;
        let tries = 0;

        let charHeight = character && typeof character.height === 'number' ? character.height : 300;
        let jumpHeight = character && typeof character.jumpHeight === 'number' ? character.jumpHeight : 100;
        let ballsToPlace = 20;
        let lowerCount = Math.floor(ballsToPlace / 2);
        let upperCount = ballsToPlace - lowerCount;
        let lowerY = 330;
        let upperY = 170 + jumpHeight / 2;
        let minX = character && typeof character.x === 'number' && typeof character.width === 'number'
            ? Math.max(character.x + character.width + 100, 50)
            : 50;

        while (this.balls.length < ballsToPlace && tries < 1000) {
            if (this.balls.length === 0 && character) {
                console.log('[EnergyBallManager] Character-Koordinaten:', {
                    x: character.x,
                    y: character.y,
                    width: character.width,
                    height: character.height,
                    offset: character.offset
                });
            }
            let x;
            if (this.balls.length === 0) {
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

    update(character) {
        for (let i = this.balls.length - 1; i >= 0; i--) {
            const ball = this.balls[i];
            ball.updatePulse();
            if (character && ball.isColliding(character)) {
                this.balls.splice(i, 1);
                this.collectedCount++;
            }
        }
    }

    draw(ctx) {
        this.balls.forEach(ball => ball.draw(ctx));
    }
}