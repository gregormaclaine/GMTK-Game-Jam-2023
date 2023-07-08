class FishSprite {
  static WIDTH = 80;

  constructor({ fish, pos, angle, images }) {
    this.fish = fish;
    this.pos = pos;
    this.angle = angle;
    this.images = images;

    this.body_image = images['fish'];
    this.body_image.resize(FishSprite.WIDTH, 0);
    this.size = [this.body_image.width, this.body_image.height];

    this.image = images[fish];
    this.image.resize(FishSprite.WIDTH, 0);
    this.true_size = [this.image.width, this.image.height];

    this.hitbox = new HitBox([this.pos[0], this.pos[1]], this.size);
  }

  set(pos, angle) {
    this.pos = pos;
    this.angle = angle;

    this.hitbox.set_pos(pos);
    this.hitbox.set_angle(angle);
  }

  show() {
    push();
    translate(this.pos[0], this.pos[1]);
    if (this.angle > PI / 2 || this.angle < -PI / 2) {
      rotate(PI + this.angle);
      scale(-1, 1);
    } else {
      rotate(this.angle);
    }

    image(this.image, -this.size[0] / 2, -this.size[1] / 2, ...this.true_size);
    pop();

    this.hitbox.show();
  }
}
