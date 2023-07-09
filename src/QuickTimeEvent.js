const exp_interp = (a, b, p) => pow(2, (p - a) / (b - a));

class QuickTimeEvent {
  static FADE_TIME = 0.2;

  constructor(time = 1, arc_size = PI / 15, critical_portion) {
    this.pos = [width / 2, height / 2];

    this.base_time = time;
    this.time = time;

    this.base_arc_size = arc_size;
    this.arc_size = arc_size;

    this.size = 150;
    this.total_arc_angles = [-PI / 2, (PI * 2) / 5];
    this.critical_portion = critical_portion;

    this.progression = 0;
    this.active = false;
    this.finished_callback = () => {};

    this.fading = false;
    this.fade_progression = 0;
    this.end_fade = () => {};
    this.stopping = false;
  }

  scale_target_arc(scale) {
    this.arc_size *= scale;
  }

  reset_target_arc() {
    this.arc_size = this.base_arc_size;
  }

  current_angle() {
    return lerp(...this.total_arc_angles, this.progression);
  }

  target_arc_angles() {
    const large_angle = this.total_arc_angles[1] - this.arc_size;
    return [large_angle - this.arc_size, large_angle];
  }

  combo_arc_angles() {
    const targ_angs = this.target_arc_angles();
    const diff = (this.arc_size * (1 - this.critical_portion)) / 2;
    return [targ_angs[0] + diff, targ_angs[1] - diff];
  }

  get opacity() {
    return lerp(255, 0, this.fade_progression);
  }

  get_current_rim_point() {
    const cur_ang = this.current_angle();
    return [
      this.pos[0] + this.size * cos(cur_ang),
      this.pos[1] + this.size * sin(cur_ang)
    ];
  }

  trigger() {
    this.fading = false;
    this.fade_progression = 0;
    this.active = true;
    this.time = this.base_time * random(0.8, 1.1);
    return new Promise(resolve => (this.finished_callback = resolve));
  }

  handle_key_press() {
    if (!this.active) return;
    if (keyCode === 32) this.stop();
  }

  async stop() {
    this.active = false;
    this.stopping = true;
    await timeout(200);
    this.stopping = false;
    this.fading = true;
    await new Promise(resolve => (this.end_fade = resolve));
    this.finished_callback(this.get_result());
    this.fading = false;
    this.fade_progression = 0;
    this.progression = 0;
  }

  get_result() {
    const cur_ang = this.current_angle();
    const targ_angs = this.target_arc_angles();
    const combo_angs = this.combo_arc_angles();

    const is_in_target = cur_ang > targ_angs[0] && cur_ang < targ_angs[1];
    if (!is_in_target) return 0;

    const is_in_combo_target =
      cur_ang > combo_angs[0] && cur_ang < combo_angs[1];
    return is_in_combo_target ? 2 : 1;
  }

  update() {
    if (this.active) {
      this.progression += 1 / this.time / frameRate();
      if (this.progression >= 1) this.stop();
    }

    if (this.fading) {
      this.fade_progression += 1 / QuickTimeEvent.FADE_TIME / frameRate();
      if (this.fade_progression >= 1) this.end_fade();
    }
  }

  show() {
    if (!this.active && !this.fading && !this.stopping) return;
    // Draw total arc
    fill(5, 80, 153, this.opacity);
    strokeWeight(0);
    arc(...this.pos, this.size * 2, this.size * 2, ...this.total_arc_angles);

    // Draw target arc
    fill(255, 141, 30, this.opacity);
    arc(...this.pos, this.size * 2, this.size * 2, ...this.target_arc_angles());

    // Draw combo target arc
    fill(255, 36, 0, this.opacity);
    arc(...this.pos, this.size * 2, this.size * 2, ...this.combo_arc_angles());

    // Draw progression line
    if (this.active || this.stopping) {
      stroke(255, this.opacity);
      strokeWeight(2);
      line(...this.pos, ...this.get_current_rim_point());
    }
  }
}
