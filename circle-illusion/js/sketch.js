256
class Circle {
  constructor(angle, start) {
    this.angle = angle
    this.position = start // [0 ... TWO_PI]

    // Shared constants
    this.magnitude = 150
    this.size = 30
    this.rate = TWO_PI / 180
  }

  draw() {
    push()
    noStroke()
    fill(color(`hsl(${floor(degrees(this.angle * 2))}, 100%, 50%)`))
    translate(width/2, height/2)
    rotate(this.angle)
    ellipse(0, this.magnitude * sin(this.position), this.size)
    pop()
  }

  advance() {
    this.position -= this.rate
    if (this.position < 0) {
      this.position += TWO_PI
    }
  }
}

let circle_count = 128
let circles = Array(circle_count).fill(null)

function setup() {
  createCanvas(400, 400)
  background(0)
  circles = circles.map((v, i, a) => new Circle(PI * i / circle_count, PI * i / circle_count))
}

function draw() {
  for (let circle of circles) {
    circle.draw()
    circle.advance()
  }
}
