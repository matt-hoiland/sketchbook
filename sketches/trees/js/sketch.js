function initSketch(p) {
  let w = CANVAS_SIZE.DEFAULT;
  let h = CANVAS_SIZE.DEFAULT;

  let root;

  let angle;

  let slider;

  p.setup = function() {
    p.createCanvas(w, h);
    // createSlider()
    root = genTree(6,4);
    angle = p.PI/5;
    slider = p.createSlider(0, 180, 120);
    slider.position(10,10);
    slider.style('width', '360px')
  }

  p.draw = function() {
    let s = slider.value();
    console.log(s);
    p.push();
    p.background(51);
    p.stroke(0xffffff);
    root.draw(w/2, h, p.radians(s), 200, 6);
    p.pop();
  }

  function genTree(depth, bredth) {
    if (depth === 0) { return null; }
    let t = new Tree();
    for (let i = 0; i < bredth; i++) {
      let c = genTree(depth-1,bredth);
      if (c != null) {
        t.branches.push(c);
      }
    }
    return t;
  }

  function Tree() {
    this.branches = []

    this.draw = function(x, y, angle, len, weight) {
      p.push();
      p.strokeWeight(weight);
      p.translate(x,y);
      p.line(0,0,0,-len);
      p.translate(0,-len);
      p.rotate(-p.PI/4);
      let a = angle;
      for (let i = 0; i < this.branches.length; i++) {
        p.push();
        p.rotate(a);
        this.branches[i].draw(0,0, angle, 2*len/3, weight - 1);
        p.pop();
        a += angle;
      }
      p.pop();
    }
  }
}
