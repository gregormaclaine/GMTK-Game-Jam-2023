const images = {};
let scenes;

function preload() {
  images['fish'] = loadImage('assets/img/fish.png');
  images['hook'] = loadImage('assets/img/fish-hook.png');
}

function mouseClicked() {
  scenes.handle_click();
}

function keyPressed() {
  // console.log(keyCode);
  scenes.handle_key_press();
}

function setup() {
  createCanvas(800, 600);
  scenes = new SceneManager(images);
}

function draw() {
  scenes.show();
}
