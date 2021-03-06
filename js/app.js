//IIFE to make the code private
let app = (function () {

  const canvasWrapper = document.querySelector('.frogger__canvasWrapper');
  const characters = document.querySelector('.frogger__charsList__nav');

  const tilesHeight = 83;
  const tilesWidth = 101;
  const topEmptyMargin = 45;// the space between the first row and the top of the canvas element

  const scoreContainer = document.querySelector('.js-score');
  let score = 0;
  const livesContainer = document.querySelector('.js-lives');
  const heart = '<img src="images/Heart.png" class="frogger__life" alt="">';

  let allEnemies = [];
  let allGems = [];
  let lives = 3;

  const resetBtn = document.querySelector('.js-reset');

  resetBtn.addEventListener('click', () => {
    resetGame();
  });

  //display the game elements after a character has been chosen
  const displayGame = () => {
    canvasWrapper.classList.remove('is-hidden');
    characters.classList.add('is-hidden');
  };

  //======================================----------------------------- Mobile controls
  const btnUp = document.querySelector('.js-btnUp');
  const btnRight = document.querySelector('.js-btnRight');
  const btnDown = document.querySelector('.js-btnDown');
  const btnLeft = document.querySelector('.js-btnLeft');

  btnUp.addEventListener('click', () => {
    if (player.y >= (player.initialPosition - (4 * tilesHeight))) {
      player.y = player.y - tilesHeight;

      if (player.y === player.initialPosition - (5 * tilesHeight)) {
        success(true);
      }
    }
  });

  btnRight.addEventListener('click', function () {
    if (player.x <= tilesWidth * 4) {
      player.x = player.x + tilesWidth;
    }
  });

  btnDown.addEventListener('click', function () {
    if (player.y < player.initialPosition) {
      player.y = player.y + tilesHeight;
    }
  });

  btnLeft.addEventListener('click', function () {
    if (player.x >= tilesWidth) {
      player.x = player.x - tilesWidth;
    }
  });

  //functions to randomly place an item on the canvas grid
  const randomHorizontalTile = (num) => {
    const tile = ((Math.floor(Math.random() * num)) * tilesWidth) + (tilesWidth / 2);
    return tile;
  };
  const randomVerticalTile = (num) => {
    const tile = ((Math.floor(Math.random() * num) + 1) * tilesHeight) + (tilesHeight / 2) + topEmptyMargin;
    return tile;
  };

  /* ======================================----------------------------- ENEMIES -----------------------------====================================== */
  // Enemies our player must avoid

  //======================================----------------------------- Class
  class Enemy {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    constructor() {
      // The image/sprite for our enemies, this uses
      // a helper we've provided to easily load images
      this.sprite = 'images/enemy-bug.png';
      //random speed between 100 and 600
      this.speed = (Math.floor(Math.random() * 6) + 1) * 100;
      this.width = 99;
      this.height = 77;
    }

    // Update the enemy's position, required method for game
    // Parameter: dt, a time delta between ticks
    update(dt) {

      // You should multiply any movement by the dt parameter
      // which will ensure the game runs at the same speed for
      // all computers.

      this.x = this.x + (this.speed * dt);

      //collision test (80% because the sprites are a little too big)
      if (player.x < this.x + this.width &&
          player.x + player.width > this.x &&
          player.y < this.y + (80 / 100) * this.height &&
          player.y + (80 / 100) * player.height > this.y) {
        success(false);
      }
    }


    // Draw the enemy on the screen, required method for game
    render() {
      ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
  }

  // Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player


  //======================================----------------------------- Instance
  const createEnemies = () => {

    //we test if an enemy is outside of the screen. If so, we remove it from the array.
    allEnemies.forEach(function (element, index, array) {
      if (element.x <= -(tilesWidth * 2) || element.x >= tilesWidth * 5) {
        array.splice(index, 1);
      }
    });

    //we create one of the 3 random precreated ennemies
    let choseEnemy = Math.floor(Math.random() * 3) + 1;

    switch (choseEnemy) {
      case 1:
        const firstEnemy = new Enemy();
        firstEnemy.x = -tilesWidth;
        firstEnemy.y = tilesHeight + topEmptyMargin;
        allEnemies.push(firstEnemy);
        break;

      case 2:
        const secondEnemy = new Enemy();
        secondEnemy.x = tilesWidth * 5;
        secondEnemy.y = (2 * tilesHeight) + topEmptyMargin;
        secondEnemy.speed = -(Math.floor(Math.random() * 6) + 1) * 100;
        secondEnemy.sprite = 'images/enemy-bug-alt.png';
        allEnemies.push(secondEnemy);
        break;

      case 3:
        const thirdEnemy = new Enemy();
        thirdEnemy.x = -tilesWidth;
        thirdEnemy.y = (3 * tilesHeight) + topEmptyMargin;
        allEnemies.push(thirdEnemy);
        break;
      default:
        console.log('enemy creation error');
    }

  };

  /* ======================================----------------------------- PLAYER -----------------------------====================================== */
  // Now write your own player class
  // This class requires an update(), render() and
  // a handleInput() method.

  //======================================----------------------------- Class
  class Player {

    constructor() {
      this.initialPosition = (tilesHeight * 6) - topEmptyMargin;
      this.x = 218;
      this.y = this.initialPosition;
      this.sprite = 'images/char-boy.png';
      this.width = 67;
      this.height = 88;
      this.isCarryingGem = false;
      this.lives = 3;
    }

    update(dt) {
      //nothing in it actually...
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
          if (this.x <= tilesWidth * 4) {
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

      //if the character has moved till the blue tiles, it's a success
      if (this.y === this.initialPosition - (5 * tilesHeight)) {
        success(true);
      }
    }
  }

  //======================================----------------------------- Instances
  const boy = document.querySelector('.js-charBoy');
  const cat = document.querySelector('.js-cat');
  const princess = document.querySelector('.js-princess');

  const player = new Player();

  //chose a character and launch the game
  boy.addEventListener('click', () => {
    player.sprite = 'images/char-boy.png';
    player.char = 'boy';
    resetGame();
    displayGame();
  });

  cat.addEventListener('click', () => {
    player.sprite = 'images/char-cat-girl.png';
    player.char = 'cat';
    player.lives = 9;
    resetGame();
    displayGame();
  });

  princess.addEventListener('click', () => {
    player.sprite = 'images/char-princess-girl.png';
    player.char = 'princess';
    player.lives = 2;
    resetGame();
    displayGame();
  });


  /* ======================================----------------------------- GEMS -----------------------------====================================== */

  //======================================----------------------------- Class
  class Gem {

    constructor() {
      this.width = 40;
      this.height = 44;
      //sort of css transform translate...
      this.x = (randomHorizontalTile(5)) - (this.width / 2);
      this.y = (randomVerticalTile(3)) - (this.height / 2);
    }

    update(dt) {
      //catch the gem
      if (player.x < this.x + this.width &&
          player.x + player.width > this.x &&
          player.y < this.y + (80 / 100) * this.height &&
          player.y + (80 / 100) * player.height > this.y) {
        player.isCarryingGem = true;
        allGems.splice(0, 1);

        if (player.char === 'princess' && lives < player.lives) {
          lives++;
          livesContainer.innerHTML += heart;
        }
      }
    }

    render() {
      ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
  }

  //======================================----------------------------- Instance
  const createGems = () => {

    if (player.char !== 'cat') {

      //we create one of the 3 random gems
      let choseGem = Math.floor(Math.random() * 3) + 1;

      switch (choseGem) {
        case 1:
          const blueGem = new Gem();
          blueGem.sprite = 'images/Gem-Blue.png';
          allGems.push(blueGem);
          break;

        case 2:
          const greenGem = new Gem();
          greenGem.sprite = 'images/Gem-Green.png';
          allGems.push(greenGem);
          break;

        case 3:
          const orangeGem = new Gem();
          orangeGem.sprite = 'images/Gem-Orange.png';
          allGems.push(orangeGem);
          break;
        default:
          console.log('gem error');
      }
    }
  };


  //we create a new enemy every second
  window.setInterval(createEnemies, 1000);

  const resetStage = () => {
    //replace the player
    player.x = 218;
    player.y = player.initialPosition;
    allGems.splice(0, 1);

    //release the gem
    player.isCarryingGem = false;
    //create new gem at a random place
    createGems();
  };

  //do things either the character has reached the blue tiles, or if he was killed
  const success = (condition) => {
    document.removeEventListener('keyup', handleKeys);
    //if the player succeeded :
    if (condition) {
      score++;
      if (player.isCarryingGem) {
        score = score + 1;
      }
      scoreContainer.textContent = `Score : ${score} point(s) !`;

      setTimeout(function () {
        resetStage();
      }, 1000);

    //if he vas touched by an enemy :
    } else {
      lives -= 1;
      livesContainer.innerHTML = null;
      for (let i = 0; i < lives; i++) {
        livesContainer.innerHTML += heart;
      }
      //if no more lives...
      if (lives === 0) {
        livesContainer.innerHTML = '<p class="frogger__text">You\'re dead...</p>'
      }
      resetStage();
    }
    setTimeout(function () {
      document.addEventListener('keyup', handleKeys);
    }, 1000);
  };

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
    const handleKeys = (e) => {
      const allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
      };

      if (lives > 0) {
        player.handleInput(allowedKeys[e.keyCode]);
      }
    };

    document.addEventListener('keyup', handleKeys);

    const resetGame = () => {
      score = 0;
      lives = player.lives;
      scoreContainer.innerHTML = `Score : ${score} point...`;
      livesContainer.innerHTML = null;
      for (let i = 1; i <= lives; i++) {
        livesContainer.innerHTML += heart;
      }
      resetStage();
    };
    resetGame();

    //returns the properties we want to be public (i.e. used by engine.js file)
    return {
      allEnemies: allEnemies,
      player: player,
      allGems: allGems
    };

  }
)();