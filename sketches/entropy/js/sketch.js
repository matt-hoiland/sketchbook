
function initSketch(p) {

  let cnv = null;
  let blues = [];
  let reds = [];
  let count = 500;
  let width = CANVAS_SIZE.DEFAULT;
  let height = CANVAS_SIZE.DEFAULT;

  p.setup = function() {
    cnv = p.createCanvas(width, height);
    p.ellipseMode(p.CENTER);
    p.angleMode(p.RADIANS);
    for (let i = 0; i < count; i++) {
      blues.push(new Particle(p.random(0, width/2), p.random(0, height), p.random(0, p.TWO_PI), 8, 'rgb(65, 187, 244)'));
      reds.push(new Particle(p.random(width*3/4, width), p.random(0, height), p.random(0, p.TWO_PI), 8, 'rgb(244, 66, 66)'));
    }
  }

  p.draw = function() {
    p.background(0xc0);
    for (let i = 0; i < count; i++) {
      blues[i].draw(p);
      blues[i].advance();
      blues[i].bounce(width, height);
      reds[i].draw(p);
      reds[i].advance();
      reds[i].bounce(width, height);
    }
  }
}
