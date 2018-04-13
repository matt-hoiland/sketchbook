function generatePoints(width, height, margin = 20, num = 100) {
  let points = new class extends Array {
    isAtLeastKFromAll(p, k = 20) {
      for (let n of this) {
        if (p.distanceTo(n) < k) {
          return false
        }
      }
      return true
    }

    draw() {
      for (let p of this) {
        push()
        translate(p.x, p.y)
        fill(230)
        stroke(0)
        strokeWeight(2)
        ellipse(0,0,6,6)
        pop()
      }
    }
  }();

  while (points.length < num) {
    let p = new Point(random(margin, width - margin), random(margin, height - margin))
    if (points.isAtLeastKFromAll(p)) {
      points.push(p);
    }
  }

  return points
}

function createSortedEdges(points) {
  let edges = []
  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      let [a, b] = [points[i], points[j]]
      edges.push({d: a.distanceTo(b), a: a, b: b})
    }
  }
  return edges.sort((a,b) => {
    if (a.d < b.d) {
      return -1
    }
    if (b.d < a.d) {
      return 1
    }
    return 0
  })
}

let points = null;
let edges = null;
let saved_edges = []
let i = 0
let sets = null;

function setup() {
  let cnv = createCanvas(600, 600)
  points = generatePoints(width, height)
  sets = new DisjointSet(points)
  edges = createSortedEdges(points)
  console.log(edges)
  frameRate(5)
}

function draw() {
  background(230)

  for (let e of saved_edges) {
    push()
    stroke('red')
    strokeWeight(3)
    line(e.a.x, e.a.y, e.b.x, e.b.y)
    pop()
  }

  if (sets.num_sets > 1) {
    let candidate = edges[i]
    if (sets.areDisjoint(candidate.a, candidate.b)) {
      sets.union(candidate.a, candidate.b)
      saved_edges.push(candidate)
    }
    push()
    stroke('blue')
    strokeWeight(3)
    line(candidate.a.x, candidate.a.y, candidate.b.x, candidate.b.y)
    pop()
  }

  points.draw()
  i++
}
