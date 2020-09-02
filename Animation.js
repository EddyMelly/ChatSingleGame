const SPRITE_SIZE = 50;

export default class Animation {
  constructor(frame_set, delay) {
    this.count = 0;
    this.delay = delay;
    this.frame = 0;
    this.frame_index = 0;
    this.frame_set = frame_set;
  }

  change(frame_set, delay = 15) {
    if (this.frame_set != frame_set) {
      //if the frame set is different to currently stored
      this.count = 0;
      this.delay = delay;
      this.frame_index = 0;
      this.frame_set = frame_set; // setting the new array frameset
      this.frame = this.frame_set[this.frame_index];
    }
  }

  update(deltaTime) {
    this.count++;
    if (this.count >= this.delay) {
      // if the count goes past the delay set at 15 we change the frame
      this.count = 0;
      /* If the frame index is on the last value in the frame set, reset to 0.
        If the frame index is not on the last value, just add 1 to it. */
      this.frame_index =
        this.frame_index == this.frame_set.length - 1
          ? 0
          : this.frame_index + 1;
      this.frame = this.frame_set[this.frame_index]; // Change the current frame value.
    }
  }
}
