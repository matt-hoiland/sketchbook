let colors = {
  'I': 'cyan',
  'J': 'blue',
  'L': 'orange',
  'O': 'yellow',
  'S': 'green',
  'T': 'purple',
  'Z': 'red'
};

class Mino {
  constructor() {
    this.position;
  }
}

class Board {
  constructor() {
    this.width = 10;
    this.height = 22;
    this.board = Array(this.height).fill().map(() => Array(this.width).fill(null));
    this.cell_size = 20;
  }

  draw(p) {
    p.push();
    p.translate(p.width/2, p.height/2);
    p.translate(this.width / 2 * - this.cell_size, (this.height - 2) / 2 * - this.cell_size);

    for (let i = 2; i < this.height; i++) {
      for (let j = 0; j < this.width; j++) {
        p.push();
        p.translate(this.cell_size * j, this.cell_size * (i - 2));
        p.stroke(150);
        if (this.board[i][j] !== null) { p.fill(p.color(this.board[i][j])); }
        else { p.noFill(); }
        p.rect(0, 0, this.cell_size, this.cell_size);
        p.pop();
      }
    }
    p.pop();
  }
}

let board;

function initSketch(p) {
  p.setup = function() {
    p.createCanvas(CANVAS_SIZE.DEFAULT, CANVAS_SIZE.DEFAULT);
    p.background(0);
    board = new Board();

    board.draw(p);
  }
}
