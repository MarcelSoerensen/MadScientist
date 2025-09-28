/**
 * Manages heart collectibles in the game world.
 */
class HeartsManager extends DrawableObject {
    /**
     * Creates a HeartsManager instance.
     */
    constructor(worldWidth, worldHeight, character, enemies = [], energyBalls = [], bombs = []) {
        super();
        this.hearts = [];
        this.collectedCount = 0;
        this.maxHearts = 3;
        this.placeHearts(worldWidth, worldHeight, character, enemies, energyBalls, bombs);
    }
    /**
     * Places hearts in the world at valid positions.
     */
    placeHearts(worldWidth, worldHeight, character, enemies = [], energyBalls = [], bombs = []) {
        let tries = 0;
        let heartsToPlace = 3;
        let lowerCount = Math.floor(heartsToPlace / 2);
        while (this.hearts.length < heartsToPlace && tries < 1000) {
            const { x, y } = this.generateHeartPosition(worldWidth, character, lowerCount);
            const tooCloseHearts = this.checkDistanceToOtherHearts(x, y);
            const tooCloseEnergy = this.checkDistanceToEnergyBalls(x, y, energyBalls);
            const tooCloseBombs = this.checkDistanceToBombs(x, y, bombs);
            const collidesWithEnemy = this.checkDistanceToEnemies(x, y, enemies);
            if (!tooCloseHearts && !tooCloseEnergy && !tooCloseBombs && !collidesWithEnemy) {
                this.hearts.push(new CollectibleHeart(x, y));
            }
            tries++;
        }
    }

    /**
     * Generates a valid heart position.
     */
    generateHeartPosition(worldWidth, character, lowerCount) {
        let jumpHeight = character && typeof character.jumpHeight === 'number' ? character.jumpHeight : 100;
        let lowerY = 330;
        let upperY = 170 + jumpHeight / 2;
        let minX = Math.max(1200, character && typeof character.x === 'number' && typeof character.width === 'number'
            ? character.x + character.width + 100
            : 50);
        let x = minX + Math.random() * Math.max(0, worldWidth - minX - 1000);
        let y = (this.hearts.length < lowerCount)
            ? lowerY + Math.random() * 10 - 5
            : upperY + Math.random() * 10 - 5;
        return { x, y };
    }

    /**
     * Checks if a heart is too close to other hearts.
     */
    checkDistanceToOtherHearts(x, y) {
        const minDist = 100;
        return this.hearts.some(h => this.checkMinDistance(h.x, h.y, x, y, minDist));
    }

    /**
     * Checks if a heart is too close to energy balls.
     */
    checkDistanceToEnergyBalls(x, y, energyBalls) {
        const minDist = 100;
        return energyBalls.some(e => this.checkMinDistance(e.x, e.y, x, y, minDist));
    }

    /**
     * Checks if a heart is too close to bombs.
     */
    checkDistanceToBombs(x, y, bombs) {
        const minDist = 100;
        return bombs.some(b => this.checkMinDistance(b.x, b.y, x, y, minDist));
    }

    /**
     * Checks if a heart collides with enemies.
     */
    checkDistanceToEnemies(x, y, enemies) {
        let tempHeart = { x, y, width: 40, height: 40, isColliding: function(enemy) {
            return (
                this.x < enemy.x + enemy.width &&
                this.x + this.width > enemy.x &&
                this.y < enemy.y + enemy.height &&
                this.y + this.height > enemy.y
            );
        }};
        return enemies.some(enemy => tempHeart.isColliding(enemy));
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
     * Updates all hearts and handles collection/collision.
     */
    update(character) {
        for (let i = this.hearts.length - 1; i >= 0; i--) {
            const heart = this.hearts[i];
            if (typeof heart.update === 'function') heart.update();
            if (!heart.isCollecting && character && heart.isColliding(character)) {
                if (character.energy < 100) {
                    this.handleCollectible(heart, character);
                } else {
                    this.handleUncollectible(heart);
                }
            }
            if (heart.isCollecting && heart.collectProgress >= 1) {
                this.handleCollectible(heart, character, i);
            }
        }
    }

    /**
     * Handles collectible heart logic (collect or energy).
     */
    handleCollectible(heart, character, index) {
        if (index === undefined) {
            heart.startCollecting(heart.x - 100, 50);
        } else {
            this.hearts.splice(index, 1);
            this.collectedCount++;
            if (character) {
                character.energy = Math.min(100, character.energy + 20);
                if (character.world && character.world.statusBar) {
                    character.world.statusBar.setPercentage(character.energy);
                }
            }
        }
    }

    /**
     * Handles uncollectible heart logic (bounce and sound).
     */
    handleUncollectible(heart) {
        heart.bounceActive = true;
        if (!this.lastNoHeartSoundTime || Date.now() - this.lastNoHeartSoundTime > 1000) {
            try {
                const noHeartSound = SoundCacheManager.getAudio('sounds/no-heart.mp3');
                noHeartSound.volume = 0.7;
                noHeartSound.play();
                setTimeout(() => {
                    noHeartSound.pause();
                    noHeartSound.currentTime = 0;
                }, 500);
            } catch (e) {}
            this.lastNoHeartSoundTime = Date.now();
        }
    }

    draw(ctx) {
        this.hearts.forEach(heart => heart.draw(ctx));
    }
}
