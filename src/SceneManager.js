class SceneManager {
  static FADE_TIME = 0.8;

  constructor(images) {
    this.images = images;

    this.state = 'game';

    this.game_scene = new GameManager(images, this.end_game.bind(this));

    this.fade_mode = null;
    this.fade_progress = 0;
    this.fade_completed = () => {};
  }

  async fade(mode) {
    this.fade_mode = mode;
    this.fade_progress = 0;
    await new Promise(resolve => (this.fade_completed = resolve));
    this.fade_mode = null;
  }

  async end_game({ fish_lost }) {
    await this.fade('out');
    this.state = 'shop';
  }

  handle_click() {
    this.game_scene.handle_click();
  }

  handle_key_press() {
    this.game_scene.handle_key_press();
  }

  show() {
    background(0);

    switch (this.state) {
      case 'game':
        this.game_scene.show();
        this.game_scene.update();
        break;
    }

    if (this.fade_mode) {
      this.fade_progress += 1 / SceneManager.FADE_TIME / frameRate();
      if (this.fade_progress >= 1) this.fade_completed();
      const opacities = this.fade_mode === 'in' ? [255, 0] : [0, 255];
      fill(0, lerp(...opacities, this.fade_progress));
      strokeWeight(0);
      rect(0, 0, width, height);
    }
  }
}
