class Snake {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.gridSize = 20;
        this.reset();
    }

    reset() {
        // 蛇的初始位置在画布中间
        this.x = Math.floor(this.canvas.width / 2 / this.gridSize) * this.gridSize;
        this.y = Math.floor(this.canvas.height / 2 / this.gridSize) * this.gridSize;
        
        // 初始长度为3个单位
        this.body = [
            { x: this.x, y: this.y },
            { x: this.x - this.gridSize, y: this.y },
            { x: this.x - this.gridSize * 2, y: this.y }
        ];
        
        // 初始方向向右
        this.dx = this.gridSize;
        this.dy = 0;
        
        // 下一个方向（用于防止快速按键导致的自杀）
        this.nextDx = this.dx;
        this.nextDy = this.dy;
    }

    draw() {
        this.ctx.fillStyle = '#4CAF50';
        this.body.forEach((segment, index) => {
            if (index === 0) {
                // 蛇头绘制为深色
                this.ctx.fillStyle = '#388E3C';
            } else {
                this.ctx.fillStyle = '#4CAF50';
            }
            this.ctx.fillRect(segment.x, segment.y, this.gridSize - 2, this.gridSize - 2);
        });
    }

    move() {
        // 更新方向
        this.dx = this.nextDx;
        this.dy = this.nextDy;

        // 移动蛇头
        const newHead = {
            x: (this.body[0].x + this.dx + this.canvas.width) % this.canvas.width,
            y: (this.body[0].y + this.dy + this.canvas.height) % this.canvas.height
        };

        // 将新头部添加到身体数组的开头
        this.body.unshift(newHead);
        
        // 移除尾部（除非刚吃到食物）
        if (!this.justAte) {
            this.body.pop();
        }
        this.justAte = false;
    }

    changeDirection(direction) {
        // 防止直接反向移动
        switch(direction) {
            case 'up':
                if (this.dy === 0) {
                    this.nextDx = 0;
                    this.nextDy = -this.gridSize;
                }
                break;
            case 'down':
                if (this.dy === 0) {
                    this.nextDx = 0;
                    this.nextDy = this.gridSize;
                }
                break;
            case 'left':
                if (this.dx === 0) {
                    this.nextDx = -this.gridSize;
                    this.nextDy = 0;
                }
                break;
            case 'right':
                if (this.dx === 0) {
                    this.nextDx = this.gridSize;
                    this.nextDy = 0;
                }
                break;
        }
    }

    checkCollision() {
        // 检查是否撞到自己
        for (let i = 1; i < this.body.length; i++) {
            if (this.body[i].x === this.body[0].x && this.body[i].y === this.body[0].y) {
                return true;
            }
        }
        return false;
    }

    eat() {
        this.justAte = true;
    }
}