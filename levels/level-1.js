const level1 = new Level(
    [
        new EnemyOne(),
        new EnemyOne(),
        new EnemyOne(),
        new Endboss(),
    ],

    [
        new BackgroundObject('img/Backgrounds/1.png', -400, 0, 480, 1955),
        new BackgroundObject('img/Backgrounds/7.png', -400, 0, 80, 1955),
        new BackgroundObject('img/Backgrounds/8.png', -402, 422, 58, 1957),
        new BackgroundObject('img/Backgrounds/2.png', 1552, 0, 480, 1955),
        new BackgroundObject('img/Backgrounds/9.png', 1552, 0, 80, 1957),
        new BackgroundObject('img/Backgrounds/10.png', 1552, 25, 455, 1955),
        new BackgroundObject('img/Backgrounds/7.png', 1952*2-480, 0, 80, 1955),
        new BackgroundObject('img/Backgrounds/8.png', 1952*2-478, 422, 58, 1957),
    ]
);

