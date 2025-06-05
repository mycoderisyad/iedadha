export const GAME_CONFIG = {
    CANVAS: {
        WIDTH: 800,
        HEIGHT: 600
    },
    
    GAME_STATES: {
        MENU: 'menu',
        PLAYING: 'playing',
        PAUSED: 'paused',
        GAME_OVER: 'gameOver'
    },
    
    GAME_MODES: {
        HUNTER: 'hunter',
        ESCAPE: 'escape'
    },
    
    PLAYER: {
        WIDTH: 40,
        HEIGHT: 50,
        SPEED: 3
    },
    
    GOAT: {
        WIDTH: 35,
        HEIGHT: 40,
        SPEED: 2.5,
        FEAR_RADIUS: 80
    },
    
    HUNTER: {
        WIDTH: 40,
        HEIGHT: 50,
        SPEED: 3.5,
        CATCH_RADIUS: 50
    },
    
    GAMEPLAY: {
        DEFAULT_LIVES: 3,
        DEFAULT_TIMER: 60,
        COMBO_TIME_WINDOW: 3000,
        BASE_SCORE: 100,
        COMBO_BONUS: 25,
        TIME_BONUS_MULTIPLIER: 10
    },
    
    AUDIO: {
        TAKBIR_SEQUENCE: [
            { note: 262, duration: 400 },
            { note: 294, duration: 400 },
            { note: 330, duration: 400 },
            { note: 349, duration: 600 },
            { note: 392, duration: 800 }
        ]
    },
    
    THEMES: {
        classic: {
            sky: ['#87CEEB', '#98FB98'],
            ground: '#228B22',
            mosque: '#8B4513'
        },
        sunset: {
            sky: ['#FF6B35', '#FF8E53'],
            ground: '#CD853F',
            mosque: '#A0522D'
        },
        night: {
            sky: ['#191970', '#4B0082'],
            ground: '#2F4F4F',
            mosque: '#1C1C1C'
        },
        desert: {
            sky: ['#F4A460', '#DEB887'],
            ground: '#D2B48C',
            mosque: '#8B4513'
        }
    },
    
    DEFAULT_SETTINGS: {
        gameDuration: 60,
        difficulty: 'normal',
        gameMode: 'hunter',
        masterVolume: 0.5,
        musicVolume: 0.3,
        backgroundMusic: 'assets/audio/takbir.mp3',
        autoTakbir: true,
        showParticles: true,
        showStars: true,
        colorTheme: 'classic',
        powerUpFreq: 0.3,
        playerSpeed: 10
    },
    
    DIFFICULTY_SETTINGS: {
        easy: { speed: 1, fearRadius: 120 },
        normal: { speed: 2, fearRadius: 100 },
        hard: { speed: 3, fearRadius: 80 },
        expert: { speed: 4, fearRadius: 60 }
    }
}; 