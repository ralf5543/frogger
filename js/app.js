//IIFE to make the code private
let app = (function () {

  const tilesHeight = 83;
  const tilesWidth = 100;
  const topEmptyMargin = 45;// the space between the first top tile and the canvas

  const scoreContainer = document.querySelector('.js-score');
  let score = 0;

  const success = () => {
    console.log('youpi');
    score++;
    scoreContainer.textContent = score.toString();
  };

  // Enemies our player must avoid
  class Enemy {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    constructor() {
      // The image/sprite for our enemies, this uses
      // a helper we've provided to easily load images
      this.sprite = 'images/enemy-bug.png';
      //random speed between 100 and 600
      this.speed = (Math.floor(Math.random() * 6) + 1) * 100;
    }

    // Update the enemy's position, required method for game
    // Parameter: dt, a time delta between ticks
    update(dt) {

      // You should multiply any movement by the dt parameter
      // which will ensure the game runs at the same speed for
      // all computers.

      this.x = this.x + (this.speed * dt);
    }

    // Draw the enemy on the screen, required method for game
    render() {
      ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
  }


  // Now write your own player class
  // This class requires an update(), render() and
  // a handleInput() method.
  class Player {

    constructor() {
      this.initialPosition = (tilesHeight * 5) - topEmptyMargin;
      this.x = 200;
      this.y = this.initialPosition;
      this.sprite = 'images/char-boy.png';
    }

    update(dt) {
    }

    render() {
      ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }

    handleInput(e) {

      //Position the Player in the playground limits

      switch (e) {
        case 'up':
          if (this.y >= (this.initialPosition - (4 * tilesHeight))) {
            this.y = this.y - tilesHeight;
          }
          break;
        case 'right':
          if (this.x <= tilesWidth * 3) {
            this.x = this.x + tilesWidth;
          }
          break;
        case 'down':
          if (this.y < this.initialPosition) {
            this.y = this.y + tilesHeight;
          }
          break;
        case 'left':
          if (this.x >= tilesWidth) {
            this.x = this.x - tilesWidth;
          }

          break;
        default:
          console.log('move error');
      }

      if (this.y === this.initialPosition - (4 * tilesHeight)) {
        success();
      }
    }
  }


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

  let allEnemies = [];

  const createEnemiesFunctions = [

    function () {
      const enemyLeft = new Enemy();
      this.x = -tilesWidth;
      enemyLeft.y = ((Math.floor(Math.random() * 3)) * tilesHeight) + topEmptyMargin;
      allEnemies.push(enemyLeft);
    },

    function () {
      const enemyRight = new Enemy();
      this.x = tilesWidth * 4;
      enemyRight.y = -((Math.floor(Math.random() * 3)) * tilesHeight) + topEmptyMargin;
      allEnemies.push(enemyRight);
    }
  ];

  const createEnemies = () => {

    //functionArray[0]();
    /*for (let createEnemiesFunction in createEnemiesFunctions) {
      console.log('createEnemiesFunction : ', createEnemiesFunction);

      createEnemiesFunction();
    }*/


    /*for (let i=0; i < createEnemiesFunctions.length; i++) {
      console.log('createEnemiesFunction : ', createEnemiesFunctions[i]());
    }*/
    const x = 1;
    createEnemiesFunctions[x]();
    console.log(allEnemies);
  };

  window.setInterval(createEnemies, 1000);


  const player = new Player();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
  document.addEventListener('keyup', function (e) {
    var allowedKeys = {
      37: 'left',
      38: 'up',
      39: 'right',
      40: 'down'
    };

    console.log('key : ', e.keyCode)

    player.handleInput(allowedKeys[e.keyCode]);
  });

  //returns the properties we want to be public (i.e. used by engine.js file)
  return {
    allEnemies: allEnemies,
    player: player
  };


})();