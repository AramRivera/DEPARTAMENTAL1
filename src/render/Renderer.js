export class Renderer {
    constructor(canvasId, width = 800, height = 600) {
        this.canvas = document.getElementById(canvasId);
        this.canvas.width = width;
        this.canvas.height = height;
        this.ctx = this.canvas.getContext('2d');
        this.width = width;
        this.height = height;
    }

    clear(color = '#1b1b1b') {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(0, 0, this.width, this.height);
    }

    drawRect(x, y, w, h, color = '#fff') {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x, y, w, h);
    }

    drawCircle(x, y, r, color = '#fff') {
        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        this.ctx.arc(x, y, r, 0, Math.PI * 2);
        this.ctx.fill();
    }

    drawText(text, x, y, color = '#fff', size = 14) {
        this.ctx.fillStyle = color;
        this.ctx.font = `${size}px monospace`;
        this.ctx.fillText(text, x, y);
    }
}