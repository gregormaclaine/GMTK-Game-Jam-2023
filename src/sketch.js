let a;
let npc_fish = [];
let player;
const images = {};

function preload() {
  images['fish'] = loadImage('assets/img/fish.png');
  console.log(images['fish'].width);
}

function mouseClicked() {
  // a.trigger().then(console.log);
  // npc_fish.forEach(f => console.log(f.is_on_screen()));
  npc_fish.forEach(f => f.handle_click());
}

function keyPressed() {
  // console.log(keyCode);
  a.handle_key_press();
}

function setup() {
  createCanvas(800, 600);
  a = new QuickTimeEvent();
  npc_fish.push(new NPCFish([200, 200], images['fish']));
  npc_fish.push(new NPCFish([600, 400], images['fish']));
  player = new PlayerFish([400, 300]);
}

function draw() {
  cursor();
  background(240);
  npc_fish.forEach(f => f.show());
  a.show();
  player.show();
}
