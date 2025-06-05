export class BackgroundRenderer {
    constructor() {}
    
    drawSkyGradient(ctx, canvas, theme) {
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, theme.sky[0]);
        gradient.addColorStop(0.3, theme.sky[0]);
        gradient.addColorStop(0.3, theme.sky[1]);
        gradient.addColorStop(1, theme.ground);
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    
    drawClouds(ctx) {
        ctx.fillStyle = '#FFFFFF';
        this.drawCloud(ctx, 100, 50, 60);
        this.drawCloud(ctx, 300, 80, 40);
        this.drawCloud(ctx, 600, 60, 50);
    }
    
    drawCloud(ctx, x, y, size) {
        ctx.globalAlpha = 0.8;
        ctx.fillRect(x, y, size, size * 0.6);
        ctx.fillRect(x + size * 0.3, y - size * 0.2, size * 0.7, size * 0.6);
        ctx.fillRect(x + size * 0.6, y, size * 0.4, size * 0.4);
        ctx.globalAlpha = 1;
    }
    
    drawMosque(ctx, theme) {
        ctx.fillStyle = theme?.mosque || '#8B4513';
        ctx.globalAlpha = 0.3;
        
        ctx.fillRect(650, 200, 120, 150);
        
        ctx.beginPath();
        ctx.arc(710, 200, 30, Math.PI, 0);
        ctx.fill();
        
        ctx.fillRect(760, 150, 20, 200);
        ctx.fillRect(755, 150, 30, 15);
        ctx.globalAlpha = 1;
    }
    
    drawGrassPattern(ctx, canvas, theme) {
        ctx.fillStyle = theme?.ground || '#228B22';
        const grassWidth = canvas.width;
        const grassHeight = canvas.height;
        
        for (let i = 0; i < grassWidth; i += 20) {
            for (let j = grassHeight * 0.7; j < grassHeight; j += 10) {
                if ((i + j) % 40 < 15) {
                    ctx.fillRect(i, j, 3, 8);
                }
            }
        }
    }
    
    drawSlaughterGround(ctx, canvas) {
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(canvas.width/2 - 100, canvas.height/2 + 40, 200, 60);
    }
    
    drawSlaughterEffects(ctx, canvas, phase, timer) {
        if (phase >= 1) {
            for (let i = 0; i < 5; i++) {
                const sparkleX = canvas.width/2 + Math.sin(timer * 0.01 + i) * 50;
                const sparkleY = canvas.height/2 - 20 + Math.cos(timer * 0.015 + i) * 30;
                
                ctx.fillStyle = '#FFD700';
                ctx.fillRect(sparkleX, sparkleY, 2, 2);
            }
        }
    }
    
    drawBackground(ctx, canvas, theme, isSlaughter = false) {
        this.drawSkyGradient(ctx, canvas, theme);
        this.drawClouds(ctx);
        this.drawMosque(ctx, theme);
        this.drawGrassPattern(ctx, canvas, theme);
        
        if (isSlaughter) {
            ctx.fillStyle = 'rgba(0,0,0,0.3)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            this.drawSlaughterGround(ctx, canvas);
        }
    }
} 