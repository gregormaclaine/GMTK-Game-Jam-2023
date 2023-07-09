class FishWarner {
  constructor(npc_fish, cooldown) {
    this.npc_fish = npc_fish;
    this.cooldown = cooldown; // Seconds

    this.pos = [width - 60 - 20, height - 10 - 20];
    this.size = [60, 10];

    this.cooling_down = false;
    this.cooldown_progress = 0;
  }

  handle_click() {
    if (this.cooling_down) return;
    this.npc_fish.forEach(f => f.flee_mouse());
    this.cooling_down = true;
    this.cooldown_progress = 0;
  }

  update() {
    if (this.cooling_down) {
      this.cooldown_progress += 1 / frameRate() / this.cooldown;
      if (this.cooldown_progress >= 1) this.cooling_down = false;
    }
  }

  show() {
    if (!this.cooling_down) return;

    rectMode(CORNER);
    stroke(0);
    strokeWeight(1);
    fill(200);
    rect(...this.pos, ...this.size);

    fill('green');
    const w = lerp(0, this.size[0], this.cooldown_progress);
    rect(...this.pos, w, this.size[1]);
  }
}
