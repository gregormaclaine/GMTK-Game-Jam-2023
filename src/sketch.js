const images = {};
const audio = new JL.Audio([], []);
let scenes;

function preload() {
  images['fish'] = loadImage('assets/img/fish.png');
  images['hook'] = loadImage('assets/img/fish-hook.png');
  images['star'] = loadImage('assets/img/star.png');
  images['worm'] = loadImage('assets/img/worm.png');
  images['agility_1'] = loadImage('assets/img/shop_icons/agility_1.png');
  images['agility_2'] = loadImage('assets/img/shop_icons/agility_2.png');
  images['luck_1'] = loadImage('assets/img/shop_icons/luck_1.png');
  images['luck_2'] = loadImage('assets/img/shop_icons/luck_2.png');
  images['luck_3'] = loadImage('assets/img/shop_icons/luck_3.png');
  images['reaction_1'] = loadImage('assets/img/shop_icons/reaction_1.png');
  images['reaction_2'] = loadImage('assets/img/shop_icons/reaction_2.png');
  images['vision_1'] = loadImage('assets/img/shop_icons/vision_1.png');
  images['vision_2'] = loadImage('assets/img/shop_icons/vision_2.png');
  images['underwater_bg'] = loadImage('assets/img/underwater_bg.jpg');
  images['cooldown_1'] = loadImage('assets/img/shop_icons/cooldown_1.png');
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
  cursor();
  scenes.show();
  scenes.update();
}
