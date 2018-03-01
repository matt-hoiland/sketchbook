var tree

var s = new p5((p) => {
  var canvas
  var interval

  p.genTree =  function generateTree(n) {
      var t = new Tree(p.random(-p.QUARTER_PI, p.QUARTER_PI), p.random(1,8) * n)
      if (n == 0) {
        return t
      }
      for (var i = p.floor(p.random(1,4)); i > 0; i--) {
        t.add(generateTree(n - 1))
      }
      return t
  }

  p.setup = () => {
    canvas = p.createCanvas(p.windowWidth, p.windowHeight * 3 / 4)
    tree = p.genTree(12)
    tree.a = 0
    interval = setInterval(() => {
      tree = p.genTree(12)
      tree.a = 0
    }, 5000)
  }

  p.draw = () => {
    p.background(42)
    p.fill(0)
    p.noStroke()
    p.translate(p.width/2, p.height)
    tree.draw(p)
  }

  p.windowResized = () => {
    canvas = p.resizeCanvas(p.windowWidth, p.windowHeight * 3 / 4);
  }
})

var factor = 150

function Tree(a, l) {
  this.a = a
  this.l = l
  this.h = undefined
  this.cs = []

  this.height = () => {
    if (this.h !== undefined) {
      return this.h
    }
    if (this.cs.length == 0) {
      this.h = 1
    } else {
      this.h = this.cs.reduce((a, b) => {
        return Math.max(a, b.height())
      }, 0)
    }
    return this.h
  }

  this.add = (t) => {
    this.cs.push(t)
    if (this.height() <= t.height()) {
      this.h = t.h + 1
    }
  }

  this.draw = (p) => {
    p.push()
    p.rotate(this.a)
    var w = this.height() * this.height() * this.height() / factor;
    var h = this.l
    p.rect(-w/2, 0, w, -h)
    // p.stroke(p.color("red"))
    // p.line(0,0,0,-h + 10)
    p.translate(0,-h)
    this.cs.forEach((v) => {
      v.draw(p);
    })
    p.pop()
  }
}
