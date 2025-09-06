
class CollisionManager {
    getEnemyRect(enemy) {
        return {
            x: enemy.x + (enemy.offset?.left || 0),
            y: enemy.y + (enemy.offset?.top || 0),
            width: enemy.width - ((enemy.offset?.left || 0) + (enemy.offset?.right || 0)),
            height: enemy.height - ((enemy.offset?.top || 0) + (enemy.offset?.bottom || 0))
        };
    }

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
    checkEnemyCollision(world) {
        world.level.enemies.forEach(enemy => {
            if (!enemy.collidable) return;
            let collided = world.character.isColliding(enemy);
            if (collided) {
                const now = Date.now();
                if (!world._lastCollisionSoundTime || now - world._lastCollisionSoundTime > 500) {
                    try {
                        const collisionSound = new Audio('sounds/character-collided.wav');
                        collisionSound.volume = 0.5;
                        collisionSound.play();
                        world._lastCollisionSoundTime = now;
                    } catch (e) {}
                }
                world.character.hit();
                world.statusBar.setPercentage(world.character.energy);
            }
        });
    }

    checkBombCollision(world) {
        world.level.enemies.forEach(enemy => {
            if (!enemy.collidable) return;
            const enemyRect = this.getEnemyRect(enemy);
            world.throwableObjects.forEach(bomb => {
                if (bomb.isExploding) {
                    const bombRect = bomb.getExplosionRect();
                    if (this.isCollision(enemyRect, bombRect)) {
                        if (enemy instanceof Endboss) {
                            enemy.triggerElectricHurt(5);
                        } else if (typeof enemy.startDeathAnimation === 'function' && !enemy.isDeadAnimationPlaying) {
                            enemy.startDeathAnimation();
                        }
                    }
                }
            });
        });
    }

    checkLaserCollision(world) {
        world.level.enemies.forEach(enemy => {
            if (!enemy.collidable) return;
            world.laserBeams.forEach(laser => {
                if (laser.isColliding(enemy)) {
                    if (enemy instanceof Endboss) {
                        if (laser.isSuperShot) {
                            enemy.triggerElectricHurt(5);
                        } else {
                            enemy.triggerElectricHurt(1);
                        }
                    } else {
                        if (laser.isSuperShot) {
                            enemy.triggerElectricHurt(3);
                        } else {
                            enemy.triggerElectricHurt(1);
                        }
                    }
                }
            });
        });
    }

    checkEndbossStickCollision(world) {
        world.level.enemies.forEach(enemy => {
            if (
                enemy instanceof Endboss &&
                enemy.animState === 'hit' &&
                enemy.collidable !== false
            ) {
                const stickRect = enemy.getStickCollisionRect && enemy.getStickCollisionRect();
                if (stickRect) {
                    const charRect = {
                        x: world.character.x + (world.character.offset?.left || 0),
                        y: world.character.y + (world.character.offset?.top || 0),
                        width: world.character.width - ((world.character.offset?.left || 0) + (world.character.offset?.right || 0)),
                        height: world.character.height - ((world.character.offset?.top || 0) + (world.character.offset?.bottom || 0))
                    };
                    const stickCollision =
                        charRect.x < stickRect.x + stickRect.width &&
                        charRect.x + charRect.width > stickRect.x &&
                        charRect.y < stickRect.y + stickRect.height &&
                        charRect.y + charRect.height > stickRect.y;
                    if (stickCollision) {
                        const now = Date.now();
                        if (!world._lastCollisionSoundTime || now - world._lastCollisionSoundTime > 500) {
                            try {
                                const collisionSound = new Audio('sounds/character-collided.wav');
                                collisionSound.volume = 0.5;
                                collisionSound.play();
                                world._lastCollisionSoundTime = now;
                            } catch (e) {}
                        }
                        world.character.hit();
                        world.statusBar.setPercentage(world.character.energy);
                    }
                }
            }
        });
    }
}

window.collisionManager = new CollisionManager();
