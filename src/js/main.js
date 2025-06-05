import { Game } from './core/Game.js';

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        try {
            const game = new Game();
        } catch (error) {
            console.error('Error creating game:', error);
        }
    }, 100);
});

window.addEventListener('resize', () => {
}); 