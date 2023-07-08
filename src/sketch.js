const images = {};
const audio = new JL.Audio([], []);
let scenes;

function preload() {
  images['fish'] = loadImage('assets/img/fish.png');
  images['hook'] = loadImage('assets/img/fish-hook.png');
  images['star'] = loadImage('assets/img/star.png');
  images['worm'] = loadImage('assets/img/worm.png');
  images['spinning-fish'] = new Gif({
    path: 'assets/img/spinning-fish.gif',
    duration: 1000,
    alt: 'feesh'
  });
  audio.preload();
}

function setup() {
  createCanvas(800, 600);
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
