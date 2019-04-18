var sketch = function(p) {
  var canvas;
  var boxes = [];
  var angle;
  var amp;
  var lambda;
  var rate;
  var cangle;

  p.amp = function(a) { if (a) amp = a; return amp; }
  p.angle = function(a) { if (a) angle = a; return angle; }
  p.lambda = function(l) { if (l) lambda = l; return lambda; }
  p.rate = function(r) { if (r) rate = r; return rate; }

  p.setup = function() {
    canvas = p.createCanvas(1200,600);
    cangle = 0;
    angle = 0;
    amp = 200;
    lambda = p.PI * 0.5;
    rate = -4;
    boxes = [];
    for (var i = 0; i < 80; i++) {
      var n = amp * p.sin(angle + i * lambda/40);
      boxes.push(n + p.height/2);
    }
  }

  p.draw = function() {
    p.background(0);
    p.fill(0x88);
    p.stroke(0xff);
    p.colorMode(p.HSB);
    var wid = p.width/boxes.length;
    boxes.forEach((v, i, a) => {
      p.fill((p.map(v, p.height/2-amp, p.height/2+amp, 0, 360) + cangle) % 360, 100, 100);
      cangle += p.radians(rate * -1);
      p.rect(i * wid, v, wid, 50);
      a[i] = amp * p.sin(angle + i * lambda/40) + p.height/2;
    });
    angle += p.radians(rate);
  }
};

var skt = new p5(sketch, 'game_box');
