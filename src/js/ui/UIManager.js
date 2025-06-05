export class UIManager {
    constructor() {
    }
    
    updateGameUI(score, combo, lives, timer, speedBoost) {
        document.getElementById('score').textContent = score;
        document.getElementById('combo').textContent = combo;
        document.getElementById('lives').textContent = lives;
        document.getElementById('timer').textContent = timer;
        
        const speedBoostEl = document.getElementById('speedBoost');
        if (speedBoost > 1) {
            speedBoostEl.style.display = 'block';
            speedBoostEl.style.animation = 'pulse 0.5s infinite';
        } else {
            speedBoostEl.style.display = 'none';
        }
    }
    

    
    showCelebration() {
        const celebration = document.getElementById('celebration');
        celebration.classList.add('show');
        
        setTimeout(() => {
            celebration.classList.remove('show');
        }, 2000);
    }
    
    drawTextWithOutline(ctx, text, x, y, fillColor, outlineColor = '#000000', outlineWidth = 3) {
        ctx.font = ctx.font.includes('Press Start 2P') ? ctx.font : ctx.font.replace(/\d+px\s+\w+/, match => match.replace(/\w+$/, '"Press Start 2P", monospace'));
        ctx.strokeStyle = outlineColor;
        ctx.lineWidth = outlineWidth;
        ctx.strokeText(text, x, y);
        ctx.fillStyle = fillColor;
        ctx.fillText(text, x, y);
    }
    
    drawMenuScreen(ctx, canvas) {
        ctx.fillStyle = '#87CEEB';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.textAlign = 'center';
        ctx.font = '24px "Press Start 2P", monospace';
        this.drawTextWithOutline(ctx, '🐐 SELAMAT IDUL ADHA 🗡️', canvas.width/2, canvas.height/2 - 50, '#FFD700', '#8B4513', 3);
        
        ctx.font = '16px "Press Start 2P", monospace';
        this.drawTextWithOutline(ctx, 'Tekan SPASI atau klik MULAI GAME', canvas.width/2, canvas.height/2, '#FFFFFF', '#000000', 2);
        
        ctx.font = '12px "Press Start 2P", monospace';
        this.drawTextWithOutline(ctx, 'Gunakan arrow keys untuk bergerak', canvas.width/2, canvas.height/2 + 50, '#F4A460', '#000000', 1);
    }
    
    drawSlaughterText(ctx, canvas, phase, timer) {
        ctx.textAlign = 'center';
        
        if (phase === 0) {
            ctx.font = 'bold 28px "Press Start 2P", monospace';
            this.drawTextWithOutline(ctx, '⏰ WAKTU HABIS!', canvas.width/2, 80, '#FF0000', '#FFFFFF', 4);
            
            ctx.font = 'bold 18px "Press Start 2P", monospace';
            this.drawTextWithOutline(ctx, 'Persiapan Penyembelihan Qurban...', canvas.width/2, 110, '#FFD700', '#8B4513', 3);
            
            const countdown = Math.ceil((2000 - timer) / 1000);
            if (countdown > 0) {
                ctx.font = 'bold 24px "Press Start 2P", monospace';
                this.drawTextWithOutline(ctx, `${countdown}...`, canvas.width/2, 140, '#FFFFFF', '#FF0000', 3);
            }
            
        } else if (phase === 1) {
            ctx.font = 'bold 24px "Press Start 2P", monospace';
            this.drawTextWithOutline(ctx, 'BISMILLAHI ALLAHU AKBAR', canvas.width/2, 80, '#FFFFFF', '#8B4513', 4);
            
            ctx.font = 'bold 16px "Press Start 2P", monospace';
            this.drawTextWithOutline(ctx, 'Melaksanakan Ibadah Qurban...', canvas.width/2, 110, '#FFD700', '#000000', 3);
    
            const pulse = Math.sin(timer * 0.02) * 0.5 + 0.5;
            ctx.globalAlpha = 0.7 + pulse * 0.3;
            ctx.font = 'bold 20px "Press Start 2P", monospace';
            this.drawTextWithOutline(ctx, 'اللهُ أَكْبَر', canvas.width/2, 140, '#00FF00', '#000000', 3);
            ctx.globalAlpha = 1;
            
        } else if (phase === 2) {
            ctx.font = 'bold 26px "Press Start 2P", monospace';
            this.drawTextWithOutline(ctx, 'QURBAN SELESAI', canvas.width/2, 80, '#00FF00', '#FFFFFF', 4);
            
            ctx.font = 'bold 18px "Press Start 2P", monospace';
            this.drawTextWithOutline(ctx, 'الحمد لله رب العالمين', canvas.width/2, 110, '#FFD700', '#8B4513', 3);
            
            ctx.font = 'bold 16px "Press Start 2P", monospace';
            this.drawTextWithOutline(ctx, 'Alhamdulillahi Rabbil Alamiin', canvas.width/2, 135, '#FFFFFF', '#000000', 2);
        }
    }
    
    drawGameOverScreen(ctx, canvas, timer, score, maxCombo) {
        ctx.fillStyle = 'rgba(0,0,0,0.8)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        const titleY = canvas.height/2 - 80 + Math.sin(timer * 0.005) * 5;
        ctx.font = 'bold 32px "Press Start 2P", monospace';
        this.drawTextWithOutline(ctx, '🎉 SELAMAT IDUL ADHA! 🎉', canvas.width/2, titleY, '#FFD700', '#8B4513', 4);
        
        ctx.font = 'bold 20px "Press Start 2P", monospace';
        this.drawTextWithOutline(ctx, `🏆 Skor Akhir: ${score} poin`, canvas.width/2, canvas.height/2 - 50, '#FFFFFF', '#000000', 3);
        
        ctx.font = 'bold 16px "Press Start 2P", monospace';
        this.drawTextWithOutline(ctx, `🔥 Max Combo: ${maxCombo}x`, canvas.width/2, canvas.height/2 - 20, '#FF6B35', '#000000', 2);
        
        ctx.font = 'bold 16px "Press Start 2P", monospace';
        this.drawTextWithOutline(ctx, 'Klik MULAI GAME untuk bermain lagi', canvas.width/2, canvas.height/2 + 10, '#00FF00', '#000000', 2);
        
        ctx.font = 'bold 14px "Press Start 2P", monospace';
        this.drawTextWithOutline(ctx, 'تقبل الله منا ومنكم', canvas.width/2, canvas.height/2 + 40, '#FFD700', '#8B4513', 2);
        
        ctx.font = '12px "Press Start 2P", monospace';
        this.drawTextWithOutline(ctx, 'Taqabbalallahu minna wa minkum', canvas.width/2, canvas.height/2 + 60, '#FFFFFF', '#000000', 1);
    }
    
    drawGameplayUI(ctx, goat) {
        ctx.strokeStyle = 'rgba(255,0,0,0.2)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(goat.x + goat.width/2, goat.y + goat.height/2, goat.fearRadius, 0, Math.PI * 2);
        ctx.stroke();
    }
}