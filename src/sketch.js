let a;
let npc_fish = [];
let player;
let hook;
const images = {};

function preload() {
  images['fish'] = loadImage('assets/img/fish.png');
  images['hook'] = loadImage('assets/img/fish-hook.png');
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
  npc_fish.push(new NPCFish([200, 500], images['fish']));
  npc_fish.push(new NPCFish([600, 400], images['fish']));
  player = new PlayerFish([400, 300], images['fish']);
  hook = new Hook([100, 100], images['hook']);
}

function draw() {
  cursor();
  background(240);
  hook.show();
  npc_fish.forEach(f => f.show());
  a.show();
  player.show();
  if (npc_fish[0].hitbox.is_colliding(npc_fish[1].hitbox))
    console.log('AAAAAAAHHHHHH');
}
