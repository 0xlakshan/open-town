class Player {
    x: number;
    y: number;
    width: number;
    height: number;
    color: string;
    speed: number;
    dx: number;
    dy: number;

    leftSprites: HTMLImageElement[];
    rightSprites: HTMLImageElement[];
    isSpritesLoaded: boolean = false;
    loadedImages: number = 0;
    currentFrame: number = 0;
    facing: string = 'right';
    animationTimer: number = Date.now();
    animationInterval: number = 100; // Milliseconds between frames

    constructor(x: number, y: number, width: number, height: number, color: string, speed: number) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.speed = speed;
        this.dx = 0;
        this.dy = 0;

        this.leftSprites = [];
        this.rightSprites = [];

        // load sprites for left and right movement
        for (let i = 1; i <= 4; i++) {
            const leftImg = new Image();
            leftImg.src = `../public/assets/compressed/characters/pink-monster/walking/left/${i}.png`;
            leftImg.onload = () => {
                this.loadedImages++;
                if (this.loadedImages === 6) this.isSpritesLoaded = true;
            };
            this.leftSprites.push(leftImg);

            const rightImg = new Image();
            rightImg.src = `../public/assets/compressed/characters/pink-monster/walking/right/${i}.png`;
            rightImg.onload = () => {
                this.loadedImages++;
                if (this.loadedImages === 6) this.isSpritesLoaded = true;
            };
            this.rightSprites.push(rightImg);
        }
    }

    public draw(ctx: any) {
        if (this.isSpritesLoaded) {
            const sprites = this.facing === 'left' ? this.leftSprites : this.rightSprites;
            const frame = (this.dx !== 0 || this.dy !== 0) ? this.currentFrame : 0;
            ctx.drawImage(sprites[frame], this.x, this.y, this.width, this.height);
        } else {
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }

    public update() {
        this.x += this.dx;
        this.y += this.dy;

        // update facing direction based on horizontal movement
        if (this.dx < 0) {
            this.facing = 'left';
        } else if (this.dx > 0) {
            this.facing = 'right';
        }

        // animate if moving
        if (this.dx !== 0 || this.dy !== 0) {
            const now = Date.now();
            if (now - this.animationTimer > this.animationInterval) {
                this.currentFrame = (this.currentFrame + 1) % 4;
                this.animationTimer = now;
            }
        }
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
        // border collision detection
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
