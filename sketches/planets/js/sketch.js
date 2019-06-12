function initSketch(p) {
  let screen_ratio;
  p.screen_ratio = function(s) { if (s) screen_ratio = s; return s; }

  let canvas;
  p.canvas = function() { return canvas; }

  let earth;
  let moon;
  let mars;

  p.planets = function() { return [earth, moon]; };

  p.setup = function() {
    canvas = p.createCanvas(CANVAS_SIZE.DEFAULT, CANVAS_SIZE.DEFAULT);
    earth = new Planet(
      p.createVector(p.width * 0.25, p.height / 2),
      200,
      p.createVector(0,4)
    );
    moon = new Planet(
      p.createVector(p.width * 0.75, p.height / 2),
      50,
      p.createVector(0,-4)
    );
    // mars = new Planet(p.createVector(p.width * 0.5, p.height * 0.25), 70, p.createVector(0,2))
  }

  p.draw = function() {
    p.background(0xcc)
    p.fill(0x44)
    p.stroke(0xee)
    earth.draw(p)
    moon.draw(p)
    // mars.draw(p)
    earth.update([earth, moon])
    moon.update([earth, moon])
    // mars.update([earth, moon, mars])
  }
}
