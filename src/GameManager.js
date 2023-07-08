class GameManager {
  static HOOK_COOLDOWN = 2000;

  constructor({
    images,
    end_game,
    day = 0,
    upgrades,
    fish_left = 3,
    dialogue
  }) {
    this.images = images;
    this.end_game = end_game;
    this.day = day;
    this.upgrades = upgrades;
    this.dialogue = dialogue;

    this.state = 'game';

    this.timer = new GameTimer(day, this.end_day.bind(this));
    this.qte = new QuickTimeEvent(1.4, PI / 8);
    this.npc_fish = [
      new NPCFish({
        pos: [200, 500],
        image: images['fish'],
        speed: day > 0 ? 2 : 1
      }),
      new NPCFish({
        pos: [600, 500],
        image: images['fish'],
        speed: day > 0 ? 2 : 1
      })
    ].slice(0, fish_left - 1);

    // // Add lots of ornamental background fish
    // for (let i = 0; i < 20; i++) {
    //   this.npc_fish.push(
    //     new NPCFish({
    //       pos: [random(0, 800), random(INVISIBLE_CEILING, 600)],
    //       image: images['fish'],
    //       angle: random(-PI, PI),
    //       in_background: true
    //     })
    //   );
    // }

    this.fish_warner = new FishWarner(this.npc_fish);
    this.player = new PlayerFish([400, 300], images['fish']);
    this.hook = new Hook([100, 100], images);
    this.score = new PlayerScore(images['star']);
    this.pause_modal = new PauseModal(this.score);

    // Flag for if hook failed to catch fish and then cant for a while
    this.hook_on_cooldown = false;

    this.timer.begin();
  }

  check_for_catches() {
    if (this.hook.hitbox.is_colliding(this.player.hitbox)) {
      return this.run_catch_event(this.player);
    }

    for (const fish of this.npc_fish) {
      if (!fish.in_background && this.hook.hitbox.is_colliding(fish.hitbox)) {
        return this.run_catch_event(fish);
      }
    }
  }

  end_day() {
    // Prepare game for fading out
    this.end_game({ fish_lost: false, score: this.score.score });
    this.state = 'day-ending';
  }

  async run_catch_event(fish) {
    this.state = 'quicktime';
    const result = await this.qte.trigger();

    if (result) {
      this.hook.has_worm = false;
      // Quicktime Success
      if (fish === this.player) this.score.add_score(50 * (result + 1));
      if (result === 2) {
        this.score.increase_combo();
        this.qte.scale_target_arc(pow(1 / this.score.combo, 1.5));
      } else {
        this.score.combo = 1;
        this.qte.reset_target_arc();
      }

      this.state = 'game';
      this.hook_on_cooldown = true;
      setTimeout(
        () => (this.hook_on_cooldown = false),
        GameManager.HOOK_COOLDOWN
      );
      return;
    }

    // Quicktime Failure
    this.state = 'losing-fish';

    if (fish !== this.player) {
      // Remove caught fish
      this.npc_fish = this.npc_fish.filter(f => f !== fish);

      // Create NPC fish stand in for player
      const npc_standin = new NPCFish({
        pos: [this.player.pos.x, this.player.pos.y],
        image: images['fish'],
        angle: this.player.angle
      });
      this.npc_fish.push(npc_standin);
    }

    await this.hook.run_catch_animation();
    this.end_game({ fish_lost: true, score: this.score.score });
  }

  handle_click() {
    if (this.state === 'game') this.fish_warner.handle_click();
    if (this.state === 'pause') this.pause_modal.handle_click();
  }

  handle_key_press() {
    if (this.state === 'pause') return this.pause_modal.handle_key_press();

    if (this.state === 'game' || this.state === 'quicktime') {
      const old_val = this.state;
      if (keyCode === 90) {
        this.pause_modal.open(() => (this.state = old_val));
        return (this.state = 'pause');
      }
    }

    if (this.state === 'quicktime') this.qte.handle_key_press();
  }

  show() {
    cursor();
    background(15, 94, 156);

    stroke(0);
    strokeWeight(1);
    line(0, INVISIBLE_CEILING, width, INVISIBLE_CEILING);

    this.npc_fish.filter(f => f.in_background).forEach(f => f.show());
    this.hook.show();
    this.npc_fish
      .filter(f => !f.in_background)
      .forEach(f => f.show(this.hook.pos));
    if (this.state !== 'losing-fish') this.player.show();
    this.score.show();
    this.timer.show();
    if (this.state !== 'losing-fish') this.fish_warner.show();
    if (this.state === 'quicktime' || this.state === 'pause') this.qte.show();
    if (this.state === 'pause') this.pause_modal.show();
  }

  update() {
    switch (this.state) {
      case 'game':
        this.hook.update();
        this.player.update();
        this.npc_fish.forEach(f => f.update(this.hook));
        this.timer.update();
        this.fish_warner.update();

        if (!this.hook_on_cooldown) this.check_for_catches();
        return;

      case 'day-ending':
        this.player.update();
      case 'losing-fish':
        this.hook.update();
        this.npc_fish.forEach(f => f.update(null));
        return;

      case 'quicktime':
        this.qte.update();
        return;

      case 'pause':
        this.pause_modal.update();
        return;
    }
  }
}
