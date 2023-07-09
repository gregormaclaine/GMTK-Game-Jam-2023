const images = {};
const audio = new JL.Audio(['laugh.mp3'], ['cheer.wav']);
let scenes;

function preload() {
  // Load fonts
  fontLight = loadFont('assets/font/Oxygen-Light.ttf');
  fontRegular = loadFont('assets/font/Oxygen-Regular.ttf');
  fontBold = loadFont('assets/font/Oxygen-Bold.ttf');

  images['hook'] = loadImage('assets/img/fish-hook.png');
  images['sun'] = loadImage('assets/img/sun.png');
  images['star'] = loadImage('assets/img/star.png');
  images['worm'] = loadImage('assets/img/worm.png');
  images['tick'] = loadImage('assets/img/tick.png');
  images['wings'] = loadImage('assets/img/wings.png');
  images['fisherman'] = loadImage('assets/img/fisherman.png');
  images['underwater_bg'] = loadImage('assets/img/underwater_bg.jpg');
  images['dialogue-profile'] = loadImage('assets/img/dialogue-profile.png');
  images['dialogue-box'] = loadImage('assets/img/dialogue-box.png');
  images['pause-tooltip'] = loadImage('assets/img/pause_tooltip.png');
  images['pufferfish1'] = loadImage('assets/img/pufferfish_1.jpg');
  images['pufferfish2'] = loadImage('assets/img/pufferfish_2.jpg');
  images['fredd'] = loadImage('assets/img/fredd.png');
  
  // Main Menu
  images['menu_bg'] = loadImage('assets/img/main_menu/menu_bg.jpg');
  images['start-button'] = loadImage('assets/img/main_menu/start_button.png');
  images['credits-button'] = loadImage('assets/img/main_menu/credits_button.png');

  // End Stars
  images['1-stars'] = loadImage('assets/img/end/1-stars.png');
  images['2-stars'] = loadImage('assets/img/end/2-stars.png');
  images['3-stars'] = loadImage('assets/img/end/3-stars.png');

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
  images['cont-button'] = loadImage('assets/img/shop_icons/cont_button.png');

  // Gifs
  images['spinning-fish'] = new Gif({
    path: 'assets/img/spinning-fish.gif',
    duration: 1000,
    alt: 'feesh',
    width: 400,
    height: 173
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

  images['squirrels'] = [
    new Gif({
      path: 'assets/img/end/dancing-squirrel.gif',
      alt: 'OOOOOH RIIIIIIIIGHTT',
      width: 200
    }),
    new Gif({
      path: 'assets/img/end/dancing-squirrel.gif',
      alt: 'OOOOOH RIIIIIIIIGHTT',
      width: 200
    })
  ];

  audio.preload();
}

function setup() {
  const cnv = createCanvas(800, 600);
  textFont(fontRegular);
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
