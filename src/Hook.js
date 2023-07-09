class Hook {
  static BASE_REEL_IN_SPEED = 2;
  static FADE_TIME = 0.3;

  constructor({
    pos,
    images,
    audio,
    speed,
    fail_chance,
    wings_effect,
    invis_dur = 0, // seconds,
    is_ended
  }) {
    this.pos = pos;
    this.images = images;
    this.audio = audio;
    this.wings_effect = wings_effect;
    this.is_ended = is_ended;

    this.invis_dur = invis_dur;
    this.invisible = false;
    this.fade_mode = null;
    this.fade_progress = 0;
    this.fade_completed = () => {};
    this.make_visible = () => {};

    this.fail_chance = fail_chance;
    this.tried_to_fail = false;
    this.reel_in_from_y = 0;

    this.image = images['hook'];
    this.image.resize(30, 0);
    this.size = [this.image.width, this.image.height];

    this.fish_sprite = null;

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
    this.finish_reload = () => {};

    this.reload_status = null;

    this.updates_till_invis =
      invis_dur > 0 ? floor(random(2, 6) * (frameRate() || 60)) : -1;
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

  async run_catch_animation(fish_type) {
    this.reel_in_from_y = this.pos[1];
    this.tried_to_fail = false;
    this.hooked_fish = true;
    this.fish_sprite = new FishSprite({
      fish: fish_type,
      pos: this.pos,
      angle: 0,
      images: this.images
    });
    return await new Promise(resolve => (this.finish_reel_in = resolve));
  }

  async go_invisible() {
    if (this.hooked_fish) {
      this.updates_till_invis = floor(2 * frameRate());
    } else {
      await this.fade('out');
      this.invisible = true;
      setTimeout(
        () => this.make_visible(),
        this.invis_dur * 1000 - 2 * Hook.FADE_TIME * 1000
      );
      const forced = await new Promise(
        resolve => (this.make_visible = resolve)
      );
      this.invisible = false;
      if (!forced) await this.fade('in');
      this.updates_till_invis = floor(random(5, 20) * frameRate());
    }
  }

  async fade(mode) {
    this.fade_mode = mode;
    this.fade_progress = mode === 'in' ? 0 : 1;
    await new Promise(resolve => (this.fade_completed = resolve));
    this.fade_mode = null;
  }

  async reload_bait(wait = true) {
    if (wait) {
      this.reload_status = 'waiting';
      await timeout(random(3000, 5000));
    }
    this.reload_status = 'up';
    await new Promise(resolve => (this.finish_reload = resolve));
    this.has_worm = true;
    this.reload_status = 'down';
    await new Promise(resolve => (this.finish_reload = resolve));
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
    if (--this.updates_till_invis === 0) this.go_invisible();

    if (this.fade_mode) {
      this.fade_progress +=
        (1 / (frameRate() || 60) / Hook.FADE_TIME) *
        (this.fade_mode === 'in' ? 1 : -1);
      if (this.fade_progress < 0 || this.fade_progress > 1) {
        this.fade_progress = round(this.fade_progress);
        this.fade_completed();
      }
    }

    if (this.hooked_fish) {
      const fish_pos = [
        this.pos[0],
        this.pos[1] + this.fish_sprite.true_size[1] / 6
      ];
      this.fish_sprite.set(fish_pos, 0);
    }

    if (this.hooked_fish || this.reload_status === 'up') {
      this.pos[1] -= this.get_hook_reel_speed();

      if (
        !this.tried_to_fail &&
        max(this.reel_in_from_y, 105 + INVISIBLE_CEILING) - this.pos[1] > 100
      ) {
        if (random() < this.fail_chance) {
          this.hooked_fish = false;
          this.finish_reel_in(true);
          this.reload_bait(false);
          this.wings_effect.trigger(this.pos);
          this.audio.play_sound('angel.wav');
        }
        this.tried_to_fail = true;
      }

      if (this.pos[1] < -this.size[1]) {
        if (this.hooked_fish) {
          this.finish_reel_in();
        } else {
          this.finish_reload();
        }
      }
      return;
    }

    if (this.reload_status === 'down') {
      this.pos[1] += this.get_hook_reel_speed();
      if (this.pos[1] > INVISIBLE_CEILING + this.size[1]) this.finish_reload();
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
    if (this.invisible) return this.hitbox.show();

    if (this.fade_mode) tint(255, this.fade_progress * 255);
    imageMode(CORNER);
    image(
      this.image,
      this.pos[0] - this.size[0] / 2,
      this.pos[1] - this.size[1] / 2,
      ...this.size
    );
    noTint();

    strokeWeight(3);
    stroke(100, this.fade_mode ? this.fade_progress * 255 : 255);
    line(this.pos[0], -5, this.pos[0], this.pos[1] - this.size[1] / 2.5);

    if (this.hooked_fish) {
      this.fish_sprite.show();
    } else if (this.has_worm) {
      push();
      if (this.fade_mode) tint(255, this.fade_progress * 255);
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
