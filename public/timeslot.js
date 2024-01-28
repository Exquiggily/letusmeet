class TimeSlot {
  constructor(column, row0, row1) {
    this.column = column
    this.row0 = row0
    this.row1 = row1
    this.dir = 1
    this.selected = false
  }

  render() {
    rect(
      gridsize * this.column + SM + marginSize + overflow,
      gridsize * this.row0 + SM * this.dir + marginSize + overflow,
      gridsize - SM * 2,
      gridsize * (this.row1 + 1 - (this.row0 + 1)) - SM * 2 * this.dir,
      SM * 2
    )
  }

  renderActive(timer) {
    let lerpAmount = lerp(SM * 2, 0, Math.min(timer, 1000) / 1000)

    rect(
      gridsize * this.column + SM + marginSize + overflow,
      gridsize * this.row0 + SM * this.dir + marginSize + overflow,
      gridsize - SM * 2,
      gridsize * (this.row1 + 1 - (this.row0 + 1)) - SM * 2 * this.dir,
      lerpAmount, // tl
      SM * 2, // tr
      lerpAmount, // br
      SM * 2, // bl
    )
    if (lerpAmount == 0) {
      fill(100, 50);
      let dot1 = {x: gridsize * this.column + SM + marginSize + overflow, y: gridsize * this.row0 + SM * this.dir + marginSize + overflow};
      let dot2 = {x: gridsize * this.column + SM + marginSize + overflow + gridsize - SM * 2, y: gridsize * this.row0 + SM * this.dir + marginSize + overflow + gridsize * (this.row1 + 1 - (this.row0 + 1)) - SM * 2 * this.dir};
      circle(dot1.x, dot1.y, pointSize);
      circle(dot2.x, dot2.y, pointSize);
    }
  }

  getHitbox() {
    return this.dir == 1 ? Array(this.row1 - this.row0).fill().map((_, i) => this.row0 + i) : Array(this.row0 - this.row1).fill().map((_, i) => this.row1 + i);
  }
}
