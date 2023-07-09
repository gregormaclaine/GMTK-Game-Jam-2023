class Fisherman {
  constructor(image, difficulty) {
    this.image = image;
    this.difficulty = difficulty;

    this.rect = [120, 60, 300 * 0.5, 327 * 0.5];
  }

  offset_for_speech() {
    const vigor = {
      0: 0,
      1: 3,
      2: 5,
      3: 8,
      4: 15
    }[this.difficulty];

    const [x, y, w, h] = this.rect;
    const offset = [x - w / 3, y + h / 8];
    if (!vigor) return;
    translate(offset[0], offset[1]);
    rotate((PI / 180) * random(-vigor * 2, vigor * 2));
    translate(-offset[0], -offset[1]);
    translate(0, random(-vigor, vigor));
  }

  show(can_move = true) {
    push();
    imageMode(CENTER);
    if (can_move) this.offset_for_speech(this.rect);
    image(this.image, ...this.rect);
    pop();
  }
}
