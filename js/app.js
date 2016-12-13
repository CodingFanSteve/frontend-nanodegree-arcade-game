const DIM = {
	x : 101,
	y : 171,
	visible: 83
};

const NUM_ROWS = 6;
const NUM_COLS = 5;

function col2Pixel(col) {
	return col * DIM.x;
}

function row2Pixel(row) {
	return row * DIM.visible;
}

function randomRange(min, max) {
	return min + Math.floor(Math.random() * (max - min));
}

var Character = function(sprite) {
    this.sprite = sprite;
    this.reset();
};
Character.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Enemies our player must avoid
var Enemy = function(row, speed) {
    var sprite = 'images/enemy-bug.png';

    Character.call(this, sprite);
};
Enemy.prototype = Object.create(Character.prototype);
Enemy.prototype.constructor = Enemy;
// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x += dt * this.speed;

    if (this.x >= col2Pixel(NUM_COLS)) {
    	this.reset();
    }
};
Enemy.prototype.reset = function() {
	this.x = col2Pixel(-1);
	this.y = row2Pixel(randomRange(0, NUM_ROWS - 1));
	this.speed = randomRange(100, 300);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
    var sprite = 'images/char-boy.png';

    Character.call(this, sprite);
};
Player.prototype = Object.create(Character.prototype);
Player.prototype.constructor = Player;
Player.prototype.reset = function() {
	this.x = col2Pixel(2);
	this.y = row2Pixel(5); 
};
Player.prototype.update = function() {
	var self = this;

    allEnemies.forEach(function(enemy) {
    	if (enemy.y == self.y && enemy.x >= self.x - 81 && enemy.x <= self.x + 81) {
    		self.reset();
    	}
    });
};
Player.prototype.handleInput = function(key) {
    if (key === 'left') {
        this.x = Math.max(0, this.x - DIM.x);
    }
    else if (key === 'right') {
        this.x = Math.min(404, this.x + DIM.x);
    }
    else if (key === 'up') {
        this.y = Math.max(0, this.y - DIM.visible);
    }
    else {
        this.y = Math.min(row2Pixel(5), this.y + DIM.visible);
    }
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
function getEnemies() {
    return [
        new Enemy(1, 20), 
        new Enemy(1, 30), 
        new Enemy(2, 40),
        new Enemy(3, 50),
        new Enemy(5, 60)];
};

function getPlayer() {
    return new Player();
};

var allEnemies = getEnemies(),
    player = getPlayer();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keydown', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
