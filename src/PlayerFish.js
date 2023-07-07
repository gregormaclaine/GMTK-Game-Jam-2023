class PlayerFish {
  constructor(start_pos, image) {
    this.pos = createVector(...start_pos);

    this.image = image;
    this.image.resize(80, 0);
    this.size = [this.image.width, this.image.height];

    this.vel = createVector(0, 0);
    this.max_vel = 6;
    this.acceleration = 0.3;
    this.damping = 0.02;

    this.hitbox = new HitBox([this.pos.x, this.pos.y], this.size);
  }

  force_on_screen() {
    if (this.pos.x + this.size[0] / 2 > width) {
      this.pos.x = width - this.size[0] / 2;
      this.vel.x = 0;
    }

    if (this.pos.x - this.size[0] / 2 < 0) {
      this.pos.x = this.size[0] / 2;
      this.vel.x = 0;
    }

    if (this.pos.y + this.size[1] / 2 > height) {
      this.pos.y = height - this.size[1] / 2;
      this.vel.y = 0;
    }

    if (this.pos.y - this.size[1] / 2 < 0) {
      this.pos.y = this.size[1] / 2;
      this.vel.y = 0;
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

    this.hitbox.set_angle(this.vel.heading());
    this.hitbox.set_pos([this.pos.x, this.pos.y]);
  }

  show() {
    // stroke(0);
    // strokeWeight(1);
    // fill('orange');
    // circle(this.pos.x, this.pos.y, this.size[0]);

    push();
    translate(this.pos.x, this.pos.y);
    const angle = this.vel.heading();
    if (angle > PI / 2 || angle < -PI / 2) {
      rotate(PI + angle);
      scale(-1, 1);
    } else {
      rotate(angle);
    }
    image(this.image, -this.size[0] / 2, -this.size[1] / 2, ...this.size);
    pop();

    this.hitbox.show();

    this.update();
  }
}
