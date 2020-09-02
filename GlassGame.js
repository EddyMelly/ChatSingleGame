import { GlassTile } from './GlassTile.js';
import { SOUNDS } from './SharedConstants.js';
import { playSound } from './PlaySound.js';
const LEVEL_STATE = {
  PAUSED: 0,
  RUNNING: 1,
};
const level = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

export default class GlassGame {
  constructor(game) {
    this.game = game;
    this.levelState = LEVEL_STATE.PAUSED;
    this.glassTiles = [];
    this.glassTilesBreaking = [];
    this.glassTilesNotBreaking = [];
    this.indexedGlassTiles = [];
    this.breakTimer = 56;
    this.animationTimer = 0;
    this.timer = 0;
    this.backGroundImage = document.getElementById('lavaBackground');
    this.startMessage = '';
    this.buildLevel(this.game);
  }

  buildLevel(game) {
    level.forEach((row, rowIndex) => {
      let tempArray = [];
      row.forEach((tile, tileIndex) => {
        if (tile === 1) {
          let position = {
            x: this.game.gameArea.startX + 50 * tileIndex,
            y: this.game.gameArea.startY + 50 * rowIndex,
          };
          let tempGlassTile = {
            XIndex: tileIndex,
            YIndex: rowIndex,
            tile: new GlassTile(game, position),
          };
          this.glassTiles.push(tempGlassTile);
          tempArray.push(tempGlassTile);
        }
      });
      this.indexedGlassTiles.push(tempArray);
    });
  }

  chooseTileToBreak() {
    if (this.glassTilesBreaking.length === 0) {
      var randomTile = this.glassTiles[
        Math.floor(Math.random() * this.glassTiles.length)
      ];
      randomTile.tile.breaking = true;
      randomTile.tile.break();
    } else {
      if (this.glassTilesNotBreaking.length >= 1) {
        var randomTile = this.glassTilesNotBreaking[
          Math.floor(Math.random() * this.glassTilesNotBreaking.length)
        ];
        randomTile.tile.breaking = true;
        randomTile.tile.break();
      }
    }
  }

  chooseTilesToBreak() {
    this.indexedGlassTiles.forEach((row, rowIndex) => {
      if (rowIndex === 0 || rowIndex === this.indexedGlassTiles.length - 1) {
        row.forEach((tile, tileIndex) => {
          tile.tile.breaking = true;
          tile.tile.break();
        });
      } else {
        row.forEach((tile, tileIndex) => {
          if (tileIndex === row.length - 1) {
            tile.tile.breaking = true;
            tile.tile.break();
            row.splice(tileIndex, 1);
          }
          if (tileIndex === 0) {
            tile.tile.breaking = true;
            tile.tile.break();
            row.splice(tileIndex, 1);
          }
        });
      }
    });
    this.indexedGlassTiles.splice(this.indexedGlassTiles.length - 1, 1);
    this.indexedGlassTiles.splice(0, 1);
  }

  callEverySecond() {
    this.timer = this.timer + 1;
    switch (this.levelState) {
      case LEVEL_STATE.RUNNING:
        if (this.timer % this.breakTimer === 0 && this.glassTiles.length >= 1) {
          this.chooseTilesToBreak();
        }
        break;
      case LEVEL_STATE.PAUSED:
        this.displayStart(this.timer);
        break;
    }
  }

  displayStart(timer) {
    switch (timer) {
      case 0:
        this.startMessage = '3';
        break;
      case 1:
        this.startMessage = '3';
        playSound(SOUNDS.BLIP);
        break;
      case 2:
        this.startMessage = '2';
        playSound(SOUNDS.BLIP);
        break;
      case 3:
        this.startMessage = '1';
        playSound(SOUNDS.BLIP);
        break;
      case 4:
        this.startMessage = 'GO!';
        playSound(SOUNDS.BLOOP);
        break;
      case 5:
        this.startMessage = '';
        this.timer = 0;
        this.levelState = LEVEL_STATE.RUNNING;
        break;
    }
  }

  update(deltaTime) {
    switch (this.levelState) {
      case LEVEL_STATE.PAUSED:
        break;
      case LEVEL_STATE.RUNNING:
        break;
    }
    //FOR RANDOM TILE BREAKS
    // this.glassTilesNotBreaking = this.glassTiles.filter(
    //   (object) => !object.tile.breaking
    // );

    // this.glassTilesBreaking = this.glassTiles.filter(
    //   (object) => object.tile.breaking
    // );

    //TEST CODE FOR JUMPING MECHANIC
    this.glassTiles.forEach((object) => object.tile.update(deltaTime));
    //TEST CODE FOR JUMPING MECHANIC

    // this.glassTilesBreaking.forEach((object) => object.update(deltaTime));

    this.animationTimer += deltaTime / 1000;
    if (this.animationTimer >= 1) {
      this.callEverySecond();
      this.animationTimer = 0;
    }
  }

  draw(ctx) {
    ctx.drawImage(this.backGroundImage, 300, 50, 600, 600);
    if (this.levelState === LEVEL_STATE.PAUSED) {
      ctx.font = '40px luckiest_guyregular';
      ctx.fillStyle = 'white';
      ctx.textAlign = 'center';

      ctx.fillText(this.startMessage, 600, 45);
    }
    this.glassTiles.forEach((object) => object.tile.draw(ctx));
  }
}
