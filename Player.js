import Animation from './Animation.js';
import { pushingDetection } from './CollisionDetection.js';
import {
  DIRECTIONS,
  SOUNDS,
  retrievePlayerInformation,
  PLAYER_STATE,
} from './SharedConstants.js';
import { playSound } from './PlaySound.js';

const SPRITE_SIZE = 50;

export default class Player {
  constructor(game, colour) {
    this.colour = colour;
    this.width = SPRITE_SIZE;
    this.game = game;
    this.height = SPRITE_SIZE;
    this.otherPlayers = [];
    this.canMove = true;
    this.playerState = PLAYER_STATE.ALIVE;
    this.movementBuffer = [];
    this.campingTimeout = 35;
    this.ticker = 0;

    const { position, animationStrip, jumpSound } = retrievePlayerInformation(
      game,
      this.height,
      this.width,
      colour
    );

    this.position = position;
    this.animationStrip = animationStrip;
    this.jumpSound = jumpSound;

    this.sprite_sheet = {
      frame_sets: [[0, 1], [2, 3, 4, 5, 6], [7]],
      image: this.animationStrip,
    };
    this.animation = new Animation(this.sprite_sheet.frame_sets[0], 30);
    this.movement = {
      activated: false,
      direction: null,
      frameToReach: 20,
      currentFrame: 0,
    };
  }

  resetMovement() {
    this.canMove = true;
    this.animation = new Animation(this.sprite_sheet.frame_sets[0], 30);
    this.movement = {
      activated: false,
      direction: null,
      frameToReach: 20,
      currentFrame: 0,
    };
    this.campingTimeout = 40;
  }

  callEverySecond() {
    this.campingTimeout--;
    if (this.campingTimeout === 0) {
      this.game.contestantPanels.changeInstruction('Camping', this.colour);
      this.moveJumpBuffer();
    }
  }

  determineOtherTeams() {
    this.otherPlayers = this.game.extractedPlayers.filter(
      (object) => object.colour != this.colour
    );
  }

  changeAnimationStrip(animationStrip) {
    this.animationStrip = animationStrip;
    this.sprite_sheet = {
      frame_sets: [[0, 1], [2, 3, 4, 5, 6], [7]],
      image: this.animationStrip,
    };
    this.animation = new Animation(this.sprite_sheet.frame_sets[0], 30);
  }

  movingDirection(direction) {
    this.movement.currentFrame = this.movement.currentFrame + 1;
    if (this.movement.currentFrame <= this.movement.frameToReach) {
      switch (direction) {
        case DIRECTIONS.LEFT:
          //if (this.position.x > this.game.gameArea.startX) {
          this.position.x = this.position.x - this.width / 20;
          //}
          break;
        case DIRECTIONS.RIGHT:
          //if (this.position.x < this.game.gameArea.endX - 50) {
          this.position.x = this.position.x + this.width / 20;
          //}
          break;
        case DIRECTIONS.UP:
          // if (this.position.y > this.game.gameArea.startY) {
          this.position.y = this.position.y - this.height / 20;
          //}
          break;
        case DIRECTIONS.DOWN:
          // if (this.position.y < this.game.gameArea.endY - 50) {
          this.position.y = this.position.y + this.height / 20;
          //}
          break;
        case DIRECTIONS.JUMP:
          this.position.x = this.position.x;
          break;
      }
    } else {
      if (this.playerState === PLAYER_STATE.ALIVE) {
        this.resetMovement();
        if (direction !== DIRECTIONS.JUMP) {
          this.land();
        }
      }
    }
  }

  death() {
    if (this.playerState === PLAYER_STATE.ALIVE) {
      this.canMove = false;
      this.animation.change(this.sprite_sheet.frame_sets[2], 5);
      playSound(SOUNDS.DEATH);
      this.playerState = PLAYER_STATE.DEAD;
      setTimeout(() => {
        this.game.removePlayer(this);
      }, 5000);
    }
  }

  moveLeftBuffer() {
    this.movementBuffer.push(this.moveLeft.bind(this));
  }

  moveRightBuffer() {
    this.movementBuffer.push(this.moveRight.bind(this));
  }

  moveUpBuffer() {
    this.movementBuffer.push(this.moveUp.bind(this));
  }

  moveDownBuffer() {
    this.movementBuffer.push(this.moveDown.bind(this));
  }
  moveJumpBuffer() {
    this.movementBuffer.push(this.moveJump.bind(this));
  }

  moveLeft() {
    if (this.canMove && this.playerState === PLAYER_STATE.ALIVE) {
      this.movement.direction = DIRECTIONS.LEFT;
      this.movement.activated = true;
      this.canMove = false;
      playSound(this.jumpSound);
      this.animation.change(this.sprite_sheet.frame_sets[1], 5);
    }
  }

  moveRight() {
    if (this.canMove && this.playerState === PLAYER_STATE.ALIVE) {
      this.movement.direction = DIRECTIONS.RIGHT;
      this.movement.activated = true;
      this.canMove = false;
      playSound(this.jumpSound);
      this.animation.change(this.sprite_sheet.frame_sets[1], 5);
    }
  }
  moveUp() {
    if (this.canMove && this.playerState === PLAYER_STATE.ALIVE) {
      this.movement.direction = DIRECTIONS.UP;
      this.movement.activated = true;
      this.canMove = false;
      playSound(this.jumpSound);
      this.animation.change(this.sprite_sheet.frame_sets[1], 5);
    }
  }
  moveDown() {
    if (this.canMove && this.playerState === PLAYER_STATE.ALIVE) {
      this.movement.direction = DIRECTIONS.DOWN;
      this.movement.activated = true;
      this.canMove = false;
      playSound(this.jumpSound);
      this.animation.change(this.sprite_sheet.frame_sets[1], 5);
    }
  }

  // EXPERIMENTAL JUMP FEATURE
  moveJump() {
    if (this.canMove && this.playerState == PLAYER_STATE.ALIVE) {
      this.canMove = false;
      this.movement.direction = DIRECTIONS.JUMP;
      this.movement.activated = true;
      playSound(this.jumpSound);
      this.animation.change(this.sprite_sheet.frame_sets[1], 5);
      this.landFromJumping();
    }
  }
  // EXPERIMENTAL JUMP FEATURE

  push(direction) {
    if (this.canMove && this.playerState === PLAYER_STATE.ALIVE) {
      this.movement.direction = direction;
      this.movement.activated = true;
      this.canMove = false;
      playSound(SOUNDS.PUSH);
      this.animation.change(this.sprite_sheet.frame_sets[1], 5);
    }
  }

  land() {
    if (this.game.glassGame) {
      const landedOnTile = this.game.glassGame.getTileLandedOn(this.position);
      landedOnTile?.moveToTile(this);
    }
  }

  landFromJumping() {
    if (this.game.glassGame) {
      const landedOnTile = this.game.glassGame.getTileLandedOn(this.position);
      landedOnTile?.break();
    }
  }

  stop() {
    this.speed = 0;
  }

  draw(ctx) {
    ctx.drawImage(
      this.sprite_sheet.image,
      this.animation.frame * SPRITE_SIZE,
      0,
      SPRITE_SIZE,
      SPRITE_SIZE,
      this.position.x,
      this.position.y,
      SPRITE_SIZE,
      SPRITE_SIZE
    );
  }

  update(deltaTime) {
    if (this.movementBuffer.length !== 0 && this.canMove) {
      this.movementBuffer[0]();
      var completedMovement = this.movementBuffer.shift();
    }
    if (this.movement.activated) {
      this.movingDirection(this.movement.direction);
      this.otherPlayers.forEach((player) => {
        if (pushingDetection(player, this, this.movement.direction)) {
          player.push(this.movement.direction);
        }
      });
    }
    this.ticker += deltaTime / 1000;
    if (this.ticker >= 1) {
      this.callEverySecond();
      this.ticker = 0;
    }
    this.animation.update(deltaTime);

    if (this.position.x < this.game.gameArea.startX) this.death();
    if (this.position.x + this.width > this.game.gameArea.endX) {
      this.death();
    }
    if (this.position.y < this.game.gameArea.startY) {
      this.death();
    }
    if (this.position.y + this.height > this.game.gameArea.endY) {
      this.death();
    }
  }
}
