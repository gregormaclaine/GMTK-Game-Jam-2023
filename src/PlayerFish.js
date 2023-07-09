class PlayerFish {
  constructor(
    start_pos,
    images,
    max_vel = 6,
    acceleration = 0.3,
    damping = 0.02
  ) {
    this.pos = createVector(...start_pos);

    this.vel = createVector(0, 0);
    this.max_vel = max_vel;
    this.acceleration = acceleration;
    this.damping = damping;

    this.sprite = new FishSprite({
      fish: 'muscle-crown-fish',
      pos: [this.pos.x, this.pos.y],
      angle: 0,
      images
    });
  }

  get hitbox() {
    return this.sprite.hitbox;
  }

  force_on_screen() {
    const size = this.sprite.size;
    if (this.pos.x + size[0] / 2 > width) {
      this.pos.x = width - size[0] / 2;
      this.vel.setMag(0.001);
    }

    if (this.pos.x - size[0] / 2 < 0) {
      this.pos.x = size[0] / 2;
      this.vel.setMag(0.001);
    }

    if (this.pos.y + size[1] / 2 > height) {
      this.pos.y = height - size[1] / 2;
      this.vel.setMag(0.001);
    }

    if (this.pos.y - size[1] / 2 < INVISIBLE_CEILING) {
      this.pos.y = INVISIBLE_CEILING + size[1] / 2;
      this.vel.setMag(0.001);
    }
  }

  handle_click() {
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
    const acc = createVector(
      (keyIsDown(68) - keyIsDown(65)) * this.acceleration,
      (keyIsDown(83) - keyIsDown(87)) * this.acceleration
    );

    if (acc.x === 0 && acc.y === 0) this.vel.mult(1 - this.damping);

    this.vel.add(acc);
    this.vel.limit(this.max_vel);
    this.pos.add(this.vel);
    this.force_on_screen();

    this.sprite.set([this.pos.x, this.pos.y], this.vel.heading());
  }

  show() {
    this.sprite.show();
  }
}
