class MenuScreen {
  constructor(images, dialogue) {
    this.images = images;
    this.dialogue = dialogue;
  }

  handle_click() {
    this.dialogue.send([
      {
        text: 'Here is some very interesting text that you should read because it is very important'
      }
    ]);
  }

  show() {
    background(200);
  }

  update() {}
}
