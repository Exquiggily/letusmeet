
const v = 4;
class TimeSlot {
  constructor(column, row0, row1) {
    this.column = column;
    this.row0 = row0;
    this.row1 = row1;
    this.dir = 1;
    this.selected = false;
    this.timer = 0;
  }

  renderv2(isFirstOrLast = -1) {
    rect(
      gridsize * this.column + SM + marginSize + leftMarginSize + overflow,
      gridsize * this.row0 + SM * this.dir + marginSize + overflow,
      gridsize - SM * 2,
      gridsize * (this.row1 + 1 - (this.row0 + 1)) - SM * 2 * this.dir,
      ...(this.selected || this.timer != 0 ? (Array(4).fill().map((_, i) => SM * 2 * ((isFirstOrLast == 0 && (i == 0 || i == 3)) || (isFirstOrLast == -1 && (i == 1 || i == 3)) || (isFirstOrLast == 1 && (i == 1 || i == 2)) ? 1 : (1 - this.timer)))) : [SM * 2])
    );
    if (this.selected || this.timer != 0) {
      if (this.selected)
        this.timer = this.timer < 0.9 ? lerp(this.timer, 1, deltaTime / 1000.0 * highlightSpeed) : 1;
      else
        this.timer = this.timer > 0.1 ? lerp(this.timer, 0, deltaTime / 1000.0 * highlightSpeed) : 0;
      fill(...highlightKnobColor, this.timer * 130);
      circle(gridsize * this.column + marginSize + leftMarginSize + SM * 2 + overflow + (isFirstOrLast == 0 ? gridsize - SM * 4 : 0), gridsize * this.row0 + SM * this.dir + marginSize + overflow, highlightKnobSize);
      circle(gridsize * this.column + marginSize + leftMarginSize + overflow + (isFirstOrLast != 1 ? gridsize - SM * 2 : SM * 2), gridsize * this.row0 + SM * this.dir + marginSize + overflow + gridsize * (this.row1 + 1 - (this.row0 + 1)) - SM * 2 * this.dir, highlightKnobSize);
    }
  }

  getHitbox() {
    return this.dir == 1 ? Array(this.row1 - this.row0).fill().map((_, i) => this.row0 + i) : Array(this.row0 - this.row1).fill().map((_, i) => this.row1 + i);
  }
}
