class Sun {
  static CYCLE_TIME = 3; // seconds

  constructor() {
    this.progress = 0;
    this.active = true;

    this.bottom_y = height * 0.3;
    this.height = height * 0.15;
  }

  current_x() {
    return lerp(width * 0.1, width * 0.9, this.progress);
  }

  current_y() {
    const y = this.progress - pow(this.progress, 2);
    return this.bottom_y - this.height * y * 4;
  }

  begin() {
    this.active = true;
  }

  update() {
    if (!this.active) return;
    this.progress += 1 / (frameRate() || 60) / Sun.CYCLE_TIME;
    if (this.progress >= 1) {
      //   this.end_day();
      //   this.active = false;
      this.progress = 0;
    }
  }

  show() {
    fill('yellow');
    strokeWeight(0);
    circle(this.current_x(), this.current_y(), 40);
  }
}
