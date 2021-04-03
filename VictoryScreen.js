import { COLOUR, truncateString } from './SharedConstants.js';
import { db } from './Game.js';

export default class VictoryScreen {
  constructor(game, winningTeam, winnerUserName) {
    this.winningTeam = winningTeam;
    this.winnerUserName = winnerUserName;
    this.game = game;
    this.backGroundImage = document.getElementById('winScreenBackGround');
    this.teamNamePosition = { x: 500, y: 500 };
    switch (winningTeam) {
      case COLOUR.ORANGE:
        this.winningTeamColour = '#d75f28';
        break;
      case COLOUR.TEAL:
        this.winningTeamColour = '#28d7cf';
        break;
      case COLOUR.PURPLE:
        this.winningTeamColour = '#8b28d7';
        break;
      case COLOUR.PINK:
        this.winningTeamColour = '#d728a9';
        break;
      case COLOUR.RED:
        this.winningTeamColour = '#d62839';
        break;
      case COLOUR.BLUE:
        this.winningTeamColour = '#339dd7';
        break;
      case COLOUR.GREEN:
        this.winningTeamColour = '#44cf6c';
        break;
      case COLOUR.YELLOW:
        this.winningTeamColour = '#e3c34f';
        break;
      default:
        this.winningTeamColour = 'black';
    }
    this.updateDB(this.winnerUserName);
  }

  update(deltaTime) {}

  updateDB(userName) {
    const winTime = firebase.firestore.Timestamp.now().seconds;
    if (userName) {
      db.collection('winners')
        .where('userName', '==', userName)
        .limit(1)
        .get()
        .then(function (querySnapshot) {
          if (querySnapshot.empty) {
            db.collection('winners')
              .add({
                userName: userName,
                winsTotal: 1,
                lastWinTimeStamp: winTime,
              })
              .then(function (docRef) {})
              .catch(function (error) {
                console.error('Error adding document: ', error);
              });
          } else {
            querySnapshot.forEach(function (doc) {
              db.collection('winners')
                .doc(doc.id)
                .set(
                  {
                    winsTotal: doc.data().winsTotal + 1,
                    lastWinTimeStamp: winTime,
                  },
                  { merge: true }
                )
                .then(function () {})
                .catch(function (error) {
                  console.error('Error writing document: ', error);
                });
            });
          }
        })
        .catch(function (error) {
          console.log('Error getting documents: ', error);
        });
    }
  }

  draw(ctx) {
    ctx.drawImage(this.backGroundImage, 300, 50, 600, 600);
    ctx.font = '40px luckiest_guyregular';
    ctx.fillStyle = this.winningTeamColour;
    ctx.textAlign = 'center';

    ctx.fillText(`${this.winningTeam} BOY`, 605, 100);

    if (this.winnerUserName) {
      ctx.font = '30px luckiest_guyregular';
      ctx.fillStyle = 'black';
      ctx.textAlign = 'center';
      ctx.fillText(this.winnerUserName, 605, 140);
    }

    var startPosition = 430;
    ctx.font = '24px luckiest_guyregular';
    ctx.fillStyle = 'black';
    ctx.textAlign = 'left';
    if (this.game.topScorers) {
      this.game.topScorers.forEach(function (element) {
        ctx.fillText(truncateString(element.userName), 320, startPosition);
        ctx.fillText(element.winsTotal, 565, startPosition);
        startPosition += 40;
      });
    }

    var latestStartPosition = 430;
    if (this.game.latestScorers) {
      ctx.font = '24px luckiest_guyregular';
      ctx.fillStyle = 'black';
      ctx.textAlign = 'center';
      this.game.latestScorers.forEach(function (element) {
        ctx.fillText(
          truncateString(element.userName),
          750,
          latestStartPosition
        );
        latestStartPosition += 40;
      });
    }
  }
}
