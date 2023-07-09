class GameTimer {
  static DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  static DAY_LENGTH = 60; // Seconds
  static START_HOUR = 5;
  static END_HOUR = 20;

  constructor(day, end_day) {
    this.day = day;
    this.end_day = end_day;

    this.progress = 0;
    this.active = false;
  }

  current_hour() {
    return Math.floor(
      lerp(GameTimer.START_HOUR, GameTimer.END_HOUR, this.progress)
    );
  }

  begin() {
    this.active = true;
  }

  update() {
    if (!this.active) return;

    this.progress += 1 / (frameRate() || 60) / GameTimer.DAY_LENGTH;
    if (this.progress >= 1) {
      this.end_day();
      this.active = false;
    }
  }

  show() {
    stroke(0);
    strokeWeight(1);
    fill(0);
    textSize(25);
    textAlign(RIGHT, CENTER);
    const hour = this.current_hour();
    const t = `${GameTimer.DAYS[this.day]} ${hour > 12 ? hour - 12 : hour}${
      hour >= 12 ? 'PM' : 'AM'
    }`;
    text(t, 770, 30);
  }
}
