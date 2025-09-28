/**
 * Represents the main character in the game world.
 */
class Character extends CollidableObject {
    x = 0;
    y = 110;
    width = 250;
    height = 380;
    speed = 2;
    offset = {
        top: 185,
        left: 80,
        right: 110,
        bottom: 110
    };
    world;
    lastAnimation = '';
    currentImage = 0;
    isAboveGroundActive = false;
    startJumpX = 0;
    jumpOffsetY = 0;
    deathAnimationPlayed = false;
    throwAnimationPlaying = false;
    JUMP_DELAYS = [10, 15, 25, 35, 55, 70, 85, 55, 22, 15];
    JUMP_DELAYS_DOWN = [...this.JUMP_DELAYS].reverse();
    jumpSoundPlayed = false;
    stepSoundEndHandler = null;

    /**
     * Creates a Character instance.
     */
    constructor() {
        super();
        this.anim = new CharacterAnimations();
        this.loadImage(this.anim.IMAGES_WALKING[0]);
        this.loadImages(this.anim.IMAGES_WALKING);
        this.loadImages(this.anim.IMAGES_JUMPING);
        this.loadImages(this.anim.IMAGES_DEAD);
        this.loadImages(this.anim.IMAGES_HURT);
        this.loadImages(this.anim.IMAGES_IDLE);
        this.loadImages(this.anim.IMAGES_THROW_BOMB);
        this.x = 0;
        this.isAboveGroundActive = false;
        this.animateCharacter();
    }

    /**
     * Starts all character animation intervals using CharacterHandling.
     */
    animateCharacter() {
        if (!this.handler) {
            this.handler = new CharacterHandling();
        }
        this.handler.animateCharacter(this);
    }

    /**
     * Triggers the jump animation.
     */
    playJumpAnimation() {
        if (!this.isAboveGround()) return;
        this.startJumpX = this.x;
        this.anim.jumpAnimation(this);
    }

    /**
     * Triggers the death animation and sound.
     */
    playDeathAnimation() {
    if (this.deathAnimationPlayed) return;
    this.deathAnimationPlayed = true;
    if (!this.sounds) this.sounds = new CharacterSounds();
    this.sounds.deathSound(this);
    this.anim.deathAnimation(this);
    }

    /**
     * Triggers the throw bomb animation.
     */
    playThrowBombAnimation() {
        if (this.throwAnimationPlaying) return;
        if (!this.sounds) this.sounds = new CharacterSounds();
        setTimeout(() => {
            this.sounds.throwBombSound(this);
        }, 500);
        this.throwAnimationPlaying = true;
        this.anim.throwBombAnimation(this);
    }

    /**
     * Returns the collision rectangle for the character.
     */
    getCollisionRect() {
        let x = this.x + (this.offset?.left || 0);
        let y = this.y + (this.offset?.top || 0);
        if (this.jumpOffsetY !== undefined) {
            y += this.jumpOffsetY * 1.5;
        }
        let width = this.width - ((this.offset?.left || 0) + (this.offset?.right || 0));
        let height = this.height - ((this.offset?.top || 0) + (this.offset?.bottom || 0));
        return { x, y, width, height };
    }

    /**
     * Removes the character from the game (sets invisible and non-collidable).
     */
    removeCharacter() {
        this.visible = false;
        this.collidable = false;
    }
}
