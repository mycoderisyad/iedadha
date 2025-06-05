import { GAME_CONFIG } from '../config/GameConfig.js';
import { AudioManager } from '../utils/AudioManager.js';
import { InputManager } from '../utils/InputManager.js';
import { SettingsManager } from '../managers/SettingsManager.js';
import { Player } from '../entities/Player.js';
import { Goat } from '../entities/Goat.js';
import { Hunter } from '../entities/Hunter.js';
import { ParticleSystem } from '../effects/ParticleSystem.js';
import { UIManager } from '../ui/UIManager.js';
import { BackgroundRenderer } from './BackgroundRenderer.js';

export class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        if (!this.canvas) {
            throw new Error('Canvas element with id "gameCanvas" not found');
        }
        
        this.ctx = this.canvas.getContext('2d');
        this.ctx.imageSmoothingEnabled = false;
        
        this.gameState = GAME_CONFIG.GAME_STATES.MENU;
        this.score = 0;
        this.lives = GAME_CONFIG.GAMEPLAY.DEFAULT_LIVES;
        this.timer = GAME_CONFIG.GAMEPLAY.DEFAULT_TIMER;
        this.gameStartTime = 0;
        
        this.combo = 0;
        this.maxCombo = 0;
        this.speedBoost = 1;
        this.lastCatchTime = 0;
        this.lastSurvivalScore = 0;
        
        this.slaughterPhase = 0;
        this.slaughterTimer = 0;
        
        this.currentTheme = GAME_CONFIG.THEMES.classic;
        
        this.initializeComponents();
        this.init();
    }
    
    initializeComponents() {
        this.audioManager = new AudioManager();
        this.settingsManager = new SettingsManager(this);
        this.inputManager = new InputManager(this);
        this.particleSystem = new ParticleSystem();
        this.uiManager = new UIManager();
        this.backgroundRenderer = new BackgroundRenderer();
        
        // Initialize entities based on game mode
        this.currentGameMode = this.settingsManager.settings.gameMode;
        this.initializeEntities();
        
        this.settings = this.settingsManager.settings;
        
        console.log('Applying settings after component initialization...');
        this.settingsManager.applySettings();
        
        this.lastTime = 0;
        this.gameLoopRunning = false;

    }
    
    initializeEntities() {
        this.currentGameMode = this.settingsManager.settings.gameMode;
        
        if (this.currentGameMode === GAME_CONFIG.GAME_MODES.ESCAPE) {
            // Player is goat
            this.player = new Player(400, 300, 'goat');
            this.hunter = new Hunter(100, 100);
            this.goat = null;
        } else {
            // Player is hunter (default mode)
            this.player = new Player(100, 300, 'hunter');
            this.goat = new Goat(600, 300);
            this.hunter = null;
        }
        

    }
    
    init() {
        this.particleSystem.createStars(this.canvas.width, this.canvas.height);
        this.startGameLoop();
        this.draw();
    }
    
    startGame() {
        this.gameState = GAME_CONFIG.GAME_STATES.PLAYING;
        this.score = 0;
        this.lives = GAME_CONFIG.GAMEPLAY.DEFAULT_LIVES;
        this.timer = this.settings.gameDuration;
        this.gameStartTime = Date.now();
        
        this.combo = 0;
        this.maxCombo = 0;
        this.speedBoost = 1;
        this.lastCatchTime = 0;
        this.lastSurvivalScore = 0;
        
        // Reinitialize entities if game mode changed
        if (this.currentGameMode !== this.settings.gameMode) {
            this.initializeEntities();
        }
        
        // Reset positions based on game mode
        if (this.currentGameMode === GAME_CONFIG.GAME_MODES.ESCAPE) {
            // Escape mode: player (goat) in center, hunter starts from edge
            this.player.x = 400;
            this.player.y = 300;
            this.hunter.respawn(this.canvas.width, this.canvas.height);
        } else {
            // Hunter mode: player (hunter) starts left, goat starts right
            this.player.x = 100;
            this.player.y = 300;
            this.goat.x = 600;
            this.goat.y = 300;
            this.goat.isCaught = false;
        }
        
        this.slaughterPhase = 0;
        this.slaughterTimer = 0;
        
        this.inputManager.clearKeys();
        this.particleSystem.reset();
        this.particleSystem.createStars(this.canvas.width, this.canvas.height);
        
        if (this.settings.autoTakbir) {
            this.audioManager.playTakbirSound();
        }
        
        this.lastTime = performance.now();
    }
    
    startGameLoop() {
        if (this.gameLoopRunning) return;
        this.gameLoopRunning = true;
        
        const loop = (currentTime) => {
            if (!this.gameLoopRunning) return;
            
            if (this.gameState === GAME_CONFIG.GAME_STATES.PLAYING) {
                this.update(currentTime);
            } else if (this.gameState === GAME_CONFIG.GAME_STATES.GAME_OVER) {
                this.updateSlaughterScene(currentTime);
            }
            
            this.draw();
            requestAnimationFrame(loop);
        };
        
        requestAnimationFrame(loop);
    }
    
    update(currentTime) {
        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;
        
        const elapsed = (Date.now() - this.gameStartTime) / 1000;
        this.timer = Math.max(0, this.settings.gameDuration - Math.floor(elapsed));
        
        if (this.timer <= 0) {
            this.gameOver();
            return;
        }
        
        this.player.update();
        
        if (this.currentGameMode === GAME_CONFIG.GAME_MODES.ESCAPE) {
            // Escape mode: hunter chases player (goat)
            this.hunter.update(this.player, this.canvas.width, this.canvas.height);
            
            // Add survival score in escape mode
            if (Math.floor(elapsed) % 5 === 0 && elapsed > this.lastSurvivalScore) {
                this.score += 100;
                this.lastSurvivalScore = elapsed;
            }
            
            if (this.hunter.checkCollisionWith(this.player)) {
                this.playerCaught();
            }
        } else {
            // Hunter mode: player chases goat
            this.goat.update(this.player, this.canvas.width, this.canvas.height);
            
            if (this.goat.checkCollisionWith(this.player)) {
                this.catchGoat();
            }
        }
        
        const collectedPowerUps = this.particleSystem.update(this.player);
        this.processPowerUps(collectedPowerUps);
        
        this.uiManager.updateGameUI(this.score, this.combo, this.lives, this.timer, this.speedBoost);
    }
    
    updateSlaughterScene(currentTime) {
        this.slaughterTimer += 16;
        
        if (this.slaughterPhase === 0 && this.slaughterTimer > 2000) {
            this.slaughterPhase = 1;
        }
        
        if (this.slaughterPhase === 1 && this.slaughterTimer > 4000) {
            this.slaughterPhase = 2;
        }
        
        if (this.slaughterPhase === 2 && this.slaughterTimer > 7000) {
            this.slaughterPhase = 3;
        }
        
        if (this.slaughterPhase <= 2) {
            this.player.update();
        }
    }
    
    catchGoat() {
        const currentTime = Date.now();
        if (currentTime - this.lastCatchTime < GAME_CONFIG.GAMEPLAY.COMBO_TIME_WINDOW) {
            this.combo++;
        } else {
            this.combo = 1;
        }
        this.lastCatchTime = currentTime;
        this.maxCombo = Math.max(this.maxCombo, this.combo);
        
        const timeBonus = Math.floor(this.timer * GAME_CONFIG.GAMEPLAY.TIME_BONUS_MULTIPLIER);
        const comboBonus = this.combo * GAME_CONFIG.GAMEPLAY.COMBO_BONUS;
        this.score += GAME_CONFIG.GAMEPLAY.BASE_SCORE + timeBonus + comboBonus;
        
        if (this.settings.showParticles) {
            this.particleSystem.createParticles(
                this.goat.x + this.goat.width/2, 
                this.goat.y + this.goat.height/2
            );
        }
        
        this.uiManager.showCelebration();
        this.goat.respawn(this.canvas.width, this.canvas.height);
        this.particleSystem.spawnPowerUp(this.canvas.width, this.canvas.height, this.settings.powerUpFreq);
        
        if (this.combo > 1) {
            this.audioManager.playComboSound(this.combo);
        } else {
            this.audioManager.playTakbirSound();
        }
    }
    
    playerCaught() {
        this.lives--;
        
        if (this.settings.showParticles) {
            this.particleSystem.createParticles(
                this.player.x + this.player.width/2, 
                this.player.y + this.player.height/2
            );
        }
        
        this.respawnPlayer();
        
        // Hunter gets repositioned to maintain challenge
        this.hunter.respawn(this.canvas.width, this.canvas.height);
        
        this.audioManager.playTakbirSound();
        
        if (this.lives <= 0) {
            this.gameOver();
        } else {
            // Add some score for surviving
            this.score += 50;
        }
    }
    
    respawnPlayer() {
        this.player.x = this.canvas.width / 2;
        this.player.y = this.canvas.height / 2;
    }
    
    processPowerUps(collectedPowerUps) {
        collectedPowerUps.forEach(powerUp => {
            if (powerUp.type === 'speed') {
                this.speedBoost = 1.5;
                setTimeout(() => {
                    this.speedBoost = 1;
                }, 5000);
                this.audioManager.playSuccessSound();
            } else if (powerUp.type === 'points') {
                this.score += 50;
                this.audioManager.playComboSound(1);
            }
            
            if (this.settings.showParticles) {
                this.particleSystem.createParticles(powerUp.x + 10, powerUp.y + 10);
            }
        });
    }
    
    gameOver() {
        this.gameState = GAME_CONFIG.GAME_STATES.GAME_OVER;
        this.settingsManager.updateGameStats(this.score, this.maxCombo);
        this.showSlaughterScene();
    }
    
    showSlaughterScene() {
        if (this.currentGameMode === GAME_CONFIG.GAME_MODES.ESCAPE) {
            // In escape mode, hunter caught the goat (player)
            this.player.x = this.canvas.width / 2 + 20;
            this.player.y = this.canvas.height / 2 + 10;
            this.hunter.x = this.canvas.width / 2 - 60;
            this.hunter.y = this.canvas.height / 2;
        } else {
            // In hunter mode, player caught the goat
            this.player.x = this.canvas.width / 2 - 60;
            this.player.y = this.canvas.height / 2;
            this.goat.x = this.canvas.width / 2 + 20;
            this.goat.y = this.canvas.height / 2 + 10;
            this.goat.isRunning = false;
            this.goat.isCaught = true;
        }
        
        this.slaughterPhase = 0;
        this.slaughterTimer = 0;
        
        this.audioManager.playTakbirSound();
    }
    
    keepPlayerInBounds() {
        this.player.x = Math.max(0, Math.min(this.canvas.width - this.player.width, this.player.x));
        this.player.y = Math.max(0, Math.min(this.canvas.height - this.player.height, this.player.y));
    }
    
    draw() {
        this.backgroundRenderer.drawSkyGradient(this.ctx, this.canvas, this.currentTheme);
        
        if (this.gameState === GAME_CONFIG.GAME_STATES.MENU) {
            this.uiManager.drawMenuScreen(this.ctx, this.canvas);
        } else if (this.gameState === GAME_CONFIG.GAME_STATES.GAME_OVER) {
            this.drawSlaughterScene();
        } else {
            this.drawGameplay();
        }
    }
    
    drawGameplay() {
        this.backgroundRenderer.drawBackground(this.ctx, this.canvas, this.currentTheme);
        this.particleSystem.draw(this.ctx, this.settings);
        this.player.draw(this.ctx);
        
        if (this.currentGameMode === GAME_CONFIG.GAME_MODES.ESCAPE) {
            // Draw hunter in escape mode
            this.hunter.draw(this.ctx);
            this.uiManager.drawGameplayUI(this.ctx, this.hunter);
        } else {
            // Draw goat in hunter mode
            this.goat.draw(this.ctx);
            this.uiManager.drawGameplayUI(this.ctx, this.goat);
        }
    }
    
    drawSlaughterScene() {
        this.backgroundRenderer.drawBackground(this.ctx, this.canvas, this.currentTheme, true);
        this.backgroundRenderer.drawSlaughterEffects(this.ctx, this.canvas, this.slaughterPhase, this.slaughterTimer);
        
        if (this.currentGameMode === GAME_CONFIG.GAME_MODES.ESCAPE) {
            // In escape mode, show hunter slaughtering goat (player)
            this.hunter.drawSlaughterPosition ? this.hunter.drawSlaughterPosition(this.ctx, this.slaughterPhase, this.slaughterTimer) : this.hunter.draw(this.ctx);
            this.player.drawSlaughterPosition ? this.player.drawSlaughterPosition(this.ctx, this.slaughterPhase, this.slaughterTimer) : this.player.draw(this.ctx);
        } else {
            // In hunter mode, show player slaughtering goat
            this.player.drawSlaughterPosition(this.ctx, this.slaughterPhase, this.slaughterTimer);
            this.goat.drawSlaughterPosition(this.ctx, this.slaughterPhase);
        }
        
        if (this.slaughterPhase === 2 && this.settings.showParticles) {
            this.particleSystem.createParticles(this.canvas.width/2, this.canvas.height/2 - 30);
        }
        
        if (this.slaughterPhase === 3) {
            this.uiManager.drawGameOverScreen(this.ctx, this.canvas, this.slaughterTimer, this.score, this.maxCombo);
        } else {
            this.uiManager.drawSlaughterText(this.ctx, this.canvas, this.slaughterPhase, this.slaughterTimer);
            if (this.slaughterPhase === 2) {
                this.ctx.font = 'bold 20px Arial';
                this.uiManager.drawTextWithOutline(this.ctx, `🏆 Skor: ${this.score} poin`, this.canvas.width/2, 165, '#FFD700', '#8B4513', 3);
            }
        }
        
        this.particleSystem.draw(this.ctx, this.settings);
    }
} 