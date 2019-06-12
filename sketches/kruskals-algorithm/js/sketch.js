function initSketch(p) {
  function generatePoints(width, height, margin = 20, num = 100) {
    let points = new class extends Array {
      isAtLeastKFromAll(pnt, k = 20) {
        for (let n of this) {
          if (pnt.distanceTo(n) < k) {
            return false;
          }
        }
        return true;
      }

      draw() {
        for (let pnt of this) {
          p.push();
          p.translate(pnt.x, pnt.y);
          p.fill(230);
          p.stroke(0);
          p.strokeWeight(2);
          p.ellipse(0,0,6,6);
          p.pop();
        }
      }
    }();

    while (points.length < num) {
      let pnt = new Point(p.random(margin, width - margin), p.random(margin, height - margin));
      if (points.isAtLeastKFromAll(pnt)) {
        points.push(pnt);
      }
    }

    return points;
  }

  function createSortedEdges(points) {
    let edges = [];
    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
        let [a, b] = [points[i], points[j]];
        edges.push({d: a.distanceTo(b), a: a, b: b});
      }
    }
    return edges.sort((a,b) => {
      if (a.d < b.d) {
        return -1;
      }
      if (b.d < a.d) {
        return 1;
      }
      return 0;
    })
  }

  let points = null;
  let edges = null;
  let saved_edges = [];
  let i = 0;
  let sets = null;

  p.setup = function() {
    let cnv = p.createCanvas(CANVAS_SIZE.DEFAULT, CANVAS_SIZE.DEFAULT);
    points = generatePoints(p.width, p.height);
    sets = new DisjointSet(points);
    edges = createSortedEdges(points);
    console.log(edges);
    p.frameRate(5);
  }

  p.draw = function() {
    p.background(230);

    for (let e of saved_edges) {
      p.push();
      p.stroke('red');
      p.strokeWeight(3);
      p.line(e.a.x, e.a.y, e.b.x, e.b.y);
      p.pop();
    }

    if (sets.num_sets > 1) {
      let candidate = edges[i];
      if (sets.areDisjoint(candidate.a, candidate.b)) {
        sets.union(candidate.a, candidate.b);
        saved_edges.push(candidate);
      }
      p.push();
      p.stroke('blue');
      p.strokeWeight(3);
      p.line(candidate.a.x, candidate.a.y, candidate.b.x, candidate.b.y);
      p.pop();
    }

    points.draw();
    i++;
  }
}
