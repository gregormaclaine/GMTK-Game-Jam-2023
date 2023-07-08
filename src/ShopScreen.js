class ShopItem {
  // pos is x and y co-ords of the item
  constructor({ pos, on_click, available, img }) {
    this.pos = pos;
    this.on_click = on_click;
    this.available = available;
    this.img = img;
  }

  contains_mouse() {
    const [x, y, w = 100, h = 100] = this.pos;
    if (mouseX < x - w / 2) return false;
    if (mouseX > x + w / 2) return false;
    if (mouseY < y - h / 2) return false;
    if (mouseY > y + h / 2) return false;
    return true;
  }

  handle_click() {
    if (this.contains_mouse) this.on_click();
  }

  show() {
    imageMode(CENTER);
    image(this.img, this.pos[0], this.pos[1], 100, 100);
    
    if (this.contains_mouse() && this.available) {
      cursor('pointer');
    }
  }
}

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

    this.shop_items = [
      new ShopItem({ pos: [250, 125], on_click: ()=>{}, available: true, img: images['agility_1'] }),
      new ShopItem({ pos: [100, 125], on_click: ()=>{}, available: true, img: images['agility_2'] }),
      new ShopItem({ pos: [550, 125], on_click: ()=>{}, available: true, img: images['reaction_1'] }),
      new ShopItem({ pos: [700, 125], on_click: ()=>{}, available: true, img: images['reaction_2'] }),
      new ShopItem({ pos: [250, 475], on_click: ()=>{}, available: true, img: images['luck_1'] }),
      new ShopItem({ pos: [100, 400], on_click: ()=>{}, available: true, img: images['luck_2'] }),
      new ShopItem({ pos: [100, 550], on_click: ()=>{}, available: true, img: images['luck_3'] }),
      new ShopItem({ pos: [550, 475], on_click: ()=>{}, available: true, img: images['vision_1'] }),
      new ShopItem({ pos: [700, 475], on_click: ()=>{}, available: true, img: images['vision_2'] }),
    ];

    this.continue = new JL.Button(
      'Continue',
      [width * 0.85, height * 0.9, 200, 100],
      this.close.bind(this)
    );
  }

  handle_click() {
    this.shop_items.forEach(i => i.handle_click());
    this.continue.handle_click();
  }

  open(fish_lost) {
    this.images['spinning-fish'].start_loop([width * 0.5, height * 0.5]);
  }

  close() {
    this.images['spinning-fish'].stop_loop();
    this.start_next_day();
  }

  show() {
    background(200);
    image(this.images['underwater_bg'], 400, 300, 800, 600);

    textAlign(CENTER);
    fill(255);
    strokeWeight(0);
    textSize(28);
    text('Upgrade available', width * 0.5, height * 0.05);

    textAlign(CENTER, CENTER);
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
    // this.continue.show();
  }

  update() {}
}
