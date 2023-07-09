class ShopItem {
  // pos is x and y co-ords of the item
  constructor({ pos, ability, shop, name, desc, side }) {
    this.pos = pos;
    this.ability = ability;
    this.is_bought = shop.unlocked_upgrades[this.ability];
    this.available = shop.is_available(this.ability);
    this.img = shop.images[ability];
    this.outline_color = color(this.img.get(5, 5));

    this.dialogue = new ShopItemDialogue(
      name,
      desc,
      this.pos,
      this.outline_color,
      side,
      () => shop.unlock(this.ability)
    );

    this.hovered = false;
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
    if (this.hovered) this.dialogue.handle_click();
  }

  show() {
    imageMode(CENTER);
    const size = this.hovered ? 90 : 80;
    image(this.img, this.pos[0], this.pos[1], size, size);
  }
}
