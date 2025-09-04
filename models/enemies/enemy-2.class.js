/**
 * @class EnemyTwo
 * @extends MovableObject
 * @classdesc Vertical-moving enemy using EnemyOne's animation, placed in the center of the level.
 */
class EnemyTwo extends CollidableObject {
    // ...existing code...
    // ...existing code...
    _proximitySoundPlaying = false;
    _proximitySoundAudio = null;
    lastHitTime = 0;
    laserHitCount = 0;
    isDeadAnimationPlaying = false;
    /**
     * Collision offset values for EnemyTwo (wie EnemyOne)
     */
    offset = {
        top: 140,
        left: 103,
        right: 115,
        bottom: 80
    };
    IMAGES_WALKING = [
        'img/Enemy Characters/Enemy Character10/Moving and Idle/Moving and Idle_0.png',
        'img/Enemy Characters/Enemy Character10/Moving and Idle/Moving and Idle_1.png',
        'img/Enemy Characters/Enemy Character10/Moving and Idle/Moving and Idle_2.png',
        'img/Enemy Characters/Enemy Character10/Moving and Idle/Moving and Idle_3.png',
        'img/Enemy Characters/Enemy Character10/Moving and Idle/Moving and Idle_4.png',
        'img/Enemy Characters/Enemy Character10/Moving and Idle/Moving and Idle_5.png',
        'img/Enemy Characters/Enemy Character10/Moving and Idle/Moving and Idle_6.png'
    ];

    IMAGES_GET_ELECTRIC = [
        'img/Enemy Characters/Enemy Character10/Get Electric/Get Electric_0.png',
        'img/Enemy Characters/Enemy Character10/Get Electric/Get Electric_1.png',
        'img/Enemy Characters/Enemy Character10/Get Electric/Get Electric_2.png',
    ];

    IMAGES_DEATH = [
        'img/Enemy Characters/Enemy Character10/Destroy/Destroy_00.png',
        'img/Enemy Characters/Enemy Character10/Destroy/Destroy_01.png',
        'img/Enemy Characters/Enemy Character10/Destroy/Destroy_02.png',
        'img/Enemy Characters/Enemy Character10/Destroy/Destroy_03.png',
        'img/Enemy Characters/Enemy Character10/Destroy/Destroy_04.png',
        'img/Enemy Characters/Enemy Character10/Destroy/Destroy_05.png',
        'img/Enemy Characters/Enemy Character10/Destroy/Destroy_06.png',
        'img/Enemy Characters/Enemy Character10/Destroy/Destroy_07.png',
        'img/Enemy Characters/Enemy Character10/Destroy/Destroy_08.png',
        'img/Enemy Characters/Enemy Character10/Destroy/Destroy_09.png',
        'img/Enemy Characters/Enemy Character10/Destroy/Destroy_10.png',
        'img/Enemy Characters/Enemy Character10/Destroy/Destroy_11.png',
        'img/Enemy Characters/Enemy Character10/Destroy/Destroy_12.png',
        'img/Enemy Characters/Enemy Character10/Destroy/Destroy_13.png'
    ];

    /**
     * Creates a new EnemyTwo instance
     * Enemy moves vertically in the center of the level
     */
    constructor(levelHeight = 480) {
        super().loadImage('img/Enemy Characters/Enemy Character01/Walk/Walk_00.png');
        this.loadImages(this.IMAGES_WALKING);
    this.x = 1800;
    this.y = Math.random() * 100 - 100;
    this.speed = 1.99 + Math.random() * 1.0;
    this.verticalDirection = Math.random() < 0.5 ? 1 : -1;
        this.loadImages(this.IMAGES_GET_ELECTRIC);
        this.loadImages(this.IMAGES_DEATH);
        this.visible = true;
        this.animate();
        // world-Referenz setzen, falls vorhanden
        if (typeof window !== 'undefined' && window.world) {
            this.world = window.world;
        }
    }

    /**
     * Starts enemy animation and vertical movement
     */
    animate() {
        let lastAnimTime = 0;
        const animFrameDuration = 120;
        const animateStep = (timestamp) => {
            // Proximity Sound: Fade-In/Fade-Out Bereich
            if (this.world && this.world.character) {
                const charX = this.world.character.x;
                const enemyX = this.x;
                const fadeRange = 350;
                const fadeOutStop = 350;
                const fadeOutStart = 250;
                const dist = Math.abs(charX - enemyX);
                if (dist <= fadeRange) {
                    if (!this._proximitySoundPlaying) {
                        this._proximitySoundAudio = new Audio('sounds/enemy2.wav');
                        this._proximitySoundAudio.loop = true;
                        this._proximitySoundAudio.volume = 0.0;
                        this._proximitySoundAudio.playbackRate = 0.90;
                        this._proximitySoundAudio.play();
                        this._proximitySoundPlaying = true;
                        // Einfaches Fade-In
                        let fadeStep = 0.01;
                        let fadeInterval = setInterval(() => {
                            if (!this._proximitySoundAudio) return;
                            if (this._proximitySoundAudio.volume >= 0.5) {
                                this._proximitySoundAudio.volume = 0.5;
                                clearInterval(fadeInterval);
                            } else {
                                this._proximitySoundAudio.volume += fadeStep;
                            }
                        }, 40);
                    }
                    // Fade-Out ab 250px Entfernung
                    if (this._proximitySoundPlaying && this._proximitySoundAudio && dist > fadeOutStart) {
                        let targetVolume = 0.5 * (1 - (dist - fadeOutStart) / (fadeRange - fadeOutStart));
                        targetVolume = Math.max(0, Math.min(0.5, targetVolume));
                        let fadeOutInterval = setInterval(() => {
                            if (!this._proximitySoundAudio) return;
                            if (this._proximitySoundAudio.volume <= targetVolume + 0.01) {
                                this._proximitySoundAudio.volume = targetVolume;
                                clearInterval(fadeOutInterval);
                            } else {
                                this._proximitySoundAudio.volume -= 0.01;
                            }
                        }, 40);
                    }
                } else if (dist > fadeRange && dist <= fadeOutStop) {
                    // Fade-Out bis 350px
                    if (this._proximitySoundPlaying && this._proximitySoundAudio) {
                        let targetVolume = 0.5 * (1 - (dist - fadeRange) / (fadeOutStop - fadeRange));
                        targetVolume = Math.max(0, Math.min(0.5, targetVolume));
                        let fadeOutInterval = setInterval(() => {
                            if (!this._proximitySoundAudio) return;
                            if (this._proximitySoundAudio.volume <= targetVolume + 0.01) {
                                this._proximitySoundAudio.volume = targetVolume;
                                clearInterval(fadeOutInterval);
                            } else {
                                this._proximitySoundAudio.volume -= 0.01;
                            }
                        }, 40);
                    }
                } else if (dist > fadeOutStop) {
                    // Sound komplett stoppen
                    if (this._proximitySoundPlaying && this._proximitySoundAudio) {
                        this._proximitySoundAudio.volume = 0;
                        this._proximitySoundAudio.pause();
                        this._proximitySoundAudio.currentTime = 0;
                        this._proximitySoundPlaying = false;
                    }
                }
            }
            if (!this.isDeadAnimationPlaying) {
                this.moveVertically();
            }
            if (this.laserHitCount >= 3 && !this.isElectricHurt) {
                if (!this.deathDone) {
                    if (typeof this.deathFrame === 'undefined') this.deathFrame = 0;
                    this.img = this.imageCache[this.IMAGES_DEATH[this.deathFrame]];
                    this.deathFrame++;
                    if (this.deathFrame >= this.IMAGES_DEATH.length) {
                        this.deathFrame = this.IMAGES_DEATH.length - 1;
                        this.deathDone = true;
                    }
                } else {
                    this.img = this.imageCache[this.IMAGES_DEATH[this.IMAGES_DEATH.length - 1]];
                }
            } else if (this.isElectricHurt) {
                if (!this.lastElectricAnimTime || timestamp - this.lastElectricAnimTime > animFrameDuration) {
                    this.playAnimation(this.IMAGES_GET_ELECTRIC);
                    this.lastElectricAnimTime = timestamp;
                }
            } else if (!this.isDeadAnimationPlaying) {
                if (!lastAnimTime || timestamp - lastAnimTime > animFrameDuration) {
                    this.playAnimation(this.IMAGES_WALKING);
                    lastAnimTime = timestamp;
                }
            }
            this.animationFrame = requestAnimationFrame(animateStep);
        };
        this.animationFrame = requestAnimationFrame(animateStep);
    }

    /**
     * Moves the enemy vertically, bouncing at top/bottom bounds
     */
    moveVertically() {
        this.y += this.speed * this.verticalDirection;
        
        if (this.y <= -80) {
            this.y = -80;
            this.verticalDirection = 1;
        } else if (this.y >= 150) {
            this.y = 150;
            this.verticalDirection = -1;
        }
    }

    /**
     * Registers an electric laser hit
     * @param {number} [force=1] - Number of hits
     */
    triggerElectricHurt(force = 1) {
        const now = Date.now();
        if (this.laserHitCount >= 3) return;
        if (force === 1 && (now - this.lastHitTime < 500)) return;
        this.lastHitTime = now;
        this.laserHitCount += force;
        if (this.laserHitCount > 3) this.laserHitCount = 3;
        if (this.electricHurtTimeout) {
            clearTimeout(this.electricHurtTimeout);
        }
        this.isElectricHurt = true;
        this.electricHurtTimeout = setTimeout(() => {
            this.isElectricHurt = false;
            this.electricHurtTimeout = null;
            if (this.laserHitCount === 3) {
                this.startDeathAnimation();
            }
        }, 700);
    }

    /**
     * Starts the death animation for the enemy
     */
    startDeathAnimation() {
        this.isDeadAnimationPlaying = true;
        this.currentImage = 0;
        this.collidable = false;
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
            this.animationFrame = null;
        }
        this.moveVertically = function(){};

        let deathFrame = 0;
        this.deathAnimInterval = setInterval(() => {
            if (deathFrame < this.IMAGES_DEATH.length) {
                this.img = this.imageCache[this.IMAGES_DEATH[deathFrame]];
                deathFrame++;
            } else {
                this.img = this.imageCache[this.IMAGES_DEATH[this.IMAGES_DEATH.length - 1]];
                clearInterval(this.deathAnimInterval);
                this.removeEnemy(); 
            }
        }, 50);
    }

    /**
     * Starts blinking effect after death
     */
    startBlinking() {
        this.blinkInterval = setInterval(() => {
            this.visible = !this.visible;
        }, 200);
    }

    /**
     * Removes the enemy from the game
     */
    removeEnemy() {
        this.visible = false;
        if (this.blinkInterval) {
            clearInterval(this.blinkInterval);
            this.blinkInterval = null;
        }
    }
}
