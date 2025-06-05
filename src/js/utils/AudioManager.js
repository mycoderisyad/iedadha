import { GAME_CONFIG } from '../config/GameConfig.js';

export class AudioManager {
    constructor() {
        this.audioContext = null;
        this.soundEnabled = true;
        this.masterVolume = GAME_CONFIG.DEFAULT_SETTINGS.masterVolume;
        this.musicVolume = GAME_CONFIG.DEFAULT_SETTINGS.musicVolume;
        this.backgroundMusic = GAME_CONFIG.DEFAULT_SETTINGS.backgroundMusic;
        this.autoTakbir = GAME_CONFIG.DEFAULT_SETTINGS.autoTakbir;
        
        this.init();
    }
    
    init() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.setupUserInteractionHandler();
        } catch (e) {
            console.warn('Web Audio API not supported:', e);
            this.audioContext = null;
        }
    }
    
    setupUserInteractionHandler() {
        const enableAudio = () => {
            if (this.audioContext && this.audioContext.state === 'suspended') {
                this.audioContext.resume();
            }
            
            const musicElement = document.getElementById('backgroundMusic');
            if (musicElement && this.soundEnabled) {
                musicElement.play().catch(e => console.log('Music autoplay prevented:', e));
            }
            
            document.removeEventListener('click', enableAudio);
            document.removeEventListener('keydown', enableAudio);
            document.removeEventListener('touchstart', enableAudio);
        };
        
        document.addEventListener('click', enableAudio, { once: true });
        document.addEventListener('keydown', enableAudio, { once: true });
        document.addEventListener('touchstart', enableAudio, { once: true });
    }
    
    playBackgroundMusic() {
        if (!this.soundEnabled || !this.autoTakbir || this.backgroundMusic === 'none') return;
        
        try {
            const musicElement = document.getElementById('backgroundMusic');
            if (musicElement) {
                musicElement.pause();
                musicElement.currentTime = 0;
                musicElement.src = this.backgroundMusic;
                musicElement.volume = this.musicVolume;
                musicElement.loop = true;
                musicElement.load();
                
                const playPromise = musicElement.play();
                if (playPromise !== undefined) {
                    playPromise.then(() => {
                        console.log('Background music playing:', this.backgroundMusic);
                    }).catch(error => {
                        console.log('Background music failed:', error);
                        this.playTakbirWithWebAudio();
                    });
                }
            } else {
                this.playTakbirWithWebAudio();
            }
        } catch (error) {
            console.log('Background music error:', error);
            this.playTakbirWithWebAudio();
        }
    }
    
    stopBackgroundMusic() {
        try {
            const musicElement = document.getElementById('backgroundMusic');
            if (musicElement) {
                musicElement.pause();
                musicElement.currentTime = 0;
            }
        } catch (error) {
            console.log('Error stopping background music:', error);
        }
    }
    
    playTakbirSound() {
        if (!this.soundEnabled) return;
        if (this.autoTakbir) {
            this.playBackgroundMusic();
        }
    }
    
    playTakbirWithWebAudio() {
        if (!this.soundEnabled) return;
        
        GAME_CONFIG.AUDIO.TAKBIR_SEQUENCE.forEach((sound, i) => {
            setTimeout(() => {
                this.playNote(sound.note, sound.duration / 1000);
            }, i * 300);
        });
        
        setTimeout(() => {
            GAME_CONFIG.AUDIO.TAKBIR_SEQUENCE.forEach((sound, i) => {
                setTimeout(() => {
                    this.playNote(sound.note * 0.8, sound.duration / 2000, 0.3);
                }, i * 150);
            });
        }, 1500);
    }
    
    playSuccessSound() {
        if (!this.soundEnabled) return;
        
        const chord = [262, 330, 392];
        chord.forEach((note, i) => {
            setTimeout(() => {
                this.playNote(note, 0.5, 0.4);
            }, i * 50);
        });
    }
    
    playComboSound(comboLevel) {
        if (!this.soundEnabled) return;
        
        const baseNote = 262 + (comboLevel * 50);
        this.playNote(baseNote, 0.2, 0.6);
        setTimeout(() => {
            this.playNote(baseNote * 1.5, 0.2, 0.4);
        }, 100);
    }
    
    playNote(frequency, duration, volume = 0.1) {
        if (!this.audioContext || !this.soundEnabled) return;
        
        volume *= this.masterVolume;
        
        try {
            if (this.audioContext.state === 'suspended') {
                this.audioContext.resume();
            }
            
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.frequency.value = frequency;
            oscillator.type = 'triangle';
            
            gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
            
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + duration);
        } catch (e) {
            console.warn('Audio playback failed:', e);
        }
    }
    
    updateSettings(settings) {
        this.masterVolume = settings.masterVolume;
        this.musicVolume = settings.musicVolume;
        this.backgroundMusic = settings.backgroundMusic;
        this.autoTakbir = settings.autoTakbir;
        
        const musicElement = document.getElementById('backgroundMusic');
        if (musicElement) {
            musicElement.volume = this.musicVolume;
        }
    }
    
    toggleSound() {
        this.soundEnabled = !this.soundEnabled;
        
        if (!this.soundEnabled) {
            this.stopBackgroundMusic();
        } else if (this.autoTakbir) {
            this.playBackgroundMusic();
        }
        
        return this.soundEnabled;
    }
} 