class Character extends MovableObject {
    y= 110;
    height = 380;
    speed = 2;
    IMAGES_WALKING = [
        'img/Main Characters/Gun01/Walk/Walk_00.png',
        'img/Main Characters/Gun01/Walk/Walk_01.png',
        'img/Main Characters/Gun01/Walk/Walk_02.png',
        'img/Main Characters/Gun01/Walk/Walk_03.png',
        'img/Main Characters/Gun01/Walk/Walk_04.png',
        'img/Main Characters/Gun01/Walk/Walk_05.png',
        'img/Main Characters/Gun01/Walk/Walk_06.png',
        'img/Main Characters/Gun01/Walk/Walk_07.png',
        'img/Main Characters/Gun01/Walk/Walk_08.png',
        'img/Main Characters/Gun01/Walk/Walk_09.png',
        'img/Main Characters/Gun01/Walk/Walk_10.png',
        'img/Main Characters/Gun01/Walk/Walk_11.png',
        'img/Main Characters/Gun01/Walk/Walk_12.png',
        'img/Main Characters/Gun01/Walk/Walk_13.png',
    ];

    IMAGES_JUMPING = [
        'img/Main Characters/Gun01/Jump/Jump_00.png',
        'img/Main Characters/Gun01/Jump/Jump_01.png',
        'img/Main Characters/Gun01/Jump/Jump_02.png',
        'img/Main Characters/Gun01/Jump/Jump_03.png',
        'img/Main Characters/Gun01/Jump/Jump_04.png',
        'img/Main Characters/Gun01/Jump/Jump_05.png',
        'img/Main Characters/Gun01/Jump/Jump_06.png',
        'img/Main Characters/Gun01/Jump/Jump_07.png',
        'img/Main Characters/Gun01/Jump/Jump_08.png',
        'img/Main Characters/Gun01/Jump/Jump_09.png',   
    ];

    world;
    lastAnimation = '';
    currentImage = 0;
    isJumping = false;
    startJumpX = 0;
    JUMP_DELAYS = [20, 30, 40, 55, 70, 70, 55, 40, 30, 20];

    constructor() {
        super().loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_JUMPING);
        this.x = 0;
        this.animate();
    }

    animate() {
        setInterval(() => {
            let moveSpeed = this.speed;

            if (this.isJumping && this.world.keyboard.UP) {
                moveSpeed = this.speed * 1.5; 
            }

            if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x - 100) {
                this.moveRight(moveSpeed);
            }
            if (this.world.keyboard.LEFT && this.x > 0 ) {
                this.moveLeft(moveSpeed);
                this.otherDirection = true;
            }

            this.world.camera_x = -this.x;

            if (this.world.keyboard.UP && !this.isJumping) {
                this.isJumping = true;
                this.currentImage = 0;
                this.playJumpAnimation();
            }
        }, 1000 / 60);

        setInterval(() => {
            if (!this.isJumping) {
                if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
                    this.playAnimation(this.IMAGES_WALKING);
                    this.lastAnimation = 'walk';
                } else {
                    this.img = this.imageCache[this.IMAGES_WALKING[0]];
                    this.lastAnimation = 'idle';
                    this.currentImage = 0;
                }
            }
        }, 70);
    }

    playJumpAnimation() {
        if (!this.isJumping) return;
        let frame = 0;
        const self = this;

        function animateFrame() {
            self.img = self.imageCache[self.IMAGES_JUMPING[frame]];
            let delay = self.JUMP_DELAYS[frame] || 70;

            if (frame < self.IMAGES_JUMPING.length - 1) {
                frame++;
                setTimeout(animateFrame, delay);
            } else {
                const maxJumpDistance = 130;
                const distance = Math.abs(self.x - self.startJumpX);
                if (self.world.keyboard.UP && distance < maxJumpDistance) {
                    setTimeout(animateFrame, 20);
                } else {
                    self.isJumping = false;
                    self.currentImage = 0;
                    self.lastAnimation = '';
                }
            }
        }

        this.startJumpX = this.x;
        animateFrame();
    }
}
