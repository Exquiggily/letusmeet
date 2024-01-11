const gridsize = 40;
const pointSize = 3;
const SM = 3;

let marginSize = 20;
let marginPercent = 10;
let drawflag = false;
let timeslots = [{row:0,col0:0,col1:1}];
let user = 0;
let eventInfo = {
  eventName:"default",
  attendies:["Default"],
  timeslots:[[{row:0,col0:0,col1:1, dir: 1}]],
};

function setup() {
  createCanvas(windowWidth, windowHeight);
  init();
}

function draw() {
  background(220);
  noStroke();
  
  fill(100);
  
  for(let i = 0; i < eventInfo.timeslots.length; i++){
    for(let j = 0; j< eventInfo.timeslots[i].length; j++){
      rect((gridsize*(eventInfo.timeslots[i][j].row)+SM)+marginSize,gridsize*(eventInfo.timeslots[i][j].col0)+SM*eventInfo.timeslots[i][j].dir+marginSize,gridsize-SM*2,(gridsize*((eventInfo.timeslots[i][j].col1+1) - (eventInfo.timeslots[i][j].col0+1)))-SM*2*eventInfo.timeslots[i][j].dir,5);
    }
  }
fill(150);
  circle(mouseX,mouseY,10);
  grid(marginSize,marginSize,width-marginSize,height-marginSize);
  if(drawflag){
    fill("red");
    circle(20,20,5);
  }
}

function grid(x,y,x2,y2){
  for(let i = 0; i< (y2-y)/gridsize; i++){
    for(let j = 0; j < (x2-x)/gridsize;j++){
      circle(x+(j*gridsize),y+(i*gridsize),pointSize);
    }
  }
}

function snap(x,y){
  return [ceil(x/gridsize) , ceil(y/gridsize)];
}
function snapUp(x,y){
  return [ceil(x/gridsize) ,floor(y/gridsize)];
}

function mousePressed(_event){
  drawflag = true;
  let i = snap(mouseX-marginSize,mouseY-marginSize);
  console.log(i);
  if(user != -1){
    eventInfo.timeslots[user].push( {row: i[0]-1, col0:i[1]-1, col1: i[1], dir: 1});
  }
}//flp the square coords when going from a down to an up
function mouseDragged(_event){
  let i = [marginSize,marginSize];
  let dir = true;
  if(eventInfo.timeslots[user][eventInfo.timeslots[user].length-1].col0*gridsize+marginSize > mouseY &&eventInfo.timeslots[user][eventInfo.timeslots[user].length-1].dir == 1){ //this line with else is causeing flickering
    i = snapUp(mouseX-marginSize,mouseY-marginSize);
    dir = false;
  }
  else{
  i = snap(mouseX-marginSize,mouseY-marginSize);
  }
  if(user != -1 && eventInfo.timeslots[user][eventInfo.timeslots[user].length-1].col1 != i[1]){
    eventInfo.timeslots[user][eventInfo.timeslots[user].length-1].col1 = i[1];
    eventInfo.timeslots[user][eventInfo.timeslots[user].length-1].dir = dir ? 1 : -1;

  }
}
function mouseReleased(_event){
  drawflag = false;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  init();
}

function init(){
  if(windowWidth < 400){
    marginPercent = 20;
  }
  marginSize = width > height ? width/marginPercent: height/marginPercent;
}
