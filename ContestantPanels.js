import { COLOUR, truncateString, startingJumps } from "./SharedConstants.js";

export default class ContestantPanels {
  constructor(game) {
    this.game = game;
    this.crownImage = document.getElementById("crownImage");

    this.teamInformation = [
      {
        colour: COLOUR.ORANGE,
        teamNamePositions: { x: 150, y: 30 },
        instruction: "",
        userName: "",
        jumpsRemaining: startingJumps,
      },
      {
        colour: COLOUR.TEAL,
        teamNamePositions: { x: 150, y: 555 },
        instruction: "",
        userName: "",
        jumpsRemaining: startingJumps,
      },
      {
        colour: COLOUR.PURPLE,
        teamNamePositions: { x: 1050, y: 555 },
        instruction: "",
        userName: "",
        jumpsRemaining: startingJumps,
      },
      {
        colour: COLOUR.PINK,
        teamNamePositions: { x: 1050, y: 30 },
        instruction: "",
        userName: "",
        jumpsRemaining: startingJumps,
      },
      {
        colour: COLOUR.RED,
        teamNamePositions: { x: 150, y: 205 },
        instruction: "",
        userName: "",
        jumpsRemaining: startingJumps,
      },
      {
        colour: COLOUR.BLUE,
        teamNamePositions: { x: 1050, y: 205 },
        instruction: "",
        userName: "",
        jumpsRemaining: startingJumps,
      },
      {
        colour: COLOUR.GREEN,
        teamNamePositions: { x: 150, y: 380 },
        instruction: "",
        userName: "",
        jumpsRemaining: startingJumps,
      },
      {
        colour: COLOUR.YELLOW,
        teamNamePositions: { x: 1050, y: 380 },
        instruction: "",
        userName: "",
        jumpsRemaining: startingJumps,
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

  changeJumpsRemaining(limit, team) {
    var tempTeam = this.teamInformation.find(
      (object) => object.colour === team
    );
    if (tempTeam) {
      tempTeam.jumpsRemaining = limit;
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
    ctx.font = "30px luckiest_guyregular";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.fillText(instruction, instructionPosition.x, instructionPosition.y);
  }

  drawJumpLimit(ctx, limit, limitPosition) {
    ctx.font = "25px luckiest_guyregular";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.fillText(`Jumps: ${limit} `, limitPosition.x, limitPosition.y);
  }

  draw(ctx) {
    this.teamInformation.forEach((element) => {
      this.drawInstruction(ctx, element.instruction, {
        x: element.teamNamePositions.x,
        y: element.teamNamePositions.y + 100,
      });
      this.drawJumpLimit(ctx, element.jumpsRemaining, {
        x: element.teamNamePositions.x,
        y: element.teamNamePositions.y + 130,
      });
      var yposition = 50;
      ctx.font = "20px galindoregular";
      ctx.fillStyle = "black";
      ctx.textAlign = "center";
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
