import { Vector2 } from '../core/Vector2.js';

export class Entity {
    constructor(x = 0, y = 0, w = 32, h = 32) {
        this.position = new Vector2(x, y);
        this.velocity = new Vector2(0, 0);
        this.width = w;
        this.height = h;
        this.color = '#fff';
        this.isAlive = true;
    }

    // Centro (útil para colisiones circulares o dibujar)
    get center() {
        return new Vector2(
            this.position.x + this.width / 2,
            this.position.y + this.height / 2
        );
    }

    update(dt) {
        // integración básica de movimiento
        this.position.x += this.velocity.x * dt;
        this.position.y += this.velocity.y * dt;
    }

    draw(renderer) {
        renderer.drawRect(
            this.position.x, this.position.y,
            this.width, this.height,
            this.color
        );
    }
}