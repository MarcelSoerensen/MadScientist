/**
 * Represents a collidable object that extends MovableObject with collision detection capabilities
 * @extends MovableObject
 */
class CollidableObject extends MovableObject {

    /** @type {boolean} Whether this object can collide with others */
    collidable = true;

    /** @type {number} Damage dealt by this object */
    damage = 0;

    /** 
     * @type {Object} Collision offset values for precise hit detection
     * @property {number} top - Top offset in pixels
     * @property {number} left - Left offset in pixels
     * @property {number} right - Right offset in pixels
     * @property {number} bottom - Bottom offset in pixels
     */
    offset = {
        top: 80,
        left: 50,
        right: 50,
        bottom: 20   
    };

    /**
     * Draws a red frame around the actual collision area
     * @param {CanvasRenderingContext2D} ctx - The 2D rendering context
     */
    drawCollisionFrame(ctx) {
        if (!this.collidable) return;
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

