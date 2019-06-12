function initSketch(p) {
  let focus = p.createVector(0, 20);
  let directrix = {
    p1: p.createVector(-200, -20),
    p2: p.createVector(200, -20)
  };
  let height = 512;
  let width = 512;
  let tolerance = 10;

  let selected = null;
  let saved = null;
  let m0 = p.createVector(0, 0);

  p.setup = () => {
    let cnv = p.createCanvas(CANVAS_SIZE.DEFAULT, CANVAS_SIZE.DEFAULT);
    cnv.mousePressed(selectObj);
    cnv.mouseMoved(moveObj);
    cnv.mouseReleased(releaseObj);
  };

  function selectObj(e) {
    let { offsetX, offsetY } = e;
    let m = p.createVector(offsetX, offsetY);
    toVectorSpace(m);

    if (test(m, focus, tolerance)) {
      selected = focus;
      saved = focus.copy();
      m0 = m;
      console.log("FOCUS!!!");
    } else if (test(m, directrix.p1, tolerance)) {
      selected = directrix.p1;
      saved = directrix.p1.copy();
      m0 = m;
      console.log("DIRECTRIX P1!!!");
    } else if (test(m, directrix.p2, tolerance)) {
      selected = directrix.p2;
      saved = directrix.p2.copy();
      m0 = m;
      console.log("DIRECTRIX P2!!!");
    }
  }

  function test(m, v, t) {
    return t ** 2 > (v.x - m.x) ** 2 + (v.y - m.y) ** 2;
  }

  function toVectorSpace(m) {
    m.sub(p.createVector(width/2, height/2));
    m.y *= -1;
  }

  function moveObj(e) {
    if (selected === null) {
      return;
    }

    let { offsetX, offsetY } = e;
    let m = p.createVector(offsetX, offsetY);
    toVectorSpace(m);
    m.sub(m0);
    selected.x = saved.x + m.x;
    selected.y = saved.y + m.y;
  }

  function releaseObj(e) {
    console.log(e);
    selected = null;
  }

  p.draw = () => {
    p.background(42);

    p.push();

    p.translate(width/2, height/2);
    p.scale(1, -1);

    p.stroke(0x80);
    p.strokeWeight(1);
    p.line(- width / 2, 0, width / 2, 0);
    p.line(0, - height / 2, 0, height / 2);

    p.stroke(0xff);
    p.strokeWeight(2);
    p.line(directrix.p1.x, directrix.p1.y, directrix.p2.x, directrix.p2.y);

    p.noStroke();
    p.fill(0xff);
    p.ellipse(focus.x, focus.y, tolerance);
    p.ellipse(directrix.p1.x, directrix.p1.y, tolerance);
    p.ellipse(directrix.p2.x, directrix.p2.y, tolerance);

    let vf = p.createVector(focus.x, focus.y);
    let v0 = p.createVector(directrix.p1.x, directrix.p1.y);
    let v1 = p.createVector(directrix.p2.x, directrix.p2.y);

    let d = p5.Vector.sub(v1, v0);
    let num_points = 250;

    for (let i = - num_points * 2 / 5; i < num_points; i += 1) {
      let n = p5.Vector.add(v0, p5.Vector.mult(d, i / (num_points / 5)));

      let u = d.copy();
      u.normalize();
      u.rotate(p.HALF_PI) // normal to the directrix;

      let t = p5.Vector.sub(n, vf);
      let c = p5.Vector.div(t, 2);
      c.add(vf);
      // p.ellipse(c.x, c.y, 5);
      t.normalize();
      t.rotate(p.HALF_PI) // Tangent slope;
      let l = intersect(n, u, c, t);

      p.ellipse(l.x, l.y, 5);
    }

    p.pop();
  }

  function intersect(v0, v, u0, u) {
    let t = ((v0.x * u.y - u0.x * u.y) - (v0.y * u.x - u0.y * u.x)) / (v.y *  u.x - v.x * u.y);
    let o = v0.copy();
    let d = v.copy();
    d.mult(t);
    o.add(d);
    return o;
  }
}
