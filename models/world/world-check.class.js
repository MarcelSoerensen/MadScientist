/**
 * Handles all check/logic methods for the World class.
 */
class WorldCheck {

    /**
     * Checks if the Endboss X-position sound (e.g. counter.mp3 from x >= 3000) should be played or faded out.
     */
    checkEndbossXPositionSound() {
        if (this.world.level && this.world.level.enemies) {
            const endboss = this.world.level.enemies.find(e => e instanceof Endboss);
            if (endboss && endboss.sounds && typeof endboss.sounds.playXPositionSound === 'function') {
                endboss.sounds.playXPositionSound(endboss);
            }
        }
    }
    /**
     * Creates a new WorldCheck instance for the given world.
     */
    constructor(world) {
        this.world = world;
    }

    /**
     * Activates the first enemy when the character reaches a certain distance.
     */
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

    /**
     * Checks if the conditions for a SuperShot are met and triggers the action if so.
     */
    checkSuperShot() {
        const w = this.world;
        if (
            w.keyboard.S &&
            w.energyBallManager.collectedCount >= 5 &&
            w.laserBeams.length === 0
        ) {
            const laser = this.createSuperShotLaser();
            this.playSuperShotSound();
            this.activateSuperShot(laser);
        }
    }

    /**
     * Creates the Laser object for the SuperShot.
     */
    createSuperShotLaser() {
        const w = this.world;
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
        return laser;
    }

    /**
     * Plays the sound effect for the SuperShot.
     */
    playSuperShotSound() {
        try {
            const shotSound = new Audio('sounds/superlaser-shot.mp3');
            shotSound.volume = 0.5;
            shotSound.play();
        } catch (e) {}
    }

    /**
     * Activates the SuperShot: adds laser, subtracts energy, starts animation.
     */
    activateSuperShot(laser) {
        const w = this.world;
        w.laserBeams.push(laser);
        w.energyBallManager.collectedCount = Math.max(0, w.energyBallManager.collectedCount - 5);
        w.laserActive = true;
        setTimeout(() => {
            w.laserBeams.forEach(l => l.stopAnimation());
            w.laserBeams = [];
            w.laserActive = false;
        }, 1000);
    }

    /**
     * Checks if throwable bomb conditions are met and triggers the throw.
     */
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

    /**
     * Checks if the conditions for a LaserBeam are met and triggers the action if so.
     */
    checkLaserBeams() {
        const w = this.world;
        if (!w.laserActive) {
            if (w.keyboard.Y && !w.lastYKeyState && w.energyBallManager.collectedCount > 0 && w.laserBeams.length === 0) {
                w.laserActive = true;
                w.laserBeams.forEach(laser => {
                    laser.stopAnimation();
                });
                w.laserBeams = [];
                const laser = this.createLaserBeam();
                this.activateLaserBeam(laser);
            } else if (!w.keyboard.Y && w.lastYKeyState) {
                w.laserBeams.forEach(laser => {
                    laser.stopAnimation();
                });
                w.laserBeams = [];
            }
        }
        w.lastYKeyState = w.keyboard.Y;
    }

    /**
     * Creates the LaserBeam object for the normal shot.
     */
    createLaserBeam() {
        const w = this.world;
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
        return laser;
    }

    /**
     * Activates the LaserBeam: adds laser, subtracts energy, starts animation.
     */
    activateLaserBeam(laser) {
        const w = this.world;
        w.laserBeams.push(laser);
        w.energyBallManager.collectedCount = Math.max(0, w.energyBallManager.collectedCount - 1);
        setTimeout(() => {
            w.laserBeams.forEach(l => l.stopAnimation());
            w.laserBeams = [];
            w.laserActive = false;
        }, 500);
    }

    /**
     * Checks and handles all relevant collisions in the world.
     */
    checkCollisions() {
        const w = this.world;
        if (this.checkGameOver()) return;
        window.collisionManager.checkEnemyCollision(w);
        window.collisionManager.checkBombCollision(w);
        window.collisionManager.checkLaserCollision(w);
        window.collisionManager.checkEndbossStickCollision(w);
    }

    /**
     * Checks if stick collision with Endboss occurs and applies effects.
     */
    checkStickCollision() {
        this.world.level.enemies
            .filter(e => e instanceof Endboss && e.animState === 'hit' && !e.isDeadAnimationPlaying && e.collidable !== false)
            .forEach(enemy => {
                const stickRect = enemy.getStickCollisionRect?.();
                const charRect = this.getCharacterCollisionRect();
                if (stickRect &&
                    charRect.x < stickRect.x + stickRect.width &&
                    charRect.x + charRect.width > stickRect.x &&
                    charRect.y < stickRect.y + stickRect.height &&
                    charRect.y + charRect.height > stickRect.y
                ) {
                    this.applyStickCollision();
                }
            });
    }

    /**
     * Returns the character's collision rectangle.
     */
    getCharacterCollisionRect() {
        const c = this.world.character;
        return {
            x: c.x + (c.offset?.left || 0),
            y: c.y + (c.offset?.top || 0),
            width: c.width - ((c.offset?.left || 0) + (c.offset?.right || 0)),
            height: c.height - ((c.offset?.top || 0) + (c.offset?.bottom || 0))
        };
    }

    /**
     * Applies effects of stick collision (sound, damage, status bar).
     */
    applyStickCollision() {
        const now = Date.now();
        if (!this.world.lastCollisionSoundTime || now - this.world.lastCollisionSoundTime > 500) {
            this.world.character.sounds.hurtSound(this.world.character, this.world);
        }
        this.world.character.hit();
        this.world.statusBar.setPercentage(this.world.character.energy);
    }

    /**
     * Checks if the game is over due to player death or endboss defeat and triggers the appropriate actions.
     */
    checkGameOver() {
        const w = this.world;
        if (w.gameOver || (w.character.isDead && w.character.isDead())) {
            this.checkGameOverByEnemy();
            return true;
        }
        if (window.endbossDefeated) {
            this.checkGameOverByEndboss();
            return true;
        }
        return false;
    }

    /**
     * Handles game over logic when the player dies.
     */
    checkGameOverByEnemy() {
        const w = this.world;
        if (w.gameOver) return;
        w.gameOver = true;
        if (w.keyboard) {
            w.keyboard.S = false;
            w.keyboard.D = false;
            w.keyboard.Y = false;
        }
        const endboss = (w.level && w.level.enemies)
            ? w.level.enemies.find(e => e instanceof Endboss)
            : null;
        const enemyTwos = (w.level && w.level.enemies)
            ? w.level.enemies.filter(e => e.constructor && e.constructor.name === 'EnemyTwo')
            : [];
        if (w.gameAlerts && typeof w.gameAlerts.triggerGameOver === 'function') {
            w.gameAlerts.triggerGameOver(this.handleGameOverEnemyCleanup.bind(this, endboss, enemyTwos));
        }
    }

    /**
     * Callback für Game-Over-Animation: Entfernt Endboss und EnemyTwo sauber.
     */
    handleGameOverEnemyCleanup(endboss, enemyTwos) {
        if (endboss && this.world.cleanup && typeof this.world.cleanup.stopAndRemoveEndboss === 'function') {
            this.world.cleanup.stopAndRemoveEndboss(endboss);
        }
        if (this.world.cleanup && typeof this.world.cleanup.stopAndRemoveEnemyTwo === 'function') {
            enemyTwos.forEach(enemy => {
                this.world.cleanup.stopAndRemoveEnemyTwo(enemy);
            });
        }
    }

    /**
     * Handles game over logic when the endboss is defeated.
     */
    checkGameOverByEndboss() {
        const w = this.world;
        if (!w.gameOver) {
            w.gameOver = true;
            if (w.keyboard) {
                w.keyboard.S = false;
                w.keyboard.D = false;
                w.keyboard.Y = false;
            }
            if (w.gameAlerts) {
                if (typeof w.gameAlerts.triggerLevelComplete === 'function') {
                    w.gameAlerts.triggerLevelComplete();
                } else if (typeof w.gameAlerts.showAlert === 'function') {
                    w.gameAlerts.showAlert('levelComplete', 'Level Complete');
                }
            }
        }
    }
}