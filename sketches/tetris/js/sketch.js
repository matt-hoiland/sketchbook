let colors = {
  'I': 'cyan',
  'J': 'blue',
  'L': 'orange',
  'O': 'yellow',
  'S': 'green',
  'T': 'purple',
  'Z': 'red'
}

class Mino {
  constructor() {
    this.position
  }
}

class Board {
  constructor() {
    this.width = 10
    this.height = 22
    this.board = Array(this.height).fill().map(() => Array(this.width).fill(null))
    this.cell_size = 20;
  }

  draw() {
    push()
    translate(width/2, height/2)
    translate(this.width / 2 * - this.cell_size, (this.height - 2) / 2 * - this.cell_size)

    for (let i = 2; i < this.height; i++) {
      for (let j = 0; j < this.width; j++) {
        push()
        translate(this.cell_size * j, this.cell_size * (i - 2))
        stroke(150)
        if (this.board[i][j] !== null) { fill(color(this.board[i][j])) }
        else { noFill() }
        rect(0, 0, this.cell_size, this.cell_size)
        pop()
      }
    }
    pop()
  }
}

let board

function setup() {
  createCanvas(512, 512);
  background(0)
  board = new Board()

  board.draw()
}
