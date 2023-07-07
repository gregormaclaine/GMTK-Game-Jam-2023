class GameManager {
  static HOOK_COOLDOWN = 2000;

  constructor(images) {
    this.images = images;

    this.state = 'game';

    this.qte = new QuickTimeEvent(4, PI / 4);
    this.npc_fish = [
      new NPCFish([200, 500], images['fish']),
      new NPCFish([600, 400], images['fish'])
    ];
    this.player = new PlayerFish([400, 300], images['fish']);
    this.hook = new Hook([100, 100], images['hook'], images['fish']);
    this.score = new PlayerScore();

    // Flag for if hook failed to catch fish and then cant for a while
    this.hook_on_cooldown = false;
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

  async run_catch_event(fish) {
    this.state = 'quicktime';
    const result = await this.qte.trigger();

    if (result) {
      // Quicktime Success
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
    console.log('fade out');
  }

  handle_click() {
    if (this.state === 'game') this.npc_fish.forEach(f => f.handle_click());
  }

  handle_key_press() {
    if (this.state === 'quicktime') this.qte.handle_key_press();
  }

  show() {
    cursor();
    background(240);

    switch (this.state) {
      case 'game':
      case 'quicktime':
        this.hook.show();
        this.npc_fish.forEach(f => f.show());
        this.player.show();
        this.score.show();
        if (this.state === 'quicktime') this.qte.show();
        return;

      case 'losing-fish':
        this.hook.show();
        this.npc_fish.forEach(f => f.show());
        this.score.show();
        return;
    }
  }

  update() {
    switch (this.state) {
      case 'game':
        this.hook.update();
        this.player.update();
        this.npc_fish.forEach(f => f.update());

        if (!this.hook_on_cooldown) this.check_for_catches();
        return;

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