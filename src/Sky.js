class Sky {
  static CYCLE_TIME = 61; // seconds
  // static SKY_COLORS = [
  //   '#f69700',
  //   '#f6ca00',
  //   '#F3C868',
  //   '#AFCEC3',
  //   '#94d4fa',
  //   '#8AD9EB',
  //   '#6dafea',
  //   '#566cc0',
  //   '#fc8629',
  //   '#f8651e'
  // ];

  static SKY_COLORS = [
    '#AFCEC3',
    '#8AD9EB',
    '#94d4fa',
    '#94d4fa',
    '#94d4fa',
    '#6dafea',
    '#566cc0',
    '#AB7A7C'
  ];

  constructor(image) {
    this.image = image;
    this.progress = 0;
    this.active = true;

    this.sky_height = INVISIBLE_CEILING;
    this.bottom_y = height * 0.3;
    this.height = height * 0.15;
  }

  current_x() {
    return lerp(width * 0.1, width * 0.9, this.progress);
  }

  current_y() {
    const y = this.progress - pow(this.progress, 2);
    return this.bottom_y - this.height * y * 7;
  }

  sky_color(progress) {
    progress = progress || this.progress;

    if (progress === 1) return color(Sky.SKY_COLORS.at(-1));

    const between_space = 1 / (Sky.SKY_COLORS.length - 1);
    const index = floor(progress / between_space);
    const [c1, c2] = Sky.SKY_COLORS.slice(index, index + 2);
    // colorMode(HSB);
    const c = lerpColor(
      color(c1),
      color(c2),
      (progress % between_space) * Sky.SKY_COLORS.length
    );
    colorMode(RGB);
    return c;
  }

  begin() {
    this.active = true;
  }

  update() {
    if (!this.active) return;
    this.progress += 1 / (frameRate() || 60) / Sky.CYCLE_TIME;
    if (this.progress >= 1) {
      //   this.end_day();
      //   this.active = false;
      this.progress = 0;
    }
  }

  show() {
    // fill('yellow');
    // strokeWeight(0);
    // circle(this.current_x(), this.current_y(), 40);

    rectMode(CORNER);
    fill(this.sky_color());
    strokeWeight(0);
    rect(0, 0, width, this.sky_height);

    imageMode(CENTER);
    image(this.image, this.current_x(), this.current_y(), 80, 80);
  }

  show_sky_gradient() {
    rectMode(CORNER);
    strokeWeight(0);
    const w = width / 100;
    for (let i = 1; i <= 100; i++) {
      fill(this.sky_color(i / 100));
      rect(w * i, 0, w, this.sky_height);
    }
  }
}
