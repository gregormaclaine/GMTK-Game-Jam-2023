class SceneManager {
  static FADE_TIME = 0.8;

  constructor(images) {
    this.images = images;

    this.state = 'game';

    this.menu_scene = new MenuScreen(images);
    this.current_game_day = -1;
    this.shop_scene = new ShopScreen(images, this.exit_menu.bind(this));
    this.initialise_new_game_day();

    this.fade_mode = null;
    this.fade_progress = 0;
    this.fade_completed = () => {};
  }

  initialise_new_game_day() {
    this.current_game_day++;
    this.game_scene = new GameManager({
      images,
      end_game: this.end_game.bind(this),
      day: this.current_game_day,
      upgrades: this.shop_scene.unlocked_upgrades
    });
  }

  async fade(mode) {
    this.fade_mode = mode;
    this.fade_progress = 0;
    await new Promise(resolve => (this.fade_completed = resolve));
    this.fade_mode = null;
  }

  async end_game({ fish_lost }) {
    await this.fade('out');
    if (this.current_game_day < 4) {
      this.state = 'shop';
    } else {
      this.state = 'end';
    }
    await this.fade('in');
  }

  async exit_menu() {
    this.initialise_new_game_day();
    await this.fade('out');
    this.state = 'game';
    await this.fade('in');
  }

  handle_click() {
    if (this.fade_mode) return;

    switch (this.state) {
      case 'game':
        return this.game_scene.handle_click();
      case 'shop':
        return this.shop_scene.handle_click();
      case 'menu':
        return this.menu_scene.handle_click();
    }
  }

  handle_key_press() {
    if (this.fade_mode) return;

    if (this.state === 'game') this.game_scene.handle_key_press();
  }

  show() {
    background(0);

    switch (this.state) {
      case 'game':
        this.game_scene.show();
        this.game_scene.update();
        break;

      case 'shop':
        this.shop_scene.show();
        this.shop_scene.update();
        break;

      case 'menu':
        this.menu_scene.show();
        this.menu_scene.update();
        break;
    }

    if (this.fade_mode) {
      this.fade_progress += 1 / SceneManager.FADE_TIME / frameRate();
      if (this.fade_progress >= 1) this.fade_completed();
      const opacities = this.fade_mode === 'in' ? [255, 0] : [0, 255];
      fill(0, lerp(...opacities, this.fade_progress));
      strokeWeight(0);
      rectMode(CORNERS);
      rect(0, 0, width, height);
    }
  }
}
