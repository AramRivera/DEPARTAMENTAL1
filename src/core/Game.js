import { Input } from './Input.js';
import { GameLoop } from './GameLoop.js';
import { Renderer } from '../render/Renderer.js';
import { Level } from '../world/Level.js';
import { Player, PLAYER_SIZE } from '../entities/Player.js';
import { Enemy } from '../entities/Enemy.js';

export class Game {
    constructor(canvasId, width = 800, height = 600) {
        this.width = width;
        this.height = height;

        this.input = new Input();
        this.renderer = new Renderer(canvasId, width, height);
        this.level = new Level(width, height);

        // Jugador en el centro
        const player = new Player(
            width / 2 - PLAYER_SIZE / 2,
            height / 2 - PLAYER_SIZE / 2,
            this.input
        );
        this.level.setPlayer(player);

        // Un enemigo de ejemplo
        this.level.add(new Enemy(100, 100, 150));

        this.loop = new GameLoop(
            (dt) => this.update(dt),
            ()      => this.render()
        );
    }

    start() { this.loop.start(); }
    stop()  { this.loop.stop(); }

    update(dt) {
        this.level.update(dt);
    }

    render() {
        this.renderer.clear('#1b1b1b');
        this.level.draw(this.renderer);

        // HUD
        const p = this.level.player;
        this.renderer.drawText(
            `WASD para moverte | pos: (${p.position.x.toFixed(0)}, ${p.position.y.toFixed(0)})`,
            10, 20, '#9E9E9E', 14
        );
    }
}