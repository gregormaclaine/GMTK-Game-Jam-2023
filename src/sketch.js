let a;

function preload() {}

function mouseClicked() {
  a.trigger().then(console.log);
}

function keyPressed() {
  a.handle_key_press();
}

function setup() {
  createCanvas(800, 600);
  a = new QuickTimeEvent();
}

function draw() {
  cursor();
  background(240);
  a.show();
}
