class GameManager {
  static HOOK_COOLDOWN = 2000;

  constructor({
    images,
    end_game,
    day = 0,
    difficulty = 0,
    upgrades,
    fish_left = 3,
    dialogue,
    has_ab
  }) {
    this.images = images;
    this.end_game = end_game;
    this.day = day;
    this.difficulty = difficulty;
    this.upgrades = upgrades;
    this.dialogue = dialogue;
    this.has_ab = has_ab;

    this.state = 'game';

    this.timer = new GameTimer(day, this.end_day.bind(this));

    this.qte = new QuickTimeEvent(
      1.4 - (has_ab('reaction-1') ? difficulty - 1 : difficulty) * 0.15,
      PI / 8,
      has_ab('reaction-2') ? 3 / 5 : 1 / 3
    );

    this.npc_fish = [
      new NPCFish({
        pos: [200, 500],
        images,
        speed: difficulty > 0 ? 2 : 1,
        see_distance: has_ab('vision-1') ? 160 : 80,
        smell_distance: has_ab('vision-2') ? 80 : 160,
        fish: has_ab('vision-1') ? 'eyes-fish' : 'fish'
      }),
      new NPCFish({
        pos: [600, 500],
        images,
        speed: difficulty > 0 ? 2 : 1,
        see_distance: has_ab('vision-1') ? 160 : 80,
        smell_distance: has_ab('vision-2') ? 80 : 160,
        fish: has_ab('vision-1') ? 'eyes-fish' : 'fish'
      })
    ].slice(0, fish_left - 1);

    // // Add lots of ornamental background fish
    // for (let i = 0; i < 20; i++) {
    //   this.npc_fish.push(
    //     new NPCFish({
    //       pos: [random(0, 800), random(INVISIBLE_CEILING, 600)],
    //       images,
    //       angle: random(-PI, PI),
    //       in_background: true
    //     })
    //   );
    // }

    this.fish_warner = new FishWarner(
      this.npc_fish,
      has_ab('cooldown-1') ? 4 : 6,
      has_ab('cooldown-1') ? 'orange' : 'green'
    );

    this.player = new PlayerFish({
      start_pos: [400, 300],
      images,
      max_vel: has_ab('agility-1') ? 9 : 6,
      acceleration: has_ab('agility-1') ? 0.6 : 0.3,
      damping: has_ab('agility-2') ? 0.1 : 0.02,
      fish: this.get_player_fish()
    });

    this.star_effect = new ParticleEffect(images['star'], 100, 90, 1);
    this.wings_effect = new ParticleEffect(images['wings'], 50, 30, 1);

    this.hook = new Hook({
      pos: [100, 100],
      images,
      speed: difficulty > 0 ? 3 : 1.5,
      fail_chance: has_ab('luck-3') ? 0.5 : 0,
      wings_effect: this.wings_effect,
      invis_dur: difficulty < 3 ? 0 : difficulty === 3 ? 2 : 3,
      is_ended: () => this.ended
    });

    this.score = new PlayerScore(
      images['star'],
      has_ab('luck-1') ? 0.4 : 0,
      has_ab('luck-2') ? 0.1 : 0
    );
    this.pause_modal = new PauseModal(this.score);

    // Flag for if hook failed to catch fish and then cant for a while
    this.hook_on_cooldown = false;

    this.timer.begin();
  }

  get_player_fish() {
    const combo =
      '0' +
      (this.has_ab('agility-1') ? '1' : '0') +
      (this.has_ab('reaction-1') ? '1' : '0') +
      (this.has_ab('luck-1') ? '1' : '0');

    return (
      {
        '0000': 'fish',
        '0001': 'crown-fish',
        '0010': 'brain-fish',
        '0011': 'brain-crown-fish',
        '0100': 'rocket-fish',
        '0101': 'rocket-crown-fish',
        '0110': 'rocket-brain-fish',
        '0111': 'rocket-brain-crown-fish'
      }[combo] || 'fish'
    );
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
    this.ended = true;
    this.state = 'day-ending';
  }

  async run_catch_event(fish) {
    this.hook.make_visible(true);
    this.state = 'quicktime';
    const result = await this.qte.trigger();

    if (result) {
      this.hook.has_worm = false;
      // Quicktime Success
      if (fish === this.player) this.score.add_score(50 * (result + 1));
      if (result === 2) {
        this.score.increase_combo();
        this.star_effect.trigger(
          fish === this.player
            ? [this.player.pos.x, this.player.pos.y]
            : fish.pos
        );
        this.qte.scale_target_arc(
          pow(1 / ((this.score.combo - 1) / 5 + 1), 1.5)
        );
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
        images: this.images,
        angle: this.player.angle,
        fish: this.player.sprite.fish
      });
      this.npc_fish.push(npc_standin);
    }

    const failed = await this.hook.run_catch_animation(
      fish === this.player ? this.player.sprite.fish : 'fish'
    );

    if (failed) {
      this.state = 'game';
      this.hook_on_cooldown = true;
      setTimeout(
        () => (this.hook_on_cooldown = false),
        GameManager.HOOK_COOLDOWN
      );
      if (fish === this.player) {
        this.player.pos.x = this.hook.pos[0];
        this.player.pos.y = this.hook.pos[1];
      } else {
        this.npc_fish[this.npc_fish.length - 1] = fish;
        fish.pos = [...this.hook.pos];
      }
    } else {
      this.ended = true;
      this.end_game({ fish_lost: true, score: this.score.score });
    }
  }

  handle_click() {
    if (this.state === 'game') this.fish_warner.handle_click();
    if (this.state === 'pause') this.pause_modal.handle_click();
  }

  handle_key_press() {
    if (this.state === 'pause') return this.pause_modal.handle_key_press();

    if (['game', 'quicktime', 'losing-fish'].includes(this.state)) {
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
    this.star_effect.show();
    this.wings_effect.show(true, false, 'grow');
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
        this.star_effect.update();
        this.wings_effect.update();

        if (!this.hook_on_cooldown) this.check_for_catches();
        return;

      case 'day-ending':
        this.player.update();
      case 'losing-fish':
        this.hook.update();
        this.npc_fish.forEach(f => f.update(null));
        this.star_effect.update();
        this.wings_effect.update();
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
