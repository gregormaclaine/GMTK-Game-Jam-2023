class ShopScreen {
  constructor(images, start_next_day) {
    this.images = images;
    this.start_next_day = start_next_day;

    this.unlocked_upgrades = {
      'agility-1': false, // Player can accelerate faster
      'agility-2': false, // Player can decelerate faster
      'reaction-1': false, // Quicktimes are slower
      'reaction-2': false, // Quicktime criticals are slightly larger
      'luck-1': false, // Chance for double points
      'luck-2': false, // Chance for triple points in combo
      'luck-3': false, // Chance for any caught fish to be let off the hook
      'vision-1': false, // Fish can see an empty hook from farther away
      'vision-2': false // Fish have worse smell
    };

    // prettier-ignore
    this.shop_items = [
      new ShopItem({ pos: [250, 125], shop: this, ability: 'agility-1',  side: 'right', name: 'Rocket Booster', desc: 'Attach rockets to increase acceleration' }),
      new ShopItem({ pos: [100, 125], shop: this, ability: 'agility-2',  side: 'right', name: '', desc: '' }),
      new ShopItem({ pos: [550, 125], shop: this, ability: 'reaction-1', side: 'left',  name: '', desc: '' }),
      new ShopItem({ pos: [700, 125], shop: this, ability: 'reaction-2', side: 'left',  name: '', desc: '' }),
      new ShopItem({ pos: [250, 475], shop: this, ability: 'luck-1',     side: 'right', name: '', desc: '' }),
      new ShopItem({ pos: [100, 400], shop: this, ability: 'luck-2',     side: 'right', name: '', desc: '' }),
      new ShopItem({ pos: [100, 550], shop: this, ability: 'luck-3',     side: 'right', name: '', desc: '' }),
      new ShopItem({ pos: [550, 475], shop: this, ability: 'vision-1',   side: 'left',  name: 'Bigger Eyes', desc: 'Other fish can more easily see the fishing hook' }),
      new ShopItem({ pos: [700, 475], shop: this, ability: 'vision-2',   side: 'left',  name: '', desc: '' }),
    ];

    this.continue = new JL.Button(
      'Continue',
      [width * 0.85, height * 0.9, 200, 100],
      this.close.bind(this)
    );

    this.open_item = null;
  }

  is_available(ability) {
    // temp:
    return true;
  }

  unlock(ability) {
    // temp:
    this.unlocked_upgrades[ability] = true;
  }

  handle_click() {
    this.shop_items.forEach(i => i.handle_click());
    // this.continue.handle_click();
  }

  open(fish_lost) {
    this.images['spinning-fish'].fade_in([width * 0.5, height * 0.5]);
  }

  close() {
    this.images['spinning-fish'].fade_out();
    this.start_next_day();
  }

  show() {
    background(200);
    image(this.images['underwater_bg'], 400, 300, 800, 600);

    textAlign(CENTER, CENTER);
    fill(255);
    strokeWeight(0);
    textSize(28);
    text('Upgrade available', width * 0.5, height * 0.05);

    fill(255, 255, 255, 70);
    strokeWeight(0);
    textSize(120);
    text('SKILL STORE', width * 0.5, height * 0.5);

    // Draw lines to all the buttons
    strokeWeight(5);
    stroke(255);
    line(125, 125, 225, 125);
    line(575, 125, 675, 125);
    line(575, 475, 675, 475);

    line(225, 475, 100, 360);
    line(225, 475, 100, 575);

    line(400, 300, 225, 125);
    line(400, 300, 575, 125);
    line(400, 300, 575, 475);
    line(400, 300, 225, 475);

    this.shop_items.forEach(i => i.show());

    if (this.open_item) {
      this.open_item.dialogue.show();
      const hovered =
        this.open_item.contains_mouse() ||
        this.open_item.dialogue.contains_mouse();
      this.open_item.hovered = hovered;
      if (!hovered) this.open_item = null;
    } else {
      this.shop_items.some(i => {
        if (i.contains_mouse()) {
          this.open_item = i;
          i.hovered = true;
          return true;
        }
      });
    }

    // this.continue.show();
  }

  update() {
    this.images['spinning-fish'].update();
  }
}
