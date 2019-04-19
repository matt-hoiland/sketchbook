
let cnv = null;
let blues = [];
let reds = [];
let count = 500;

function setup() {
  cnv = createCanvas(0x200, 0x100);
  ellipseMode(CENTER);
  angleMode(RADIANS);
  for (let i = 0; i < count; i++) {
    blues.push(new Particle(random(0, 0x50), random(0, 0x100), random(0, TWO_PI), 8, 'rgb(65, 187, 244)'));
    reds.push(new Particle(random(0x150, 0x200), random(0, 0x100), random(0, TWO_PI), 8, 'rgb(244, 66, 66)'));
  }
}

function draw() {
  background(0xc0);
  for (let i = 0; i < count; i++) {
    blues[i].draw();
    blues[i].advance();
    blues[i].bounce(width, height);
    reds[i].draw();
    reds[i].advance();
    reds[i].bounce(width, height);
  }
}
