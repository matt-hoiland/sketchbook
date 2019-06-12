function initSketch(p) {
  let canvas;
  let ratio = 0.90;
  let sam;

  p.ratio = function(r) {
    if (r) {
      ratio = r; p.windowResized();
    } return ratio
  };

  p.setup = function() {
    console.log('Hello world!');
    canvas = p.createCanvas(CANVAS_SIZE.DEFAULT, CANVAS_SIZE.DEFAULT);
    sam = new Block(p.createVector(p.width/2, p.height * 0.75), 60, 100, p.color(245,0,0));
  }

  p.draw = function() {
    p.noStroke();
    p.background(0xcc);
    p.fill(0x88);
    p.rect(0, p.height * 0.75, p.width, p.height * 0.25);
    sam.draw(p);
  }

  p.windowResized = function() {
    canvas = p.resizeCanvas(p.windowWidth * ratio, p.windowHeight * ratio);
  }

  p.keyPressed = function() {
    if (p.keyCode == 0x20) { // space
      sam.press();
    }
  }

  p.keyReleased = function() {
    if (p.keyCode == 0x20) { // space
      sam.release();
    }
  }
}
