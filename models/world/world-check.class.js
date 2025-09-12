/**
 * Handles all check/logic methods for the World class.
 */
class WorldCheck {
    constructor(world) {
        this.world = world;
    }

    checkFirstEnemyDistance() {
        if (this.world.level && this.world.level.enemies && this.world.level.enemies.length > 0) {
            this.world.level.enemies.forEach(enemy => {
                let activateAt = enemy._activateAt || 500;
                if (enemy._waitingForCharacter && this.world.character.x >= activateAt) {
                    enemy.visible = true;
                    enemy._waitingForCharacter = false;
                    if (!enemy.moveInterval && !enemy.animInterval) {
                        if (enemy instanceof EnemyOne && enemy.handler && typeof enemy.handler.animateEnemyOne === 'function') {
                            enemy.handler.animateEnemyOne(enemy);
                        } else if (typeof enemy.animate === 'function') {
                            enemy.animate();
                        }
                    }
                }
            });
        }
    }

    checkSuperShot() {
        const w = this.world;
        if (
            w.keyboard.S &&
            w.energyBallManager.collectedCount >= 5 &&
            w.laserBeams.length === 0
        ) {
            let offsetY = 170;
            let offsetX = w.character.otherDirection ? -94 : 187;
            let laser = new LaserBeam(
                w.character.x + offsetX,
                w.character.y + offsetY,
                w.character.otherDirection,
                w.character,
                offsetX,
                offsetY
            );
            laser.width *= 2;
            laser.height *= 2;
            laser.isSuperShot = true;
            try {
                const shotSound = new Audio('sounds/superlaser-shot.mp3');
                shotSound.volume = 0.5;
                shotSound.play();
            } catch (e) {}
            w.laserBeams.push(laser);
            w.energyBallManager.collectedCount = Math.max(0, w.energyBallManager.collectedCount - 5);
            w.laserActive = true;
            setTimeout(() => {
                w.laserBeams.forEach(l => l.stopAnimation());
                w.laserBeams = [];
                w.laserActive = false;
            }, 1000);
        }
    }

    checkThrowableObjects() {
        const w = this.world;
        if (w.keyboard.D && !w.lastDKeyState && !w.character.throwAnimationPlaying && w.bombManager.collectedCount > 0) {
            w.character.playThrowBombAnimation();
            setTimeout(() => {
                let bombX = w.character.otherDirection ? w.character.x + 100 : w.character.x + 160;
                let bomb = ThrowableObjects.createThrowableObject(
                    'bomb',
                    bombX,
                    w.character.y + 180,
                    w.character.otherDirection
                );
                w.throwableObjects.push(bomb);
                w.bombManager.collectedCount = Math.max(0, w.bombManager.collectedCount - 1);
            }, 500);
        }
        w.lastDKeyState = w.keyboard.D;
    }

    checkLaserBeams() {
        const w = this.world;
        if (!w.laserActive) {
            if (w.keyboard.Y && !w.lastYKeyState && w.energyBallManager.collectedCount > 0 && w.laserBeams.length === 0) {
                w.laserActive = true;
                w.laserBeams.forEach(laser => {
                    laser.stopAnimation();
                });
                w.laserBeams = [];
                let offsetY = 205;
                let offsetX = w.character.otherDirection ? -20 : 190;
                let laser = new LaserBeam(
                    w.character.x + offsetX,
                    w.character.y + offsetY,
                    w.character.otherDirection,
                    w.character,
                    offsetX,
                    offsetY
                );
                laser.shoot();
                w.laserBeams.push(laser);
                w.energyBallManager.collectedCount = Math.max(0, w.energyBallManager.collectedCount - 1);
                setTimeout(() => {
                    w.laserBeams.forEach(laser => {
                        laser.stopAnimation();
                    });
                    w.laserBeams = [];
                    w.laserActive = false;
                }, 500);
            } else if (!w.keyboard.Y && w.lastYKeyState) {
                w.laserBeams.forEach(laser => {
                    laser.stopAnimation();
                });
                w.laserBeams = [];
            }
        }
        w.lastYKeyState = w.keyboard.Y;
    }

    checkCollisions() {
        const w = this.world;
        if (this.checkGameOver()) return;
        window.collisionManager.checkEnemyCollision(w);
        window.collisionManager.checkBombCollision(w);
        window.collisionManager.checkLaserCollision(w);
        window.collisionManager.checkEndbossStickCollision(w);
    }

    /**
     * Checks only the stick collision of the Endboss with the character
     */
    checkStickCollision() {
        this.world.level.enemies.forEach(enemy => {
            if (
                enemy instanceof Endboss &&
                enemy.animState === 'hit' &&
                !enemy.isDeadAnimationPlaying &&
                enemy.collidable !== false
            ) {
                const stickRect = enemy.getStickCollisionRect && enemy.getStickCollisionRect();
                if (stickRect) {
                    const charRect = {
                        x: this.world.character.x + (this.world.character.offset?.left || 0),
                        y: this.world.character.y + (this.world.character.offset?.top || 0),
                        width: this.world.character.width - ((this.world.character.offset?.left || 0) + (this.world.character.offset?.right || 0)),
                        height: this.world.character.height - ((this.world.character.offset?.top || 0) + (this.world.character.offset?.bottom || 0))
                    };
                    const stickCollision =
                        charRect.x < stickRect.x + stickRect.width &&
                        charRect.x + charRect.width > stickRect.x &&
                        charRect.y < stickRect.y + stickRect.height &&
                        charRect.y + charRect.height > stickRect.y;
                    if (stickCollision) {
                        const now = Date.now();
                        if (!this.world.lastCollisionSoundTime || now - this.world.lastCollisionSoundTime > 500) {
                            this.world.character.sounds.hurtSound(this.world.character, this.world);
                        }
                        this.world.character.hit();
                        this.world.statusBar.setPercentage(this.world.character.energy);
                    }
                }
            }
        });
    }

    checkGameOver() {
        const w = this.world;
        if (w.gameOver || (w.character.isDead && w.character.isDead())) {
            if (!w.gameOver) {
                w.gameOver = true;
                if (w.keyboard) {
                    w.keyboard.S = false;
                    w.keyboard.D = false;
                    w.keyboard.Y = false;
                }
                if (w.gameAlerts && typeof w.gameAlerts.showAlert === 'function') {
                    w.gameAlerts.showAlert('gameOver', 'Game Over');
                }
            }
            return true;
        }
        if (window.endbossDefeated) {
            if (!w.gameOver) {
                w.gameOver = true;
                if (w.keyboard) {
                    w.keyboard.S = false;
                    w.keyboard.D = false;
                    w.keyboard.Y = false;
                }
                w.gameAlerts.triggerLevelComplete && typeof w.gameAlerts.triggerLevelComplete === 'function'
                    ? w.gameAlerts.triggerLevelComplete()
                    : w.gameAlerts.showAlert('levelComplete', 'Level Complete');
            }
            return true;
        }
        return false;
    }
}