var sketch = new p5(function(p) {
  var screen_ratio;
  p.screen_ratio = function(s) { if (s) screen_ratio = s; return s; }

  var canvas;
  p.canvas = function() { return canvas; }

  var earth;
  var moon;
  var mars;

  p.planets = function() { return [earth, moon]; }

  p.setup = function() {
    screen_ratio = {x:0.90, y:0.75}
    canvas = p.createCanvas(p.windowWidth * screen_ratio.x, p.windowHeight * screen_ratio.y)
    earth = new Planet(p.createVector(p.width * 0.25, p.height / 2), 200, p.createVector(0,4))
    moon = new Planet(p.createVector(p.width * 0.75, p.height / 2), 50, p.createVector(0,-4))
    // mars = new Planet(p.createVector(p.width * 0.5, p.height * 0.25), 70, p.createVector(0,2))
  }

  p.windowResized = function() {
    canvas = p.resizeCanvas(p.windowWidth * screen_ratio.x, p.windowHeight * screen_ratio.y)
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
}, 'game_box')
