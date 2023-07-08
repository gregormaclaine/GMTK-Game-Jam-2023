const images = {};
const audio = new JL.Audio([], []);
let scenes;

function preload() {
  images['fish'] = loadImage('assets/img/fish/main.png');
  images['muscle-fish'] = loadImage('assets/img/fish/muscle.png');
  images['crown-fish'] = loadImage('assets/img/fish/crown.png');
  images['muscle-crown-fish'] = loadImage('assets/img/fish/muscle-crown.png');

  images['hook'] = loadImage('assets/img/fish-hook.png');
  images['star'] = loadImage('assets/img/star.png');
  images['worm'] = loadImage('assets/img/worm.png');
  images['spinning-fish'] = new Gif({
    path: 'assets/img/spinning-fish.gif',
    duration: 1000,
    alt: 'feesh',
    width: 400
  });
  audio.preload();
}

function setup() {
  const cnv = createCanvas(800, 600);
  Gif.set_canvas(cnv);
  scenes = new SceneManager(images, audio);
}

function mouseClicked() {
  scenes.handle_click();
}

function keyPressed() {
  // console.log(keyCode);
  scenes.handle_key_press();
}

function draw() {
  scenes.show();
  scenes.update();
}
