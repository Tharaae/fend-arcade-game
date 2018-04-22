// Enemies/Bugs our player must avoid
class Enemy {
  constructor() {
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';

    // the initial x position of Bug/Enemy
    this.x = -101;

    // Random stone row number from 1-3, used to caluclate y position
    this.row = Math.floor(Math.random() * 3 + 1);

    // Random bug/enemy speed from 1-3
    this.speedX = Math.floor(Math.random() * 3 + 1);
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

  // Draw the enemy on the screen, required method for game
  render() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.row * 83);
  }
}

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
class Player {
  constructor() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    // The image/sprite for our player, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/char-boy.png';
    // the initial column of Player (middle column)
    this.col = 2;
    // the initial row of Player (bottom grass row)
    this.row = 5;
    // won flag
    this.won = false;
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
        return;
      }
    });
  }

  // Draw the enemy on the screen, required method for game
  render() {
    ctx.drawImage(Resources.get(this.sprite), this.col * 101, this.row * 83);
  }

  // Check if Player collides with Ememy
  checkCollision(enemy) {
    // if both components on same rows
    if (this.row == enemy.row) {
      // get x edges positions of both components
      const playerLeft = this.col * 101 + 20;
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
    switch (pressedKey) {
      case 'left':
        this.col = this.col > 0 ? this.col - 1 : 0;
        break;
      case 'right':
        this.col = this.col < 4 ? this.col + 1 : 4;
        break;
      case 'up':
        this.row = this.row > 0 ? this.row - 1 : 0;
        if(this.row == 0) {
          this.wins();
        }
        break;
      case 'down':
        this.row = this.row < 5 ? this.row + 1 : 5;
    }
  }

  /* Congratulate on winning and flag as winning */
  wins() {
    // flag as won
    this.won = true;
  }

  /* reset player setting for a new game or restart */
  reset() {
      this.col = 2;
      this.row = 5;
      this.won = false;
  }
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

  // if player won, reset game
  if(player.won) {

    let winModal = document.getElementById("win-modal");

    // When the user clicks on <span> (x), close the modal
    document.getElementById("close").onclick = function() {
      winModal.style.display = "none";
    }

    // When the user clicks anywhere outside of the modal, close the modal
    window.onclick = function(event) {
      if (event.target == winModal) {
        winModal.style.display = "none";
      }
    }

    // When the user clicks on No (don't want to play again), clost the modal
    document.getElementById("no-play").onclick = function() {
      winModal.style.display = "none";
    }

    // When the user clicks on Yes (want to play again), close the modal and restart a new game
    document.getElementById("yes-play").onclick = function() {
      winModal.style.display = "none";

      // empty enemies array
      for(let i=0; i < allEnemies.length; i++) {
         allEnemies.pop();
      }
      // reset player's settings
      player.reset();
    }

    // display greeting madal after 1 sec
    setTimeout(function() {
      winModal.style.display = "block";
    }, 1000);
  }
});
