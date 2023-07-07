let a;
let npc_fish = [];

function preload() {}

function mouseClicked() {
  // a.trigger().then(console.log);
  // npc_fish.forEach(f => console.log(f.is_on_screen()));
  npc_fish.forEach(f => f.handle_click());
}

function keyPressed() {
  a.handle_key_press();
}

function setup() {
  createCanvas(800, 600);
  a = new QuickTimeEvent();
  npc_fish.push(new NPCFish([200, 200]));
  npc_fish.push(new NPCFish([600, 400]));
}

function draw() {
  cursor();
  background(240);
  npc_fish.forEach(f => f.show());
  a.show();
}
