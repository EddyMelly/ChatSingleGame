import { DIRECTIONS } from './SharedConstants.js';

// const DIRECTIONS = {
//   LEFT: 0,
//   RIGHT: 1,
//   UP: 2,
//   DOWN: 3,
// };

export function lavaDetection(lavaTile, player) {
  if (
    lavaTile.position.x == player.position.x &&
    lavaTile.position.y == player.position.y
  ) {
    return true;
  } else {
    return false;
  }
}

export function jumpingDetection(glassTile, player){
  if(lavaDetection(glassTile, player) && player.movement.direction === DIRECTIONS.JUMP){
    return true;
  }else{
    return false;
  }
}

export function pushingDetection(stillPlayer, movingPlayer, movementDirection) {
  switch (movementDirection) {
    case DIRECTIONS.UP:
      if (
        movingPlayer.position.x == stillPlayer.position.x &&
        movingPlayer.position.y <= stillPlayer.position.y + 45 &&
        movingPlayer.position.y >= stillPlayer.position.y &&
        stillPlayer.canMove
      ) {
        return true;
      }
      break;
    case DIRECTIONS.DOWN:
      if (
        movingPlayer.position.x == stillPlayer.position.x &&
        movingPlayer.position.y + movingPlayer.width >=
          stillPlayer.position.y + 5 &&
        movingPlayer.position.y + movingPlayer.width <=
          stillPlayer.position.y + stillPlayer.height &&
        stillPlayer.canMove
      ) {
        return true;
      }
      break;
    case DIRECTIONS.LEFT:
      if (
        movingPlayer.position.y == stillPlayer.position.y &&
        movingPlayer.position.x <= stillPlayer.position.x + 45 &&
        movingPlayer.position.x >= stillPlayer.position.x &&
        stillPlayer.canMove
      ) {
        return true;
      }
      break;
    case DIRECTIONS.RIGHT:
      if (
        movingPlayer.position.y == stillPlayer.position.y &&
        movingPlayer.position.x + movingPlayer.width >=
          stillPlayer.position.x + 5 &&
        movingPlayer.position.x + movingPlayer.width <=
          stillPlayer.position.x + stillPlayer.height &&
          stillPlayer.canMove
      ) {
        return true;
      }
      break;
    default:
      return false;
  }
}
