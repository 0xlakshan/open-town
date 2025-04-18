"use strict";
class Player {
    constructor(x, y, width, height, color, speed) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.speed = speed;
        this.dx = 0;
        this.dy = 0;
    }
    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    update() {
        this.x += this.dx;
        this.y += this.dy;
    }
    move(key, isPressed) {
        switch (key) {
            case "ArrowUp":
                this.dy = isPressed ? -this.speed : 0;
                break;
            case "ArrowDown":
                this.dy = isPressed ? this.speed : 0;
                break;
            case "ArrowLeft":
                this.dx = isPressed ? -this.speed : 0;
                break;
            case "ArrowRight":
                this.dx = isPressed ? this.speed : 0;
                break;
        }
    }
}
class Game {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.player = new Player(50, 50, 40, 40, 'blue', 4);
        document.addEventListener('keydown', (e) => this.player.move(e.key, true));
        document.addEventListener('keyup', (e) => this.player.move(e.key, false));
    }
    start() {
        this.update();
    }
    update() {
        this.clearCanvas();
        this.player.update();
        this.player.draw(this.ctx);
        requestAnimationFrame(() => this.update());
    }
    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}
const game = new Game("canvas");
game.start();
