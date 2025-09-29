/**
 * Manages caching of audio and image resources to optimize performance.
 */
class SoundCacheManager {
    static cache = {};
    static muted = true; // Standard: alle Sounds aus

    /**
     * Returns a cached audio instance (always a NEW instance, but with cached source).
     */
    static getAudio(src) {
        if (!this.cache[src]) {
            const audio = new Audio(src);
            this.cache[src] = audio;
        }
        const newAudio = new Audio();
        newAudio.src = this.cache[src].src;
        newAudio.muted = this.muted;
        return newAudio;
    }

    /**
     * Setzt globales Mute für alle neuen Sounds und laufende Instanzen
     */
    static setMuted(mute) {
        this.muted = mute;
        // Alle laufenden Audios muten/unmuten
        const audios = document.querySelectorAll('audio');
        audios.forEach(a => a.muted = mute);
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
