document.addEventListener('DOMContentLoaded', function() {
    const btn = document.getElementById('audio-toggle-btn');
    if (!btn) return;
    let muted = true;
    let unlocked = false;
    const audioOnIcon = btn.querySelector('#audio-on-icon');
    const audioOffIcon = btn.querySelector('#audio-off-icon');
    function setIcon() {
        if (muted) {
            audioOnIcon.style.display = 'none';
            audioOffIcon.style.display = '';
        } else {
            audioOnIcon.style.display = '';
            audioOffIcon.style.display = 'none';
        }
    }
    btn.addEventListener('click', function(e) {
        e.preventDefault();
        if (!unlocked) {
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
        muted = !muted;
        setIcon();
        if (window.SoundCacheManager && typeof SoundCacheManager.setMuted === 'function') {
            SoundCacheManager.setMuted(muted);
        }
        window.isAudioMuted = muted;
    });
    setIcon();
});
