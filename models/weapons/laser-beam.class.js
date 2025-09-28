/**
 * Represents a laser beam projectile that can be shot by the character
 */
class LaserBeam extends CollidableObject {
    /**
     * Creates a new LaserBeam instance.
     */
    constructor(x, y, otherDirection = false, character = null, offsetX, offsetY) {
        super().loadImage('img/Projectile/Laser/skeleton-animation_0.png');
        this.IMAGES_LASER_BEAM = [
            'img/Projectile/Laser/skeleton-animation_0.png',
            'img/Projectile/Laser/skeleton-animation_1.png',
            'img/Projectile/Laser/skeleton-animation_2.png',
            'img/Projectile/Laser/skeleton-animation_3.png',
            'img/Projectile/Laser/skeleton-animation_4.png',
        ];
        this.loadImages(this.IMAGES_LASER_BEAM);
        this.x = x;
        this.y = y;
        this.height = 60;
        this.width = 80;
        this.otherDirection = otherDirection;
        this.character = character;
        this.offset = { top: 5, left: 10, right: 10, bottom: 5 };
        this.speedX = 15;
        this.damage = 25;
        this.animationInterval = null;
        this.positionInterval = null;
        this.offsetX = offsetX !== undefined ? offsetX : 190;
        this.offsetY = offsetY !== undefined ? offsetY : 205;
        this.animateLaserBeam();
        this.followCharacter();
    }

    /**
     * Creates a normal LaserBeam and plays the sound (like previous createNormal, but with World logic)
     */
        static createLaserBeam(world) {
            let offsetY = 205;
            let offsetX = world.character.otherDirection ? -20 : 190;
            let laser = new LaserBeam(
                world.character.x + offsetX,
                world.character.y + offsetY,
                world.character.otherDirection,
                world.character,
                offsetX,
                offsetY
            );
            laser.shoot();
            return laser;
        }

    /**
     * Activates the LaserBeam: adds it, subtracts energy, starts animation and removes after 500ms
     */
        static activateLaserBeam(world, laser) {
            world.laserBeams.push(laser);
            world.energyBallManager.collectedCount = Math.max(0, world.energyBallManager.collectedCount - 1);
            setTimeout(() => {
                world.laserBeams.forEach(l => l.stopAnimation());
                world.laserBeams = [];
                world.laserActive = false;
            }, 500);
        }

    /**
     * Creates a normal laser and plays the sound
     */
    static createNormal(x, y, otherDirection, character, offsetX, offsetY) {
        const laser = new LaserBeam(x, y, otherDirection, character, offsetX, offsetY);
        laser.playLaserSound();
        return laser;
    }

    /**
     * Creates a SuperShot laser (double size) and plays the SuperShot sound
     */
    static createSuperShot(x, y, otherDirection, character, offsetX, offsetY) {
        const laser = new LaserBeam(x, y, otherDirection, character, offsetX, offsetY);
        laser.width *= 2;
        laser.height *= 2;
        laser.isSuperShot = true;
        laser.playSuperShotSound();
        return laser;
    }

    /** 
     * Plays the laser shooting sound
     */
    playLaserSound() {
        try {
            const laserSound = SoundCacheManager.getAudio('sounds/laser-shot.mp3');
            laserSound.volume = 0.5;
            laserSound.load();
            laserSound.play().catch((err) => {
                if (window && window.console) console.warn('Laser-Sound konnte nicht abgespielt werden:', err);
            });
        } catch (e) {
            if (window && window.console) console.warn('Laser-Sound Fehler:', e);
        }
    }

    /** 
     * Plays the SuperShot shooting sound
     */
    playSuperShotSound() {
        try {
            const shotSound = SoundCacheManager.getAudio('sounds/superlaser-shot.mp3');
            shotSound.volume = 0.5;
            shotSound.load();
            shotSound.play().catch((err) => {
                if (window && window.console) console.warn('SuperShot-Sound konnte nicht abgespielt werden:', err);
            });
        } catch (e) {
            if (window && window.console) console.warn('SuperShot-Sound Fehler:', e);
        }
    }

    /**
     * Initiates the shooting movement for the laser beam
     */
    shoot() {
        this.playLaserSound();
        setInterval(() => {
            if (this.otherDirection) {
                this.x -= this.speedX;
            } else {
                this.x += this.speedX;
            }
        }, 1000 / 60);
    }

    /**
     * Makes the laser follow the character's position
     */
    followCharacter() {
        if (!this.character) return;
        this.positionInterval = setInterval(() => {
            if (this.character.otherDirection) {
                this.x = this.character.x + this.offsetX;
            } else {
                this.x = this.character.x + this.offsetX;
            }
            this.y = this.character.y + this.offsetY;
            if (this.character.jumpOffsetY !== undefined && this.character.jumpOffsetY < 0) {
                this.y += this.character.jumpOffsetY * 1.2 - 25;
            } else if (this.character.jumpOffsetY !== undefined) {
                this.y += this.character.jumpOffsetY * 1.2;
            }
            this.otherDirection = this.character.otherDirection;
        }, 1000 / 120);
    }

    /**
     * Starts the laser beam animation
     */
    animateLaserBeam() {
        this.animationInterval = setInterval(() => {
            this.playAnimation(this.IMAGES_LASER_BEAM);
        }, 80);
    }

    /**
     * Stops the laser beam animation
     */
    stopAnimation() {
        if (this.animationInterval) {
            clearInterval(this.animationInterval);
            this.animationInterval = null;
        }
        if (this.positionInterval) {
            clearInterval(this.positionInterval);
            this.positionInterval = null;
        }
    }

    /**
     * Draws the laser beam
     */
    draw(ctx) {
        if (this.visible === false) return;
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }
}
