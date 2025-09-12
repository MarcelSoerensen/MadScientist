/**
 * Represents a game level containing enemies and background objects
 */
class Level {
    enemies;
    backgroundObjects;
    level_end_x = (1952*2-400 + 80); // Level-Ende = rechtes Ende des letzten Backgrounds

    /**
     * Creates a new Level instance
     */
    constructor(enemies, backgroundObjects) {
        this.enemies = enemies;
        this.backgroundObjects = backgroundObjects;
    }
}