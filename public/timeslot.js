class TimeSlot {
    constructor(column, row0, row1) {
        this.column = column;
        this.row0 = row0;
        this.row1 = row1;
        this.dir = 1;
        this.sel = false;
    }

    render(){
        rect(
            gridsize * this.column + SM + marginSize + overflow,
            gridsize * this.row0 + SM * this.dir + marginSize + overflow,
            gridsize- SM * 2,
            (gridsize * ((this.row1 + 1)-(this.row0 + 1))) - SM * 2 * this.dir,
            SM * 2
            );
    }
}






















