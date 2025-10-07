/**
 * Starting position of the first enemies in the level.
 */
const levelStartX = -400;

/**
 * Creates the first level of the game.
 */
function createLevel1() {
    return new Level(levelOneEnemies(), levelOneBackgrounds());
}

/**
 * Creates a fresh level1 instance with new enemies and background objects.
 */
function levelOneEnemies() {
    return [
        new EnemyOne(true, levelStartX),
        new EnemyOne(),
        new EnemyOne(),
        new EnemyOne(false, 2500 + Math.random() * 1500, 1800),
        new EnemyOne(false, 2500 + Math.random() * 1500, 1800),
        new EnemyTwo(),
        new Endboss(),
    ];
}

/**
 * Background objects for level one.
 */
function levelOneBackgrounds() {
    const base = 1952 * 2;
    return [
        new BackgroundObject('img/Backgrounds/1.png', -400, 0, 480, 1954),
        new BackgroundObject('img/Backgrounds/7.png', -500, 0, 80, 1955),
        new BackgroundObject('img/Backgrounds/8.png', -600, 422, 58, 1957),
        new BackgroundObject('img/Backgrounds/2.png', 1552, 0, 480, 1954),
        new BackgroundObject('img/Backgrounds/9.png', 1452, 0, 80, 1957),
        new BackgroundObject('img/Backgrounds/10.png', 1352, 25, 455, 1955),
        new BackgroundObject('img/Backgrounds/7.png', base - 500, 0, 80, 1955),
        new BackgroundObject('img/Backgrounds/8.png', base - 600, 422, 58, 1957),
    ];
}

/**
 * Level object with enemies and background objects.
 */
let level1 = createLevel1();

