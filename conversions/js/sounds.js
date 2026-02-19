/**
 * SoundManager - Web Audio API Sound Effects
 * Generates game sounds using synthesized audio (no external files needed)
 */

const SoundManager = (function() {
    'use strict';

    let audioContext = null;
    let masterGain = null;
    let isMuted = false;
    let musicEnabled = false;
    let musicOscillators = [];
    let musicInterval = null;

    /**
     * Initialize audio context (must be called after user interaction)
     */
    function init() {
        if (!audioContext) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) {
                audioContext = new AudioContext();
                masterGain = audioContext.createGain();
                masterGain.connect(audioContext.destination);
                masterGain.gain.value = 0.3; // Master volume
            }
        }
        // Resume audio context if suspended (browser policy)
        if (audioContext && audioContext.state === 'suspended') {
            audioContext.resume();
        }
    }

    /**
     * Play a tone with specified parameters
     */
    function playTone(frequency, duration, type = 'sine', volume = 0.5, startTime = 0) {
        if (!audioContext || isMuted) return;

        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(masterGain);

        oscillator.frequency.value = frequency;
        oscillator.type = type;

        const now = audioContext.currentTime + startTime;
        
        // Envelope for natural sound
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(volume, now + 0.01);
        gainNode.gain.linearRampToValueAtTime(volume * 0.7, now + duration * 0.5);
        gainNode.gain.linearRampToValueAtTime(0, now + duration);

        oscillator.start(now);
        oscillator.stop(now + duration);
    }

    /**
     * Play correct answer sound - cheerful ascending arpeggio
     */
    function playCorrect() {
        init();
        // Play a happy major arpeggio
        playTone(523.25, 0.15, 'sine', 0.6, 0);      // C5
        playTone(659.25, 0.15, 'sine', 0.6, 0.05);   // E5
        playTone(783.99, 0.2, 'sine', 0.6, 0.1);     // G5
        playTone(1046.50, 0.25, 'sine', 0.5, 0.15);  // C6
    }

    /**
     * Play incorrect answer sound - gentle descending tones
     */
    function playIncorrect() {
        init();
        // Play a gentle descending sound
        playTone(440, 0.2, 'sine', 0.4, 0);         // A4
        playTone(392, 0.2, 'sine', 0.4, 0.15);      // G4
        playTone(349.23, 0.25, 'sine', 0.4, 0.3);   // F4
    }

    /**
     * Play combo build sound - rising chime
     */
    function playCombo(comboCount) {
        init();
        const baseFreq = 400 + (comboCount * 50);
        playTone(baseFreq, 0.1, 'sine', 0.5, 0);
        playTone(baseFreq * 1.5, 0.15, 'sine', 0.4, 0.05);
    }

    /**
     * Play level complete sound - fanfare
     */
    function playLevelComplete() {
        init();
        // Victory fanfare
        const notes = [523.25, 659.25, 783.99, 1046.50, 783.99, 1046.50];
        const times = [0, 0.15, 0.3, 0.45, 0.6, 0.75];
        
        notes.forEach((freq, i) => {
            playTone(freq, 0.2, 'sine', 0.5, times[i]);
        });

        // Add sparkle effect
        setTimeout(() => {
            playTone(1318.51, 0.3, 'triangle', 0.3, 0);
            playTone(1567.98, 0.3, 'triangle', 0.3, 0.1);
        }, 100);
    }

    /**
     * Play badge earned sound - magical chime
     */
    function playBadgeEarned() {
        init();
        // Magical ascending chime
        const notes = [659.25, 783.99, 987.77, 1318.51];
        const times = [0, 0.1, 0.2, 0.35];
        
        notes.forEach((freq, i) => {
            playTone(freq, 0.3, 'sine', 0.5, times[i]);
        });

        // Add sparkle
        setTimeout(() => {
            playTone(1975.53, 0.4, 'triangle', 0.3, 0);
        }, 500);
    }

    /**
     * Play button click sound
     */
    function playClick() {
        init();
        playTone(800, 0.05, 'sine', 0.3, 0);
    }

    /**
     * Play hint reveal sound
     */
    function playHint() {
        init();
        playTone(523.25, 0.1, 'sine', 0.3, 0);
        playTone(659.25, 0.15, 'sine', 0.3, 0.08);
    }

    /**
     * Play star earned sound
     */
    function playStarEarned(starCount) {
        init();
        // Play ascending stars
        for (let i = 0; i < starCount; i++) {
            playTone(783.99 + (i * 100), 0.15, 'sine', 0.4, i * 0.12);
        }
    }

    /**
     * Start background music (optional, ambient)
     */
    function startMusic() {
        if (!audioContext || musicEnabled) return;
        
        musicEnabled = true;
        init();
        
        // Simple ambient loop - very subtle
        const bassNotes = [130.81, 146.83, 164.81, 196.00]; // C3, D3, E3, G3
        let noteIndex = 0;

        function playNextNote() {
            if (!musicEnabled || isMuted) return;
            
            const freq = bassNotes[noteIndex % bassNotes.length];
            playTone(freq, 1.5, 'sine', 0.15, 0);
            noteIndex++;
            
            musicInterval = setTimeout(playNextNote, 2000);
        }

        playNextNote();
    }

    /**
     * Stop background music
     */
    function stopMusic() {
        musicEnabled = false;
        if (musicInterval) {
            clearTimeout(musicInterval);
            musicInterval = null;
        }
    }

    /**
     * Toggle mute on/off
     */
    function toggleMute() {
        isMuted = !isMuted;
        if (isMuted) {
            stopMusic();
        }
        return isMuted;
    }

    /**
     * Check if muted
     */
    function isMutedState() {
        return isMuted;
    }

    /**
     * Check if music is enabled
     */
    function isMusicEnabled() {
        return musicEnabled;
    }

    /**
     * Set volume (0.0 to 1.0)
     */
    function setVolume(value) {
        if (masterGain) {
            masterGain.gain.value = Math.max(0, Math.min(1, value));
        }
    }

    // Public API
    return {
        init,
        playCorrect,
        playIncorrect,
        playCombo,
        playLevelComplete,
        playBadgeEarned,
        playClick,
        playHint,
        playStarEarned,
        startMusic,
        stopMusic,
        toggleMute,
        isMutedState,
        isMusicEnabled,
        setVolume
    };

})();
