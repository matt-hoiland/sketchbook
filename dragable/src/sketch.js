var cSize;
var cColor;

var xSlider;
var ySlider;

var origin = {x:0,y:0};
var step = 50;

var pressed = false;
var pressStart = {x: 0, y: 0};
var oSaved = {x: 0, y: 0};

function setup() {
  cSize = 500;
  cColor = color('#0d2034');

  cnv = createCanvas(cSize, cSize);
  cnv.mousePressed(mousePressedHandler);
  cnv.mouseMoved(mouseMovedHandler);
  cnv.mouseReleased(mouseReleasedHandler);
  cnv.mouseWheel(mouseWheelHandler);

  origin.x = width/2;
  origin.y = height/2;
}

function mousePressedHandler() {
  pressed = true;
  pressStart = {x: mouseX, y: mouseY};
  oSaved.x = origin.x;
  oSaved.y = origin.y;
}

function mouseMovedHandler() {
  if (!pressed) { return; }
  origin.x = oSaved.x + mouseX - pressStart.x;
  origin.y = oSaved.y + mouseY - pressStart.y;
}

function mouseReleasedHandler() {
  pressed = false;
}

function mouseWheelHandler(e) {
  console.log(e);
  if (e.deltaY > 0) {
    step += 3;
  } else {
    step -= 3;
  }
  if (step <= 0) {
    step = 3;
  }
}

function draw() {
  background(cColor);
  gridlines(origin, {x: step, y: step});
}

function gridlines(origin, delta) {
  // var c = color()
  stroke('#5d5d5d');
  strokeWeight(3);
  line(origin.x, 0, origin.x, height);
  line(0, origin.y, width, origin.y);

  strokeWeight(1)
  for (var x = 0; x < width; x += delta.x) {
    line(origin.x + x, 0, origin.x + x, height)
    line(origin.x - x, 0, origin.x - x, height)
  }
  for (var y = 0; y < height; y += delta.y) {
    line(0, origin.y + y, width, origin.y + y)
    line(0, origin.y - y, width, origin.y - y)
  }
}
