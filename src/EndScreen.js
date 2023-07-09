class EndScreen {
  constructor(images, audio, dialogue, go_to_menu) {
    this.images = images;
    this.audio = audio;
    this.dialogue = dialogue;
    this.go_to_menu = go_to_menu;

    this.state = null;
    this.fish_left = 1;
    this.final_score = 0;

    this.lose_gifs = [...images['laugh-gifs']];
    this.lose_gifs.splice(random([0, 1, 2]), 1);
    if (random() > 0.5) this.lose_gifs.reverse();

    this.win_gifs = images['squirrels'];

    this.menu_button = new JL.Button(
      'Return To Menu',
      [width / 2, height * 0.55, 300, 75],
      () => this.leave()
    );
  }

  handle_click() {
    this.menu_button.handle_click();
  }

  open({ result, fish_left, final_score }) {
    this.state = result;
    this.fish_left = fish_left;
    this.final_score = final_score;

    if (result === 'lose') {
      this.lose_gifs[0].fade_in([width * 0.15, height * 0.5]);
      this.lose_gifs[1].fade_in([width * 0.85, height * 0.5]);

      this.audio.play_track('laugh.mp3');
    } else {
      this.win_gifs[0].fade_in([width * 0.15, height * 0.5]);
      this.win_gifs[1].fade_in([width * 0.85, height * 0.5]);

      this.menu_button.rect = [width / 2, height * 0.69, 300, 75];

      this.audio.play_sound('cheer.wav');
    }
  }

  leave() {
    if (this.state === 'lose') {
      this.lose_gifs.forEach(g => g.fade_out());
      this.audio.stop();
    } else {
      this.win_gifs.forEach(g => g.fade_out());
    }

    window.location.reload();
    // this.go_to_menu();
  }

  show() {
    background(200);

    switch (this.state) {
      case 'lose':
        textAlign(CENTER);
        fill(255);
        strokeWeight(2);
        stroke(0);
        textSize(50);
        text('YOU LOSE!', width * 0.5, height * 0.4);

        this.menu_button.show();
        break;

      case 'win':
        textAlign(CENTER);
        fill(255);
        strokeWeight(2);
        stroke(0);
        textSize(50);
        text('YOU WIN!', width * 0.5, height * 0.25);

        textAlign(CENTER);
        fill(255);
        strokeWeight(2);
        stroke(0);
        textSize(30);
        text(
          'Final Score: ' + this.final_score.toLocaleString(),
          width * 0.5,
          height * 0.35
        );

        imageMode(CENTER);
        image(this.images[this.fish_left + '-stars'], 400, 300, 300, 100);

        this.menu_button.show();
        break;
    }
  }

  update() {
    if (this.state === 'lose') this.lose_gifs.forEach(g => g.update());
    else this.win_gifs.forEach(g => g.update());
  }
}
