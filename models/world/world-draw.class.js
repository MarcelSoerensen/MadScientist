/**
 * Handles all draw/render methods for the World class.
 */
class WorldDraw {
    /**
     * Creates a WorldDraw instance for rendering the game world.
     */
    constructor(world) {
        this.world = world;
    }

    /**
     * Main rendering loop for the game world.
     */
    draw() {
        this.world.ctx.clearRect(0, 0, this.world.canvas.width, this.world.canvas.height);
        this.world.ctx.save();
        this.world.ctx.translate(this.world.camera_x, 0);
        this.drawMainBackground();
        this.drawGameObjects();
        this.drawParallaxTop();
        this.drawParallaxBottom();
        this.world.ctx.restore();
        this.drawBars();
        this.drawAlerts();
        this.animationFrameId = requestAnimationFrame(() => this.draw());
    }

    /**
     * Draws all background layers.
     */
    drawBackground() {
        this.drawMainBackground();
        this.drawParallaxTop();
        this.drawParallaxBottom();
    }

     /**
     * Draws the main background images.
     */
    drawMainBackground() {
        this.world.addToMap(this.world.backgroundObjects[3]);
        this.world.addToMap(this.world.backgroundObjects[0]);
    }

    /**
     * Draws the top parallax background layers.
     */
    drawParallaxTop() {
        this.world.ctx.translate(this.world.camera_x * 0.25, 0);
        this.world.addToMap(this.world.backgroundObjects[6]);
        this.world.addToMap(this.world.backgroundObjects[4]);
        this.world.addToMap(this.world.backgroundObjects[1]);
        this.world.ctx.translate(-this.world.camera_x * 0.25, 0);
    }

    /**
     * Draws the bottom parallax background layers.
     */
    drawParallaxBottom() {
        this.world.ctx.translate(this.world.camera_x * 0.5, 0);
        this.world.addToMap(this.world.backgroundObjects[7]);
        this.world.addToMap(this.world.backgroundObjects[5]);
        this.world.addToMap(this.world.backgroundObjects[2]);
        this.world.ctx.translate(-this.world.camera_x * 0.5, 0);
    }

    /**
     * Draws only the status bar and HP bar.
     */
    drawBars() {
        this.drawStatusBar();
        this.drawBombsBar();
        this.drawSuperShotBar();
    }

    /**
     * Draws the status bar and HP bar.
     */
    drawStatusBar() {
        if (this.world.statusBar) {
            this.world.addToMap(this.world.statusBar);
            this.world.statusBar.drawHPBar(this.world.ctx);
        }
    }

    /**
     * Draws the bombs bar overlay.
     */
    drawBombsBar() {
        if (this.world.bombsBar && this.world.bombManager) {
            this.world.bombsBar.setBombs(this.world.bombManager.collectedCount);
            this.world.bombsBar.draw(this.world.ctx);
        }
    }
    drawSuperShotBar() {
        if (this.world.superShotBar && this.world.energyBallManager) {
            this.world.superShotBar.setBalls(this.world.energyBallManager.collectedCount);
            this.world.superShotBar.draw(this.world.ctx);
        }
    }

    /**
     * Draws all game objects (enemies, character, projectiles, collectibles).
     */
    drawGameObjects() {
        this.drawEnemies();
        this.drawCharacter();
        this.drawProjectiles();
        this.drawEnergyBalls();
        this.drawBombs();
        this.drawHearts();
    }

    /**
     * Draws all enemies.
     */
    drawEnemies() {
        this.world.addObjectsToMap(this.world.enemies);
        this.world.enemies.forEach(enemy => {
            if (enemy instanceof EnemyTwo && enemy.visible) {
                this.world.ctx.save();
                this.world.ctx.restore();
            }
        });
    }

    /**
     * Draws the main character.
     */
    drawCharacter() {
        this.world.addToMap(this.world.character);
    }

    /**
     * Draws all projectiles (bombs, lasers).
     */
    drawProjectiles() {
        this.world.addObjectsToMap(this.world.throwableObjects);
        this.world.addObjectsToMap(this.world.laserBeams);
    }

    /**
     * Draws energy balls and handles super shot logic.
     */
    drawEnergyBalls() {
        if (this.world.energyBallManager && this.world.superShotBar) {
            const prevSuperShots = this.world.superShotBar.getSuperShots();
            this.world.energyBallManager.update(this.world.character);
            this.world.superShotBar.setBalls(this.world.energyBallManager.collectedCount);
            const newSuperShots = this.world.superShotBar.getSuperShots();
            if (newSuperShots > prevSuperShots) {
                this.world.gameAlerts.triggerSuperlaser(newSuperShots);
            }
            this.world.energyBallManager.draw(this.world.ctx);
        }
    }

    /**
     * Draws bombs and updates their state.
     */
    drawBombs() {
        if (this.world.bombManager) {
            this.world.bombManager.update(this.world.character);
            this.world.bombManager.draw(this.world.ctx);
        }
    }

    /**
     * Draws hearts and updates energy state.
     */
    drawHearts() {
        if (this.world.heartsManager) {
            const prevEnergy = this.world.statusBar.percentage;
            this.world.heartsManager.update(this.world.character);
            if (prevEnergy < 100 && this.world.statusBar.percentage === 100) {
                this.world.gameAlerts.triggerFullEnergy();
            }
            this.world.heartsManager.draw(this.world.ctx);
        }
    }

    /**
     * Draws game alerts.
     */
    drawAlerts() {
        this.world.gameAlerts.draw(this.world.ctx);
    }
}


