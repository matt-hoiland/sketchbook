function initSketch(p) {
  let points = [];
  let hexes = [];
  let s;
  let cnv;

  p.setup = function () {
    cnv = p.createCanvas(CANVAS_SIZE.DEFAULT,CANVAS_SIZE.DEFAULT);
    p.colorMode(p.HSB, 100);
    // frameRate(5);

    s = 40;
    let i = p.createVector(1,0);
    let j = p.createVector(0,-1).rotate(p.radians(-30));
    for (let x = 0; x < p.width/s; x++) {
      for (let y = 0; y < p.height/s; y++) {
        points.push(p5.Vector.add(p5.Vector.mult(i, x * s), p5.Vector.mult(j, y * s)));
        if (x != 0) {
          points.push(p5.Vector.add(p5.Vector.mult(i, -x * s), p5.Vector.mult(j, y * s)));
        }
        if (x != 0 && y != 0) {
          points.push(p5.Vector.add(p5.Vector.mult(i, -x * s), p5.Vector.mult(j, -y * s)));
        }
        if (y != 0) {
          points.push(p5.Vector.add(p5.Vector.mult(i, x * s), p5.Vector.mult(j, -y * s)));
        }
      }
    }
    for (let i = 0; i < points.length; i++) {
      hexes.push(new Hexagon(points[i], s/2, {h:53/360*100, s:100, b:p.random(50) + 50}));
    }
  }

  p.draw = function() {
    p.background(0);
    p.noStroke();
    p.push();
    p.translate(p.width/2, p.height/2);
    for (let i = 0; i < points.length; i++) {
      // point(points[i].x, points[i].y);
      hexes[i].draw();
      hexes[i].shiftColor();
      // hexes[i].c = color(53/360*100, 100, p.random(50) + 50);
    }
    p.pop();
  }

  function Hexagon(center, s, color) {
    this.center = center;
    this.s = s;
    this.c = color;
    this.fading = p.random(1) ? true : false;
    this.rate = (p.random(3) + 1) / 3;

    this.draw = function() {
      let up = p.createVector(0, -this.s);
      p.fill(this.c.h, this.c.s, this.c.b);
      p.beginShape();
      for (let i = 0; i < 6; i++) {
        let v = p5.Vector.add(up, this.center);
        p.vertex(v.x, v.y);
        up.rotate(p.radians(60));
      }
      p.endShape(p.CLOSE);
    }

    this.shiftColor = function() {
      // console.log("brightness: " + this.c.b);
      if (this.c.b >= 99) {
        // console.log("fading");
        this.fading = true;
      }
      if (this.c.b <= 25) {
        // console.log("brightening  ");
        this.fading = false;
      }
      this.c.b += this.fading ? -this.rate : this.rate;
    }
  }
}
