class Endboss extends MovableObject {
    height = 600;
    width = 600;
    y = -60;

    IMAGES_WALKING = [
        'img/Enemy Characters/Enemy Character07/Idle/Idle_00.png',
        'img/Enemy Characters/Enemy Character07/Idle/Idle_01.png',
        'img/Enemy Characters/Enemy Character07/Idle/Idle_02.png',
        'img/Enemy Characters/Enemy Character07/Idle/Idle_03.png',
        'img/Enemy Characters/Enemy Character07/Idle/Idle_04.png',
        'img/Enemy Characters/Enemy Character07/Idle/Idle_05.png',
        'img/Enemy Characters/Enemy Character07/Idle/Idle_06.png',
        'img/Enemy Characters/Enemy Character07/Idle/Idle_07.png',
        'img/Enemy Characters/Enemy Character07/Idle/Idle_08.png',
        'img/Enemy Characters/Enemy Character07/Idle/Idle_09.png',
        'img/Enemy Characters/Enemy Character07/Idle/Idle_10.png',
        'img/Enemy Characters/Enemy Character07/Idle/Idle_11.png',
        'img/Enemy Characters/Enemy Character07/Idle/Idle_12.png',
        'img/Enemy Characters/Enemy Character07/Idle/Idle_13.png',
    ];

    constructor() {
        super().loadImage('img/Enemy Characters/Enemy Character07/Walk/Walk_00.png');
        this.loadImages(this.IMAGES_WALKING);
        this.x = (1952 * 2 - 500);
        this.animate();
    }

    animate() {
        setInterval(() => {
            this.playAnimation(this.IMAGES_WALKING);
        }, 100);
    }
}