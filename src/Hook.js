class Hook {
  constructor(start_pos, image) {
    this.pos = start_pos;

    this.image = image;
    this.image.resize(30, 0);
    this.size = [this.image.width, this.image.height];

    this.angle = PI / 4;
    this.vel = 1;
    this.noise_offset = random(0, 100);
    this.max_angle_change = PI / 80;
  }

  is_on_screen() {
    if (this.pos[0] + this.size[0] / 2 > width) return false;
    if (this.pos[0] - this.size[0] / 2 < 0) return false;
    if (this.pos[1] + this.size[1] / 2 > height) return false;
    if (this.pos[1] - this.size[1] / 2 < 0) return false;
    return true;
  }

  get_normal_angle() {
    if (this.pos[0] + this.size[0] / 2 > width) return -PI;
    if (this.pos[0] - this.size[0] / 2 < 0) return 0;
    if (this.pos[1] + this.size[1] / 2 > height) return -PI / 2;
    if (this.pos[1] - this.size[1] / 2 < 0) return PI / 2;
    return true;
  }

  update() {
    if (!this.is_on_screen()) this.angle = this.get_normal_angle(); //this.angle += PI;

    this.noise_offset += 0.01;
    const angle_change = noise(this.noise_offset) * 2 - 1;
    this.angle += angle_change * this.max_angle_change;
    this.angle %= 2 * PI;

    this.pos[0] += cos(this.angle) * this.vel;
    this.pos[1] += sin(this.angle) * this.vel;
  }

  show() {
    image(
      this.image,
      this.pos[0] - this.size[0] / 2,
      this.pos[1] - this.size[1] / 2,
      ...this.size
    );

    strokeWeight(3);
    stroke(100);
    line(this.pos[0], 0, this.pos[0], this.pos[1] - this.size[1] / 2.5);

    this.update();
  }
}
