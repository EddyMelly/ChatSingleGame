import TwitchApi from './TwitchApi.js';
import JoiningScreen from './JoiningScreen.js';
import InputHandler from './InputHandler.js';
import Player from './Player.js';
import GlassGame from './GlassGame.js';
import ContestantPanels from './ContestantPanels.js';
import VictoryScreen from './VictoryScreen.js';
import { playSound } from './PlaySound.js';
import { restart } from './index.js';
import { GAMESTATE, COLOUR, SOUNDS } from './SharedConstants.js';

export const db = firebase.firestore();

export default class Game {
  constructor(gameWidth, gameHeight, ctx, gameArea) {
    this.gameArea = gameArea;
    this.topScorers = [];
    this.latestScorers = [];
    this.ctx = ctx;
    this.glassGame = null;
    this.gameWidth = gameWidth;
    this.gameHeight = gameHeight;
    this.gameObjects = [];
    this.victoryScreen;

    //Start with no players
    this.playerTeams = [
      {
        teamColour: COLOUR.ORANGE,
        user: null,
        player: new Player(this, COLOUR.ORANGE),
        isMod: false,
      },
      {
        teamColour: COLOUR.TEAL,
        user: null,
        player: new Player(this, COLOUR.TEAL),
        isMod: false,
      },
      {
        teamColour: COLOUR.PURPLE,
        user: null,
        player: new Player(this, COLOUR.PURPLE),
        isMod: false,
      },
      {
        teamColour: COLOUR.PINK,
        user: null,
        player: new Player(this, COLOUR.PINK),
        isMod: false,
      },
      {
        teamColour: COLOUR.RED,
        user: null,
        player: new Player(this, COLOUR.RED),
        isMod: false,
      },
      {
        teamColour: COLOUR.BLUE,
        user: null,
        player: new Player(this, COLOUR.BLUE),
        isMod: false,
      },
      {
        teamColour: COLOUR.GREEN,
        user: null,
        player: new Player(this, COLOUR.GREEN),
        isMod: false,
      },
      {
        teamColour: COLOUR.YELLOW,
        user: null,
        player: new Player(this, COLOUR.YELLOW),
        isMod: false,
      },
    ];
    this.activePlayers = [];
    new InputHandler(this.playerTeams[0], this, COLOUR.ORANGE);
    new InputHandler(this.playerTeams[3], this, COLOUR.PINK);
    this.JoiningScreen = new JoiningScreen(this);
    this.contestantPanels = new ContestantPanels(this);
    this.currentGameState = null;
    this.allPlayers = [];
    this.extractedPlayers = [];
    this.getLeaderboard();
    this.getLatestWinners();
  }

  getLeaderboard() {
    db.collection('winners')
      .orderBy('winsTotal', 'desc')
      .limit(5)
      .get()
      .then((snapshot) => {
        snapshot.docs.forEach((doc) => {
          if (doc) {
            try {
              this.topScorers.push({
                id: doc.id,
                userName: doc.data().userName,
                winsTotal: doc.data().winsTotal,
              });
            } catch (error) {
              console.log(error);
            }
          }
        });
      });
  }
  getLatestWinners() {
    db.collection('winners')
      .orderBy('lastWinTimeStamp', 'desc')
      .limit(5)
      .get()
      .then((snapshot) => {
        snapshot.docs.forEach((doc) => {
          if (doc) {
            try {
              this.latestScorers.push({
                id: doc.id,
                userName: doc.data().userName,
              });
            } catch (error) {
              console.log(error);
            }
          }
        });
      });
  }

  start() {
    this.currentGameState = GAMESTATE.JOINING;
    this.gameObjects = [this.JoiningScreen];
    this.TwitchApi = new TwitchApi('ceremor', this);
    this.TwitchApi.connectTwitchChat();
  }

  startGlassGame() {
    this.activePlayers.forEach((element) => {
      if (element.user === 'chaosshield') {
        var animationStrip = document.getElementById('beatriceAnimationStrip');
        element.player.changeAnimationStrip(animationStrip);
      }
      if (element.user === 'ceremor') {
        var animationStrip = document.getElementById('ceremorAnimationStrip');
        element.player.changeAnimationStrip(animationStrip);
      }
      this.extractedPlayers.push(element.player);
    });
    this.activePlayers.forEach((object) => object.player.determineOtherTeams());
    this.gameObjects = [this.contestantPanels, ...this.extractedPlayers];
    this.currentGameState = GAMESTATE.FIRSTGAME;
  }

  update(deltaTime) {
    switch (this.currentGameState) {
      case GAMESTATE.PAUSED:
        break;
      case GAMESTATE.JOINING:
        this.gameObjects = [this.contestantPanels, this.JoiningScreen];
        this.gameObjects.forEach((object) => object.update(deltaTime));

        break;
      case GAMESTATE.FIRSTGAME:
        if (this.glassGame === null) {
          this.glassGame = new GlassGame(this);
          this.gameObjects.push(this.glassGame);
        }
        this.gameObjects = [
          this.contestantPanels,
          this.glassGame,
          ...this.extractedPlayers,
        ];
        this.gameObjects.forEach((object) => object.update(deltaTime));
        if (this.extractedPlayers.length <= 1) {
          this.victory(this.extractedPlayers[0]);
        }
        break;
      case GAMESTATE.VICTORY:
        this.gameObjects = [this.contestantPanels, this.victoryScreen];
    }
  }

  removePlayer(player) {
    this.extractedPlayers = this.extractedPlayers.filter(
      (object) => object !== player
    );
    this.extractedPlayers.forEach((object) => {
      object.determineOtherTeams();
    });
  }

  draw(ctx) {
    this.gameObjects.forEach((object) => object.draw(ctx));
    ctx.font = '12px Monospace';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'left';
  }

  displayMessage(ctx, rgbValue, message) {
    ctx.rect(200, 100, this.gameWidth / 2, this.gameHeight / 2);
    ctx.fillStyle = rgbValue;
    ctx.fill();
    ctx.font = '35px Monospace';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.fillText(message.main, this.gameWidth / 2, this.gameHeight / 2);
    ctx.font = '18px Monospace';
    ctx.fillText(
      message.subtitle,
      this.gameWidth / 2,
      this.gameHeight / 2 + 30
    );
  }

  victory(player) {
    if (player && player.playerState === 0) {
      var winnerUserName;
      var foundPlayer = this.activePlayers.find(
        (element) => element.teamColour === player.colour
      );
      if (foundPlayer) {
        winnerUserName = foundPlayer.user;
        this.latestScorers.unshift(winnerUserName);
        this.latestScorers.pop();
      } else {
        winnerUserName = null;
      }
      this.victoryScreen = new VictoryScreen(
        this,
        player.colour,
        winnerUserName
      );
    } else {
      this.victoryScreen = new VictoryScreen(this, 'no', winnerUserName);
    }
    this.currentGameState = GAMESTATE.VICTORY;
    playSound(SOUNDS.VICTORY);
    this.restartStatus = true;
    setTimeout(function () {
      restart();
      return;
    }, 10000);
  }
}
