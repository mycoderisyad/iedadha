export class InputManager {
    constructor(game) {
        this.game = game;
        this.keys = {};
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        this.setupKeyboardControls();
        this.setupButtonControls();
        this.setupMobileControls();
    }
    
    setupKeyboardControls() {
        document.addEventListener('keydown', (e) => {
            this.keys[e.key] = true;
            this.keys[e.code] = true;
            this.keys[e.keyCode] = true;
            
            if (this.game.gameState === 'playing') {
                this.handleMovement(e);
            }
            
            if (e.key === ' ' && this.game.gameState === 'menu') {
                this.game.startGame();
            }
            
            e.preventDefault();
        });
        
        document.addEventListener('keyup', (e) => {
            this.keys[e.key] = false;
            this.keys[e.code] = false;
            this.keys[e.keyCode] = false;
        });
    }
    
    handleMovement(e) {
        const speed = 5;
        
        if (e.key === 'ArrowLeft' || e.key === 'a' || e.keyCode === 37) {
            this.game.player.x -= speed;
        }
        if (e.key === 'ArrowRight' || e.key === 'd' || e.keyCode === 39) {
            this.game.player.x += speed;
        }
        if (e.key === 'ArrowUp' || e.key === 'w' || e.keyCode === 38) {
            this.game.player.y -= speed;
        }
        if (e.key === 'ArrowDown' || e.key === 's' || e.keyCode === 40) {
            this.game.player.y += speed;
        }
        
        this.game.keepPlayerInBounds();
    }
    
    setupButtonControls() {
        document.getElementById('startBtn').addEventListener('click', () => {
            if (this.game.gameState === 'menu' || this.game.gameState === 'gameOver') {
                this.game.startGame();
            }
        });
        
        document.getElementById('soundBtn').addEventListener('click', () => {
            const soundEnabled = this.game.audioManager.toggleSound();
            document.getElementById('soundBtn').textContent = soundEnabled ? '🔊 SUARA' : '🔇 SUARA';
        });
        
        document.getElementById('settingsBtn').addEventListener('click', () => {
            this.game.settingsManager.openSettings();
        });
        

    }
    
    setupMobileControls() {
        document.getElementById('mobileControls').style.display = 'block';
        
        const movePlayer = (direction) => {
            if (this.game.gameState !== 'playing') {
                this.game.startGame();
            }
            
            const speed = this.game.settings.playerSpeed * this.game.speedBoost;
            
            switch(direction) {
                case 'up':
                    this.game.player.y -= speed;
                    break;
                case 'down':
                    this.game.player.y += speed;
                    break;
                case 'left':
                    this.game.player.x -= speed;
                    this.game.player.direction = 'left';
                    break;
                case 'right':
                    this.game.player.x += speed;
                    this.game.player.direction = 'right';
                    break;
            }
            
            this.game.keepPlayerInBounds();
            this.game.draw();
        };
        
        document.getElementById('upBtn').addEventListener('click', () => movePlayer('up'));
        document.getElementById('downBtn').addEventListener('click', () => movePlayer('down'));
        document.getElementById('leftBtn').addEventListener('click', () => movePlayer('left'));
        document.getElementById('rightBtn').addEventListener('click', () => movePlayer('right'));
    }
    
    isKeyPressed(key) {
        return this.keys[key];
    }
    
    clearKeys() {
        this.keys = {};
    }
} 