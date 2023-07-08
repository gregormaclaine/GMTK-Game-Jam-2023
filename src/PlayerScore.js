class PlayerScore {
    constructor() {
        this.val = 0;
        this.x = 750;
        this.y = 40;
        this.width = 40;
        this.size = 30;
    }

    setVal(newVal) {
        this.val = newVal;
    }

    incrementVal(increment) {
        this.val += increment;
    }

    decrementVal(decrement) {
        this.val -= decrement;
    }

    getVal() {
        return this.val;
    }

    show() {
        textSize(this.size);
        textAlign(RIGHT);
        strokeWeight(1);
        text("Score: " + this.val, this.x, this.y);
    }
}