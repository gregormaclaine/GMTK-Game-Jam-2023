class ShopItemDialogue {
  constructor(
    name,
    description,
    icon_pos,
    outline_color,
    side = 'right',
    on_buy
  ) {
    this.name = name;
    this.description = description;
    this.icon_pos = icon_pos;
    this.outline_color = outline_color;
    this.side = side;
    this.on_buy = on_buy;

    this.size = [200, 90];
  }

  pos() {
    return [
      this.icon_pos[0] +
        (45 + this.size[0] / 2) * (this.side === 'right' ? 1 : -1),
      this.icon_pos[1]
    ];
  }

  buy_button_pos() {
    const pos = this.pos();
    return [
      this.side === 'right'
        ? pos[0] + this.size[0] * (7 / 20)
        : pos[0] - this.size[0] * (7 / 20),
      pos[1]
    ];
  }

  mouse_over_buy_button() {
    const mouse = createVector(mouseX, mouseY);
    const pos = createVector(...this.buy_button_pos());
    return mouse.dist(pos) < 45 / 2;
  }

  handle_click() {
    if (this.mouse_over_buy_button()) this.on_buy();
  }

  contains_mouse() {
    const [x, y] = this.pos();
    const [w, h] = this.size;
    if (mouseX < x - w / 2 - 1) return false;
    if (mouseX > x + w / 2) return false;
    if (mouseY < y - h / 2) return false;
    if (mouseY > y + h / 2) return false;
    return true;
  }

  show() {
    const pos = this.pos();
    rectMode(CENTER);
    strokeWeight(0);
    fill(this.outline_color);
    rect(pos[0] - 1, pos[1], this.size[0] + 2, this.size[1]);

    fill(255, 200);
    rect(...pos, this.size[0] - 8, this.size[1] - 8);

    stroke(0);
    strokeWeight(1);
    if (this.side === 'right') {
      line(
        pos[0] + this.size[0] / 5,
        pos[1] - this.size[1] / 2 + 10,
        pos[0] + this.size[0] / 5,
        pos[1] + this.size[1] / 2 - 10
      );
    } else {
      line(
        pos[0] - this.size[0] / 5,
        pos[1] - this.size[1] / 2 + 10,
        pos[0] - this.size[0] / 5,
        pos[1] + this.size[1] / 2 - 10
      );
    }

    // Name
    textAlign(LEFT, TOP);
    textSize(15);
    strokeWeight(0);
    fill(0);

    const top_left_point =
      this.side === 'right'
        ? [pos[0] - this.size[0] / 2 + 4 + 8, pos[1] - this.size[1] / 2 + 4 + 6]
        : [pos[0] - this.size[0] / 5 + 8, pos[1] - this.size[1] / 2 + 4 + 6];
    text(this.name, ...top_left_point);

    // Description
    rectMode(CORNERS);
    textSize(12);
    text(this.description, top_left_point[0], top_left_point[1] + 20, 120, 45);

    // Buy button
    const b_hovering = this.mouse_over_buy_button();
    fill('green');
    circle(...this.buy_button_pos(), b_hovering ? 48 : 45);
    textAlign(CENTER, CENTER);
    textSize(15);
    fill('black');
    text('BUY', ...this.buy_button_pos());

    if (b_hovering) {
      cursor('pointer');
    }
  }
}
