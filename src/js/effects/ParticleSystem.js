export class ParticleSystem {
    constructor() {
        this.particles = [];
        this.stars = [];
        this.powerUps = [];
    }
    
    createParticles(x, y, count = 15) {
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 8,
                vy: (Math.random() - 0.5) * 8,
                life: 1.0,
                color: ['#FFD700', '#FF6B35', '#FFA500'][Math.floor(Math.random() * 3)]
            });
        }
    }
    
    createStars(canvasWidth, canvasHeight) {
        this.stars = [];
        for (let i = 0; i < 50; i++) {
            this.stars.push({
                x: Math.random() * canvasWidth,
                y: Math.random() * canvasHeight * 0.6,
                size: Math.random() * 2 + 1,
                twinkle: Math.random() * Math.PI * 2,
                speed: Math.random() * 0.02 + 0.01
            });
        }
    }
    
    spawnPowerUp(canvasWidth, canvasHeight, frequency) {
        if (Math.random() < frequency) {
            this.powerUps.push({
                x: Math.random() * (canvasWidth - 30),
                y: Math.random() * (canvasHeight - 30),
                type: Math.random() < 0.5 ? 'speed' : 'points',
                age: 0,
                collected: false
            });
        }
    }
    
    updateParticles() {
        this.particles = this.particles.filter(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.vy += 0.2;
            particle.life -= 0.02;
            return particle.life > 0;
        });
    }
    
    updateStars() {
        this.stars.forEach(star => {
            star.twinkle += star.speed;
        });
    }
    
    updatePowerUps(player) {
        this.powerUps = this.powerUps.filter(powerUp => {
            powerUp.age += 16;
            
            if (!powerUp.collected &&
                player.x < powerUp.x + 20 &&
                player.x + player.width > powerUp.x &&
                player.y < powerUp.y + 20 &&
                player.y + player.height > powerUp.y) {
                
                powerUp.collected = true;
                return false;
            }
            
            return powerUp.age < 10000;
        });
        
        return this.powerUps.filter(p => p.collected);
    }
    
    drawParticles(ctx) {
        this.particles.forEach(particle => {
            ctx.fillStyle = particle.color;
            ctx.globalAlpha = particle.life;
            ctx.fillRect(particle.x, particle.y, 3, 3);
        });
        ctx.globalAlpha = 1;
    }
    
    drawStars(ctx, showStars) {
        if (!showStars) return;
        
        this.stars.forEach(star => {
            const alpha = (Math.sin(star.twinkle) + 1) / 2 * 0.8 + 0.2;
            ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
            ctx.fillRect(star.x, star.y, star.size, star.size);
        });
    }
    
    drawPowerUps(ctx) {
        this.powerUps.forEach(powerUp => {
            const bounce = Math.sin(powerUp.age * 0.01) * 3;
            const x = powerUp.x;
            const y = powerUp.y + bounce;
            
            ctx.shadowColor = powerUp.type === 'speed' ? '#00FF00' : '#FFD700';
            ctx.shadowBlur = 10;
            
            if (powerUp.type === 'speed') {
                ctx.fillStyle = '#00FF00';
                ctx.fillRect(x + 8, y + 2, 4, 16);
                ctx.fillRect(x + 4, y + 6, 4, 4);
                ctx.fillRect(x + 12, y + 10, 4, 4);
                ctx.fillRect(x + 2, y + 8, 6, 2);
                ctx.fillRect(x + 12, y + 12, 6, 2);
            } else {
                ctx.fillStyle = '#FFD700';
                const centerX = x + 10;
                const centerY = y + 10;
                for (let i = 0; i < 5; i++) {
                    const angle = (i * Math.PI * 2) / 5 - Math.PI / 2;
                    const outerX = centerX + Math.cos(angle) * 8;
                    const outerY = centerY + Math.sin(angle) * 8;
                    const innerAngle = angle + Math.PI / 5;
                    const innerX = centerX + Math.cos(innerAngle) * 4;
                    const innerY = centerY + Math.sin(innerAngle) * 4;
                    
                    ctx.fillRect(outerX - 1, outerY - 1, 2, 2);
                    ctx.fillRect(innerX - 1, innerY - 1, 2, 2);
                }
            }
            
            ctx.shadowBlur = 0;
        });
    }
    
    update(player) {
        this.updateParticles();
        this.updateStars();
        return this.updatePowerUps(player);
    }
    
    draw(ctx, settings) {
        if (settings.showParticles) {
            this.drawParticles(ctx);
        }
        this.drawStars(ctx, settings.showStars);
        this.drawPowerUps(ctx);
    }
    
    reset() {
        this.particles = [];
        this.powerUps = [];
    }
} 