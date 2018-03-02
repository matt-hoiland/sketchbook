let a = []

function generatePoint() {
  const min_theta = - radians(90 - 35);
  const max_theta = - radians(90 + 35);

  let angle = random() * (max_theta - min_theta) + min_theta
  let mag = (random(5) + 5) / 5
  let [dx, dy] = [mag * cos(angle), mag * sin(angle)]
  let [x, y] = [width * 0.5, height * 0.90]

  return new Particle(x, y, dx, dy, (random(10) + 80) / 20000.0)
}

function setup() {
  let cnv = createCanvas(500, 1000)
  background(0)

  a = Array(50).fill().map(generatePoint)
}

function draw() {
  let deletes = []
  background(0)
  for (let p of a) {
    p.draw()
    p.next()
    if (p.transparency === 0) {
      deletes.push(p)
    }
  }

  a = a.filter(p => !deletes.includes(p))

  a.push(generatePoint())
}
