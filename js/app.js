var Person = function(x, y, speed, sprite) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.sprite = sprite;
};
Person.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Enemies our player must avoid
var Enemy = function(row, speed) {
    var x = 0,
        y = row * 83,
        sprite = 'images/enemy-bug.png';

    Person.call(this, x, y, speed, sprite);
};
Enemy.prototype = Object.create(Person.prototype);
Enemy.prototype.constructor = Enemy;
// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x += dt * this.speed;
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
    var x = 202,
        y = 5 * 83,
        speed = 1,
        sprite = 'images/char-boy.png';

    Person.call(this, x, y, speed, sprite);
};
Player.prototype = Object.create(Person.prototype);
Player.prototype.constructor = Player;
/*
Player.prototype.update = function() {
    this.y -= 1;
};
*/
Player.prototype.handleInput = function(key) {
    if (key === 'left') {
        this.x = Math.max(0, this.x - 101);
    }
    else if (key === 'right') {
        this.x = Math.min(404, this.x + 101);
    }
    else if (key === 'up') {
        this.y = Math.max(0, this.y - 101);
    }
    else {
        this.y = Math.min(5 * 83, this.y + 101);
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
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
