import { Game } from './core/Game.js';

window.addEventListener('load', () => {
    const game = new Game('game', 800, 600);
    game.start();

    // Exponer para debug en consola
    window.game = game;
});