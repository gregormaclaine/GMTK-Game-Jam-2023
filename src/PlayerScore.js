const handle_float = num => Math.floor(num * 10000) / 10000;

class PlayerScore {
  constructor(combo_image, audio, double_chance = 0, triple_chance = 0) {
    this.audio = audio;
    this.double_chance = double_chance;
    this.triple_chance = triple_chance;

    this.score = 0;
    this.combo = 1;

    this.combo_image = combo_image;
    this.combo_image.resize(60, 0);
    this.combo_img_size = [this.combo_image.width, this.combo_image.height];
  }

  add_score(score) {
    const double = random() < this.double_chance ? 2 : 1;
    const triple = random() < this.triple_chance && this.combo > 1 ? 3 : 1;
    this.score = Math.floor(this.score + score * this.combo * double * triple);
  }

  increase_combo() {
    this.combo += 0.5;
    this.audio.play_sound('star.wav');
  }

  show() {
    stroke(0);
    strokeWeight(1);
    fill(0);
    textSize(20);
    textAlign(RIGHT, CENTER);
    text('Score: ' + this.score, width - (this.combo > 1 ? 70 : 30), 70);

    if (this.combo > 1) {
      push();
      translate(width - 35, 68);
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
