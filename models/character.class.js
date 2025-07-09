class Character extends CollidableObject {
    y= 110;
    height = 380;
    speed = 2;

    offset = {
        top: 185,
        left: 100,
        right: 130,
        bottom: 105
    };
    
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

    IMAGES_DEAD = [
        'img/Main Characters/Gun01/Death/Death_00.png',
        'img/Main Characters/Gun01/Death/Death_01.png',
        'img/Main Characters/Gun01/Death/Death_02.png',
        'img/Main Characters/Gun01/Death/Death_03.png',
        'img/Main Characters/Gun01/Death/Death_04.png',
        'img/Main Characters/Gun01/Death/Death_05.png',
        'img/Main Characters/Gun01/Death/Death_06.png',
        'img/Main Characters/Gun01/Death/Death_07.png',
        'img/Main Characters/Gun01/Death/Death_08.png',
        'img/Main Characters/Gun01/Death/Death_09.png',
        'img/Main Characters/Gun01/Death/Death_10.png',
        'img/Main Characters/Gun01/Death/Death_11.png',
        'img/Main Characters/Gun01/Death/Death_12.png',
        'img/Main Characters/Gun01/Death/Death_13.png',
        'img/Main Characters/Gun01/Death/Death_14.png',
        'img/Main Characters/Gun01/Death/Death_15.png',
        'img/Main Characters/Gun01/Death/Death_16.png',
        'img/Main Characters/Gun01/Death/Death_17.png',
        'img/Main Characters/Gun01/Death/Death_18.png',
        'img/Main Characters/Gun01/Death/Death_19.png',
        'img/Main Characters/Gun01/Death/Death_20.png',
        'img/Main Characters/Gun01/Death/Death_21.png',
        'img/Main Characters/Gun01/Death/Death_22.png',
        'img/Main Characters/Gun01/Death/Death_23.png',
        'img/Main Characters/Gun01/Death/Death_24.png',
        'img/Main Characters/Gun01/Death/Death_25.png',
        'img/Main Characters/Gun01/Death/Death_26.png',
        'img/Main Characters/Gun01/Death/Death_27.png',
        'img/Main Characters/Gun01/Death/Death_28.png',
        'img/Main Characters/Gun01/Death/Death_29.png',
        'img/Main Characters/Gun01/Death/Death_30.png',
        'img/Main Characters/Gun01/Death/Death_31.png',
        'img/Main Characters/Gun01/Death/Death_32.png',
        'img/Main Characters/Gun01/Death/Death_33.png',
        'img/Main Characters/Gun01/Death/Death_34.png',
        'img/Main Characters/Gun01/Death/Death_35.png',
        'img/Main Characters/Gun01/Death/Death_36.png',
        'img/Main Characters/Gun01/Death/Death_37.png',
        'img/Main Characters/Gun01/Death/Death_38.png',
        'img/Main Characters/Gun01/Death/Death_39.png',
        'img/Main Characters/Gun01/Death/Death_40.png',
        'img/Main Characters/Gun01/Death/Death_41.png',
        'img/Main Characters/Gun01/Death/Death_42.png',
        'img/Main Characters/Gun01/Death/Death_43.png',
    ];

    world;
    lastAnimation = '';
    currentImage = 0;
    isAboveGroundActive = false;
    startJumpX = 0;
    jumpOffsetY = 0;  // Y-Verschiebung während des Sprungs
    JUMP_DELAYS = [10, 15, 25, 35, 55, 70, 85, 55, 22, 15];
    JUMP_DELAYS_DOWN = [...this.JUMP_DELAYS].reverse();

    constructor() {
        super().loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_JUMPING);
        this.loadImages(this.IMAGES_DEAD);
        this.x = 0;
        this.isAboveGroundActive = false; // Status-Flag initialisieren
        this.animate();
    }

    animate() {
        setInterval(() => {
            let moveSpeed = this.speed;

            if (this.isAboveGround() && this.world.keyboard.UP) {
                moveSpeed = this.speed * 1.5; 
            }

            if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x - 100) {
                this.moveRight(moveSpeed);
                this.otherDirection = false;
            }
            if (this.world.keyboard.LEFT && this.x > 0 ) {
                this.moveLeft(moveSpeed);
                this.otherDirection = true;
            }

            this.world.camera_x = -this.x;

            if (this.world.keyboard.UP && !this.isAboveGround()) {
                this.isAboveGroundActive = true;
                this.currentImage = 0;
                this.playJumpAnimation();
            }
        }, 1000 / 60);

        setInterval(() => {
            if (!this.isDead() && !this.isAboveGround()) {
                if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
                    this.playAnimation(this.IMAGES_WALKING);
                    this.lastAnimation = 'walk';
                } else {
                    this.img = this.imageCache[this.IMAGES_WALKING[0]];
                    this.lastAnimation = 'idle';
                    this.currentImage = 0;
                }
            }
        }, 60);

        setInterval(() => {
            if (this.isDead()) {
                this.playAnimation(this.IMAGES_DEAD);
                this.lastAnimation = 'dead';
            }
        }, 30);
    }

    playJumpAnimation() {
        if (!this.isAboveGround()) return;
        this.startJumpX = this.x;
        let frame = 0;
        const self = this;
        const maxJumpHeight = 100;
        const totalFrames = this.IMAGES_JUMPING.length;

        function animateUp() {
            self.img = self.imageCache[self.IMAGES_JUMPING[frame]];
            
            self.jumpOffsetY = -(frame / totalFrames) * maxJumpHeight;
            
            let delay = self.JUMP_DELAYS[frame] || 60;
            frame++;
            if (frame < self.IMAGES_JUMPING.length) {
                setTimeout(animateUp, delay);
            } else {
                frame = self.IMAGES_JUMPING.length - 1;
                holdOnTop();
            }
        }

        function holdOnTop() {
            const maxJumpDistance = 120;
            const distance = Math.abs(self.x - self.startJumpX);
            const isMoving = self.world.keyboard.RIGHT || self.world.keyboard.LEFT;

            // Y-Offset bleibt am höchsten Punkt
            self.jumpOffsetY = -maxJumpHeight;

            if (self.world.keyboard.UP && isMoving && distance < maxJumpDistance) {
                setTimeout(holdOnTop, 20);
            } else {
                animateDown();
            }
        }

        function animateDown() {
            let delay = self.JUMP_DELAYS.slice().reverse()[self.IMAGES_JUMPING.length - 1 - frame] || 60;
            self.img = self.imageCache[self.IMAGES_JUMPING[frame]];
            self.jumpOffsetY = -(frame / totalFrames) * maxJumpHeight;
            
            frame--;
            if (frame >= 0) {
                setTimeout(animateDown, delay);
            } else {
                self.isAboveGroundActive = false;
                self.currentImage = 0;
                self.lastAnimation = '';
                self.jumpOffsetY = 0; 
            }
        }

        animateUp();
    }
}
