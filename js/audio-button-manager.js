(function() {
    const configs = [
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

    let muted = (typeof window.isAudioMuted !== 'undefined') ? window.isAudioMuted : (window.SoundCacheManager ? SoundCacheManager.muted : true);
    let unlocked = false;

    function setIcons() {
        configs.forEach(cfg => {
            const btn = document.getElementById(cfg.btnId);
            if (!btn) return;
            const onIcon = btn.querySelector('#' + cfg.onId);
            const offIcon = btn.querySelector('#' + cfg.offId);
            if (!onIcon || !offIcon) return;
            if (muted) {
                onIcon.style.display = 'none';
                offIcon.style.display = '';
            } else {
                onIcon.style.display = '';
                offIcon.style.display = 'none';
            }
        });
    }

    function setMutedAll(newMuted) {
        muted = newMuted;
        if (window.SoundCacheManager && typeof SoundCacheManager.setMuted === 'function') {
            SoundCacheManager.setMuted(muted);
        }
        window.isAudioMuted = muted;
        setIcons();

        if (typeof window !== 'undefined') {
            const canvas = document.getElementById('canvas');
            const canvasVisible = canvas && canvas.classList.contains('canvas-visible');
            if (canvasVisible) {
                if (window.backgroundMusic) {
                    if (!muted) {
                        window.backgroundMusic.muted = false;
                        window.backgroundMusic.volume = 0.08;
                        window.backgroundMusic.currentTime = 0;
                        window.backgroundMusic.play().catch(()=>{});
                    } else {
                        window.backgroundMusic.muted = true;
                        window.backgroundMusic.volume = 0;
                    }
                }
            }
        }
    }

    function unlockAudio() {
        if (unlocked) return;
        try {
            const audio = window.SoundCacheManager
                ? SoundCacheManager.getAudio('sounds/laser-shot.mp3')
                : new Audio('sounds/laser-shot.mp3');
            audio.volume = 0;
            audio.play().catch(()=>{});
        } catch (e) {}
        unlocked = true;
        if (typeof window.CustomEvent === 'function') {
            window.dispatchEvent(new CustomEvent('audio-unlocked'));
        }
    }

    function addListeners() {
        configs.forEach(cfg => {
            const btn = document.getElementById(cfg.btnId);
            if (!btn) return;
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                unlockAudio();
                setMutedAll(!muted);
                if (typeof window.CustomEvent === 'function') {
                    window.dispatchEvent(new CustomEvent('audio-mute-changed', { detail: { muted } }));
                }
            });
        });
        window.addEventListener('audio-mute-changed', function(e) {
            if (typeof e.detail === 'object' && typeof e.detail.muted === 'boolean') {
                setMutedAll(e.detail.muted);
            }
        });
    }

    document.addEventListener('DOMContentLoaded', function() {
        setIcons();
        addListeners();
    });
})();
