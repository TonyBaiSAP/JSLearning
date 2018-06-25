// 这是我们的玩家要躲避的敌人
const CELL_WIDTH = 101;
const CELL_HEIGHT = 83;

var Enemy = function(x, y, start, speed) {
    // 要应用到每个敌人的实例的变量写在这里
    // 我们已经提供了一个来帮助你实现更多

    // 敌人的图片，用一个我们提供的工具函数来轻松的加载文件
    this.sprite = 'images/enemy-bug.png';
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.start = start;
};

// 此为游戏必须的函数，用来更新敌人的位置
// 参数: dt ，表示时间间隙
Enemy.prototype.update = function(dt) {
    // 你应该给每一次的移动都乘以 dt 参数，以此来保证游戏在所有的电脑上
    // 都是以同样的速度运行的
    this.x += dt * this.speed;
    if (this.x > 500) {
        this.x = -CELL_WIDTH;
    }
};

// 此为游戏必须的函数，用来在屏幕上画出敌人，
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Enemy.prototype.checkCollision = function(player, playerScore) {
    if (this.x < player.x + CELL_WIDTH && this.x + CELL_WIDTH > player.x &&
        this.y < player.y + CELL_HEIGHT && this.y + CELL_HEIGHT > player.y) {
        //if (this.y === player.y + 55 && this.x === player.x + CELL_WIDTH) {
        console.log('collision happened!! enemy.x:' + this.x + ', player.x:' + player.x);
        player.x = 2 * CELL_WIDTH;
        player.y = 5 * CELL_HEIGHT;
        player.count = 0;
    } else {
        console.log('player is safe!! enemy.x:' + this.x + ', player.x:' + player.x);
    }
    playerScore.innerText = "Score: " + player.count;
};

var Speed = function(min, max) {
    this.min = Math.ceil(min);
    this.max = Math.floor(max);
};

Speed.prototype.getSpeed = function() {
    return Math.floor(Math.random() * (this.max - this.min)) + this.min;
};

var Award = function(x, y) {
    this.award = 'images/Heart.png';
    this.x = x;
    this.y = y;
};

Award.prototype.update = function(dt) {
    if (player.win) {
        this.y = this.y <= 415 ? this.y += dt * 170 : 415;
    }
};

Award.prototype.render = function(dt) {
    ctx.drawImage(Resources.get(this.award), this.x, this.y);
};

// 现在实现你自己的玩家类
// 这个类需要一个 update() 函数， render() 函数和一个 handleInput()函数

var Player = function(x, y) {
    this.people = 'images/char-boy.png';
    this.x = x;
    this.y = y;
    this.count = 0;
    this.awards = ["", "images/Heart.png", "images/Star.png", "images/Heart.png", "images/Gem Blue.png", "images/Gem Green.png", "images/Gem Orange.png"];
    this.win = false;
};

Player.prototype.update = function(dt) {
    // 你应该给每一次的移动都乘以 dt 参数，以此来保证游戏在所有的电脑上
    // 都是以同样的速度运行的
    //this.dt *= dt;
    ctx.drawImage(Resources.get(this.people), 1, 5);
};

// 此为游戏必须的函数，用来在屏幕上画出player，
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.people), this.x, this.y);
};

// 此为游戏必须的函数，用来在屏幕上画出player，
Player.prototype.handleInput = function(sKey) {

    switch (sKey) {
        case "left":
            if (this.x > 0) {
                this.x -= CELL_WIDTH;
            }
            break;
        case "up":
            if (this.y > 83) {
                this.y -= CELL_HEIGHT;
            }
            break;
        case "right":
            if (this.x < 404) {
                this.x += CELL_WIDTH;
            }
            break;
        case "down":
            if (this.y < 415) {
                this.y += CELL_HEIGHT;
            }
            break;
    }

    this.count += 1;
    let playerScore = document.getElementById("score");

    allEnemies.map(function(enemy, index) {
        if (enemy.x > 404) {
            var oSpeed = new Speed(10, 100);
            var oEnemy = new Enemy(enemy.x, enemy.y, CELL_HEIGHT * enemy.start + 55, oSpeed.getSpeed());
            allEnemies.splice(index, 1, oEnemy);
        }
        enemy.checkCollision(player, playerScore);
    });

    if (this.y === CELL_HEIGHT) {
        this.win = true; // 修改为游戏获胜
        this.y = 5 * CELL_HEIGHT; // 重置玩家 Y 坐标
        this.x = 3 * CELL_WIDTH;
    }
};

// 现在实例化你的所有对象
// 把所有敌人的对象都放进一个叫 allEnemies 的数组里面
// 把玩家对象放进一个叫 player 的变量里面

var iSpeed = [];

for (var i = 0; i <= 5; i++) {
    var oSpeed = new Speed(10, 100);
    iSpeed.push(oSpeed.getSpeed());
}

var allEnemies = [
    new Enemy(22, 83 * 0 + 55, 0, iSpeed[0]),
    new Enemy(21, 83 * 0 + 55, 0, iSpeed[1]),
    new Enemy(57, 83 * 1 + 55, 1, iSpeed[2]),
    new Enemy(20, 83 * 1 + 55, 1, iSpeed[3]),
    new Enemy(22, 83 * 2 + 55, 2, iSpeed[4]),
    new Enemy(59, 83 * 2 + 55, 2, iSpeed[5])
];
var player = new Player(2 * CELL_WIDTH, 5 * CELL_HEIGHT);

var award = new Award(4 * CELL_WIDTH, 0 * CELL_HEIGHT);

// 这段代码监听游戏玩家的键盘点击事件并且代表将按键的关键数字送到 Player.handleInput()
// 方法里面。你不需要再更改这段代码了。
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    player.handleInput(allowedKeys[e.keyCode]);

});