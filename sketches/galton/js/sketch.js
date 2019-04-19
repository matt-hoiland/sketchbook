let cnv = null
let btn_refresh = null
let inp_resolution = null

let level_count = 0
let bucket_count = 0

let bucket = null

let margin = 10
let rate = 1

function triNum(n) {
  return (n ** 2 - n) / 2 + n
}

function setup() {
  inp_resolution = select('#resolution')
  btn_refresh = select('#refresh')
  btn_refresh.mousePressed(refresh)
  let element = select('#canvas-container')
  cnv = createCanvas(700, 500)
  cnv.parent(element)
  refresh()
}

let step
let tallest
let l_tall
let l_short

function draw() {
  background(0x80)
  fill(0xc0)
  stroke(0x80)
  if (buckets == null) {
    return
  }

  step = (width-2*margin)/buckets.length
  tallest = max(buckets)
  shortest = min(buckets)
  l_tall = log(height - 2*margin)/log(10)
  l_short = log(shortest/tallest * (height - 2*margin))/log(10)
  strokeWeight(floor(step/10))
  push()
  translate(0,height)
  for (let i = 0; i < buckets.length; i++) {
    // console.log(step, tallest)
    let h = buckets[i] / tallest * (height - 2*margin)
    h = log(h)/log(10)
    h = map(h, l_short, l_tall, 1, (height - 2*margin))
    rect(margin + step * i, -margin, step, -h)
  }

  for (let i = 0; i < rate; ++i) {
    update()
  }
}

function update() {
  let n = 0
  for (let i = 0; i < level_count; ++i) {
    n += floor(random(2))
  }
  buckets[n]++
}

function refresh() {
  level_count = Number(inp_resolution.value())
  if (Number.isNaN(level_count)) {
    level_count = 10
  }
  bucket_count = level_count + 1
  console.log(`level_count: ${level_count}, bucket_count: ${bucket_count}`)

  buckets = Array(bucket_count).fill(1)
}
