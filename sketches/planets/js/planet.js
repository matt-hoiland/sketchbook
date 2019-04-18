function Planet(pos, mass, vel) {
  this.pos = pos
  this.mass = mass
  this.speed = 0
  this.vel = vel;
  this.force = new p5.Vector(0, 0);

  this.draw = function(p) {
    p.push()
    p.translate(this.pos.x, this.pos.y)
    p.ellipse(0, 0, mass, mass)
    p.stroke('green')
    p.strokeWeight(1)
    var arrow = p5.Vector.mult(this.vel, 10)
    p.line(0, 0, arrow.x, arrow.y)
    arrow = p5.Vector.mult(this.force, 1000)
    p.stroke('red')
    p.strokeWeight(2)
    p.line(0, 0, arrow.x, arrow.y)
    p.pop()
  }

  this.update = function(ps) {
    this.force.mult(0);
    ps.forEach((v, i, a) => {
      if (v != this) {
        var dir = p5.Vector.sub(v.pos, this.pos).normalize()
        var acc = 0.004 * this.mass * v.mass / (p5.Vector.dist(this.pos, v.pos))
        this.force.add(p5.Vector.mult(dir, acc))
      }
    })
    this.vel.add(this.force)
    this.pos.add(this.vel)
  }
}
