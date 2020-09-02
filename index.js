import Game from './Game.js';
let canvas = document.getElementById('gameScreen');
let ctx = canvas.getContext('2d');
const GAME_WIDTH = 1200;
const GAME_HEIGHT = 700;
const GAME_AREA = { startX: 350, startY: 100, endX: 850, endY: 600 };
let lastTime = 0;
var game;

window.onload = function () {
  startFirst();
};

export function restart() {
  game = new Game(GAME_WIDTH, GAME_HEIGHT, ctx, GAME_AREA);
  game.start();
}

function startFirst() {
  game = new Game(GAME_WIDTH, GAME_HEIGHT, ctx, GAME_AREA);
  game.start();
  requestAnimationFrame(gameLoop);
}

function gameLoop(timestamp) {
  let deltaTime = timestamp - lastTime;
  lastTime = timestamp;
  //clear the whole screen
  ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
  //tell game to update
  game.update(deltaTime);
  //tell game to draw
  game.draw(ctx);

  requestAnimationFrame(gameLoop);
}
