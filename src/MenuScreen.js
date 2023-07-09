class MenuScreen {
  constructor(images, dialogue, start_game) {
    this.images = images;
    this.dialogue = dialogue;
    this.start_game = start_game;
  }

  handle_click() {
    this.start_game();
  }

  show() {
    background(200);
    imageMode(CORNER);
    image(this.images['menu_bg'], 0, 0, 800, 600);
    imageMode(CENTER);
    image(this.images['start-button'], width * 0.5, height * 0.5);
    image(this.images['credits-button'], width * 0.5, height * 0.8);

    textSize(40);
    textAlign(CENTER);
    text('Game where you play as fish.', width * 0.5, height * 0.25);
  }

  update() {}
}
