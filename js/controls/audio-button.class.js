/**
 * AudioButtonManager: Steuert die Audio-Button-Funktion als Klasse.
 */
class AudioButtonManager {
    /**
     * Configuration for audio buttons and their associated icons.
     */
    static configs = [
        {
            btnId: 'audio-toggle-btn',
            onId: 'audio-on-icon',
            offId: 'audio-off-icon'
        },
        {
            btnId: 'system-audio-btn',
            onId: 'system-audio-on-icon',
            offId: 'system-audio-off-icon'
        }
    ];

    /**
     * Global mute state for audio; defaults to true (muted) if not set.
     */
    static muted = (() => {
        const stored = localStorage.getItem('audioMuted');
        if (stored !== null) return stored === 'true';
        if (typeof window.isAudioMuted !== 'undefined') return window.isAudioMuted;
        return window.SoundCacheManager ? SoundCacheManager.muted : true;
    })();
    static unlocked = false;

    /**
     * Sets the visibility of audio icons based on the current mute state.
     */
    static setIcons() {
        AudioButtonManager.configs.forEach(cfg => {
            const btn = document.getElementById(cfg.btnId);
            if (!btn) return;
            const onIcon = btn.querySelector('#' + cfg.onId);
            const offIcon = btn.querySelector('#' + cfg.offId);
            if (!onIcon || !offIcon) return;
            if (AudioButtonManager.muted) {
                onIcon.style.display = 'none';
                offIcon.style.display = '';
            } else {
                onIcon.style.display = '';
                offIcon.style.display = 'none';
            }
        });
    }
    
    /**
     * Sets the global mute state for all audio elements.
     */
    static setMutedAll(newMuted) {
        AudioButtonManager.muted = newMuted;
        window.isAudioMuted = AudioButtonManager.muted;
        localStorage.setItem('audioMuted', AudioButtonManager.muted ? 'true' : 'false');
        AudioButtonManager.setIcons();
        if (window.SoundCacheManager?.setMuted) {
            SoundCacheManager.setMuted(AudioButtonManager.muted);
        }
        const bgMusic = window.backgroundMusic;
        if (document.getElementById('canvas')?.classList.contains('canvas-visible') && bgMusic) {
            bgMusic.muted = AudioButtonManager.muted;
            bgMusic.volume = AudioButtonManager.muted ? 0 : 0.08;
            if (!AudioButtonManager.muted) {
                bgMusic.play().catch(e => {
                    if (e.name !== 'AbortError') console.error(e);
                });
            }
        }
    }

    /**
     * Unlocks the audio playback.
    */
    static unlockAudio() {
        if (AudioButtonManager.unlocked) return;
        try {
            const audio = window.SoundCacheManager
                ? SoundCacheManager.getAudio('sounds/laser-shot.mp3')
                : new Audio('sounds/laser-shot.mp3');
            audio.volume = 0;
            audio.play().catch(e => {
                if (e.name !== 'AbortError') console.error(e);
            });
        } catch (e) {}
        AudioButtonManager.unlocked = true;
        if (typeof window.CustomEvent === 'function') {
            window.dispatchEvent(new CustomEvent('audio-unlocked'));
        }
    }

    /**
     * Adds event listeners for audio button clicks and mute state changes.
     */

    static addListeners() {
        AudioButtonManager.configs.forEach(cfg => {
            document.getElementById(cfg.btnId)?.addEventListener('click', e => {
                if (e.cancelable) e.preventDefault();
                AudioButtonManager.unlockAudio();
                AudioButtonManager.setMutedAll(!AudioButtonManager.muted);
                window.dispatchEvent?.(new CustomEvent('audio-mute-changed', { detail: { muted: AudioButtonManager.muted } }));
            });
        });
        window.addEventListener('audio-mute-changed', e => {
            if (e?.detail?.muted !== undefined) AudioButtonManager.setMutedAll(e.detail.muted);
        });
    }

    /**
     * Initializes the AudioButtonManager by setting icons and adding listeners.
     */
    static init() {
        const stored = localStorage.getItem('audioMuted');
        if (stored !== null) {
            AudioButtonManager.setMutedAll(stored === 'true');
        } else {
            AudioButtonManager.setIcons();
        }
        AudioButtonManager.addListeners();
    }
}

/**
 * Initialize AudioButtonManager when DOM is ready
 */
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        AudioButtonManager.init();
    });
} else {
    AudioButtonManager.init();
}
window.AudioButtonManager = AudioButtonManager;
