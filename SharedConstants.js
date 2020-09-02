export const GAMESTATE = {
  PAUSED: 0,
  JOINING: 1,
  FIRSTGAME: 2,
  VICTORY: 3,
};

export const COLOUR = {
  RED: 'RED',
  BLUE: 'BLUE',
  GREEN: 'GREEN',
  YELLOW: 'YELLOW',
  ORANGE: 'ORANGE',
  TEAL: 'TEAL',
  PURPLE: 'PURPLE',
  PINK: 'PINK',
};

export const DIRECTIONS = {
  LEFT: 'LEFT',
  RIGHT: 'RIGHT',
  UP: 'UP',
  DOWN: 'DOWN',
  JUMP: 'JUMP',
};

export const SOUNDS = {
  VICTORY: document.getElementById('victorySound'),
  JUMP: document.getElementById('jumpSound'),
  DEATH: document.getElementById('deathSound'),
  PUSH: document.getElementById('pushSound'),
  BLIP: document.getElementById('blipSound'),
  BLOOP: document.getElementById('bloopSound'),
};
