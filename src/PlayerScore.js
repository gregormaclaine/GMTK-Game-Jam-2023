const handle_float = num => Math.floor(num * 10000) / 10000;

class PlayerScore {
  constructor(combo_image) {
    this.score = 0;
    this.combo = 1;

    this.combo_image = combo_image;
    this.combo_image.resize(60, 0);
    this.combo_img_size = [this.combo_image.width, this.combo_image.height];
  }

  add_score(score) {
    this.score = Math.floor(this.score + score * this.combo);
  }

  increase_combo() {
    this.combo += 0.1;
  }

  show() {
    stroke(0);
    strokeWeight(1);
    fill(0);
    textSize(25);
    textAlign(RIGHT, CENTER);
    text('Score: ' + this.score, width - (this.combo > 1 ? 70 : 30), 30);

    if (this.combo > 1) {
      push();
      translate(width - 35, 28);
      rotate(PI / 12);
      imageMode(CENTER);
      image(this.combo_image, 0, -2, ...this.combo_img_size);
      rotate(-PI / 12);

      textSize(15);
      textAlign(CENTER, CENTER);
      fill(0, 150);
      stroke(0, 100);
      text(handle_float(this.combo) + 'x', 0, 0);
      pop();
    }
  }
}
