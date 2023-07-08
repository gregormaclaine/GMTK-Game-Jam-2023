class DialogueManager {
  static PROFILE_RECT = [125, 475, 150, 150];
  static DIALOGUE_RECT = [750 - 525 / 2, 475, 525, 150];
  static TEXT_RECT = [750 - 525 / 2, 475, 500, 125];

  static TEXT_SPEED = 50;

  constructor() {
    this.active = false;
    this.current_dialogue = null;
    this.progress = 0;
  }

  contains_mouse() {
    const [x, y, w, h] = DialogueManager.DIALOGUE_RECT;
    if (mouseX < x - w / 2) return false;
    if (mouseX > x + w / 2) return false;
    if (mouseY < y - h / 2) return false;
    if (mouseY > y + h / 2) return false;
    return true;
  }

  async send(dialogues) {
    this.active = true;
    for (const dialogue of dialogues) {
      this.current_dialogue = dialogue;
      this.progress = 0;
      await new Promise(resolve => (this.finished_dialogue = resolve));
    }
    this.current_dialogue = null;
    this.active = false;
  }

  handle_click() {
    if (!this.contains_mouse()) return;
    const t = this.current_dialogue.text;
    const text_index = floor(lerp(0, t.length, this.progress));
    if (text_index < t.length) {
      this.progress = 1;
    } else {
      this.finished_dialogue();
    }
  }

  show() {
    // Draw Rects
    strokeWeight(0);
    rectMode(CENTER);
    fill('orange');
    rect(...DialogueManager.DIALOGUE_RECT);
    fill('blue');
    rect(...DialogueManager.PROFILE_RECT);
    fill('red');
    rect(...DialogueManager.TEXT_RECT);

    if (this.active) {
      fill(255);
      textSize(22);
      textAlign(LEFT, TOP);
      const t = this.current_dialogue.text;
      const text_index = floor(lerp(0, t.length, this.progress));
      text(t.substring(0, text_index), ...DialogueManager.TEXT_RECT);
    }
  }

  update() {
    this.progress +=
      ((1 / frameRate()) * DialogueManager.TEXT_SPEED) /
      this.current_dialogue.text.length;
  }
}
