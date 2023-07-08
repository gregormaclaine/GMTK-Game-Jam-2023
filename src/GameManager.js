class GameManager {
  static HOOK_COOLDOWN = 2000;

  constructor(images, end_game, day = 0) {
    this.images = images;
    this.end_game = end_game;

    this.state = 'game';

    this.timer = new GameTimer(day, this.end_day.bind(this));
    this.qte = new QuickTimeEvent(4, PI / 4);
    this.npc_fish = [
      new NPCFish([200, 500], images['fish']),
      new NPCFish([600, 400], images['fish'])
    ];
    this.fish_warner = new FishWarner(this.npc_fish);
    this.player = new PlayerFish([400, 300], images['fish']);
    this.hook = new Hook([100, 100], images);
    this.score = new PlayerScore(images['star']);

    // Flag for if hook failed to catch fish and then cant for a while
    this.hook_on_cooldown = false;

    this.timer.begin();
  }

  check_for_catches() {
    if (this.hook.hitbox.is_colliding(this.player.hitbox)) {
      return this.run_catch_event(this.player);
    }

    for (const fish of this.npc_fish) {
      if (this.hook.hitbox.is_colliding(fish.hitbox)) {
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
      // Quicktime Success
      if (result === 2) this.score.increase_combo();
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
      const npc_standin = new NPCFish(
        [this.player.pos.x, this.player.pos.y],
        images['fish'],
        this.player.angle
      );
      this.npc_fish.push(npc_standin);
    }

    await this.hook.run_catch_animation();
    this.end_game({ fish_lost: true, score: this.score.score });
  }

  handle_click() {
    if (this.state === 'game') this.fish_warner.handle_click();
  }

  handle_key_press() {
    if (this.state === 'quicktime') this.qte.handle_key_press();
  }

  show() {
    cursor();
    background(240);

    stroke(0);
    strokeWeight(1);
    line(0, INVISIBLE_CEILING, width, INVISIBLE_CEILING);

    switch (this.state) {
      case 'game':
      case 'quicktime':
      case 'day-ending':
        this.hook.show();
        this.npc_fish.forEach(f => f.show());
        this.player.show();
        this.score.show();
        this.timer.show();
        this.fish_warner.show();
        if (this.state === 'quicktime') this.qte.show();
        return;

      case 'losing-fish':
        this.hook.show();
        this.npc_fish.forEach(f => f.show());
        this.score.show();
        this.timer.show();
        return;
    }
  }

  update() {
    switch (this.state) {
      case 'game':
        this.hook.update();
        this.player.update();
        this.npc_fish.forEach(f => f.update());
        this.timer.update();
        this.fish_warner.update();

        if (!this.hook_on_cooldown) this.check_for_catches();
        return;

      case 'day-ending':
        this.player.update();
      case 'losing-fish':
        this.hook.update();
        this.npc_fish.forEach(f => f.update());
        return;

      case 'quicktime':
        this.qte.update();
        return;
    }
  }
}
