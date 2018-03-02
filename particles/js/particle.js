class Particle {

  constructor(x, y, dx, dy, decay) {
    this.x = x
    this.y = y
    this.dx = dx
    this.dy = dy
    this.decay = decay
    this.width = 25
    this.expansion = 1
    this.transparency = 1.0
    this.color = '100%, 100%, 100%'//`${random(101)}%, ${random(101)}%, ${random(101)}%`
  }

  next() {
    this.transparency -= this.decay;
    this.transparency = this.transparency > 0 ? this.transparency : 0
    this.x += this.dx
    this.y += this.dy
    this.width += this.expansion
    this.expansion -= .01
    this.dy -= 0.01
  }

  draw() {
    push()
    translate(this.x, this.y)
    noStroke()
    fill(color(`rgba(${this.color}, ${this.transparency})`))
    ellipse(0,0, this.width)
    pop()
  }
}
