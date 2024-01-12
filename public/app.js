const gridsize = 40;
const pointSize = 3;
const SM = 3; // rounding of cells

let marginSize = 20;
let marginPercent = 10;
let overflow = 5;
let drawflag = false;
let timeslots = [{ col: 0, row0: 0, row1: 1 }];
let user = 0;
let modeView = false;


let eventInfo = {
  eventName: "default",
  attendies: ["Default"],
  eventDates: 7,
  timeslots: [[[new TimeSlot(0, 0, 1)],[],[],[],[],[],[],[]]], // [user][column][timeslot]
};

let UIState = {
  editButton: { x: 10, y: 10, width: 40, height: 20, curve: 10, pressed: false }
};
let selectingState = false;
let lastColumn = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  init();
  textAlign(CENTER);
  UIState.editButton.x = width / 2 - (UIState.editButton.width / 2);
  UIState.editButton.y = marginSize / 2 - (UIState.editButton.height / 2);

}

function draw() {
  background(220);
  noStroke();

  fill(100, 50);

  if (user == -1 || UIState.editButton.pressed) {
    for (let i = 0; i < eventInfo.timeslots.length; i++) {
      for (let j = 0; j < eventInfo.timeslots[i].length; j++) {
        for (let k = 0; k < eventInfo.timeslots[i][j].length; k++) {
          eventInfo.timeslots[i][j][k].render();
        }
      }
    }
  }
  else {
      for (let j = 0; j < eventInfo.timeslots[user].length; j++) {
        for (let k = 0; k < eventInfo.timeslots[user][j].length; k++) {
          if (eventInfo.timeslots[user][j][k].sel) {
            fill('red');
          }
          else {
            fill(100, 50);
          }
          eventInfo.timeslots[user][j][k].render();
        }
        
      }
  }

  fill(150);

  circle(mouseX, mouseY, 10);
  grid(marginSize, marginSize, width - marginSize, height - marginSize);
  viewToggle();

  if (drawflag) {
    fill("red");
    circle(20, 20, 5);
  }
}

function grid(x, y, x2, y2) {
  for (let i = 0; i < (y2 - y) / gridsize; i++) {
    for (let j = 0; j < (x2 - x) / gridsize; j++) {
      circle(x + (j * gridsize) + overflow, y + (i * gridsize) + overflow, pointSize);
    }
  }
}

function viewToggle() {
  push();
  let t = "view";
  if (UIState.editButton.pressed) {
    fill(200);

  }
  else {
    fill(150);
    t = "edit";
  }
  rect(UIState.editButton.x, UIState.editButton.y, UIState.editButton.width, UIState.editButton.height, UIState.editButton.curve);
  //circle(width / 2,marginSize/2,20);
  fill(250);
  text(t, width / 2, marginSize / 2 + textSize() / 4);
  pop();
}

function snap(x, y) {
  return [ceil(x / gridsize), ceil(y / gridsize)];
}

function snapUp(x, y) {
  return [ceil(x / gridsize), floor(y / gridsize)];
}

function mousePressed(_event) {
  if (pillCollision(UIState.editButton.x, UIState.editButton.y, UIState.editButton.width, UIState.editButton.height, UIState.editButton.curve)) {
    UIState.editButton.pressed = !UIState.editButton.pressed;
  }

  drawflag = true;

  if (user != -1) {
    let closestGridPosition = snap(mouseX - marginSize - overflow, mouseY - marginSize - overflow);
    let closestCol =  constrain(closestGridPosition[0] - 1, 0, (width - marginSize*2)/gridsize-1);
    let closestRow0 = closestGridPosition[1] - 1;
    let closestRow1 = closestGridPosition[1];

    let currentDay = eventInfo.timeslots[user][closestCol];
    console.log(currentDay);

    if (
      mouseX > marginSize + overflow &&
      mouseX < width - marginSize + overflow &&
      mouseY > marginSize + overflow &&
      mouseY < height - marginSize - overflow &&
      !selectingState
    ) {
      eventInfo.timeslots[user][closestCol].push(new TimeSlot(closestCol, closestRow0, closestRow1));
      lastColumn = closestCol;
    }
  }
}

function mouseDragged(_event) {
  let i = [marginSize, marginSize];

  if (user != -1) {
    if (mouseX < marginSize + overflow || mouseX > width - marginSize + overflow || mouseY < marginSize + overflow || mouseY > height - marginSize - overflow * 2 || selectingState) {
      return
    }
    const lastIndex = eventInfo.timeslots[user][lastColumn].length - 1;
    if (eventInfo.timeslots[user][lastColumn][lastIndex].row0 * gridsize + marginSize + overflow > mouseY && eventInfo.timeslots[user][lastColumn][lastIndex].dir == 1) {
      eventInfo.timeslots[user][lastColumn][lastIndex].dir = -1;
      eventInfo.timeslots[user][lastColumn][lastIndex].row0++;
    }
    else if (eventInfo.timeslots[user][lastColumn][lastIndex].row0 * gridsize + marginSize + overflow < mouseY && eventInfo.timeslots[user][lastColumn][lastIndex].dir == -1) {
      eventInfo.timeslots[user][lastColumn][lastIndex].dir = 1;
      eventInfo.timeslots[user][lastColumn][lastIndex].row0--;
    }
    if (eventInfo.timeslots[user][lastColumn][lastIndex].dir == 1) {
      i = snap(mouseX - marginSize - overflow, mouseY - marginSize - overflow);
    }
    else {
      i = snapUp(mouseX - marginSize - overflow, mouseY - marginSize - overflow);
    }
    if (eventInfo.timeslots[user][lastColumn][lastIndex].row1 != i[1]) {
      eventInfo.timeslots[user][lastColumn][lastIndex].row1 = i[1];
    }

  }
}

function mouseReleased(_event) {
  drawflag = false;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  init();
}

function init() {
  if (windowWidth < 400) {
    marginPercent = 20;
  }
  overflow = (width - marginSize * 2) % gridsize / 2;
  marginSize = width > height ? width / marginPercent : height / marginPercent;
  for(let i = 0; i < (width - marginSize*2)/gridsize-1; i++)
    eventInfo.timeslots[user].push([]);
}

function pillCollision(x, y, w, h, c) {
  let f1 = { x: x + c, y: y + c };
  let f2 = { x: x + w - c, y: y + c };
  let b = { x1: x + c, y1: y, x2: x + w - c, y2: y + h };

  let d2f1 = dist(mouseX, mouseY, f1.x, f1.y);
  let d2f2 = dist(mouseX, mouseY, f2.x, f2.y);

  if (d2f1 <= c || d2f2 <= c || (mouseX >= b.x1 && mouseX <= b.x2 && mouseY >= b.y1 && mouseY <= b.y2)) {
    return true;
  }
}
