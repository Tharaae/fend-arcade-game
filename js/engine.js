/* Engine.js
 * This file provides the game loop functionality (update entities and render),
 * draws the initial game board on the screen, and then calls the update and
 * render methods on your player and enemy objects (defined in your app.js).
 *
 * A game engine works by drawing the entire game screen over and over, kind of
 * like a flipbook you may have created as a kid. When your player moves across
 * the screen, it may look like just that image/character is moving or being
 * drawn but that is not the case. What's really happening is the entire "scene"
 * is being drawn over and over, presenting the illusion of animation.
 *
 * This engine makes the canvas' context (ctx) object globally available to make
 * writing app.js a little simpler to work with.
 */

var Engine = (function(global) {
  /* Predefine the variables we'll be using within this scope,
   * create the canvas element, grab the 2D context for that canvas
   * set the canvas elements height/width and add it to the DOM.
   */
  var doc = global.document,
    win = global.window,
    canvas = doc.createElement('canvas'),
    ctx = canvas.getContext('2d'),
    lastTime;

  // object to handle game difficulty properties and methods
  const difficulty = {
    level: 1,
    minGap: 100,
    maxGap: 300,
    change: function(newLevel) { // method to change difficaulty level
      this.level = newLevel;
      // Set min and max gap between enemies according to difficulty level
      // - from 100-300 at Level 1
      // - from 80-220 at level 2
      // - from 50-150 at level 3
      switch (newLevel) {
        case 1:
          this.minGap = 100;
          this.maxGap = 300;
          break;
        case 2:
          this.minGap = 80;
          this.maxGap = 220;
          break;
        case 3:
          this.minGap = 50;
          this.maxGap = 150;
      }
    }
  };

  canvas.width = 505;
  canvas.height = 606;
  doc.body.appendChild(canvas);

  /* This function serves as the kickoff point for the game loop itself
   * and handles properly calling the update and render methods.
   */
  function main() {
    /* Get our time delta information which is required if your game
     * requires smooth animation. Because everyone's computer processes
     * instructions at different speeds we need a constant value that
     * would be the same for everyone (regardless of how fast their
     * computer is) - hurray time!
     */
    var now = Date.now(),
      dt = (now - lastTime) / 1000.0;

    // if player did not win yet, continue updating canvas
    if (!player.won) {
      /* Call our update/render functions, pass along the time delta to
       * our update function since it may be used for smooth animation.
       */
      update(dt);
    }

    // if time elapsed equiavlent to 100 fps
    if (dt >= 0.01) {
      render();

      /* Set our lastTime variable which is used to determine the time delta
       * for the next time this function is called.
       */
      lastTime = now;
    }

    /* Use the browser's requestAnimationFrame function to call this
     * function again as soon as the browser is able to draw another frame.
     */
    win.requestAnimationFrame(main);
  }

  /* This function does some initial setup that should only occur once,
   * particularly setting the lastTime variable that is required for the
   * game loop.
   */
  function init() {
    prepareSettingsPanel();
    reset();
    lastTime = Date.now();
    main();
  }

  /* This function is called by main (our game loop) and itself calls all
   * of the functions which may need to update entity's data. Based on how
   * you implement your collision detection (when two entities occupy the
   * same space, for instance when your character should die), you may find
   * the need to add an additional function call here. For now, we've left
   * it commented out - you may or may not want to implement this
   * functionality this way (you could just implement collision detection
   * on the entities themselves within your app.js file).
   */
  function update(dt) {
    // get current number of enemies
    const enemiesCount = allEnemies.length;
    // if no enemies are created yet or the newest enemy is at a random distance according to difficulty level
    if (enemiesCount == 0 || allEnemies[enemiesCount - 1].x > Math.floor(Math.random() * (difficulty.maxGap - difficulty.minGap) + difficulty.minGap)) {
      // Create new enemy at the selected difficulty level
      allEnemies.push(new Enemy(difficulty.level));
    }
    updateEntities(dt);
  }

  /* This is called by the update function and loops through all of the
   * objects within your allEnemies array as defined in app.js and calls
   * their update() methods. It will then call the update function for your
   * player object. These update methods should focus purely on updating
   * the data/properties related to the object. Do your drawing in your
   * render methods.
   */
  function updateEntities(dt) {
    // initiate array to hold indeces of Enemies out of canvas to be deleted
    const enemiesOut = [];

    // iterate on Enemies
    allEnemies.forEach(function(enemy, index) {
      // if out of canvas
      if (enemy.x > canvas.width + 300) {
        // store index to be deleted later
        enemiesOut.push(index);
      } else {
        // update Enemy position
        enemy.update(dt);
      }
    });

    // delete all out-of-canvas enemies
    enemiesOut.forEach((enemyIndex) => allEnemies.splice(enemyIndex, 1));
  }

  /* This function initially draws the "game level", it will then call
   * the renderEntities function. Remember, this function is called every
   * game tick (or loop of the game engine) because that's how games work -
   * they are flipbooks creating the illusion of animation but in reality
   * they are just drawing the entire screen over and over.
   */
  function render() {
    /* This array holds the relative URL to the image used
     * for that particular row of the game level.
     */
    const rowImages = [
        'images/water-block.png', // Top row is water
        'images/stone-block.png', // Row 1 of 3 of stone
        'images/stone-block.png', // Row 2 of 3 of stone
        'images/stone-block.png', // Row 3 of 3 of stone
        'images/grass-block.png', // Row 1 of 2 of grass
        'images/grass-block.png' // Row 2 of 2 of grass
      ];
    const numRows = 6;
    const numCols = 5;

    // Before drawing, clear existing canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    /* Loop through the number of rows and columns we've defined above
     * and, using the rowImages array, draw the correct image for that
     * portion of the "grid"
     */
    for (let row = 0; row < numRows; row++) {
      for (let col = 0; col < numCols; col++) {
        /* The drawImage function of the canvas' context element
         * requires 3 parameters: the image to draw, the x coordinate
         * to start drawing and the y coordinate to start drawing.
         * We're using our Resources helpers to refer to our images
         * so that we get the benefits of caching these images, since
         * we're using them over and over.
         */
        ctx.drawImage(Resources.get(rowImages[row]), col * 101, row * 83 + 15);
      }
    }

    // Draw components
    renderEntities();

    // update Player postion in case of collision or winning
    player.update();
  }

  /* This function is called by the render function and is called on each game
   * tick. Its purpose is to then call the render functions you have defined
   * on your enemy and player entities within app.js
   */
  function renderEntities() {
    /* Loop through all of the objects within the allEnemies array and call
     * the render function you have defined.
     */
    allEnemies.forEach(function(enemy) {
      enemy.render();
    });

    player.render();
  }

  /* This function could have been a good place to
   * handle game reset states - maybe a new game menu or a game over screen
   * those sorts of things. It's only called once by the init() method.
   */
  function reset() {
    // empty enemies array
    allEnemies.splice(0, allEnemies.length);

    // reset player's settings
    player.reset();
  }

  /* Prepare Setting Panel functionalities */
  function prepareSettingsPanel() {
    // When the user clicks on x to close settings sidebar
    document.getElementById("close-settings").onclick = function() {
      document.getElementById("sidebar").style.left = '-320px';
    };

    // When the user clicks on Open Settings to open settings sidebar
    document.getElementById("open-sidebar").onclick = function() {
      document.getElementById("sidebar").style.left = '0';
    };

    // Character Selection funstionality
    document.getElementById('chars-div').querySelectorAll('.char').forEach(function(char) {
      // on clicking on a charater
      char.onclick = (event) => {
        // get previously selected character
        const selectedChar = document.getElementById('chars-div').querySelector('.char.selected');

        // get newly selected character
        const newChar = event.target;

        if (newChar != selectedChar) {
          selectedChar.className = 'char';
          newChar.className = 'char selected';
          const srcFile = newChar.src;
          player.setCharacter(srcFile.slice(srcFile.indexOf('images')));
        }
      };
    });

    // Level Selection functionality
    document.getElementById('levels-div').querySelectorAll('.level').forEach(function(level) {
      // on clicking on a Level
      level.onclick = (event) => {
        // get previously selected level element
        const previousLevelElement = document.getElementById('levels-div').querySelector('.level.selected');
        // get newly selected level
        const newLevel = parseInt(event.target.id, 10);

        // if new level is different than that already assigned
        if (newLevel != difficulty.level) {
          previousLevelElement.className = 'level';
          event.target.className = 'level selected';
          difficulty.change(newLevel);
        }
      };
    });

    // Restart Game button funstionality
    document.getElementById("restart").onclick = function() {
      reset();
    };

    // get winning modal div
    const winModal = document.getElementById("win-modal");

    // When the user clicks on <span> (x), close the modal
    document.getElementById("close").onclick = function() {
      winModal.style.display = "none";
    };

    // When the user clicks anywhere outside of the modal, close the modal
    window.onclick = function(event) {
      if (event.target == winModal) {
        winModal.style.display = "none";
      }
    };

    // When the user clicks on No (don't want to play again), clost the modal
    document.getElementById("no-play").onclick = function() {
      winModal.style.display = "none";
    };

    // When the user clicks on Yes (want to play again), close the modal and restart a new game
    document.getElementById("yes-play").onclick = function() {
      winModal.style.display = "none";
      reset();
    };
  }

  /* Go ahead and load all of the images we know we're going to need to
   * draw our game level. Then set init as the callback method, so that when
   * all of these images are properly loaded our game will start.
   */
  Resources.load([
    'images/stone-block.png',
    'images/water-block.png',
    'images/grass-block.png',
    'images/enemy-bug.png',
    'images/char-boy.png',
    'images/char-cat-girl.png',
    'images/char-horn-girl.png',
    'images/char-pink-girl.png',
    'images/char-princess-girl.png'
  ]);
  Resources.onReady(init);

  /* Assign the canvas' context object to the global variable (the window
   * object when run in a browser) so that developers can use it more easily
   * from within their app.js files.
   */
  global.ctx = ctx;
})(this);
