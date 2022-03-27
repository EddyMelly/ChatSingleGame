import { COLOUR, truncateString } from './SharedConstants.js';

export default class ContestantPanels {
  constructor(game) {
    this.game = game;
    this.crownImage = document.getElementById('crownImage');

    this.teamInformation = [
      {
        colour: COLOUR.ORANGE,
        teamNamePositions: { x: 150, y: 30 },
        instructionPosition: { x: 150, y: 140 },
        instruction: '',
        userName: '',
      },
      {
        colour: COLOUR.TEAL,
        teamNamePositions: { x: 150, y: 555 },
        instructionPosition: { x: 150, y: 665 },
        instruction: '',
        userName: '',
      },
      {
        colour: COLOUR.PURPLE,
        teamNamePositions: { x: 1050, y: 555 },
        instructionPosition: { x: 1050, y: 665 },
        instruction: '',
        userName: '',
      },
      {
        colour: COLOUR.PINK,
        teamNamePositions: { x: 1050, y: 30 },
        instructionPosition: { x: 1050, y: 140 },
        instruction: '',
        userName: '',
      },
      {
        colour: COLOUR.RED,
        teamNamePositions: { x: 150, y: 205 },
        instructionPosition: { x: 150, y: 315 },
        instruction: '',
        userName: '',
      },
      {
        colour: COLOUR.BLUE,
        teamNamePositions: { x: 1050, y: 205 },
        instructionPosition: { x: 1050, y: 315 },
        instruction: '',
        userName: '',
      },
      {
        colour: COLOUR.GREEN,
        teamNamePositions: { x: 150, y: 380 },
        instructionPosition: { x: 150, y: 490 },
        instruction: '',
        userName: '',
      },
      {
        colour: COLOUR.YELLOW,
        teamNamePositions: { x: 1050, y: 380 },
        instructionPosition: { x: 1050, y: 490 },
        instruction: '',
        userName: '',
      },
    ];
  }

  update(deltaTime) {}

  changeInstruction(instruction, team) {
    var tempTeam = this.teamInformation.find(
      (object) => object.colour === team
    );
    if (tempTeam) {
      tempTeam.instruction = instruction;
    }
  }

  giveUserName(userName, team) {
    var tempTeam = this.teamInformation.find(
      (object) => object.colour === team
    );
    var truncatedName = truncateString(userName);
    if (tempTeam) {
      tempTeam.userName = truncatedName;
    }
  }

  drawInstruction(ctx, instruction, instructionPosition) {
    ctx.font = '30px luckiest_guyregular';
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';
    ctx.fillText(instruction, instructionPosition.x, instructionPosition.y);
  }

  draw(ctx) {
    this.teamInformation.forEach((element) => {
      this.drawInstruction(
        ctx,
        element.instruction,
        element.instructionPosition
      );
      var yposition = 50;
      ctx.font = '20px galindoregular';
      ctx.fillStyle = 'black';
      ctx.textAlign = 'center';
      ctx.fillText(
        element.userName,
        element.teamNamePositions.x,
        element.teamNamePositions.y + yposition
      );
      if (this.game.topScorers[0]) {
        if (element.userName === this.game.topScorers[0].userName) {
          ctx.drawImage(
            this.crownImage,
            element.teamNamePositions.x + 110,
            element.teamNamePositions.y + 30,
            25,
            25
          );
        }
      }
    });
  }
}
