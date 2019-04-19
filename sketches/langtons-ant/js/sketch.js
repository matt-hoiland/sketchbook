let rate = 100
const gridsize = 750
const canvassize = 750

let dnaString = 'lrrrrlllrrr'
let dna = []

let colors = [
  'red',
  'orange',
  'yellow',
  'lime',
  'green',
  'skyblue',
  'blue',
  'purple',
  'pink',
  'white',
  'brown'
]

var sketch = new p5((p) => {
  for (let i = 0; i < dnaString.length; ++i) {
    switch (dnaString.charAt(i)) {
      case 'l': dna.push(+1); break;
      case 'r': dna.push(-1); break;
    }
  }
  var canvas
  var grid
  var step
  var ant
  var dir

  p.setup = () => {
    canvas = p.createCanvas(canvassize,canvassize)
    grid = Array(gridsize).fill(null).map(() => Array(gridsize).fill(0))
    console.log(grid)
    step = p.floor(canvassize/gridsize)
    ant = p.createVector(gridsize/2, gridsize/2)
    dir = 0;
    p.background(0)
    p.noStroke()
  }

  p.draw = () => {
    for (let i = 0; i < rate; i++) {
      if (dna[grid[ant.x][ant.y]] > 0) {
        dir = (dir + 1) % 4
      } else {
        dir = (dir - 1 < 0 ? 3 : dir - 1)
      }
      p.fill(colors[grid[ant.x][ant.y]])
      p.rect(ant.x * step, ant.y * step, step, step)
      grid[ant.x][ant.y]++
      grid[ant.x][ant.y] %= dna.length
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
      if (ant.y >= gridsize) {
        ant.y = 0
      }
      if (ant.y < 0) {
        ant.y = gridsize - 1
      }
      if (ant.x >= gridsize) {
        ant.x = 0
      }
      if (ant.x < 0) {
        ant.x = gridsize - 1
      }
    }
  }
})
