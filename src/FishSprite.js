class FishSprite {
  static WIDTH = 80;

  // Hardcoded values
  static FISH_OFFSETS = {
    fish: 0,
    'crown-fish': 3,
    'brain-fish': 0,
    'brain-crown-fish': 3,
    'rocket-fish': 2,
    'rocket-crown-fish': 3,
    'rocket-brain-fish': 2,
    'rocket-brain-crown-fish': 3,

    'muscle-fish': 0,
    'muscle-crown-fish': 6,
    'eyes-fish': 1
  };

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

    this.hitbox = new HitBox(
      [this.pos[0], this.pos[1] + this.y_offset()],
      this.size
    );
  }

  y_offset() {
    return FishSprite.FISH_OFFSETS[this.fish] || 0;
  }

  set(pos, angle) {
    this.pos = pos;
    this.angle = angle;

    const v = createVector(...pos);
    const is_flipped = this.angle > PI / 2 || this.angle < -PI / 2;
    const offset = p5.Vector.fromAngle(
      angle + (PI / 2) * (is_flipped ? -1 : 1)
    );
    offset.setMag(this.y_offset());
    v.add(offset);

    this.hitbox.set_pos([v.x, v.y]);
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

    imageMode(CENTER);
    image(this.image, 0, 0, ...this.true_size);
    pop();

    this.hitbox.show();
  }
}
