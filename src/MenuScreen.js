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
  }

  update() {}
}
