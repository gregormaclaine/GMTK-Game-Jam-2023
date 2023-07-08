const all_gifs = []

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

    all_gifs.push(this);
  }

  static set_canvas(cnv) {
    cnv.elt.parentElement.style.position = 'relative';
    all_gifs.forEach(g => g.image.parent(cnv.elt.parentElement));
  }

  get_corner_pos(pos) {
    const [midx, midy] = pos;
    const gif_height = (this.width / this.image.width) * this.image.height;

    return [midx - this.width / 2, midy - gif_height / 2];
  }

  async play(pos, sound) {
    this.image.position(...this.get_corner_pos(pos));
    this.image.removeAttribute('src');
    this.image.show();

    if (sound && this.audio) this.audio.play_sound(sound);
    this.image.attribute('src', this.path);
    await timeout(this.duration);

    this.image.hide();
  }

  start_loop(pos) {
    this.showing = true;
    this.image.position(...this.get_corner_pos(pos));
    this.image.removeAttribute('src');
    this.image.show();
    this.image.attribute('src', this.path);
  }

  stop_loop() {
    this.showing = false;
    this.image.hide();
  }
}
