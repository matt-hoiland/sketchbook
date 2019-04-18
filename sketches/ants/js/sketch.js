var sketch = new p5((p) => {
  var canvas
  var grid
  var step
  var ant
  var dir

  p.setup = () => {
    canvas = p.createCanvas(600,600)
    grid = new Array(100)
    for (var i = 0; i < grid.length; i++) {
      grid[i] = new Array(100)
      for (var j = 0; j < grid.length; j++) {
        grid[i][j] = true;
      }
    }
    console.log(grid)
    step = 6
    ant = p.createVector(50, 50)
    dir = 0;
    p.background(0)
  }

  p.draw = () => {
    if (grid[ant.x][ant.y]) {
      dir = (dir + 1) % 4
      p.fill(0xff)
    } else {
      dir = (dir - 1 < 0 ? 3 : dir - 1)
      p.fill(0x00)
    }
    p.rect(ant.x * step, ant.y * step, step, step)
    grid[ant.x][ant.y] = !grid[ant.x][ant.y]
    switch (dir) {
      case 0:
        ant.y++; break;
      case 1:
        ant.x++; break;
      case 2:
        ant.y--; break;
      case 3:
        ant.x--; break;
      default:
        console.log("WRONG!!!! " + dir)
    }
  }
})
