import { Entity } from './Entity.js';
import { Vector2 } from '../core/Vector2.js';

export class Enemy extends Entity {
    constructor(x, y, patrolRange = 120) {
        super(x, y, 28, 28);
        this.color = '#EF5350';
        this.speed = 80;
        this.origin = new Vector2(x, y);
        this.patrolRange = patrolRange;
        this.direction = 1;
    }

    update(dt) {
        this.position.x += this.speed * this.direction * dt;

        if (this.position.x > this.origin.x + this.patrolRange) {
            this.position.x = this.origin.x + this.patrolRange;
            this.direction = -1;
        } else if (this.position.x < this.origin.x) {
            this.position.x = this.origin.x;
            this.direction = 1;
        }
    }
}