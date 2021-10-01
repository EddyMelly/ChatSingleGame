export const GAMESTATE = {
  PAUSED: 0,
  JOINING: 1,
  FIRSTGAME: 2,
  VICTORY: 3,
};

export const truncateString = (str) => {
  return str.length > 15 ? str.substr(0, 15) + '...' : str;
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

export const retrievePlayerInformation = (game, width, height, colour) => {
  const playerInfo = {
    [COLOUR.RED]: {
      position: {
        x: game.gameArea.startX + 100,
        y: game.gameArea.startY + 200,
      },
      animationStrip: document.getElementById('redAnimationStrip'),
      jumpSound: document.getElementById('redJumpSound'),
    },
    [COLOUR.BLUE]: {
      position: {
        x: game.gameArea.endX - 250,
        y: game.gameArea.startY + 100,
      },
      animationStrip: document.getElementById('blueAnimationStrip'),
      jumpSound: document.getElementById('blueJumpSound'),
    },
    [COLOUR.GREEN]: {
      position: {
        x: game.gameArea.startX + 200,
        y: game.gameArea.endY - 150,
      },
      animationStrip: document.getElementById('greenAnimationStrip'),
      jumpSound: document.getElementById('greenJumpSound'),
    },
    [COLOUR.YELLOW]: {
      position: {
        x: game.gameArea.endX - 150,
        y: game.gameArea.endY - 250,
      },
      animationStrip: document.getElementById('yellowAnimationStrip'),
      jumpSound: document.getElementById('yellowJumpSound'),
    },
    [COLOUR.ORANGE]: {
      position: {
        x: game.gameArea.startX + width,
        y: game.gameArea.startY + height,
      },
      animationStrip: document.getElementById('orangeAnimationStrip'),
      jumpSound: document.getElementById('redJumpSound'),
    },
    [COLOUR.TEAL]: {
      position: {
        x: game.gameArea.startX + width,
        y: game.gameArea.endY - height * 2,
      },
      animationStrip: document.getElementById('tealAnimationStrip'),
      jumpSound: document.getElementById('blueJumpSound'),
    },
    [COLOUR.PURPLE]: {
      position: {
        x: game.gameArea.endX - width * 2,
        y: game.gameArea.endY - height * 2,
      },
      animationStrip: document.getElementById('purpleAnimationStrip'),
      jumpSound: document.getElementById('greenJumpSound'),
    },
    [COLOUR.PINK]: {
      position: {
        x: game.gameArea.endX - width * 2,
        y: game.gameArea.startY + height,
      },
      animationStrip: document.getElementById('pinkAnimationStrip'),
      jumpSound: document.getElementById('yellowJumpSound'),
    },
  };

  return playerInfo[colour];
};
