class World{
    character = new Character();
    level = level1;
    enemies = level1.enemies;
    backgroundObjects = level1.backgroundObjects;

    canvas;
    ctx;
    keyboard;
    camera_x = 0;

    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.draw();
        this.setWorld();
        this.checkCollisions();
    }
    
    setWorld() {
        this.character.world = this;
    }

    checkCollisions() {
        setInterval(() => {
            this.level.enemies.forEach(enemy => {
               if( this.character.isColliding(enemy)) {
                    this.character.hit();
                    console.log(`Collision detected! Character energy: ${this.character.energy}`);   
               }
            });
        },200);
    }

    draw() {

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.translate(this.camera_x, 0);
        
        this.drawMainBackground();
        this.drawGameObjects();
        this.drawParallaxTop();
        this.drawParallaxBottom();

        this.ctx.translate(-this.camera_x, 0);

        let self = this;
        requestAnimationFrame(function() {
            self.draw();
        });
    }

    drawMainBackground() {
        this.addToMap(this.backgroundObjects[3]);
        this.addToMap(this.backgroundObjects[0]);
    }

    drawGameObjects() {
        this.addObjectsToMap(this.enemies);
        this.addToMap(this.character);
    }

    drawParallaxTop() {
        this.ctx.translate(this.camera_x * 0.25, 0);
        this.addToMap(this.backgroundObjects[6]);
        this.addToMap(this.backgroundObjects[4]);
        this.addToMap(this.backgroundObjects[1]);
        this.ctx.translate(-this.camera_x * 0.25, 0);
    }

    drawParallaxBottom() {
        this.ctx.translate(this.camera_x * 0.5, 0);
        this.addToMap(this.backgroundObjects[7]);
        this.addToMap(this.backgroundObjects[5]);
        this.addToMap(this.backgroundObjects[2]);
        this.ctx.translate(-this.camera_x * 0.5, 0);
    }

    addObjectsToMap(objects) {
        objects.forEach(object => {
            this.addToMap(object);
        });
    }

    addToMap(movableObject) {
        if (
            movableObject.img &&
            movableObject.img.complete &&
            movableObject.img.naturalWidth > 0
        ) {
            if (movableObject.otherDirection) {
                this.flipImage(movableObject);
            }
            
            movableObject.draw(this.ctx);
            movableObject.drawFrame(this.ctx); 

            if (movableObject.drawCollisionFrame) {
                movableObject.drawCollisionFrame(this.ctx);
            }

            if (movableObject.otherDirection) {
                this.flipImageBack(movableObject);
            }
        }
    }

    flipImage(movableObject) {
        this.ctx.save();
        this.ctx.translate(movableObject.width, 0);
        this.ctx.scale(-1, 1);
        movableObject.x = movableObject.x * -1;
    }

    flipImageBack(movableObject) {
        movableObject.x = movableObject.x * -1;
        this.ctx.restore();
    }
            
}
