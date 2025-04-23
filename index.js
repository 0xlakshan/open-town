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
        this.isFloorLoaded = false;
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.player = new Player(50, 50, 40, 40, 'blue', 2);
        // make the canvas fullscreen
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        document.addEventListener('keydown', (e) => this.player.move(e.key, true));
        document.addEventListener('keyup', (e) => this.player.move(e.key, false));
        this.loadFloor();
    }
    start() {
        this.update();
    }
    // load the floor
    loadFloor() {
        this.floorImage = new Image();
        this.floorImage.src = './assets/compressed/floor-128-50.png';
        this.floorImage.onload = () => {
            console.log('image loaded');
            this.isFloorLoaded = true;
        };
        this.floorImage.onerror = () => {
            console.error("Failed to load image: ", this.floorImage.src);
        };
    }
    drawFloor() {
        if (this.isFloorLoaded) {
            const tileSize = 128;
            for (let x = 0; x < this.canvas.width; x += tileSize) {
                for (let y = 0; y < this.canvas.height; y += tileSize) {
                    this.ctx.drawImage(this.floorImage, x, y);
                }
            }
        }
    }
    // game loop
    update() {
        this.clearCanvas();
        this.drawFloor();
        this.player.update();
        this.player.draw(this.ctx);
        console.log(this.player.x, this.player.y, this.player.dx, this.player.dy);
        requestAnimationFrame(() => this.update());
    }
    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}
const game = new Game("canvas");
game.start();
// let windowHeight = 996;
// let windowWidth = 1566;
// let tileSize = 128;
// for (let x = 0; x < windowWidth; x += tileSize) {
//     console.log("x", x);
//     for (let y = 0; y < windowHeight; y += tileSize) {
//         console.log(y);
//     }
// }
