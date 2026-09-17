export class Level {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.entities = [];
        this.player = null;
    }

    add(entity) { this.entities.push(entity); return entity; }

    setPlayer(player) {
        this.player = player;
        this.add(player);
    }

    update(dt) {
        for (const e of this.entities) {
            if (!e.isAlive) continue;
            if (e === this.player) {
                e.update(dt, { width: this.width, height: this.height });
            } else {
                e.update(dt);
            }
        }
        // limpiar muertos
        this.entities = this.entities.filter(e => e.isAlive);
    }

    draw(renderer) {
        for (const e of this.entities) e.draw(renderer);
    }
}