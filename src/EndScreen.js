class EndScreen {
  constructor(images, dialogue, go_to_menu) {
    this.images = images;
    this.dialogue = dialogue;
    this.go_to_menu = go_to_menu;

    this.state = null;

    this.lose_gifs = [...images['laugh-gifs']];
    this.lose_gifs.splice(random([0, 1, 2]), 1);
    if (random() > 0.5) this.lose_gifs.reverse();

    this.menu_button = new JL.Button(
      'Return To Menu',
      [width / 2, height * 0.55, 300, 75],
      () => this.leave()
    );
  }

  handle_click() {
    this.menu_button.handle_click();
  }

  open({ result }) {
    this.state = result;
    if (result === 'lose') {
      this.lose_gifs[0].fade_in([width * 0.15, height * 0.5]);
      this.lose_gifs[1].fade_in([width * 0.85, height * 0.5]);
    }
  }

  leave() {
    if (this.state === 'lose') this.lose_gifs.forEach(g => g.fade_out());
    this.go_to_menu();
  }

  show() {
    background(200);

    switch (this.state) {
      case 'lose':
        textAlign(CENTER);
        fill(255);
        strokeWeight(2);
        stroke(0);
        textSize(50);
        text('YOU LOSE!', width * 0.5, height * 0.4);

        this.menu_button.show();
        break;
    }
  }

  update() {
    if (this.state === 'lose') this.lose_gifs.forEach(g => g.update());
  }
}
