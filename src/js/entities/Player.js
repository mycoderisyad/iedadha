import { GAME_CONFIG } from '../config/GameConfig.js';

export class Player {
    constructor(x, y, mode = 'hunter') {
        this.x = x;
        this.y = y;
        this.mode = mode; // 'hunter' or 'goat'
        
        if (mode === 'goat') {
            this.width = GAME_CONFIG.GOAT.WIDTH;
            this.height = GAME_CONFIG.GOAT.HEIGHT;
            this.speed = GAME_CONFIG.GOAT.SPEED;
            this.hasKnife = false;
        } else {
            this.width = GAME_CONFIG.PLAYER.WIDTH;
            this.height = GAME_CONFIG.PLAYER.HEIGHT;
            this.speed = GAME_CONFIG.PLAYER.SPEED;
            this.hasKnife = true;
        }
        
        this.direction = 'right';
        this.animFrame = 0;
        this.animSpeed = 8;
    }
    
    update() {
        this.animFrame = (this.animFrame + 0.1) % 4;
    }
    
    draw(ctx) {
        if (this.mode === 'goat') {
            this.drawAsGoat(ctx);
        } else {
            this.drawAsHunter(ctx);
        }
    }
    
    drawAsHunter(ctx) {
        const x = this.x;
        const y = this.y;
        const frame = Math.floor(this.animFrame);
        
        ctx.fillStyle = 'rgba(0,0,0,0.2)';
        ctx.fillRect(x + 5, y + this.height, this.width - 10, 8);
        
        ctx.fillStyle = '#F4A460';
        ctx.fillRect(x + 15, y + 10, 10, 15);
        
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(x + 13, y + 8, 14, 8);
        
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(x + 12, y + 25, 16, 20);
        
        ctx.fillStyle = '#F4A460';
        const armOffset = Math.sin(frame * 0.5) * 2;
        ctx.fillRect(x + 8, y + 25 + armOffset, 6, 15);
        ctx.fillRect(x + 26, y + 25 - armOffset, 6, 15);
        
        if (this.hasKnife) {
            ctx.fillStyle = '#C0C0C0';
            ctx.fillRect(x + 32, y + 20 - armOffset, 12, 3);
            ctx.fillStyle = '#8B4513';
            ctx.fillRect(x + 29, y + 19 - armOffset, 6, 5);
        }
        
        ctx.fillStyle = '#8B4513';
        const legOffset = Math.sin(frame * 0.8) * 1;
        ctx.fillRect(x + 14, y + 45, 5, 12 + legOffset);
        ctx.fillRect(x + 21, y + 45, 5, 12 - legOffset);
        
        ctx.fillStyle = '#654321';
        ctx.fillRect(x + 13, y + 57, 7, 4);
        ctx.fillRect(x + 20, y + 57, 7, 4);
    }
    
    drawAsGoat(ctx) {
        const x = this.x;
        const y = this.y;
        const frame = Math.floor(this.animFrame);
        
        // Shadow
        ctx.fillStyle = 'rgba(0,0,0,0.2)';
        ctx.fillRect(x + 5, y + this.height, this.width - 10, 8);
        
        // Body (elliptical)
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(x + 8, y + 20, 20, 15);
        
        // Head
        ctx.fillStyle = '#F0F0F0';
        ctx.fillRect(x + 5, y + 10, 12, 12);
        
        // Horns
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(x + 7, y + 8, 2, 4);
        ctx.fillRect(x + 13, y + 8, 2, 4);
        
        // Eyes (scared look)
        ctx.fillStyle = '#000000';
        ctx.fillRect(x + 8, y + 14, 2, 2);
        ctx.fillRect(x + 12, y + 14, 2, 2);
        
        // Nose/mouth
        ctx.fillStyle = '#FFB6C1';
        ctx.fillRect(x + 10, y + 18, 2, 1);
        
        // Legs with running animation
        ctx.fillStyle = '#FFFFFF';
        const legOffset = Math.sin(frame * 1.2) * 2;
        ctx.fillRect(x + 10, y + 35, 3, 8 + legOffset);
        ctx.fillRect(x + 15, y + 35, 3, 8 - legOffset);
        ctx.fillRect(x + 20, y + 35, 3, 8 + legOffset);
        ctx.fillRect(x + 25, y + 35, 3, 8 - legOffset);
        
        // Hooves
        ctx.fillStyle = '#654321';
        ctx.fillRect(x + 9, y + 42, 4, 2);
        ctx.fillRect(x + 14, y + 42, 4, 2);
        ctx.fillRect(x + 19, y + 42, 4, 2);
        ctx.fillRect(x + 24, y + 42, 4, 2);
        
        // Tail
        ctx.fillStyle = '#FFFFFF';
        const tailOffset = Math.sin(frame * 0.8) * 3;
        ctx.fillRect(x + 28, y + 25 + tailOffset, 3, 8);
    }
    
    drawSlaughterPosition(ctx, phase, timer) {
        const x = this.x;
        const y = this.y;
        
        ctx.fillStyle = 'rgba(0,0,0,0.2)';
        ctx.fillRect(x + 5, y + this.height, this.width - 10, 8);
        
        ctx.fillStyle = '#F4A460';
        ctx.fillRect(x + 15, y + 10, 10, 15);
        
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(x + 13, y + 8, 14, 8);
        
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(x + 12, y + 25, 16, 20);
        
        ctx.fillStyle = '#F4A460';
        if (phase >= 1) {
            const motionOffset = Math.sin(timer * 0.01) * 3;
            ctx.fillRect(x + 8, y + 20 + motionOffset, 6, 18);
            ctx.fillRect(x + 26, y + 22 + motionOffset, 6, 16);
            
            ctx.fillStyle = '#C0C0C0';
            ctx.fillRect(x + 32, y + 15 + motionOffset, 15, 4);
            ctx.fillStyle = '#8B4513';
            ctx.fillRect(x + 29, y + 14 + motionOffset, 6, 6);
        } else {
            ctx.fillRect(x + 8, y + 25, 6, 15);
            ctx.fillRect(x + 26, y + 25, 6, 15);
            
            ctx.fillStyle = '#C0C0C0';
            ctx.fillRect(x + 32, y + 20, 12, 3);
            ctx.fillStyle = '#8B4513';
            ctx.fillRect(x + 29, y + 19, 6, 5);
        }
        
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(x + 14, y + 45, 5, 10);
        ctx.fillRect(x + 21, y + 45, 5, 10);
    }
} 