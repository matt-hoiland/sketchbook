var block_size = 30
var board;

var sketch = new p5((p) => {
  var canvas;
  var mino;
  var gravity;

  p.setup = () => {
    canvas = p.createCanvas(10 * block_size, 20 * block_size)

    p.background(0x44)
    var grid = [[false, true, false], [true, true, true], [false, false, false]]
    mino = new Mino(10, 5, grid, '#b642f4')
    board = new Board()
    gravity = 50;
  }

  p.draw = () => {
    // drawbg()
    board.draw(p)
    if (mino && board.collide(mino)) {
      board.merge(mino)
      mino = null
    }
    if (mino && gravity-- == 0) {
      mino.row++;
      gravity = 50;
    }
    if (mino) mino.draw(p)
  }

  p.keyPressed = () => {
    switch (p.keyCode) {
      case p.LEFT_ARROW: mino.col--; break;
      case p.RIGHT_ARROW: mino.col++; break;
      case p.UP_ARROW: mino.rotate(); break;
      case p.DOWN_ARROW: mino.row++; break;
    }
  }

  function drawbg() {
    p.fill(0x44)
    p.stroke(0x66)
    p.strokeWeight(4)
    for (var i = 0; i < 20; i++) {
      for (var j = 0; j < 10; j++) {
        p.rect(block_size * j, block_size * i, block_size, block_size)
      }
    }
  }
})

function Mino(row, col, grid, color) {
  this.row = row
  this.col = col
  this.grid = grid
  this.color = color

  this.draw = (p) => {
    p.fill(this.color)
    p.stroke(0xff)
    p.strokeWeight(2)
    for (var i = 0; i < this.grid.length; i++) {
      for (var j = 0; j < this.grid.length; j++) {
        if(this.grid[i][j]) {
          p.rect((this.col + j) * block_size, (this.row + i) * block_size, block_size, block_size)
        }
      }
    }
  }

  this.rotate = () => {
    var grid = []
    for (var i = 0; i < this.grid.length; i++) {
      var row = []
      for (var j = 0; j < this.grid.length; j++) {
        row.push(this.grid[j][this.grid.length - 1 - i])
      }
      grid.push(row)
    }
    this.grid = grid
  }

  this.edge = () => {
    var edge = []
    for (var i = this.grid.length - 1; i >= 0; i--) {
      for (var j = 0; j < this.grid[i].length; j++) {
        if (this.grid[i][j]) {
          edge.push(this.row + i);
        }
      }
    }
    return edge;
  }
}

function Board() {
  this.grid = []
  for (var i = 0; i < 20; i++) {
    var row = []
    for (var j = 0; j < 10; j++) {
      row.push(null)
    }
    this.grid.push(row)
  }
  this.frontier = [19,19,19,19,19,19,19,19,19,19]

  this.draw = (p) => {
    for (var i = 0; i < this.grid.length; i++) {
      for (var j = 0; j < this.grid[i].length; j++) {
        if (this.grid[i][j] !== null) {
          // console.log((i * block_size) + ", " + (j * block_size))
          p.fill(this.grid[i][j])
          // p.fill(0xff);
        } else {
          p.fill(0x44)
        }
        p.rect(i * block_size, j * block_size, block_size, block_size)
      }
    }
  }

  this.collide = (mino) => {
    var edge = mino.edge()
    for (var i = 0; i < edge.length; i++) {
      if (edge[i] == 19) {
        return true;
      }
    }
    return false;
  }

  this.merge = (mino) => {
    for (var i = 0; i < mino.grid.length; i++) {
      for (var j = 0; j < mino.grid[i].length; j++) {
        if (mino.grid[i][j]) {
          this.grid[mino.row + i][mino.col + j] = mino.color
        }
      }
    }
  }
}
