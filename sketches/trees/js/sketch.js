
var w = 1200;
var h = 600;

var root;

var angle;

var slider;

function setup() {
  createCanvas(w, h);
  // createSlider()
  root = genTree(6,4);
  angle = PI/5;
  slider = createSlider(0, 180, 120);
  slider.position(10,10);
  slider.style('width', '360px')
}

function draw() {
  var s = slider.value();
  console.log(s);
  push();
  background(51);
  stroke(0xffffff);
  root.draw(w/2, h, radians(s), 200, 6);
  pop();
}

function genTree(depth, bredth) {
  if (depth === 0) { return null; }
  var t = new Tree();
  for (var i = 0; i < bredth; i++) {
    var c = genTree(depth-1,bredth);
    if (c != null) {
      t.branches.push(c);
    }
  }
  return t;
}

function Tree() {
  this.branches = []

  this.draw = function(x, y, angle, len, weight) {
    push();
    strokeWeight(weight);
    translate(x,y);
    line(0,0,0,-len);
    translate(0,-len);
    rotate(-PI/4);
    var a = angle;
    for (var i = 0; i < this.branches.length; i++) {
      push();
      rotate(a);
      this.branches[i].draw(0,0, angle, 2*len/3, weight - 1);
      pop();
      a += angle;
    }
    pop();
  }
}
