class Snake {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.gridSize = 20;
        this.snake = [{x: 5, y: 5}];
        this.direction = {x: 1, y: 0};
        this.food = this.generateFood();
        this.score = 0;
        this.gameOver = false;
        this.speed = 150;
        
        // 设置画布大小
        this.canvas.width = 400;
        this.canvas.height = 400;
        
        // 初始化虚拟摇杆
        this.initJoystick();
        
        // 开始游戏循环
        this.gameLoop();
    }

    initJoystick() {
        const joystickThumb = document.getElementById('joystick-thumb');
        const joystickBase = document.getElementById('joystick-base');
        let isDragging = false;
        let startX, startY;
        
        const handleStart = (e) => {
            const touch = e.type === 'mousedown' ? e : e.touches[0];
            isDragging = true;
            startX = touch.clientX - joystickThumb.offsetLeft;
            startY = touch.clientY - joystickThumb.offsetTop;
        };
        
        const handleMove = (e) => {
            if (!isDragging) return;
            e.preventDefault();
            
            const touch = e.type === 'mousemove' ? e : e.touches[0];
            const baseRect = joystickBase.getBoundingClientRect();
            const centerX = baseRect.left + baseRect.width / 2;
            const centerY = baseRect.top + baseRect.height / 2;
            
            let deltaX = touch.clientX - centerX;
            let deltaY = touch.clientY - centerY;
            
            // 计算角度和距离
            const angle = Math.atan2(deltaY, deltaX);
            const distance = Math.min(50, Math.sqrt(deltaX * deltaX + deltaY * deltaY));
            
            // 更新摇杆位置
            const thumbX = Math.cos(angle) * distance;
            const thumbY = Math.sin(angle) * distance;
            
            joystickThumb.style.transform = `translate(${thumbX}px, ${thumbY}px)`;
            
            // 更新蛇的方向
            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                this.direction = {x: deltaX > 0 ? 1 : -1, y: 0};
            } else {
                this.direction = {x: 0, y: deltaY > 0 ? 1 : -1};
            }
        };
        
        const handleEnd = () => {
            isDragging = false;
            joystickThumb.style.transform = 'translate(0px, 0px)';
        };
        
        // 添加触摸和鼠标事件监听
        joystickThumb.addEventListener('mousedown', handleStart);
        joystickThumb.addEventListener('touchstart', handleStart);
        document.addEventListener('mousemove', handleMove);
        document.addEventListener('touchmove', handleMove, { passive: false });
        document.addEventListener('mouseup', handleEnd);
        document.addEventListener('touchend', handleEnd);
    }

    generateFood() {
        const x = Math.floor(Math.random() * (this.canvas.width / this.gridSize));
        const y = Math.floor(Math.random() * (this.canvas.height / this.gridSize));
        return {x, y};
    }

    update() {
        if (this.gameOver) return;

        // 移动蛇
        const head = {
            x: this.snake[0].x + this.direction.x,
            y: this.snake[0].y + this.direction.y
        };

        // 检查碰撞
        if (this.checkCollision(head)) {
            this.gameOver = true;
            return;
        }

        this.snake.unshift(head);

        // 检查是否吃到食物
        if (head.x === this.food.x && head.y === this.food.y) {
            this.score += 10;
            document.getElementById('score').textContent = `分数: ${this.score}`;
            this.food = this.generateFood();
            // 加快游戏速度
            this.speed = Math.max(50, this.speed - 5);
        } else {
            this.snake.pop();
        }
    }

    checkCollision(head) {
        // 检查墙壁碰撞
        if (head.x < 0 || head.x >= this.canvas.width / this.gridSize ||
            head.y < 0 || head.y >= this.canvas.height / this.gridSize) {
            return true;
        }

        // 检查自身碰撞
        return this.snake.some(segment => segment.x === head.x && segment.y === head.y);
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // 绘制蛇
        this.ctx.fillStyle = '#4CAF50';
        this.snake.forEach(segment => {
            this.ctx.fillRect(
                segment.x * this.gridSize,
                segment.y * this.gridSize,
                this.gridSize - 1,
                this.gridSize - 1
            );
        });

        // 绘制食物
        this.ctx.fillStyle = '#FF5722';
        this.ctx.fillRect(
            this.food.x * this.gridSize,
            this.food.y * this.gridSize,
            this.gridSize - 1,
            this.gridSize - 1
        );

        // 游戏结束显示
        if (this.gameOver) {
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.fillStyle = '#fff';
            this.ctx.font = '30px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('游戏结束!', this.canvas.width / 2, this.canvas.height / 2);
            this.ctx.font = '20px Arial';
            this.ctx.fillText(
                `最终得分: ${this.score}`,
                this.canvas.width / 2,
                this.canvas.height / 2 + 40
            );
        }
    }

    gameLoop() {
        this.update();
        this.draw();
        setTimeout(() => requestAnimationFrame(() => this.gameLoop()), this.speed);
    }
}

// 初始化游戏
window.onload = () => {
    const canvas = document.getElementById('gameCanvas');
    new Snake(canvas);
}; 