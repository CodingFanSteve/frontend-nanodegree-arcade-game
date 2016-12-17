const DIFFICULTY = {
	EASY : {
		num_enemies : 5,
		min_speed : 100,
		max_speed : 300,
		get_speed : function() { return randomRange(this.min_speed, this.max_speed); }
	},
	MEDIUM : {
		num_enemies : 7,
		min_speed : 100,
		max_speed : 500,
		get_speed : function() { return randomRange(this.min_speed, this.max_speed); }
	},
	HARD : {
        num_enemies : 9,
		min_speed : 100,
		max_speed : 700,
		get_speed : function() { return randomRange(this.min_speed, this.max_speed); }
	}
};

var CUR_DIFF = DIFFICULTY.EASY;

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
var Enemy = function() {
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
	this.y = row2Pixel(randomRange(1, NUM_ROWS - 1));
	this.speed = CUR_DIFF.get_speed();
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
	var self = this,
		loss = false;

    allEnemies.forEach(function(enemy) {
    	if (enemy.y == self.y && enemy.x >= self.x - 81 && enemy.x <= self.x + 81) {
    		self.reset();
    		loss = true;
    	}
    });

    if (loss) {
    	scoreboard.lose();
    }
    else if (self.y === 0) {
    	self.reset();
    	scoreboard.win();
    }
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

var Scoreboard = function() {
	this.wins = 0,
	this.losses = 0;

	var tags = document.getElementsByTagName("td");
	this.winsTag = tags[0];
	this.lossesTag = tags[1];
	this.winsTag.innerHTML = this.wins;
	this.lossesTag.innerHTML = this.losses;
};
Scoreboard.prototype.win = function() {
	this.wins++;
	this.winsTag.innerHTML = this.wins;
};
Scoreboard.prototype.lose = function() {
	this.losses--;
	this.lossesTag.innerHTML = this.losses;
};
Scoreboard.prototype.reset = function() {
	this.wins = 0;
	this.losses = 0;
	this.winsTag.innerHTML = this.wins;
	this.lossesTag.innerHTML = this.losses;
};

(function defineRadioHandler() {
	var radioChangeHandler = function() {
		player.reset();	
		scoreboard.reset();
		allEnemies = [];

		CUR_DIFF = DIFFICULTY[this.value];

		for (var i = 0; i < CUR_DIFF.num_enemies; i++) {
			allEnemies.push(new Enemy());
		}

		this.blur();
	};

	var radios = document.getElementById("difficultyList").getElementsByTagName("input");
	for (var idx in radios) {
		if (radios.hasOwnProperty(idx)) {
			radios[idx].onclick = radioChangeHandler;
		}
	}
})();

var allEnemies = [],
    player = new Player(),
    scoreboard = new Scoreboard();
for (var i = 0; i < CUR_DIFF.num_enemies; i++) {
	allEnemies.push(new Enemy());
}

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
