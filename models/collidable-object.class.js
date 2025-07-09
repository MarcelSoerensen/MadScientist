class CollidableObject extends MovableObject {

    collidable = true;

    damage = 0;

    offset = {
        top: 80,
        left: 50,
        right: 50,
        bottom: 20   
    };

    /**
     * Zeichnet einen roten Rahmen um den tatsächlichen Collision-Bereich
     * @param {CanvasRenderingContext2D} ctx 
     */
    drawCollisionFrame(ctx) {
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 2;
        ctx.strokeRect(
            this.x + this.offset.left,
            this.y + this.offset.top,
            this.width - this.offset.left - this.offset.right,
            this.height - this.offset.top - this.offset.bottom
        );
    }
}

