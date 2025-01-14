class Food {
    constructor(canvas, snake) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.snake = snake;
        this.gridSize = snake.gridSize;
        this.spawn();
    }

    spawn() {
        do {
            this.x = Math.floor(Math.random() * (this.canvas.width / this.gridSize)) * this.gridSize;
            this.y = Math.floor(Math.random() * (this.canvas.height / this.gridSize)) * this.gridSize;
        } while (this.isOnSnake());
    }

    isOnSnake() {
        return this.snake.body.some(segment => 
            segment.x === this.x && segment.y === this.y
        );
    }

    draw() {
        this.ctx.fillStyle = '#FF5722';
        this.ctx.fillRect(this.x, this.y, this.gridSize - 2, this.gridSize - 2);
    }
}