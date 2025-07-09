class EnemyOne extends CollidableObject {

    offset = {
        top: 140,
        left: 103,
        right: 115,
        bottom: 80
    };

    IMAGES_WALKING = [
        'img/Enemy Characters/Enemy Character01/Walk/Walk_00.png',
        'img/Enemy Characters/Enemy Character01/Walk/Walk_01.png',
        'img/Enemy Characters/Enemy Character01/Walk/Walk_02.png',
        'img/Enemy Characters/Enemy Character01/Walk/Walk_03.png',
        'img/Enemy Characters/Enemy Character01/Walk/Walk_04.png',
        'img/Enemy Characters/Enemy Character01/Walk/Walk_05.png',
        'img/Enemy Characters/Enemy Character01/Walk/Walk_06.png',
        'img/Enemy Characters/Enemy Character01/Walk/Walk_07.png',
        'img/Enemy Characters/Enemy Character01/Walk/Walk_08.png',
        'img/Enemy Characters/Enemy Character01/Walk/Walk_09.png',
        'img/Enemy Characters/Enemy Character01/Walk/Walk_10.png',
        'img/Enemy Characters/Enemy Character01/Walk/Walk_11.png',
        'img/Enemy Characters/Enemy Character01/Walk/Walk_12.png',
        'img/Enemy Characters/Enemy Character01/Walk/Walk_13.png',
    ];

    constructor() {
        super().loadImage('img/Enemy Characters/Enemy Character01/Walk/Walk_00.png');
        this.loadImages(this.IMAGES_WALKING);
        this.x = 400 + Math.random() * 720;
        this.y = 160 + Math.random() * 10;

        this.speed = 0.15 + Math.random() * 0.25;

        this.animate();
    }

    animate() {
        setInterval(() => {
            this.moveLeft();
        }, 1000 / 60);

        setInterval(() => {
            this.playAnimation(this.IMAGES_WALKING);
        }, 100);
    }

}