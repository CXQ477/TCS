class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        // 设置画布大小
        this.canvas.width = 400;
        this.canvas.height = 400;
        
        // 初始化游戏对象
        this.snake = new Snake(this.canvas);
        this.food = new Food(this.canvas, this.snake);
        
        // 游戏状态
        this.score = 0;
        this.highScore = localStorage.getItem('snakeHighScore') || 0;
        this.isRunning = false;
        this.isPaused = false;
        
        // 初始化速度
        this.speed = 150;
        
        // 绑定事件处理
        this.bindEvents();
        
        // 更新高分显示
        this.updateScoreDisplay();
    }

    bindEvents() {
        // 键盘控制
        document.addEventListener('keydown', (e) => {
            if (!this.isRunning) return;
            
            switch(e.key) {
                case 'ArrowUp':
                case 'w':
                case 'W':
                    this.snake.changeDirection('up');
                    break;
                case 'ArrowDown':
                case 's':
                case 'S':
                    this.snake.changeDirection('down');
                    break;
                case 'ArrowLeft':
                case 'a':
                case 'A':
                    this.snake.changeDirection('left');
                    break;
                case 'ArrowRight':
                case 'd':
                case 'D':
                    this.snake.changeDirection('right');
                    break;
                case ' ':
                    this.togglePause();
                    break;
            }
        });

        // 按钮控制
        document.getElementById('startBtn').addEventListener('click', () => this.start());
        document.getElementById('pauseBtn').addEventListener('click', () => this.togglePause());
        document.getElementById('restartBtn').addEventListener('click', () => this.restart());
        
        // 速度控制
        document.getElementById('gameSpeed').addEventListener('change', (e) => {
            switch(e.target.value) {
                case 'slow':
                    this.speed = 200;
                    break;
                case 'normal':
                    this.speed = 150;
                    break;
                case 'fast':
                    this.speed = 100;
                    break;
            }
        });
    }

    start() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.gameLoop();
        }
    }

    togglePause() {
        this.isPaused = !this.isPaused;
        if (!this.isPaused) {
            this.gameLoop();
        }
    }

    restart() {
        this.snake.reset();
        this.food.spawn();
        this.score = 0;
        this.updateScoreDisplay();
        this.isRunning = true;
        this.isPaused = false;
        this.gameLoop();
    }

    gameLoop() {
        if (!this.isRunning || this.isPaused) return;

        this.update();
        this.draw();

        setTimeout(() => this.gameLoop(), this.speed);
    }

    update() {
        this.snake.move();

        // 检查是否吃到食物
        if (this.snake.body[0].x === this.food.x && this.snake.body[0].y === this.food.y) {
            this.snake.eat();
            this.food.spawn();
            this.score += 10;
            this.updateScoreDisplay();
        }

        // 检查碰撞
        if (this.snake.checkCollision()) {
            this.gameOver();
        }
    }

    draw() {
        // 清空画布
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 绘制网格
        this.drawGrid();
        
        // 绘制蛇和食物
        this.snake.draw();
        this.food.draw();
    }

    drawGrid() {
        this.ctx.strokeStyle = '#eee';
        this.ctx.lineWidth = 1;

        for (let x = 0; x < this.canvas.width; x += this.snake.gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.canvas.height);
            this.ctx.stroke();
        }

        for (let y = 0; y < this.canvas.height; y += this.snake.gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvas.width, y);
            this.ctx.stroke();
        }
    }

    gameOver() {
        this.isRunning = false;
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('snakeHighScore', this.highScore);
        }
        this.updateScoreDisplay();
        alert(`游戏结束！\n得分：${this.score}\n最高分：${this.highScore}`);
    }

    updateScoreDisplay() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('highScore').textContent = this.highScore;
    }
}

// 初始化游戏
window.onload = () => {
    const game = new Game();
};