export class GameLoop {
    constructor(update, render) {
        this.update = update;
        this.render = render;
        this.lastTime = 0;
        this.running = false;
        this._tick = this._tick.bind(this);
    }

    start() {
        if (this.running) return;
        this.running = true;
        this.lastTime = performance.now();
        requestAnimationFrame(this._tick);
    }

    stop() { this.running = false; }

    _tick(now) {
        if (!this.running) return;

        let dt = (now - this.lastTime) / 1000; // segundos
        this.lastTime = now;

        // clamp para evitar saltos enormes al volver de una pestaña en background
        if (dt > 0.05) dt = 0.05;

        this.update(dt);
        this.render();

        requestAnimationFrame(this._tick);
    }
}