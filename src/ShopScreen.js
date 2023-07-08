class ShopItem {
  // Rect is center points and width and height
  constructor({ rect, on_click, available }) {
    this.rect = rect;
    this.on_click = on_click;
    this.available = available;
  }

  contains_mouse() {
    const [x, y, w, h] = this.rect;
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
      'fin-1': false, // Player can accelerate faster
      'fin-2': false, // Player can decelerate faster
      'reaction-1': false, // Quicktimes are easier
      'reaction-2': false, // Quicktime criticals are slightly larger
      'luck-1': false, // Small chance for double points
      'luck-2': false, // Larger chance for double points
      'luck-3': false, // Higher combo from consecutive criticals
      'vision-1': false, // Fish can see an empty hook from farther away
      'vision-2': false // Fish have worse smell
    };

    this.shop_items = [];
  }

  handle_click() {
    this.shop_items.forEach(i => i.handle_click());
  }

  open() {
    this.images['spinning-fish'].start_loop([800, 200]);
  }

  show() {
    background(200);

    textAlign(CENTER, CENTER);
    fill(255);
    strokeWeight(0);
    textSize(40);
    text('Shop', width * 0.5, height * 0.45);

    this.shop_items.forEach(i => i.show());
  }

  update() {}
}
