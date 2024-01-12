const gridsize = 40;
const pointSize = 3;
const SM = 3;

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
  timeslots: [[{ col: 0, row0: 0, row1: 1, dir: 1 , sel: false}]],
};

let UIState = {
  editButton:{x:10,y:10,width:40,height:20,curve:10, pressed: false}
};
let selectingState = false;

function setup() {
  createCanvas(windowWidth, windowHeight);
  init();
  textAlign(CENTER);
  UIState.editButton.x = width / 2 - (UIState.editButton.width/2);
  UIState.editButton.y = marginSize/2 - (UIState.editButton.height/2);
  
}

function draw() {
  background(220);
  noStroke();

  fill(100, 50);

  if(user != -1 || modeView){
    for (let i = 0; i < eventInfo.timeslots.length; i++) {
      for (let j = 0; j < eventInfo.timeslots[i].length; j++) {
        if(eventInfo.timeslots[i][j].sel){
          fill('red');
        }
        else{
          fill(100,50)
        }
        rect(
          (gridsize * (eventInfo.timeslots[i][j].col) + SM) + marginSize + overflow,
          gridsize * (eventInfo.timeslots[i][j].row0) + SM * eventInfo.timeslots[i][j].dir + marginSize + overflow,
          gridsize - SM * 2,
          (gridsize * ((eventInfo.timeslots[i][j].row1 + 1) - (eventInfo.timeslots[i][j].row0 + 1))) - SM * 2 * eventInfo.timeslots[i][j].dir,
          5
        );
      }
    }
  }
  else{

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
  else{
    fill(150);
    t = "edit";
  }
  rect(UIState.editButton.x,UIState.editButton.y,UIState.editButton.width,UIState.editButton.height,UIState.editButton.curve);
  //circle(width / 2,marginSize/2,20);
  fill(250);
  text(t,width/2,marginSize/2 + textSize()/4);
  pop();
}

function snap(x, y) {
  return [ceil(x / gridsize), ceil(y / gridsize)];
}

function snapUp(x, y) {
  return [ceil(x / gridsize), floor(y / gridsize)];
}

function mousePressed(_event) {
  if(dist(mouseX,mouseY,UIState.editButton.x+UIState.editButton.width/2,UIState.editButton.y+UIState.editButton.height/2) < UIState.editButton.width/2){
    UIState.editButton.pressed = !UIState.editButton.pressed;
  }
  drawflag = true;
  let closestGridPosition = snap(mouseX - marginSize - overflow, mouseY - marginSize - overflow);

  // console.log(closestGridPosition);
  console.log("mouse x: " + mouseX + " mouse y: " + mouseY);
  
  if (user != -1) {
    for (var i = 0; i < eventInfo.timeslots[user].length; i++) {
      var currentCol = closestGridPosition[0] - 1;
      var currentRow0 = closestGridPosition[1] - 1;
      var currentRow1 = closestGridPosition[1];

      eventInfo.timeslots[user][i].sel = false;
      selectingState = false;

      if (eventInfo.timeslots[user][i].col == currentCol) {
        if (eventInfo.timeslots[user][i].dir == 1) { // going down -> row0 < row1
          if (currentRow0 >= eventInfo.timeslots[user][i].row0 && currentRow1 <= eventInfo.timeslots[user][i].row1) {
            eventInfo.timeslots[user][i].sel = true;
            selectingState = true;
          }
        }
        else { // going up -> row0 > row1
          if (currentRow0 <= eventInfo.timeslots[user][i].row0 && currentRow1 >= eventInfo.timeslots[user][i].row1) {
            eventInfo.timeslots[user][i].sel = true;
            selectingState = true;
          }
        }
      }
    }
    
    if (
      mouseX > marginSize + overflow &&
      mouseX < width - marginSize + overflow &&
      mouseY > marginSize + overflow &&
      mouseY < height - marginSize - overflow &&
      !selectingState
      ) {
      eventInfo.timeslots[user].push({ col: closestGridPosition[0] - 1, row0: closestGridPosition[1] - 1, row1: closestGridPosition[1], dir: 1, sel: false });
    }
  }
} 

function mouseDragged(_event) {
  let i = [marginSize, marginSize];
  
  if (user != -1) {
    if (mouseX < marginSize + overflow || mouseX > width - marginSize + overflow || mouseY < marginSize + 2 || mouseY > height - marginSize - 2 || selectingState) {
      return
    }

    if (eventInfo.timeslots[user][eventInfo.timeslots[user].length - 1].row0 * gridsize + marginSize + overflow > mouseY && eventInfo.timeslots[user][eventInfo.timeslots[user].length - 1].dir == 1) {
      eventInfo.timeslots[user][eventInfo.timeslots[user].length - 1].dir = -1;
      eventInfo.timeslots[user][eventInfo.timeslots[user].length - 1].row0++;
    }
    else if (eventInfo.timeslots[user][eventInfo.timeslots[user].length - 1].row0 * gridsize + marginSize + overflow < mouseY && eventInfo.timeslots[user][eventInfo.timeslots[user].length - 1].dir == -1) {
      eventInfo.timeslots[user][eventInfo.timeslots[user].length - 1].dir = 1;
      eventInfo.timeslots[user][eventInfo.timeslots[user].length - 1].row0--;
    }
    if (eventInfo.timeslots[user][eventInfo.timeslots[user].length - 1].dir == 1) {
      i = snap(mouseX - marginSize - overflow, mouseY - marginSize - overflow);
    }
    else {
      i = snapUp(mouseX - marginSize - overflow, mouseY - marginSize - overflow);
    }
    if (eventInfo.timeslots[user][eventInfo.timeslots[user].length - 1].row1 != i[1]) {
      eventInfo.timeslots[user][eventInfo.timeslots[user].length - 1].row1 = i[1];
    }
    console.log(eventInfo.timeslots[user][eventInfo.timeslots[user].length - 1].row0);
    console.log(eventInfo.timeslots[user][eventInfo.timeslots[user].length - 1].row0);
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
}
