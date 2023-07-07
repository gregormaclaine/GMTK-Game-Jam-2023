const images = {};

function preload() {
  images['fish'] = loadImage('assets/img/fish.png');
  images['hook'] = loadImage('assets/img/fish-hook.png');
}

function mouseClicked() {
  game.handle_click();
}

function keyPressed() {
  // console.log(keyCode);
  game.handle_key_press();
}

function setup() {
  createCanvas(800, 600);
  game = new GameManager(images);
}

function draw() {
  game.show();
  game.update();
}
