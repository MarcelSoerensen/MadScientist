class Level {
    enemies;
    backgroundObjects;
    level_end_x = 1952*2-620;

    constructor(enemies, backgroundObjects) {
        this.enemies = enemies;
        this.backgroundObjects = backgroundObjects;
    }
}