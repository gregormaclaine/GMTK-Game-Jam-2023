const images = {};
const audio = new JL.Audio([], []);
let scenes;

function preload() {
  images['hook'] = loadImage('assets/img/fish-hook.png');
  images['star'] = loadImage('assets/img/star.png');
  images['worm'] = loadImage('assets/img/worm.png');
  images['underwater_bg'] = loadImage('assets/img/underwater_bg.jpg');

  // Fish
  images['fish'] = loadImage('assets/img/fish/main.png');
  images['crown-fish'] = loadImage('assets/img/fish/crown.png');
  images['brain-fish'] = loadImage('assets/img/fish/brain.png');
  images['brain-crown-fish'] = loadImage('assets/img/fish/brain-crown.png');
  images['rocket-fish'] = loadImage('assets/img/fish/rocket.png');
  images['rocket-crown-fish'] = loadImage('assets/img/fish/rocket-crown.png');
  images['rocket-brain-fish'] = loadImage('assets/img/fish/rocket-brain.png');
  images['rocket-brain-crown-fish'] = loadImage(
    'assets/img/fish/rocket-brain-crown.png'
  );
  // images['muscle-crown-fish'] = loadImage('assets/img/fish/muscle-crown.png');
  images['eyes-fish'] = loadImage('assets/img/fish/eyes.png');

  // Shop Item Icons
  images['agility-1'] = loadImage('assets/img/shop_icons/agility_1.png');
  images['agility-2'] = loadImage('assets/img/shop_icons/agility_2.png');
  images['luck-1'] = loadImage('assets/img/shop_icons/luck_1.png');
  images['luck-2'] = loadImage('assets/img/shop_icons/luck_2.png');
  images['luck-3'] = loadImage('assets/img/shop_icons/luck_3.png');
  images['reaction-1'] = loadImage('assets/img/shop_icons/reaction_1.png');
  images['reaction-2'] = loadImage('assets/img/shop_icons/reaction_2.png');
  images['vision-1'] = loadImage('assets/img/shop_icons/vision_1.png');
  images['vision-2'] = loadImage('assets/img/shop_icons/vision_2.png');
  images['cooldown-1'] = loadImage('assets/img/shop_icons/cooldown_1.png');

  // Gifs
  images['spinning-fish'] = new Gif({
    path: 'assets/img/spinning-fish.gif',
    duration: 1000,
    alt: 'feesh',
    width: 400
  });

  images['laugh-gifs'] = [
    new Gif({
      path: 'assets/img/end/laugh-1.gif',
      alt: 'HAHAHAHAHAHAHAHA',
      width: 200
    }),
    new Gif({
      path: 'assets/img/end/laugh-2.gif',
      alt: 'HAHAHAHAHAHAHAHA',
      width: 200
    }),
    new Gif({
      path: 'assets/img/end/laugh-3.gif',
      alt: 'HAHAHAHAHAHAHAHA',
      width: 200
    })
  ];

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
