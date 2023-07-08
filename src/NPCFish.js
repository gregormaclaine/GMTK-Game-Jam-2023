class NPCFish {
  constructor(start_pos, image, angle = 0) {
    this.pos = start_pos;
    this.image = image;
    this.image.resize(80, 0);
    this.size = [this.image.width, this.image.height];

    this.angle = 0;
    this.vel = 1;
    this.noise_offset = random(0, 100);
    this.max_angle_change = PI / 100;

    this.hitbox = new HitBox(start_pos, this.size);
  }

  is_on_screen() {
    if (this.pos[0] + this.size[0] / 2 > width) return false;
    if (this.pos[0] - this.size[0] / 2 < 0) return false;
    if (this.pos[1] + this.size[1] / 2 > height) return false;
    if (this.pos[1] - this.size[1] / 2 < INVISIBLE_CEILING) return false;
    return true;
  }

  get_normal_angle() {
    if (this.pos[0] + this.size[0] / 2 > width) return -PI;
    if (this.pos[0] - this.size[0] / 2 < 0) return 0;
    if (this.pos[1] + this.size[1] / 2 > height) return -PI / 2;
    if (this.pos[1] - this.size[1] / 2 < INVISIBLE_CEILING) return PI / 2;
    return true;
  }

  flee_mouse() {
    const mouse = createVector(mouseX, mouseY);
    const fish = createVector(...this.pos);
    fish.sub(mouse);
    this.angle = fish.heading();

    this.max_angle_change /= 2;
    this.vel *= 3;
    setTimeout(() => {
      this.max_angle_change *= 2;
      this.vel /= 3;
    }, 500);
  }

  update() {
    if (!this.is_on_screen()) this.angle = this.get_normal_angle(); //this.angle += PI;

    this.noise_offset += 0.01;
    const angle_change = noise(this.noise_offset) * 2 - 1;
    this.angle += angle_change * this.max_angle_change;
    this.angle %= 2 * PI;

    this.pos[0] += cos(this.angle) * this.vel;
    this.pos[1] += sin(this.angle) * this.vel;

    this.hitbox.set_angle(this.angle);
  }

  show() {
    push();
    translate(...this.pos);
    if (this.angle > PI / 2 || this.angle < -PI / 2) {
      // rotate(-this.angle + (this.angle > PI / 2 ? PI / 2 : -PI / 2));
      rotate(PI + this.angle);
      scale(-1, 1);
    } else {
      rotate(this.angle);
    }
    image(this.image, -this.size[0] / 2, -this.size[1] / 2, ...this.size);
    pop();

    this.hitbox.show();
  }
}
