import { Entity } from './Entity.js';
import { Vector2 } from '../core/Vector2.js';

export class Player extends Entity {
    constructor(x, y, input) {
        super(x, y, 32, 32);
        this.input = input;
        this.color = '#4FC3F7';
        this.speed = 250;           // px/seg
        this.maxSpeed = 250;
        this.acceleration = 1200;   // px/seg² (para suavizar)
        this.friction = 1500;       // desaceleración cuando no hay input
    }

    update(dt, worldBounds) {
        const axis = this.input.getMoveAxis();

        // --- Aplicar aceleración según input ---
        if (axis.x !== 0 || axis.y !== 0) {
            this.velocity.x += axis.x * this.acceleration * dt;
            this.velocity.y += axis.y * this.acceleration * dt;
        } else {
            // fricción: acercar velocity a 0
            const speed = this.velocity.length();
            if (speed > 0) {
                const drop = Math.min(speed, this.friction * dt);
                const dir = this.velocity.normalized();
                this.velocity.x -= dir.x * drop;
                this.velocity.y -= dir.y * drop;
            }
        }

        // --- Limitar a velocidad máxima ---
        const speed = this.velocity.length();
        if (speed > this.maxSpeed) {
            const dir = this.velocity.normalized();
            this.velocity.x = dir.x * this.maxSpeed;
            this.velocity.y = dir.y * this.maxSpeed;
        }

        // --- Integrar movimiento ---
        super.update(dt);

        // --- Clamp dentro del mundo ---
        if (worldBounds) {
            const { width, height } = worldBounds;
            if (this.position.x < 0) this.position.x = 0;
            if (this.position.y < 0) this.position.y = 0;
            if (this.position.x + this.width  > width)  this.position.x = width  - this.width;
            if (this.position.y + this.height > height) this.position.y = height - this.height;
        }
    }

    draw(renderer) {
        // cuerpo
        renderer.drawRect(
            this.position.x, this.position.y,
            this.width, this.height,
            this.color
        );
        // "ojos" para ver la dirección (opcional)
        const cx = this.position.x + this.width / 2;
        const cy = this.position.y + this.height / 2;
        renderer.drawCircle(cx - 6, cy - 4, 3, '#000');
        renderer.drawCircle(cx + 6, cy - 4, 3, '#000');
    }
}