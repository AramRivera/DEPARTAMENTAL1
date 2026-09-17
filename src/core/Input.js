export class Input {
    constructor() {
        this.keys = new Set();

        window.addEventListener('keydown', (e) => {
            // evita scroll con flechas/espacio
            if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' '].includes(e.key)) {
                e.preventDefault();
            }
            this.keys.add(e.key.toLowerCase());
        });

        window.addEventListener('keyup', (e) => {
            this.keys.delete(e.key.toLowerCase());
        });

        // si la ventana pierde foco, limpia las teclas
        window.addEventListener('blur', () => this.keys.clear());
    }

    isDown(key) { return this.keys.has(key.toLowerCase()); }

    // Vector de movimiento normalizado en base a WASD (y flechas como extra)
    getMoveAxis() {
        let x = 0, y = 0;
        if (this.isDown('a') || this.isDown('arrowleft'))  x -= 1;
        if (this.isDown('d') || this.isDown('arrowright')) x += 1;
        if (this.isDown('w') || this.isDown('arrowup'))    y -= 1;
        if (this.isDown('s') || this.isDown('arrowdown'))  y += 1;

        // normalizar para que la diagonal no sea más rápida
        if (x !== 0 && y !== 0) {
            const inv = 1 / Math.sqrt(2);
            x *= inv; y *= inv;
        }
        return { x, y };
    }
}