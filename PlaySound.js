export function playSound(sound) {
  if (sound) {
    let playSound = sound;
    playSound.volume = 0.2;
    playSound.play();
  }
}
