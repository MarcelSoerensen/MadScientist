/**
 * Represents a game level containing enemies and background objects
 */
class Level {
    /** @type {Array} Array of enemy objects in this level */
    enemies;
    /** @type {Array} Array of background objects in this level */
    backgroundObjects;
    /** @type {number} X coordinate where the level ends */
    level_end_x = 1952*2-620;

    /**
     * Creates a new Level instance
     * @param {Array} enemies - Array of enemy objects
     * @param {Array} backgroundObjects - Array of background objects
     */
    constructor(enemies, backgroundObjects) {
        this.enemies = enemies;
        this.backgroundObjects = backgroundObjects;
    }
}