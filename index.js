'use strict';

// -------------------------------
// Header

document.querySelector('.header__theme-btn').addEventListener('click', () => {
  document.body.classList.toggle('dark');
});

// -------------------------------
// Game filed

class GameField {
  constructor(params) {
    const { size } = params;

    this.size = size;
    this.areaSize = size ** 2;
    this.element = document.querySelector('.game-field');
    this.allBlocks = undefined;

    this.fill();
  }

  fill() {
    for (let i = 1; i <= this.areaSize; i += 1) {
      const block = document.createElement('div');

      block.classList.add('block');
      this.element.appendChild(block);
    }

    this.allBlocks = this.element.children;
  }

  clean() {}
  generateRandomStuff() {}

  generatePoint() {
    // -1 because array's index starts from zero
    const randomPosition = Math.ceil(Math.random() * this.areaSize) - 1;

    this.allBlocks[randomPosition].classList.add('point');
  }
}

// -------------------------------
// Snake

class Snake {
  constructor(params) {
    const { life, field, speed } = params;
    // -1 because array's index starts from zero
    const startPosition = Math.ceil(field.areaSize / 2) - 1;

    this.speed = speed; // ms
    this.life = life;
    this.field = field;
    this.allBlocks = field.element.children;
    this.startPosition = startPosition;
    this.bodyItems = [startPosition];
    this.movement = 'up';
    this.score = 0;
    this.movingIntervalId = undefined;

    this.allBlocks[startPosition].classList.add('snake-head');
    document.querySelector('.header__score b').textContent = this.score;
  }

  logCoordinates() {
    console.group('%c Coordinates', 'color: brown; font-size: 14px');
    console.log('movement: ', this.movement);
    console.log('head: ', this.bodyItems[0]);
    console.log('body items: ', this.bodyItems);
    console.groupEnd();
  }

  begin() {
    document.addEventListener('keydown', (event) => {
      const key = event.key;
      const prevMovement = this.movement;

      if (key === 'w' || key === 'ц' || key === 'ArrowUp') {
        this.movement = 'up';
        this.moveUp();
      }

      if (key === 's' || key === 'ы' || key === 'ArrowDown') {
        this.movement = 'down';
        this.moveDown();
      }

      if (key === 'a' || key === 'ф' || key === 'ArrowLeft') {
        this.movement = 'left';
        this.moveLeft();
      }

      if (key === 'd' || key === 'в' || key === 'ArrowRight') {
        this.movement = 'right';
        this.moveRight();
      }

      if (key === 'Escape') this.lose();

      this.startSnakeMovement({
        key,
        prevMovement,
      });
    });
  }

  startSnakeMovement(params) {
    const { key, prevMovement } = params;
    if (
      [
        'w',
        's',
        'a',
        'd',
        'ц',
        'ы',
        'ф',
        'в',
        'ArrowUp',
        'ArrowDown',
        'ArrowLeft',
        'ArrowRight',
      ].includes(key)
    ) {
      if (!this.movingIntervalId || this.movement !== prevMovement) {
        clearInterval(this.movingIntervalId);

        this.movingIntervalId = setInterval(() => {
          document.dispatchEvent(new KeyboardEvent('keydown', { key }));
        }, this.speed);
      }
    }
  }

  lose() {
    this.score = 0;
    // at first we have to make a real array to be able to change the blocks
    [...this.allBlocks].map((block) => block.classList.remove('snake'));
    document.querySelector('.snake-head').classList.remove('snake-head');
    // save only one head block
    this.bodyItems = [this.startPosition];
    // move the head on start
    this.allBlocks[this.startPosition].classList.add('snake-head');

    clearInterval(this.movingIntervalId);
  }

  moveUp() {
    this.updateSnakePosition({
      prevHeadPosition: this.bodyItems[0],
      currentHeadPosition: (this.bodyItems[0] -= this.field.size),
    });
    this.logCoordinates('up');
  }

  moveDown() {
    this.updateSnakePosition({
      prevHeadPosition: this.bodyItems[0],
      currentHeadPosition: (this.bodyItems[0] += this.field.size),
    });
    this.logCoordinates('down');
  }

  moveLeft() {
    this.updateSnakePosition({
      prevHeadPosition: this.bodyItems[0],
      currentHeadPosition: (this.bodyItems[0] -= 1),
    });
    this.logCoordinates('left');
  }

  moveRight() {
    this.updateSnakePosition({
      prevHeadPosition: this.bodyItems[0],
      currentHeadPosition: (this.bodyItems[0] += 1),
    });
    this.logCoordinates('right');
  }

  updateSnakePosition(params) {
    const { prevHeadPosition, currentHeadPosition } = params;

    this.allBlocks[prevHeadPosition].classList.remove('snake-head');
    this.allBlocks[currentHeadPosition].classList.add('snake-head');

    if (this.bodyItems.length > 1) {
      // delete the last snake's block
      this.allBlocks[this.bodyItems.length - 1].classList.remove('snake');
      this.allBlocks[prevHeadPosition].classList.add('snake');
    }

    this.bodyItems.unshift(currentHeadPosition);
    this.bodyItems.length -= 1;
  }

  increaseScore(points) {
    this.score += points;
  }
}

// -------------------------------
// Instances

const gameField = new GameField({
  size: 13,
});

const snake = new Snake({
  field: gameField,
  life: 3,
  speed: 500,
});

snake.begin();

// -------------------------------
// Footer

document.querySelector(
  'footer .copyright'
).textContent = `© ${new Date().getFullYear()} Creeping`;
