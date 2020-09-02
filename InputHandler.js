import { COLOUR } from './SharedConstants.js';

export default class InputHandler {
  constructor(player, game, colour) {
    document.addEventListener('keydown', (event) => {
      if (colour === COLOUR.ORANGE) {
        switch (event.keyCode) {
          case 37:
            player.player.moveLeftBuffer();
            break;
          case 38:
            player.player.moveUpBuffer();
            break;
          case 39:
            player.player.moveRightBuffer();
            break;
          case 40:
            player.player.moveDownBuffer();
            break;
          case 74:
            player.player.moveJumpBuffer();
        }
      } else {
        switch (event.keyCode) {
          case 65:
            player.player.moveLeftBuffer();
            break;
          case 87:
            player.player.moveUpBuffer();
            break;
          case 68:
            player.player.moveRightBuffer();
            break;
          case 83:
            player.player.moveDownBuffer();
            break;
        }
      }
    });

    document.addEventListener('keyup', (event) => {
      switch (event.keyCode) {
        case 37:
          if (player.player.speed < 0) {
            player.player.stop();
          }
          break;
        case 39:
          if (player.player.speed > 0) {
            player.player.stop();
          }
          break;
        case 38:
          if (player.player.speed < 0) {
            player.player.stop();
          }
          break;
        case 40:
          if (player.speed > 0) {
            player.player.stop();
          }
          break;
        case 74:
          if (player.speed > 0) {
            player.player.stop();
          }
          break;
      }
    });
  }
}
