import { GAME_CONFIG } from '../config/GameConfig.js';

export class SettingsManager {
    constructor(game) {

        this.game = game;
        this.settings = { ...GAME_CONFIG.DEFAULT_SETTINGS };
        this.stats = {
            totalGames: 0,
            highScore: 0,
            bestCombo: 0
        };
        
        this.loadSettings();

    }
    
    loadSettings() {
        try {
            const savedSettings = localStorage.getItem('idulAdhaGameSettings');
            if (savedSettings) {
                this.settings = { ...this.settings, ...JSON.parse(savedSettings) };
            }
            
            const savedStats = localStorage.getItem('idulAdhaGameStats');
            if (savedStats) {
                this.stats = { ...this.stats, ...JSON.parse(savedStats) };
            }
        } catch (error) {
            console.error('Error loading settings:', error);
        }
    }
    
    saveSettings() {
        localStorage.setItem('idulAdhaGameSettings', JSON.stringify(this.settings));
        localStorage.setItem('idulAdhaGameStats', JSON.stringify(this.stats));
    }
    
    applySettings() {
        this.applyDifficulty();
        this.applyColorTheme();
        this.updateSettingsUI();
        this.updateGameInstructions(this.settings.gameMode);
        if (this.game.audioManager) {
            this.game.audioManager.updateSettings(this.settings);
        }
    }
    
    updateGameInstructions(gameMode) {
        const instructionsEl = document.getElementById('gameInstructions');
        const objectiveEl = document.getElementById('gameObjective');
        
        if (instructionsEl && objectiveEl) {
            if (gameMode === 'escape') {
                instructionsEl.textContent = 'Anda adalah kambing! Lari dari penyembelih!';
                objectiveEl.textContent = 'Bertahan hidup selama mungkin untuk skor tinggi!';
            } else {
                instructionsEl.textContent = 'Kejar dan tangkap kambing untuk qurban!';
                objectiveEl.textContent = 'Semakin cepat menangkap, semakin tinggi skor dan combo!';
            }
        }
    }
    
    applyDifficulty() {
        const difficulty = GAME_CONFIG.DIFFICULTY_SETTINGS[this.settings.difficulty];
        if (difficulty && this.game.goat) {
            this.game.goat.speed = difficulty.speed;
            this.game.goat.fearRadius = difficulty.fearRadius;
        }
    }
    
    applyColorTheme() {
        if (this.game) {
            this.game.currentTheme = GAME_CONFIG.THEMES[this.settings.colorTheme] || GAME_CONFIG.THEMES.classic;
        }
    }
    
    openSettings() {
        this.updateSettingsUI();
        this.updateStatisticsDisplay();
        document.getElementById('settingsModal').style.display = 'flex';
        this.setupSettingsEventListeners();
    }
    
    updateSettingsUI() {
        try {
            const elements = [
                'gameDuration', 'gameMode', 'difficulty', 'masterVolume', 'volumeDisplay',
                'musicVolume', 'musicVolumeDisplay', 'backgroundMusicSelector',
                'autoTakbir', 'showParticles', 'showStars', 'colorTheme',
                'powerUpFreq', 'playerSpeed'
            ];
            
            // Check if all elements exist before updating
            const missingElements = elements.filter(id => !document.getElementById(id));
            if (missingElements.length > 0) {
                return;
            }
            
            document.getElementById('gameDuration').value = this.settings.gameDuration;
            document.getElementById('gameMode').value = this.settings.gameMode;
            document.getElementById('difficulty').value = this.settings.difficulty;
            document.getElementById('masterVolume').value = Math.round(this.settings.masterVolume * 100);
            document.getElementById('volumeDisplay').textContent = Math.round(this.settings.masterVolume * 100) + '%';
            document.getElementById('musicVolume').value = Math.round(this.settings.musicVolume * 100);
            document.getElementById('musicVolumeDisplay').textContent = Math.round(this.settings.musicVolume * 100) + '%';
            document.getElementById('backgroundMusicSelector').value = this.settings.backgroundMusic;
            document.getElementById('autoTakbir').checked = this.settings.autoTakbir;
            document.getElementById('showParticles').checked = this.settings.showParticles;
            document.getElementById('showStars').checked = this.settings.showStars;
            document.getElementById('colorTheme').value = this.settings.colorTheme;
            document.getElementById('powerUpFreq').value = this.settings.powerUpFreq;
            document.getElementById('playerSpeed').value = this.settings.playerSpeed;
            

        } catch (error) {
            console.log('Error updating settings UI:', error);
        }
    }
    
    updateStatisticsDisplay() {
        document.getElementById('totalGames').textContent = this.stats.totalGames;
        document.getElementById('highScore').textContent = this.stats.highScore;
        document.getElementById('bestCombo').textContent = this.stats.bestCombo;
    }
    
    setupSettingsEventListeners() {
        document.getElementById('closeSettings').onclick = () => {
            document.getElementById('settingsModal').style.display = 'none';
        };
        
        document.getElementById('masterVolume').oninput = (e) => {
            document.getElementById('volumeDisplay').textContent = e.target.value + '%';
        };
        
        document.getElementById('musicVolume').oninput = (e) => {
            const value = e.target.value;
            document.getElementById('musicVolumeDisplay').textContent = value + '%';
            
            const musicElement = document.getElementById('backgroundMusic');
            if (musicElement) {
                musicElement.volume = value / 100;
            }
        };
        
        document.getElementById('backgroundMusicSelector').onchange = (e) => {
            const selectedMusic = e.target.value;
            this.game.audioManager.stopBackgroundMusic();
            if (this.game.audioManager.soundEnabled) {
                setTimeout(() => {
                    this.settings.backgroundMusic = selectedMusic;
                    this.game.audioManager.updateSettings(this.settings);
                    this.game.audioManager.playBackgroundMusic();
                }, 100);
            }
        };
        
        document.getElementById('gameMode').onchange = (e) => {
            this.updateGameInstructions(e.target.value);
        };
        
        document.getElementById('customAudio').onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const url = URL.createObjectURL(file);
                const option = document.createElement('option');
                option.value = url;
                option.textContent = `Custom: ${file.name}`;
                option.selected = true;
                
                const selector = document.getElementById('backgroundMusicSelector');
                selector.appendChild(option);
                
                this.settings.backgroundMusic = url;
                this.game.audioManager.updateSettings(this.settings);
            }
        };
        
        document.getElementById('saveSettings').onclick = () => {
            this.saveSettingsFromUI();
            this.saveSettings();
            this.applySettings();
            document.getElementById('settingsModal').style.display = 'none';
            this.showNotification('✅ Pengaturan disimpan!');
        };
        
        document.getElementById('resetSettings').onclick = () => {
            if (confirm('Reset semua pengaturan ke default?')) {
                this.resetToDefaults();
                this.updateSettingsUI();
                this.showNotification('🔄 Pengaturan direset ke default!');
            }
        };
        
        document.getElementById('resetStats').onclick = () => {
            if (confirm('Hapus semua statistik permainan?')) {
                this.resetStatistics();
                this.updateStatisticsDisplay();
                this.showNotification('🗑️ Statistik dihapus!');
            }
        };
        
        document.getElementById('settingsModal').onclick = (e) => {
            if (e.target.id === 'settingsModal') {
                document.getElementById('settingsModal').style.display = 'none';
            }
        };
    }
    
    saveSettingsFromUI() {
        this.settings.gameDuration = parseInt(document.getElementById('gameDuration').value);
        this.settings.gameMode = document.getElementById('gameMode').value;
        this.settings.difficulty = document.getElementById('difficulty').value;
        this.settings.masterVolume = parseInt(document.getElementById('masterVolume').value) / 100;
        this.settings.musicVolume = parseInt(document.getElementById('musicVolume').value) / 100;
        this.settings.backgroundMusic = document.getElementById('backgroundMusicSelector').value;
        this.settings.autoTakbir = document.getElementById('autoTakbir').checked;
        this.settings.showParticles = document.getElementById('showParticles').checked;
        this.settings.showStars = document.getElementById('showStars').checked;
        this.settings.colorTheme = document.getElementById('colorTheme').value;
        this.settings.powerUpFreq = parseFloat(document.getElementById('powerUpFreq').value);
        this.settings.playerSpeed = parseInt(document.getElementById('playerSpeed').value);
    }
    
    resetToDefaults() {
        this.settings = { ...GAME_CONFIG.DEFAULT_SETTINGS };
    }
    
    resetStatistics() {
        this.stats = {
            totalGames: 0,
            highScore: 0,
            bestCombo: 0
        };
        this.saveSettings();
    }
    
    updateGameStats(score, combo) {
        this.stats.totalGames++;
        this.stats.highScore = Math.max(this.stats.highScore, score);
        this.stats.bestCombo = Math.max(this.stats.bestCombo, combo);
        this.saveSettings();
    }
    
    showNotification(message) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(45deg, #FFD700, #FFA500);
            color: #8B4513;
            padding: 15px 20px;
            border-radius: 10px;
            font-family: 'Press Start 2P', monospace;
            font-size: 12px;
            font-weight: bold;
            z-index: 2000;
            box-shadow: 0 4px 20px rgba(255, 215, 0, 0.5);
            border: 2px solid #8B4513;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 3000);
    }
} 