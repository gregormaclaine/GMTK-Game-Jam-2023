class NPCFish {
  constructor({
    pos,
    image,
    angle = 0,
    in_background = false,
    smell_distance = 160,
    see_distance = 80
  }) {
    this.pos = pos;
    this.in_background = in_background;

    this.image = image;
    this.image.resize(in_background ? 40 : 80, 0);
    this.size = [this.image.width, this.image.height];

    this.angle = angle;
    this.vel = 1;
    this.noise_offset = random(0, 100);
    this.max_angle_change = PI / 100;

    this.hitbox = new HitBox(pos, this.size);

    // How far the fish will be when it begins to turn towards the hook
    this.smell_distance = smell_distance;
    this.see_distance = see_distance;
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

    this.hitbox.set_angle(this.angle);
  }

  show(hook_pos) {
    push();
    translate(...this.pos);
    if (this.angle > PI / 2 || this.angle < -PI / 2) {
      // rotate(-this.angle + (this.angle > PI / 2 ? PI / 2 : -PI / 2));
      rotate(PI + this.angle);
      scale(-1, 1);
    } else {
      rotate(this.angle);
    }
    tint(255, this.in_background ? 120 : 255);
    image(this.image, -this.size[0] / 2, -this.size[1] / 2, ...this.size);
    pop();

    // if (!this.in_background && this.is_near_hook(hook_pos)) {
    //   stroke('lime');
    //   strokeWeight(1);
    //   line(...this.pos, ...hook_pos);
    // }

    this.hitbox.show();
  }
}
