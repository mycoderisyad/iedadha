import { GAME_CONFIG } from '../config/GameConfig.js';

export class Hunter {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = GAME_CONFIG.HUNTER.WIDTH;
        this.height = GAME_CONFIG.HUNTER.HEIGHT;
        this.speed = GAME_CONFIG.HUNTER.SPEED;
        this.direction = 'right';
        this.animFrame = 0;
        this.catchRadius = GAME_CONFIG.HUNTER.CATCH_RADIUS;
        this.hasKnife = true;
        this.lastDirection = { x: 1, y: 0 };
        this.changeDirectionTimer = 0;
        this.huntingMode = true;
    }
    
    update(target, canvasWidth, canvasHeight) {
        this.animFrame = (this.animFrame + 0.1) % 4;
        const dx = target.x - this.x;
        const dy = target.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 0) {
            let moveX = (dx / distance) * this.speed;
            let moveY = (dy / distance) * this.speed;
            
            if (Math.random() < 0.1) {
                moveX += (Math.random() - 0.5) * this.speed * 0.3;
                moveY += (Math.random() - 0.5) * this.speed * 0.3;
            }
            
            // Update position
            this.x += moveX;
            this.y += moveY;
            
            // Set direction for animation
            if (Math.abs(moveX) > Math.abs(moveY)) {
                this.direction = moveX > 0 ? 'right' : 'left';
            }
        }
        
        // Keep hunter within bounds
        this.x = Math.max(0, Math.min(canvasWidth - this.width, this.x));
        this.y = Math.max(0, Math.min(canvasHeight - this.height, this.y));
    }
    
    checkCollisionWith(target) {
        const centerX = this.x + this.width / 2;
        const centerY = this.y + this.height / 2;
        const targetCenterX = target.x + target.width / 2;
        const targetCenterY = target.y + target.height / 2;
        
        const distance = Math.sqrt(
            Math.pow(centerX - targetCenterX, 2) + 
            Math.pow(centerY - targetCenterY, 2)
        );
        
        return distance < this.catchRadius;
    }
    
    draw(ctx) {
        const x = this.x;
        const y = this.y;
        const frame = Math.floor(this.animFrame);
        
        // Shadow
        ctx.fillStyle = 'rgba(0,0,0,0.2)';
        ctx.fillRect(x + 5, y + this.height, this.width - 10, 8);
        
        // Head
        ctx.fillStyle = '#F4A460';
        ctx.fillRect(x + 15, y + 10, 10, 15);
        
        // Turban/hat
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(x + 13, y + 8, 14, 8);
        
        // Body
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(x + 12, y + 25, 16, 20);
        
        // Arms with animation
        ctx.fillStyle = '#F4A460';
        const armOffset = Math.sin(frame * 0.5) * 2;
        ctx.fillRect(x + 8, y + 25 + armOffset, 6, 15);
        ctx.fillRect(x + 26, y + 25 - armOffset, 6, 15);
        
        // Knife
        if (this.hasKnife) {
            ctx.fillStyle = '#C0C0C0';
            ctx.fillRect(x + 32, y + 20 - armOffset, 12, 3);
            ctx.fillStyle = '#8B4513';
            ctx.fillRect(x + 29, y + 19 - armOffset, 6, 5);
        }
        
        // Legs with walking animation
        ctx.fillStyle = '#8B4513';
        const legOffset = Math.sin(frame * 0.8) * 1;
        ctx.fillRect(x + 14, y + 45, 5, 12 + legOffset);
        ctx.fillRect(x + 21, y + 45, 5, 12 - legOffset);
        
        // Boots
        ctx.fillStyle = '#654321';
        ctx.fillRect(x + 13, y + 57, 7, 4);
        ctx.fillRect(x + 20, y + 57, 7, 4);
        
        // Draw hunting indicator (red eyes)
        ctx.fillStyle = '#FF0000';
        ctx.fillRect(x + 16, y + 12, 2, 2);
        ctx.fillRect(x + 22, y + 12, 2, 2);
    }
    
    respawn(canvasWidth, canvasHeight) {
        // Respawn at a random edge of the screen
        const edge = Math.floor(Math.random() * 4);
        switch (edge) {
            case 0: // Top
                this.x = Math.random() * (canvasWidth - this.width);
                this.y = 0;
                break;
            case 1: // Right
                this.x = canvasWidth - this.width;
                this.y = Math.random() * (canvasHeight - this.height);
                break;
            case 2: // Bottom
                this.x = Math.random() * (canvasWidth - this.width);
                this.y = canvasHeight - this.height;
                break;
            case 3: // Left
                this.x = 0;
                this.y = Math.random() * (canvasHeight - this.height);
                break;
        }
    }
} 