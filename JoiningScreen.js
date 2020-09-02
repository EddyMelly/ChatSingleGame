import Animation from './Animation.js';
export default class JoiningScreen {
  constructor(game) {
    this.game = game;

    this.backGroundImage = document.getElementById('joiningBackground');
    this.waitingMessage = [
      'WAITING FOR PLAYERS',
      'WAITING FOR PLAYERS .',
      'WAITING FOR PLAYERS ..',
      'WAITING FOR PLAYERS ...',
    ];
    this.currentWaitingMessage = this.waitingMessage[0];
    this.ticker = 0;
    this.timer = 60;
    this.minimumPlayers = 6;
    this.sprite_sheet = {
      frame_sets: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
      image: document.getElementById('joinStrip'),
    };
    this.animation = this.animation = new Animation(
      this.sprite_sheet.frame_sets,
      2
    );
  }

  update(deltaTime) {
    this.ticker += deltaTime / 1000;
    if (this.ticker >= 1) {
      this.callEverySecond();
      this.ticker = 0;
    }
    this.animation.update(deltaTime);
  }

  callEverySecond() {
    this.timer--;
    const currentIndex = this.waitingMessage.indexOf(
      this.currentWaitingMessage
    );
    const nextIndex = (currentIndex + 1) % this.waitingMessage.length;
    this.currentWaitingMessage = this.waitingMessage[nextIndex];

    if (this.timer === 0) {
      if (this.game.allPlayers.length >= this.minimumPlayers) {
        this.game.startGlassGame();
      } else {
        this.timer = 20;
        this.minimumPlayers = 4;
      }
    }
  }

  draw(ctx) {
    ctx.drawImage(this.backGroundImage, 300, 50, 600, 600);
    ctx.font = '50px luckiest_guyregular';
    ctx.fillStyle = 'black';
    ctx.textAlign = 'left';

    ctx.fillText(this.timer, 575, 100);

    ctx.font = '30px luckiest_guyregular';
    ctx.fillStyle = 'black';
    ctx.textAlign = 'left';

    ctx.fillText(this.currentWaitingMessage, 450, 45);

    ctx.font = '30px luckiest_guyregular';
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';

    ctx.fillText(`MINIMUM PLAYERS NEEDED: ${this.minimumPlayers}`, 600, 685);

    ctx.drawImage(
      this.sprite_sheet.image,
      this.animation.frame * 150,
      0,
      150,
      150,
      367,
      175,
      150,
      150
    );
  }
}
