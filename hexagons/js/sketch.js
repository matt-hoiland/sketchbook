var points = []
var hexes = []
var s;
var cnv;

function setup() {
  cnv = createCanvas(windowWidth,windowHeight)
  colorMode(HSB, 100)
  // frameRate(5)

  s = 40;
  var i = createVector(1,0)
  var j = createVector(0,-1).rotate(radians(-30))
  for (var x = 0; x < width/s; x++) {
    for (var y = 0; y < height/s; y++) {
      points.push(p5.Vector.add(p5.Vector.mult(i, x * s), p5.Vector.mult(j, y * s)))
      if (x != 0)
        points.push(p5.Vector.add(p5.Vector.mult(i, -x * s), p5.Vector.mult(j, y * s)))
      if (x != 0 && y != 0)
        points.push(p5.Vector.add(p5.Vector.mult(i, -x * s), p5.Vector.mult(j, -y * s)))
      if (y != 0)
        points.push(p5.Vector.add(p5.Vector.mult(i, x * s), p5.Vector.mult(j, -y * s)))
    }
  }
  for (var i = 0; i < points.length; i++) {
    hexes.push(new Hexagon(points[i], s/2, {h:53/360*100, s:100, b:random(50) + 50}))
  }
}

function draw() {
  background(0)
  noStroke()
  push()
  translate(width/2, height/2)
  for (var i = 0; i < points.length; i++) {
    // point(points[i].x, points[i].y)
    hexes[i].draw()
    hexes[i].shiftColor()
    // hexes[i].c = color(53/360*100, 100, random(50) + 50)
  }
  pop()
}

function Hexagon(center, s, color) {
  this.center = center
  this.s = s
  this.c = color
  this.fading = random(1) ? true : false;
  this.rate = (random(3) + 1) / 3;

  this.draw = function() {
    var up = createVector(0, -this.s)
    fill(this.c.h, this.c.s, this.c.b)
    beginShape()
    for (var i = 0; i < 6; i++) {
      var p = p5.Vector.add(up, this.center)
      vertex(p.x, p.y)
      up.rotate(radians(60))
    }
    endShape(CLOSE)
  }

  this.shiftColor = function() {
    // console.log("brightness: " + this.c.b)
    if (this.c.b >= 99) {
      // console.log("fading");
      this.fading = true;
    }
    if (this.c.b <= 25) {
      // console.log("brightening  ")
      this.fading = false;
    }
    this.c.b += this.fading ? -this.rate : this.rate;
  }
}
