class ShopItem {
  // pos is x and y co-ords of the item
  constructor({ pos, ability, shop, name, desc, side }) {
    this.pos = pos;
    this.shop = shop;
    this.ability = ability;
    this.img = shop.images[ability];
    this.outline_color = color(this.img.get(5, 5));

    this.dialogue = new ShopItemDialogue(
      name,
      desc,
      this.pos,
      this.outline_color,
      side,
      () => shop.unlock(this.ability),
      shop.images['tick'],
      () => shop.unlocked_upgrades[this.ability],
      () => shop.available_upgrades > 0
    );

    this.hovered = false;
  }

  available() {
    return this.shop.is_available(this.ability);
  }

  contains_mouse() {
    if (!this.available()) return false;
    const [x, y, w = 100, h = 100] = this.pos;
    if (mouseX < x - w / 2) return false;
    if (mouseX > x + w / 2) return false;
    if (mouseY < y - h / 2) return false;
    if (mouseY > y + h / 2) return false;
    return true;
  }

  handle_click() {
    if (this.hovered) this.dialogue.handle_click();
  }

  show() {
    imageMode(CENTER);
    const size = this.hovered ? 90 : 80;
    image(this.img, ...this.pos, size, size);
    if (!this.available()) {
      rectMode(CENTER);
      strokeWeight(0);
      fill(0, 180);
      rect(...this.pos, size, size);
    }
  }
}
