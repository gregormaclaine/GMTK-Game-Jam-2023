class StarParticleEffect {
  static DURATION = 1;
  static DISTANCE = 90;

  constructor(image) {
    this.image = image;
    this.image.resize(60, 0);
    this.size = [this.image.width, this.image.height];

    this.pos = [0, 0];

    this.showing = false;
    this.progress = 0;
    this.end_effect = () => {};
  }

  async trigger(pos) {
    this.showing = true;
    this.progress = 0;
    this.pos = pos;
    await new Promise(resolve => (this.end_effect = resolve));
    this.showing = false;
  }

  show() {
    const y_offset = lerp(0, StarParticleEffect.DISTANCE, this.progress);
    push();
    imageMode(CENTER);
    tint(255, lerp(255, 0, this.progress));
    translate(this.pos[0], this.pos[1] - y_offset);
    rotate(lerp(0, 2 * PI, this.progress));
    const scaler = x => x * lerp(1, 0.1, this.progress);
    image(this.image, 0, 0, ...this.size.map(scaler));
    pop();
  }

  update() {
    this.progress += 1 / frameRate() / StarParticleEffect.DURATION;
  }
}
