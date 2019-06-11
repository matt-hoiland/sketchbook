
class Circle {
  constructor(angle, start) {
    this.angle = angle;
    this.position = start; // [0 ... TWO_PI]

    // Shared constants
    this.magnitude = 150;
    this.size = 30;
    this.rate = 2*Math.PI / 180;
  }

  draw(p) {
    p.push();
    p.noStroke();
    p.fill(p.color(`hsl(${p.floor(p.degrees(this.angle * 2))}, 100%, 50%)`));
    p.translate(p.width/2, p.height/2);
    p.rotate(this.angle);
    p.ellipse(0, this.magnitude * p.sin(this.position), this.size);
    p.pop();
  }

  advance() {
    this.position -= this.rate;
    if (this.position < 0) {
      this.position += 2*Math.PI;
    }
  }
}

function initSketch(p) {

  let circle_count = 12;
  let circles = Array(circle_count).fill(null);

  p.setup = function() {
    p.createCanvas(CANVAS_SIZE.DEFAULT, CANVAS_SIZE.DEFAULT);
    p.background(0);
    circles = circles.map((v, i, a) => new Circle(Math.PI * i / circle_count, Math.PI * i / circle_count));
  }

  p.draw = function() {
    p.background(0);
    for (let circle of circles) {
      circle.draw(p);
      circle.advance();
    }
  }
}
