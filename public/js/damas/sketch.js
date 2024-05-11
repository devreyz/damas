

function setup() {
  // put setup code here
  createCanvas(window.innerWidth, window.innerHeight);
  background("#4668a9");
}

let lastPos = {
  x: 0,
  y: 0,
};
function draw() {
  // background('#000');
  fill("#ff3333");
  stroke("#000");
  circle(mouseX, mouseY, 3, 3);
  lastPos.x = mouseX;
  lastPos.y = mouseY;
}
window.onresize = () => setup();
