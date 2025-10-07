/**
 * Manages caching of audio and image resources to optimize performance.
 */
class SoundCacheManager {
    static cache = {};
    static muted = true;
    static BACKGROUND_SRC = 'sounds/background-sound.mp3';

    /**
     * Returns a cached audio instance (always a NEW instance, but with cached source).
     */
    static getBackgroundMusic() {
        if (!this.cache.backgroundMusicSingleton) {
            const audio = new Audio(this.BACKGROUND_SRC);
            audio.loop = true;
            audio.muted = this.muted;
            audio.volume = this.muted ? 0 : 0.08;
            this.cache.backgroundMusicSingleton = audio;
        }
        return this.cache.backgroundMusicSingleton;
    }

    /** 
     * Returns a cached audio instance (always a NEW instance, but with cached source).
     */
    static getAudio(src) {
        if (src === this.BACKGROUND_SRC) {
            return this.getBackgroundMusic();
        }
        if (!this.cache[src]) {
            this.cache[src] = new Audio(src);
        }
        const instance = new Audio(this.cache[src].src);
        instance.muted = this.muted;
        return instance;
    }

    /** 
     * Sets the global mute state for all new sounds and currently playing instances.
     */
    static setMuted(mute) {
        this.muted = mute;
        const audios = document.querySelectorAll('audio');
        audios.forEach(a => a.muted = mute);
        Object.entries(this.cache).forEach(([key, audio]) => {
            if (audio instanceof Audio && key !== 'backgroundMusicSingleton') {
                audio.muted = mute;
            }
        });
    }
}

class ImageCacheManager {
    static cache = {};

    /**
     * Returns a cached image instance (always the same instance for sprites, etc.).
     */
    static getImage(src) {
        if (!this.cache[src]) {
            const img = new Image();
            img.src = src;
            this.cache[src] = img;
        }
        return this.cache[src];
    }
}

window.SoundCacheManager = SoundCacheManager;
window.ImageCacheManager = ImageCacheManager;
