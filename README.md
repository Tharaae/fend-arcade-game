# fend-arcade-game
Google-Udacity Front-end Web Developer Nano Degree - Arcade Game Project
------------------------------------------------------------------------
By _Tharaa Elmorssi_

This project is an implementation of the basic Classic Arcade game functionality. JS ES6 is used.

**The game steps and functionalities are as follows:**

- To start the game, run the index.html file in the browser. You may also use [this link](https://cdn.rawgit.com/Tharaae/fend-arcade-game/c4c099cb/index.html).
- In this game you have a Player and Enemies (Bugs).
- The goal of the player is to reach the water, without colliding into any one of the enemies.
- The player can move left, right, up and down using keyboard arrows.
- The enemies move in varying speeds on the paved block portion of the scene.
- If a the player collides with an enemy, the game is reset and the player moves back to the grass area.
- Once the player reaches the water the game is won.
- On winning, a modal message is displayed congratulating the player and asking if they like to play again or not.
  -- If the player will not play again, the game stops at where they won the game.
  -- If the player chose to play again, the game is reset and restarted.
- Default player character is already set. You can change it anytime (even during the game) from Game Settings Panel.
- Default difficulty level is set to 1 (easiest option). You can change difficulty anytime (even during the game) from Game Settings Panel to 2 (intermediate option) or 3 (hardest level). Game gets harder by increasing the enemies speed and decreasing the gaps between them.
- Player can restart the game any time from the Restart Game button in Settings Panel.
- Player can close the Settings Panel from the top right x button on the Settings Panel.
- Player can open the Setting Panel by clicking on top left Open Settings link.

**Future work to do:**

- Display score, star rating and time to finish the game to the winner.
- Add options to hare scores on social media.
- Limit the game to number of lives of player per game.
- Allows customizing canvas size (number or rows and/or columns).
- Add "collecting gems" option by which player can increase their score.
- Add obstacles that player has to pass around.
