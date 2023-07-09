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
      'vision-2': false, // Fish have worse smell,
      'cooldown-1': false // Shorter scream cooldown
    };

    // prettier-ignore
    this.shop_items = [
      new ShopItem({ pos: [250, 150], shop: this, ability: 'agility-1',  side: 'right', name: 'Rocket Fish', desc: 'Attach rockets to increase acceleration' }),
      new ShopItem({ pos: [100, 150], shop: this, ability: 'agility-2',  side: 'right', name: 'Mega Fin', desc: 'Buff up your fins to improve decceleration' }),
      new ShopItem({ pos: [550, 150], shop: this, ability: 'reaction-1', side: 'left',  name: 'Ultra Instinct', desc: 'Max out your fish neurones to slow down quicktimes' }),
      new ShopItem({ pos: [700, 150], shop: this, ability: 'reaction-2', side: 'left',  name: 'Quicktime Mastery', desc: 'Perform ancient rituals to increase the size of quicktimes' }),
      new ShopItem({ pos: [250, 475], shop: this, ability: 'luck-1',     side: 'right', name: 'Lucky Star', desc: 'Fish wishes come true, chance to get double points on QTE' }),
      new ShopItem({ pos: [100, 380], shop: this, ability: 'luck-2',     side: 'right', name: 'Starry Show', desc: 'Be the star of the show, chance to get triple points in combo' }),
      new ShopItem({ pos: [100, 550], shop: this, ability: 'luck-3',     side: 'right', name: 'Redemption', desc: 'Fish have a chance to be let off the hook without losing points' }),
      new ShopItem({ pos: [550, 475], shop: this, ability: 'vision-1',   side: 'left',  name: 'Eye Surgery', desc: 'New surgery allows fish to see the hook from further' }),
      new ShopItem({ pos: [700, 475], shop: this, ability: 'vision-2',   side: 'left',  name: 'Trash Smell', desc: 'Failed nose surgery has greatly reduced ability to smell bait' }),
      new ShopItem({ pos: [400, 100], shop: this, ability: 'cooldown-1', side: 'right', name: 'Fish Roar ++', desc: 'Improved vocalisation tech enables more regular screaming' }),
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
    line(125, 150, 225, 150);
    line(575, 150, 675, 150);
    line(575, 475, 675, 475);

    line(225, 475, 100, 360);
    line(225, 475, 100, 575);

    line(400, 300, 225, 125);
    line(400, 300, 575, 125);
    line(400, 300, 575, 475);
    line(400, 300, 225, 475);
    line(400, 300, 400, 125);

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
