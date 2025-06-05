import { GAME_CONFIG } from '../config/GameConfig.js';

export class Goat {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = GAME_CONFIG.GOAT.WIDTH;
        this.height = GAME_CONFIG.GOAT.HEIGHT;
        this.speed = GAME_CONFIG.GOAT.SPEED;
        this.direction = 'left';
        this.animFrame = 0;
        this.animSpeed = 10;
        this.isRunning = false;
        this.isCaught = false;
        this.fearRadius = GAME_CONFIG.GOAT.FEAR_RADIUS;
    }
    
    update(player, canvasWidth, canvasHeight) {
        const dx = player.x - this.x;
        const dy = player.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < this.fearRadius) {
            this.isRunning = true;
            const angle = Math.atan2(dy, dx);
            this.x -= Math.cos(angle) * this.speed * 1.5;
            this.y -= Math.sin(angle) * this.speed * 1.5;
            this.direction = dx > 0 ? 'left' : 'right';
        } else {
            this.isRunning = false;
            if (Math.random() < 0.02) {
                const randomAngle = Math.random() * Math.PI * 2;
                this.x += Math.cos(randomAngle) * this.speed;
                this.y += Math.sin(randomAngle) * this.speed;
            }
        }
        
        this.x = Math.max(0, Math.min(canvasWidth - this.width, this.x));
        this.y = Math.max(0, Math.min(canvasHeight - this.height, this.y));
        
        this.animFrame = (this.animFrame + (this.isRunning ? 0.3 : 0.1)) % 4;
    }
    
    draw(ctx) {
        let x = this.x;
        let y = this.y;
        const frame = Math.floor(this.animFrame);
        const isRunning = this.isRunning;
        
        ctx.fillStyle = 'rgba(0,0,0,0.2)';
        ctx.fillRect(x + 3, y + this.height, this.width - 6, 6);
        
        if (this.direction === 'left') {
            ctx.save();
            ctx.scale(-1, 1);
            ctx.translate(-ctx.canvas.width, 0);
            x = ctx.canvas.width - x - this.width;
        }
        
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(x + 8, y + 15, 20, 15);
        ctx.fillRect(x + 25, y + 10, 12, 10);
        
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(x + 26, y + 8, 2, 4);
        ctx.fillRect(x + 32, y + 8, 2, 4);
        
        ctx.fillStyle = '#000000';
        ctx.fillRect(x + 28, y + 12, 1, 1);
        ctx.fillRect(x + 31, y + 12, 1, 1);
        
        const legMove = isRunning ? Math.sin(frame * 2) * 3 : Math.sin(frame * 0.5) * 1;
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(x + 10, y + 30 + legMove, 3, 8);
        ctx.fillRect(x + 15, y + 30 - legMove, 3, 8);
        ctx.fillRect(x + 20, y + 30 - legMove, 3, 8);
        ctx.fillRect(x + 25, y + 30 + legMove, 3, 8);
        
        ctx.fillRect(x + 6, y + 18, 4, 2);
        ctx.fillRect(x + 30, y + 16, 2, 4);
        
        if (isRunning) {
            ctx.fillStyle = '#FF0000';
            ctx.fillRect(x + 24, y + 5, 2, 2);
            ctx.fillRect(x + 27, y + 7, 1, 1);
        }
        
        if (this.direction === 'left') {
            ctx.restore();
        }
    }
    
    drawSlaughterPosition(ctx, phase) {
        const x = this.x;
        const y = this.y;
        
        ctx.fillStyle = 'rgba(0,0,0,0.2)';
        ctx.fillRect(x + 3, y + this.height, this.width - 6, 6);
        
        if (phase <= 1) {
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(x + 5, y + 20, 25, 12);
            ctx.fillRect(x + 30, y + 15, 10, 8);
            
            ctx.fillStyle = '#8B4513';
            ctx.fillRect(x + 31, y + 13, 2, 3);
            ctx.fillRect(x + 35, y + 13, 2, 3);
            
            ctx.fillStyle = '#000000';
            ctx.fillRect(x + 32, y + 17, 1, 1);
            ctx.fillRect(x + 35, y + 17, 1, 1);
            
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(x + 8, y + 30, 3, 6);
            ctx.fillRect(x + 13, y + 30, 3, 6);
            ctx.fillRect(x + 18, y + 30, 3, 6);
            ctx.fillRect(x + 23, y + 30, 3, 6);
        } else {
            ctx.fillStyle = '#F5F5F5';
            ctx.fillRect(x + 5, y + 25, 25, 10);
            ctx.fillRect(x + 30, y + 20, 10, 6);
            
            ctx.fillStyle = '#8B4513';
            ctx.fillRect(x + 31, y + 18, 2, 3);
            ctx.fillRect(x + 35, y + 18, 2, 3);
            
            ctx.fillStyle = '#000000';
            ctx.fillRect(x + 32, y + 22, 2, 1);
            ctx.fillRect(x + 35, y + 22, 2, 1);
        }
    }
    
    respawn(canvasWidth, canvasHeight) {
        const side = Math.floor(Math.random() * 4);
        switch(side) {
            case 0:
                this.x = Math.random() * (canvasWidth - this.width);
                this.y = 0;
                break;
            case 1:
                this.x = canvasWidth - this.width;
                this.y = Math.random() * (canvasHeight - this.height);
                break;
            case 2:
                this.x = Math.random() * (canvasWidth - this.width);
                this.y = canvasHeight - this.height;
                break;
            case 3:
                this.x = 0;
                this.y = Math.random() * (canvasHeight - this.height);
                break;
        }
    }
    
    checkCollisionWith(player) {
        return player.x < this.x + this.width &&
               player.x + player.width > this.x &&
               player.y < this.y + this.height &&
               player.y + player.height > this.y;
    }
} 