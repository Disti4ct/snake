'use strict';

// -------------------------------
// Game filed

class GameField {
  constructor(params) {
    const { size } = params;

    this.size = size;
    this.element = document.querySelector('.game-field');
  }

  fill() {
    for (let i = 1; i <= this.size ** 2; i += 1) {
      const block = document.createElement('div');

      block.classList.add('block');
      this.element.appendChild(block);
    }
  }

  clean() {}
  generateRandomStuff() {}
  generatePoint() {}
}

// -------------------------------
// Snake

class Snake {
  constructor(params) {
    const { life, field, speed } = params;
    // -1 because array's index starts from zero
    const startPosition = Math.ceil(field.size ** 2 / 2) - 1;

    this.speed = speed; // ms
    this.life = life;
    this.field = field;
    this.allBlocks = field.element.children;
    this.startPosition = startPosition;
    this.bodyItems = [startPosition];
    this.movement = 'up';
    this.score = 0;

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

  start() {
    document.addEventListener('keydown', (event) => {
      if (event.key === 'w') this.moveUp();
      if (event.key === 's') this.moveDown();
      if (event.key === 'a') this.moveLeft();
      if (event.key === 'd') this.moveRight();
    });
  }

  losing() {
    this.score = 0;
    this.bodyItems = [this.startPosition];
    this.allBlocks[startPosition].classList.add('snake-head');

    // TODO: remove a listener from the 'start' method after game losing
  }

  moveUp() {
    this.movement = 'up';
    this.updateSnakePosition({
      prevHeadPosition: this.bodyItems[0],
      currentHeadPosition: (this.bodyItems[0] -= this.field.size),
    });
    this.logCoordinates('up');
  }

  moveDown() {
    this.movement = 'down';
    this.updateSnakePosition({
      prevHeadPosition: this.bodyItems[0],
      currentHeadPosition: (this.bodyItems[0] += this.field.size),
    });
    this.logCoordinates('down');
  }

  moveLeft() {
    this.movement = 'left';
    this.updateSnakePosition({
      prevHeadPosition: this.bodyItems[0],
      currentHeadPosition: (this.bodyItems[0] -= 1),
    });
    this.logCoordinates('left');
  }

  moveRight() {
    this.movement = 'right';
    this.updateSnakePosition({
      prevHeadPosition: this.bodyItems[0],
      currentHeadPosition: (this.bodyItems[0] += 1),
    });
    this.logCoordinates('right');
  }

  updateSnakePosition(params) {
    const { prevHeadPosition, currentHeadPosition } = params;

    this.bodyItems[0] = currentHeadPosition;
    this.allBlocks[prevHeadPosition].classList.remove('snake-head');
    this.allBlocks[currentHeadPosition].classList.add('snake-head');
  }

  increaseScore(points) {
    this.score += points;
  }
}

// -------------------------------
// Instances

const gameField = new GameField({
  size: 9,
});

gameField.fill();

const snake = new Snake({
  field: gameField,
  life: 3,
  speed: 1000,
});

snake.start();

// -------------------------------
// Footer

document.querySelector(
  'footer .copyright'
).textContent = `© ${new Date().getFullYear()} Creeping`;
