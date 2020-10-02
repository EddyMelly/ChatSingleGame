import { GAMESTATE, COLOUR, DIRECTIONS } from './SharedConstants.js';
import { playSound } from './PlaySound.js';
export default class TwitchApi {
  constructor(channel, game) {
    this.channel = channel;
    this.users = [];
    this.game = game;
    this.previousInstruction = {};
    this.statusElement = document.getElementById('status');
    this.twitchCall = new TwitchJs({
      log: {
        enabled: false,
      },
    });
  }
  disconnectTwitchChat() {
    const { chat } = this.twitchCall;
    chat.disconnect();
    this.statusElement.innerHTML = 'disconnected';
    this.statusElement.style.color = 'red';
  }

  connectTwitchChat() {
    const { chat } = this.twitchCall;
    chat
      .connect()
      .then(() => {
        chat
          .join(this.channel)
          .then(() => {
            console.log('connected boy');
            this.statusElement.innerHTML = 'connected';
            this.statusElement.style.color = 'green';
          })
          .catch(function (err) {
            console.log(err);
            this.statusElement.innerHTML = 'Edgar Fucked Up';
            this.statusElement.style.color = 'red';
          });
      })
      .catch(function (err) {
        console.log(err);
        statusElement.innerHTML = 'Error: Cant connect right now';
        statusElement.style.color = 'red';
      });

    chat.on('*', (message) => {
      var message = message;
      var clean_message = DOMPurify.sanitize(message.message, {
        ALLOWED_TAGS: ['b'],
      });
      var clean_username = DOMPurify.sanitize(message.username, {
        ALLOWED_TAGS: ['b'],
      });
      var uppercaseMessage = clean_message.toUpperCase();
      var upperCaseMessageClean = uppercaseMessage.replace(/ .*/, '');

      switch (this.game.currentGameState) {
        case GAMESTATE.JOINING:
          if (upperCaseMessageClean === 'JOIN') {
            this.addUserToColour(clean_username, message);
          }
          break;
        case GAMESTATE.PAUSED:
          //DO NOTHING
          break;
        case GAMESTATE.VICTORY:
          //VICTORY
          break;
        case GAMESTATE.FIRSTGAME:
          if (
            upperCaseMessageClean === DIRECTIONS.LEFT ||
            upperCaseMessageClean === DIRECTIONS.RIGHT ||
            upperCaseMessageClean === DIRECTIONS.UP ||
            upperCaseMessageClean === DIRECTIONS.DOWN ||
            upperCaseMessageClean === DIRECTIONS.JUMP
          ) {
            this.performInstruction(
              clean_username,
              upperCaseMessageClean,
              clean_message
            );
          }
      }
    });
  }

  determineModStatus(message) {
    if (message.tags.badges) {
      if (
        'broadcaster' in message.tags.badges ||
        'moderator' in message.tags.badges
      ) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  performInstruction(userName, instruction, originalMessage) {
    var result = this.game.activePlayers.find(
      (player) => player.user === userName
    );

    if (result) {
      if (result.isMod === true) {
        this.modCheckCompleteInstruction(
          result,
          userName,
          instruction,
          originalMessage
        );
      } else {
        this.completeInstruction(result.player, instruction);
        this.game.contestantPanels.changeInstruction(
          instruction,
          result.teamColour
        );
      }
    }
  }

  modCheckCompleteInstruction(result, userName, instruction, originalMessage) {
    if (this.previousInstruction[userName].canInstruct) {
      if (
        this.previousInstruction[userName].previousMessage !== originalMessage
      ) {
        this.completeInstruction(result.player, instruction);
        this.game.contestantPanels.changeInstruction(
          instruction,
          result.teamColour
        );

        this.previousInstruction[userName].canInstruct = false;
        this.previousInstruction[userName].previousMessage = originalMessage;
        setTimeout(() => {
          this.previousInstruction[userName].canInstruct = true;
        }, 1000);
      } else {
        this.game.contestantPanels.changeInstruction(
          'MOD CHEATING',
          result.teamColour
        );
      }
    } else {
      this.game.contestantPanels.changeInstruction(
        'MOD TOO FAST',
        result.teamColour
      );
    }
  }

  completeInstruction(playerTeam, instruction) {
    switch (instruction) {
      case DIRECTIONS.LEFT:
        playerTeam.moveLeftBuffer();
        break;
      case DIRECTIONS.RIGHT:
        playerTeam.moveRightBuffer();
        break;
      case DIRECTIONS.UP:
        playerTeam.moveUpBuffer();
        break;
      case DIRECTIONS.DOWN:
        playerTeam.moveDownBuffer();
        break;
      case DIRECTIONS.JUMP:
        playerTeam.moveJumpBuffer();
        break;
      default:
        break;
    }
  }

  addUserToColour(cleanUserName, message) {
    if (this.game.playerTeams.length > 0) {
      if (!this.checkIfJoined(cleanUserName)) {
        if (cleanUserName === 'chaosshield') {
          var sound = document.getElementById('chaosLaugh');
          playSound(sound);
        }

        //determine mod status
        var isMod = this.determineModStatus(message);
        //find empty team
        var emptyTeam = this.game.playerTeams.find((x) => x.user === null);
        // add player to Team
        emptyTeam.user = cleanUserName;
        emptyTeam.isMod = isMod;

        if (isMod) {
          this.previousInstruction[cleanUserName] = {
            canInstruct: true,
            previousMessage: 'test',
          };
        }

        //add player to all players
        this.game.allPlayers.push({
          userName: cleanUserName,
          team: emptyTeam,
        });
        this.game.contestantPanels.giveUserName(
          cleanUserName,
          emptyTeam.teamColour
        );

        // add team to active teams
        this.game.activePlayers.push(emptyTeam);

        // remove team from available
        this.game.playerTeams = this.game.playerTeams.filter(
          (object) => object.user === null
        );
        if (this.game.playerTeams.length <= 0) {
          this.game.startGlassGame();
        }
      }
    }
  }

  checkIfJoined(userName) {
    if (this.game.allPlayers.some((player) => player.userName === userName)) {
      return true;
    } else {
      return false;
    }
  }
}
