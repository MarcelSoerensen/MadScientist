class CollidableObject extends MovableObject {

    collidable = true;

    damage = 0;

    offset = {
        top: 80,
        left: 50,
        right: 50,
        bottom: 20   
    };

    drawCollisionFrame(ctx) {
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 2;
        
        let yPos = this.y + this.offset.top;
        if (this.jumpOffsetY !== undefined) {
            yPos += this.jumpOffsetY * 1.5;
        }
        
        ctx.strokeRect(
            this.x + this.offset.left,
            yPos,
            this.width - this.offset.left - this.offset.right,
            this.height - this.offset.top - this.offset.bottom
        );
    }

}

