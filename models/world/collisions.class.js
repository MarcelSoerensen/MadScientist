
/**
 * Manages all collision detection and processing in the game world.
 */
class CollisionManager {
    /**
     * Returns the collision rectangle for an enemy.
     */
    getEnemyRect(enemy) {
        return {
            x: enemy.x + (enemy.offset?.left || 0),
            y: enemy.y + (enemy.offset?.top || 0),
            width: enemy.width - ((enemy.offset?.left || 0) + (enemy.offset?.right || 0)),
            height: enemy.height - ((enemy.offset?.top || 0) + (enemy.offset?.bottom || 0))
        };
    }

    /**
     * Determines if two rectangles are colliding.
     */
    isCollision(rectA, rectB) {
        const overlap =
            rectA.x < rectB.x + rectB.width &&
            rectA.x + rectA.width > rectB.x &&
            rectA.y < rectB.y + rectB.height &&
            rectA.y + rectA.height > rectB.y;
        const contained =
            rectA.x >= rectB.x &&
            rectA.y >= rectB.y &&
            rectA.x + rectA.width <= rectB.x + rectB.width &&
            rectA.y + rectA.height <= rectB.y + rectB.height;
        return overlap || contained;
    }

    /**
     * Checks collision between the character and all enemies.
     */
    checkEnemyCollision(world) {
        world.level.enemies.forEach(enemy => {
            if (!enemy.collidable) return;
            let collided = world.character.isColliding(enemy);
            if (collided) {
                if (!world.character.sounds) world.character.sounds = new CharacterSounds();
                world.character.sounds.hurtSound(world.character, world);
                world.character.hit();
                world.statusBar.setPercentage(world.character.energy);
            }
        });
    }

    /**
     * Checks collision between bombs and enemies.
     */
    checkBombCollision(world) {
        world.level.enemies.forEach(enemy => {
            if (!enemy.collidable) return;
            const enemyRect = this.getEnemyRect(enemy);
            world.throwableObjects.forEach(bomb => {
                if (bomb.isExploding) {
                    const bombRect = bomb.getExplosionRect();
                    if (this.isCollision(enemyRect, bombRect)) {
                        if (enemy instanceof Endboss && enemy.handler) {
                            enemy.handler.handleHurtAnimation(enemy, 5);
                        } else if (enemy instanceof EnemyOne && enemy.handler && !enemy.isDeadAnimationPlaying) {
                            enemy.handler.handleDeathAnimation(enemy);
                        } else if (typeof enemy.handleDeathAnimation === 'function' && !enemy.isDeadAnimationPlaying) {
                            enemy.handleDeathAnimation();
                        }
                    }
                }
            });
        });
    }

    /**
     * Checks collision between laser beams and enemies.
     */
    checkLaserCollision(world) {
        world.level.enemies.forEach(enemy => {
            if (!enemy.collidable) return;
            world.laserBeams.forEach(laser => {
                if (laser.isColliding(enemy)) {
                    this.processLaserHit(enemy, laser);
                }
            });
        });
    }

    /**
     * Processes a laser hit on an enemy.
     */
    processLaserHit(enemy, laser) {
        if (enemy instanceof Endboss) {
            this.processEndbossLaserHit(enemy, laser);
        } else {
            this.processEnemyLaserHit(enemy, laser);
        }
    }
   
    /**
     * Processes a laser hit on the Endboss.
     */
    processEndbossLaserHit(enemy, laser) {
        if (laser.isSuperShot) {
            if ((enemy instanceof Endboss || enemy instanceof EnemyOne) && enemy.handler) {
                enemy.handler.handleHurtAnimation(enemy, 5);
            }
        } else {
            if ((enemy instanceof Endboss || enemy instanceof EnemyOne) && enemy.handler) {
                enemy.handler.handleHurtAnimation(enemy, 1);
            }
        }
    }

    /**
     * Processes a laser hit on a normal enemy.
     */
    processEnemyLaserHit(enemy, laser) {
        if (enemy instanceof EnemyTwo) {
            enemy.triggerElectricHurt(laser.isSuperShot ? 3 : 1);
        } else if (laser.isSuperShot) {
            if ((enemy instanceof Endboss || enemy instanceof EnemyOne) && enemy.handler) {
                enemy.handler.handleHurtAnimation(enemy, 3);
            }
        } else {
            if ((enemy instanceof Endboss || enemy instanceof EnemyOne) && enemy.handler) {
                enemy.handler.handleHurtAnimation(enemy, 1);
            }
        }
    }

    /**
     * Checks collision between the Endboss stick and the character.
     */
    checkEndbossStickCollision(world) {
        world.level.enemies.forEach(enemy => {
            const stickRect = this.getEndbossStickCollisionRect(enemy);
            if (stickRect && this.checkEndbossStickCharacterCollision(world.character, stickRect)) {
            }
        });
    }

    /**
     * Returns the Endboss stick collision rectangle if active, otherwise null.
     */
    getEndbossStickCollisionRect(enemy) {
        if (
            enemy instanceof Endboss &&
            enemy.animState === 'hit' &&
            enemy.collidable !== false &&
            typeof enemy.getStickCollisionRect === 'function'
        ) {
            return enemy.getStickCollisionRect();
        }
        return null;
    }

    /**
     * Checks if the character collides with the Endboss stick.
     */
    checkEndbossStickCharacterCollision(character, stickRect) {
        const charRect = {
            x: character.x + (character.offset?.left || 0),
            y: character.y + (character.offset?.top || 0),
            width: character.width - ((character.offset?.left || 0) + (character.offset?.right || 0)),
            height: character.height - ((character.offset?.top || 0) + (character.offset?.bottom || 0))
        };
        return (
            charRect.x < stickRect.x + stickRect.width &&
            charRect.x + charRect.width > stickRect.x &&
            charRect.y < stickRect.y + stickRect.height &&
            charRect.y + charRect.height > stickRect.y
        );
    }

    /**
     * Applies the effects of an Endboss stick collision to the character and world.
     */
    applyEndbossStickCollisionEffects(world) {
        if (!world.character.sounds) world.character.sounds = new CharacterSounds();
        world.character.sounds.hurtSound(world.character, world);
        world.character.hit();
        world.statusBar.setPercentage(world.character.energy);
    }
}
