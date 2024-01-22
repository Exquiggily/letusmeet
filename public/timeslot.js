class TimeSlot {
  constructor (column, row0, row1) {
    this.column = column
    this.row0 = row0
    this.row1 = row1
    this.dir = 1
    this.selected = false
  }

  render () {
    rect(
      gridsize * this.column + SM + marginSize + overflow,
      gridsize * this.row0 + SM * this.dir + marginSize + overflow,
      gridsize - SM * 2,
      gridsize * (this.row1 + 1 - (this.row0 + 1)) - SM * 2 * this.dir,
      SM * 2
    )
  }

  getHitbox(){
    return this.dir == 1 ? Array(this.row1-this.row0).fill().map((_, i) => this.row0+i) : Array(this.row0-this.row1).fill().map((_,i) => this.row1+i);
  }
}
