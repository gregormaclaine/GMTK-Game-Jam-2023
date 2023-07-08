class Hook {
  static BASE_REEL_IN_SPEED = 2;

  constructor({ pos, images, speed }) {
    this.pos = pos;

    this.image = images['hook'];
    this.image.resize(30, 0);
    this.size = [this.image.width, this.image.height];

    this.fish_sprite = images['fish'];
    this.fish_sprite.resize(80, 0);
    this.fish_size = [this.fish_sprite.width, this.fish_sprite.height];

    this.worm_sprite = images['worm'];
    this.worm_sprite.resize(40, 0);
    this.worm_size = [this.worm_sprite.width, this.worm_sprite.height];

    this.angle = PI / 4;
    this.vel = speed;
    this.noise_offset = random(0, 100);
    this.max_angle_change = PI / 80;

    this.hitbox = new HitBox(this.pos, this.size);

    this.has_worm = true;

    // Flag for when the hook has successfully caught a fish
    this.hooked_fish = false;
    this.finish_reel_in = () => {};

    this.reload_status = null;
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

  async run_catch_animation() {
    this.hooked_fish = true;
    await new Promise(resolve => (this.finish_reel_in = resolve));
  }

  async reload_bait() {
    this.reload_status = 'waiting';
    await timeout(random(3000, 5000));
    this.reload_status = 'up';
    await new Promise(resolve => (this.finish_reel_in = resolve));
    this.has_worm = true;
    this.reload_status = 'down';
    await new Promise(resolve => (this.finish_reel_in = resolve));
    this.reload_status = null;
  }

  get_hook_reel_speed() {
    return lerp(
      Hook.BASE_REEL_IN_SPEED,
      Hook.BASE_REEL_IN_SPEED * 5,
      this.pos[1] / height
    );
  }

  update() {
    if (this.hooked_fish || this.reload_status === 'up') {
      this.pos[1] -= this.get_hook_reel_speed();
      if (this.pos[1] < -this.size[1]) this.finish_reel_in();
      return;
    }

    if (this.reload_status === 'down') {
      this.pos[1] += this.get_hook_reel_speed();
      if (this.pos[1] > INVISIBLE_CEILING + this.size[1]) this.finish_reel_in();
      return;
    }

    if (!this.is_on_screen()) this.angle = this.get_normal_angle(); //this.angle += PI;

    this.noise_offset += 0.01;
    const angle_change = noise(this.noise_offset) * 2 - 1;
    this.angle += angle_change * this.max_angle_change;
    this.angle %= 2 * PI;

    this.pos[0] += cos(this.angle) * this.vel;
    this.pos[1] += sin(this.angle) * this.vel;

    if (!this.has_worm && !this.reload_status) this.reload_bait();
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
    line(this.pos[0], -5, this.pos[0], this.pos[1] - this.size[1] / 2.5);

    if (this.hooked_fish) {
      image(
        this.fish_sprite,
        this.pos[0] - this.fish_size[0] / 2,
        this.pos[1] - this.fish_size[1] / 6,
        ...this.fish_size
      );
    } else if (this.has_worm) {
      push();
      translate(
        this.pos[0] - this.worm_size[0] / 2 + 10,
        this.pos[1] - this.worm_size[1] / 6
      );
      rotate(PI / 10);
      image(this.worm_sprite, 0, 0, ...this.worm_size);
      pop();
    }

    this.hitbox.show();
  }
}
