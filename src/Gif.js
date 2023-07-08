// const all_gifs = []

class Gif {
  constructor({ path, alt, duration, width, audio }) {
    this.path = path;
    this.duration = duration;
    this.width = width;
    this.audio = audio;

    this.image = createImg(this.path, alt);
    this.image.hide();
    this.image.style('width', `${this.width}px`);
    this.image.style('height', 'auto');

    this.showing = false;

    // all_gifs.push(this);
  }

  // static set_canvas(cnv) {
  //   cnv.elt.parentElement.style.position = 'relative';
  //   this.boom_gif.parent(cnv.elt.parentElement);
  // }

  calc_pos_from_rect(rect) {
    const [x, y, w, h] = rect;
    const [midx, midy] = [x + w / 2, y + h / 2];
    const gif_height = (this.width / this.image.width) * this.image.height;

    return [midx - this.width / 2, midy - gif_height / 2];
  }

  async play(rect, sound) {
    const pos = this.calc_pos_from_rect(rect);
    this.image.position(...pos);
    this.image.removeAttribute('src');
    this.image.show();

    if (sound && this.audio) this.audio.play_sound(sound);
    this.image.attribute('src', this.path);
    await timeout(this.duration);

    this.image.hide();
  }

  start_loop(rect) {
    this.showing = true;
    const pos = this.calc_pos_from_rect(rect);
    this.image.position(...pos);
    this.image.removeAttribute('src');
    this.image.show();
    this.image.attribute('src', this.path);
  }

  stop_loop() {
    this.showing = false;
    this.image.hide();
  }
}
