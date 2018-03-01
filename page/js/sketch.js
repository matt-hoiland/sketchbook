const sketch = new p5((p) => {
  p.setup = function() {
    let container = p.select('#canvas-container')
    console.log(container)
    let cnv = p.createCanvas(container.width, container.height)
    cnv.parent(container)
    p.background('pink')
  }
})
