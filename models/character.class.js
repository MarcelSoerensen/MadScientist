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
            if (!this.isAboveGround()) {
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
        if (!this.isAboveGround()) return;
        this.startJumpX = this.x;
        let frame = 0;
        const self = this;
        const maxJumpHeight = 100; // Maximale Sprunghöhe
        const totalFrames = this.IMAGES_JUMPING.length;

        function animateUp() {
            self.img = self.imageCache[self.IMAGES_JUMPING[frame]];
            
            self.jumpOffsetY = -(frame / totalFrames) * maxJumpHeight;
            
            let delay = self.JUMP_DELAYS[frame] || 70;
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
            let delay = self.JUMP_DELAYS.slice().reverse()[self.IMAGES_JUMPING.length - 1 - frame] || 70;
            self.img = self.imageCache[self.IMAGES_JUMPING[frame]];
            
            // Y-Offset berechnen (nach unten während des Falls)
            self.jumpOffsetY = -(frame / totalFrames) * maxJumpHeight;
            
            frame--;
            if (frame >= 0) {
                setTimeout(animateDown, delay);
            } else {
                self.isAboveGroundActive = false;
                self.currentImage = 0;
                self.lastAnimation = '';
                self.jumpOffsetY = 0; // Zurück zur normalen Position
            }
        }

        animateUp();
    }
}
