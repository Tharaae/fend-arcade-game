// Common Game component to be extended by Player and Enemies
class GameComponent {
  constructor(image, gridRow, xPosition) {
    // game component image
    this.sprite = image;
    // game component grid row
    this.row = gridRow;
    // game component x position in canvas
    this.x = xPosition;
    // game component y position in canvas
    this.y = gridRow * 83;
  }

  // draw game component in its position in canvas
  render() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  }
}

// Enemies/Bugs our player must avoid
class Enemy extends GameComponent{
  constructor(level = 1) {
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    const image = 'images/enemy-bug.png';

    // the initial x position of Bug/Enemy (at the left of the canvas)
    const xPosition = -101;

    // Random enemy row number from 1-3, used to caluclate y position
    const row = Math.floor(Math.random() * 3 + 1);

    // construct Game Component for the Enemey
    super(image, row, xPosition);

    // the difficulty level of the enemy 1, 2 or 3
    this.difficulty = level;

    // Random bug/enemy speed from 2, 4 or 6 accordong to difficaulty level
    this.speedX = Math.floor(Math.random() * 3 + (level * 2));
  }

  // Update the enemy's position, required method for game
  // Parameter: dt, a time delta between ticks
  update(dt) {
    // if time elapsed equiavlent to 100 fps
    if (dt >= 0.01) {
      // increase x position according to the speed
      this.x += this.speedX;
    }
  }
}

// Player class
// This class requires an update(), render() and
// a handleInput() method.
class Player extends GameComponent {
  constructor(charImage = 'images/char-boy.png') {
    // initial grid position
    const initCol = 2;
    const initRow = 5;

    // construct Game Component for the Player
    super(charImage, initRow, initCol * 101);

    // the initial column of Player (middle column)
    this.col = initCol;
    // won flag
    this.won = false;
  }

  // set player position
  setXYPosition() {
    // set x and y position according to current grid position
    this.x = this.col * 101;
    this.y = this.row * 83;
  }

  /* Select new player character */
  setCharacter(charImage) {
    this.sprite = charImage;
  }

  /* Update the Player's position, required method for game */
  update() {
    // for eveny enemy
    allEnemies.forEach((enemy) => {
      // check collision with player
      if (this.checkCollision(enemy)) {
        // if collides, reset Player position
        this.col = 2;
        this.row = 4;
        this.setXYPosition();
        return;
      }
    });
  }

  // Check if Player collides with Ememy
  checkCollision(enemy) {
    // if both components on same rows
    if (this.row == enemy.row) {
      // get x edges positions of both components
      const playerLeft = this.x + 20;
      const playerRight = playerLeft + 70;
      const enemyLeft = enemy.x;
      const enemyRight = enemyLeft + 101;

      // check x positions overlap
      if ((playerLeft <= enemyRight && playerLeft >= enemyLeft) || (playerRight <= enemyRight && playerRight >= enemyLeft)) {
        return true; //collides
      }
    }
    return false; //no collision
  }

  /* Handle keyboard input */
  handleInput(pressedKey) {
    if (this.row > 0) {
      switch (pressedKey) {
        case 'left':
          this.col = this.col > 0 ? this.col - 1 : 0;
          break;
        case 'right':
          this.col = this.col < 4 ? this.col + 1 : 4;
          break;
        case 'up':
          this.row = this.row > 0 ? this.row - 1 : 0;
          if (this.row == 0) {
            this.wins();
          }
          break;
        case 'down':
          this.row = this.row < 5 ? this.row + 1 : 5;
      }
    }
    this.setXYPosition();
  }

  /* Congratulate on winning and flag as winning */
  wins() {
    // flag as won
    this.won = true;
    announceWinning();
  }

  /* reset player setting for a new game or restart */
  reset() {
    this.col = 2;
    this.row = 5;
    this.setXYPosition();
    this.won = false;
  }
}

/* Display Winning Greeting */
function announceWinning() {
  // display greeting madal after 1 sec
  setTimeout(function() {
    document.getElementById("win-modal").style.display = "block";
  }, 1000);
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
const allEnemies = [];

// Place the player object in a variable called player
const player = new Player();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
  var allowedKeys = {
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down'
  };

  // move according to pressed key
  player.handleInput(allowedKeys[e.keyCode]);
});
