class TimeSlot {
  constructor(column, row0, row1) {
    this.column = column;
    this.row0 = row0;
    this.row1 = row1;
    this.dir = 1;
    this.selected = false;
    this.timer = 0;
  }

  render() {
    rect(
      gridsize * this.column + SM + marginSize + overflow,
      gridsize * this.row0 + SM * this.dir + marginSize + overflow,
      gridsize - SM * 2,
      gridsize * (this.row1 + 1 - (this.row0 + 1)) - SM * 2 * this.dir,
      SM * 2
    );
  }

  renderActive() {
    let lerpAmount = lerp(SM * 2, 0, Math.max(Math.min(this.timer, 1000), 0) / 1000)
    let lerpAmount2 = lerp(0, 50, Math.max(Math.min(this.timer, 1000), 0) / 1000)

    rect(
      gridsize * this.column + SM + marginSize + overflow,
      gridsize * this.row0 + SM * this.dir + marginSize + overflow,
      gridsize - SM * 2,
      gridsize * (this.row1 + 1 - (this.row0 + 1)) - SM * 2 * this.dir,
      lerpAmount, // tl
      SM * 2, // tr
      lerpAmount, // br
      SM * 2, // bl
    );
    
    this.selected ? fill(255, 0, 0, lerpAmount2) : fill(100, lerpAmount2);
    circle(gridsize * this.column + SM + marginSize + overflow, gridsize * this.row0 + SM * this.dir + marginSize + overflow, pointSize);
    circle(gridsize * this.column + SM + marginSize + overflow + gridsize - SM * 2, gridsize * this.row0 + SM * this.dir + marginSize + overflow + gridsize * (this.row1 + 1 - (this.row0 + 1)) - SM * 2 * this.dir, pointSize);
  }

  getHitbox() {
    return this.dir == 1 ? Array(this.row1 - this.row0).fill().map((_, i) => this.row0 + i) : Array(this.row0 - this.row1).fill().map((_, i) => this.row1 + i);
  }
}
