class NPCFish {
  constructor({
    pos,
    images,
    angle = 0,
    in_background = false,
    smell_distance = 160,
    see_distance = 80,
    speed = 1,
    fish = 'fish'
  }) {
    this.pos = pos;
    this.images = images;
    this.in_background = in_background;

    this.sprite = new FishSprite({
      fish,
      pos,
      angle,
      images
    });

    this.angle = angle;
    this.vel = speed;
    this.noise_offset = random(0, 100);
    this.max_angle_change = PI / 100;

    // How far the fish will be when it begins to turn towards the hook
    this.smell_distance = smell_distance;
    this.see_distance = see_distance;
  }

  get hitbox() {
    return this.sprite.hitbox;
  }

  is_on_screen() {
    const size = this.sprite.size;
    if (this.pos[0] + size[0] / 2 > width) return false;
    if (this.pos[0] - size[0] / 2 < 0) return false;
    if (this.pos[1] + size[1] / 2 > height) return false;
    if (this.pos[1] - size[1] / 2 < INVISIBLE_CEILING) return false;
    return true;
  }

  get_normal_angle() {
    const size = this.sprite.size;
    if (this.pos[0] + size[0] / 2 > width) return -PI;
    if (this.pos[0] - size[0] / 2 < 0) return 0;
    if (this.pos[1] + size[1] / 2 > height) return -PI / 2;
    if (this.pos[1] - size[1] / 2 < INVISIBLE_CEILING) return PI / 2;
    return true;
  }

  flee_mouse() {
    if (this.in_background) return;

    const mouse = createVector(mouseX, mouseY);
    const fish = createVector(...this.pos);
    fish.sub(mouse);
    this.angle = fish.heading();

    this.is_fleeing = true;
    setTimeout(() => {
      this.is_fleeing = false;
    }, 500);
  }

  is_near_hook(hook_pos, max_dist = 0) {
    max_dist ||= this.smell_distance;
    const dist = sqrt(
      pow(this.pos[0] - hook_pos[0], 2) + pow(this.pos[1] - hook_pos[1], 2)
    );
    return max_dist > dist;
  }

  angle_change_if_near_hook(hook_pos, mode) {
    const hook = createVector(...hook_pos);
    hook.sub(createVector(...this.pos));
    if (mode === 'away') hook.mult(-1);
    const dir = p5.Vector.fromAngle(this.angle);

    angleMode(RADIANS);
    const angle_diff = dir.angleBetween(hook);
    if (angle_diff > 0) {
      return Math.min(angle_diff, this.max_angle_change);
    } else {
      return Math.max(angle_diff, -this.max_angle_change);
    }
  }

  update(hook) {
    if (!this.is_on_screen()) this.angle = this.get_normal_angle(); //this.angle += PI;

    if (hook && this.is_near_hook(hook.pos)) {
      if (hook.has_worm) {
        this.angle += this.angle_change_if_near_hook(hook.pos, 'towards');
      } else if (this.is_near_hook(hook.pos, this.see_distance)) {
        this.angle += this.angle_change_if_near_hook(hook.pos, 'away');
      }
    } else {
      this.noise_offset += 0.01;
      const angle_change = noise(this.noise_offset) * 2 - 1;
      this.angle +=
        (angle_change * this.max_angle_change) / (this.is_fleeing ? 2 : 1);
    }

    this.angle %= 2 * PI;

    this.pos[0] += cos(this.angle) * this.vel * (this.is_fleeing ? 3 : 1);
    this.pos[1] += sin(this.angle) * this.vel * (this.is_fleeing ? 3 : 1);

    this.sprite.set(this.pos, this.angle);
  }

  show(hook_pos) {
    tint(255, this.in_background ? 120 : 255);
    this.sprite.show();
    noTint();

    // if (!this.in_background && this.is_near_hook(hook_pos)) {
    //   stroke('lime');
    //   strokeWeight(1);
    //   line(...this.pos, ...hook_pos);
    // }

    this.hitbox.show();
  }
}
