/**
 * Handles all check/logic methods for the World class.
 */
class WorldCheck {
    /**
     * Creates a new WorldCheck instance for the given world.
     */
    constructor(world) {
        this.world = world;
    }

    /**
     * Checks if the Endboss X-position sound (e.g. counter.mp3 from x >= 3000) should be played or faded out.
     */
    checkEndbossXPositionSound() {
        if (this.world.gameOver) return;
        if (this.world.level && this.world.level.enemies) {
            const endboss = this.world.level.enemies.find(e => e instanceof Endboss);
            if (endboss && endboss.sounds && typeof endboss.sounds.playXPositionSound === 'function') {
                endboss.sounds.playXPositionSound(endboss);
            }
        }
    }

    /**
     * Activates the first enemy when the character reaches a certain distance.
     */
    checkFirstEnemyDistance() {
        const w = this.world;
        if (window.isPaused || (window.PauseButtonManager && window.PauseButtonManager.isPaused)) return;
        const enemies = w.level?.enemies || [];
        const character = w.character;
        if (!character) return;
        for (const enemy of enemies) {
            const activateAt = enemy._activateAt || 500;
            if (!enemy._waitingForCharacter || character.x < activateAt) continue;
            if (enemy instanceof EnemyOne) this.checkEnemyOneSpawn(enemy, character);
            enemy.visible = true;
            enemy._waitingForCharacter = false;
            if (!enemy.moveInterval && !enemy.animInterval) {
                if (enemy instanceof EnemyOne && enemy.handler?.animateEnemyOne) enemy.handler.animateEnemyOne(enemy);
                else if (typeof enemy.animate === 'function') enemy.animate();
            }
        }
    }

    /**
     * Repositions EnemyOne if too close to character or in viewport.
     */
    checkEnemyOneSpawn(enemy, character) {
        const w = this.world;
        const minViewportDistance = 650;
        const canvasWidth = w.canvas?.width || 720;
        const half = canvasWidth * 0.5;
        const charX = character.x;
        const cameraLeft = charX - half;
        const cameraRight = charX + half;
        const inViewport = enemy.x > cameraLeft && enemy.x < cameraRight;
        const tooClose = Math.abs(enemy.x - charX) < minViewportDistance || inViewport;
        if (!tooClose || !enemy.getEnemyOneSpawnRange || !enemy.calculateEnemyOnePosition) return;
        const { minX, maxX } = enemy.getEnemyOneSpawnRange(enemy._activateAt);
        let newX = enemy.calculateEnemyOnePosition(minX, maxX);
        if (Math.abs(newX - charX) < minViewportDistance) newX = charX + minViewportDistance + 100;
        enemy.x = newX;
    }

    /**
     * Checks if the conditions for a SuperShot are met and triggers the action if so.
     */
    checkSuperShot() {
        const w = this.world;
        const ready = w.keyboard.S && w.energyBallManager.collectedCount >= 5 && w.laserBeams.length === 0;
        if (!ready) return;
        const offsetY = 170;
        const offsetX = w.character.otherDirection ? -94 : 187;
        this.activateSuperShot(
            LaserBeam.createSuperShot(
                w.character.x + offsetX,
                w.character.y + offsetY,
                w.character.otherDirection,
                w.character,
                offsetX,
                offsetY
            )
        );
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
        const pressed = w.keyboard.D && !w.lastDKeyState && !w.character.throwAnimationPlaying && w.bombManager.collectedCount > 0;
        if (pressed) {
            w.character.playThrowBombAnimation();
            setTimeout(() => {
                const bombX = w.character.x + (w.character.otherDirection ? 100 : 160);
                w.throwableObjects.push(
                    ThrowableObjects.createThrowableObject('bomb', bombX, w.character.y + 180, w.character.otherDirection)
                );
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
        if (w.laserActive) return w.lastYKeyState = w.keyboard.Y;
        const pressed = w.keyboard.Y && !w.lastYKeyState && w.energyBallManager.collectedCount > 0 && w.laserBeams.length === 0;
        const released = !w.keyboard.Y && w.lastYKeyState;
        if (pressed || released) {
            w.laserBeams.forEach(l => l.stopAnimation());
            w.laserBeams = [];
        }
        if (pressed) {
            w.laserActive = true;
            const laser = LaserBeam.createLaserBeam(w);
            LaserBeam.activateLaserBeam(w, laser);
        }
        w.lastYKeyState = w.keyboard.Y;
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
    if (w.gameOver || w.character.deathAnimationPlayed) {
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
        if (w.cleanup && typeof w.cleanup.cleanupIntervals === 'function') {
            w.cleanup.cleanupIntervals();
        }
        if (w.keyboard) w.keyboard.S = w.keyboard.D = w.keyboard.Y = false;
        const endboss = w.level?.enemies?.find(e => e instanceof Endboss);
        const enemyTwos = w.level?.enemies?.filter(e => e.constructor?.name === 'EnemyTwo') || [];
        w.gameAlerts?.triggerGameOver?.(this.handleGameOverEnemyCleanup.bind(this, endboss, enemyTwos));
    }

    /**
     * Cleans up enemies when the game is over.
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
        if (w.gameOver) return;
        w.gameOver = true;
        w.cleanup?.cleanupIntervals?.();
        const endboss = w.level?.enemies?.find(e => e instanceof Endboss);
        if (endboss?.sounds?.stopAllEndbossSounds) {
            endboss.sounds.stopAllEndbossSounds(endboss);
        }
        endboss?.handler?.handleDeathAnimation?.(endboss);
        if (w.character && typeof w.characterHandling?.handleLevelCompleteAnimation === 'function') {
            w.characterHandling.handleLevelCompleteAnimation(w.character);
        }
        if (w.character) w.character.energy = -1;
        if (w.keyboard) w.keyboard.S = w.keyboard.D = w.keyboard.Y = false;
        w.gameAlerts?.triggerLevelComplete?.() || w.gameAlerts?.showAlert?.('levelComplete', 'Level Complete');
    }
}