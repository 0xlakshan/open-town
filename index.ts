class Player {
    x: number;
    y: number;
    width: number;
    height: number;
    color: string;
    speed: number;
    dx: number;
    dy: number;

    constructor(x: number, y: number, width: number, height: number, color: string, speed: number) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.speed = speed;
        this.dx = 0;
        this.dy = 0;
    }

    public draw(ctx: any) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    public update()  {
        this.x += this.dx;
        this.y += this.dy;
    }

    public move(key: any, isPressed: any) {
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
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    public player: any;
    constructor(canvasId: string) {
        this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
        this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
        this.player = new Player(50, 50, 40, 40, 'blue', 4);

        document.addEventListener('keydown', (e) => this.player.move(e.key, true));
        document.addEventListener('keyup', (e) => this.player.move(e.key, false));
    }

    public start() {
        this.update();
    }

    public update() {
        this.clearCanvas();
        this.player.update();
        this.player.draw(this.ctx);
        requestAnimationFrame(() => this.update());
    }

    public clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

}

const game = new Game("canvas");
game.start();