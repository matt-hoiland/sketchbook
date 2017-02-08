var square



function setup() {
  createCanvas(400,400)
  square = new Square([30,30], 24, PI/4)
}

function draw() {
  background(51);
  square.draw()
  rect(height/2, width/2, 100, 100);
  square.angle += 0.01
}

function Square(center, edge_length, angle) {
  this.center = center
  this.edge_length = edge_length
  this.angle = angle

  this.draw = function() {
    push()
    translate(this.center[0], this.center[1])
    rotate(this.angle)
    rect(-this.edge_length/2, -this.edge_length/2, this.edge_length, this.edge_length)
    pop()
  }
}
