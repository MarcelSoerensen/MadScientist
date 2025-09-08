/**
 * Represents a collidable object that extends MovableObject with collision detection capabilities
 */
class CollidableObject extends MovableObject {

    collidable = true;
    damage = 0;

    /** 
     * Collision offset values for precise hit detection
     */
    offset = {
    top: 80,
    left: 30,
    right: 30,
    bottom: 20   
    };

    /**
     * Draws a red frame around the actual collision area
     */
    drawCollisionFrame(ctx) {
        if (!this.collidable) return;
    ctx.strokeStyle = 'rgba(0,0,0,0)';
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

