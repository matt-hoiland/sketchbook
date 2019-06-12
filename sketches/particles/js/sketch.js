function initSketch(p) {
  let a = [];

  function generatePoint() {
    const min_theta = - p.radians(90 - 35);
    const max_theta = - p.radians(90 + 35);

    let angle = p.random() * (max_theta - min_theta) + min_theta;
    let mag = (p.random(5) + 5) / 5;
    let [dx, dy] = [mag * p.cos(angle), mag * p.sin(angle)];
    let [x, y] = [p.width * 0.5, p.height * 0.90];

    return new Particle(x, y, dx, dy, (p.random(10) + 80) / 20000.0);
  }

  p.setup = function() {
    let cnv = p.createCanvas(CANVAS_SIZE.DEFAULT, CANVAS_SIZE.DEFAULT);
    p.background(0);

    a = Array(50).fill().map(generatePoint);
  }

  p.draw = function() {
    let deletes = [];
    p.background(0);
    for (let pnt of a) {
      pnt.draw(p);
      pnt.next();
      if (pnt.transparency === 0) {
        deletes.push(pnt);
      }
    }

    a = a.filter(pnt => !deletes.includes(pnt));

    a.push(generatePoint());
  }
}
