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

    public update() {
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
    private floorImage: any;
    private isFloorLoaded: boolean = false;
    constructor(canvasId: string) {
        this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
        this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
        this.player = new Player(50, 50, 40, 40, 'blue', 2);

        // make the canvas fullscreen
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        document.addEventListener('keydown', (e) => this.player.move(e.key, true));
        document.addEventListener('keyup', (e) => this.player.move(e.key, false));

        this.loadFloor();
    }

    public start() {
        this.update();
    }

    // load the floor
    public loadFloor() {
        this.floorImage = new Image();
        this.floorImage.src = '../public/assets/compressed/floor-128-50.png';
        this.floorImage.onload = () => {
            console.log('image loaded');
            this.isFloorLoaded = true;
        }
        this.floorImage.onerror = () => {
            console.error("Failed to load image: ", this.floorImage.src);
        };
    }

    public drawFloor() {
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
    public update() {
        this.clearCanvas();
        this.drawFloor();
        this.player.update();
        // Clamp player position to canvas borders
        if (this.player.x < 0) {
            this.player.x = 0;
        }
        if (this.player.x + this.player.width > this.canvas.width) {
            this.player.x = this.canvas.width - this.player.width;
        }
        if (this.player.y < 0) {
            this.player.y = 0;
        }
        if (this.player.y + this.player.height > this.canvas.height) {
            this.player.y = this.canvas.height - this.player.height;
        }
        this.player.draw(this.ctx);
        console.log(this.player.x, this.player.y, this.player.dx, this.player.dy);
        requestAnimationFrame(() => this.update());
    }

    public clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

}

const game = new Game("canvas");
game.start();
