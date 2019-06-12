function initSketch(p) {
  let cnv = null;
  let btn_refresh = null;
  let inp_resolution = null;

  let level_count = 10;
  let bucket_count = 10;

  let bucket = null;

  let margin = 10;
  let rate = 1;

  let width = CANVAS_SIZE.DEFAULT;
  let height = CANVAS_SIZE.DEFAULT;

  function triNum(n) {
    return (n ** 2 - n) / 2 + n;
  }

  function setupFunction() {
    // inp_resolution = select('#resolution');
    // btn_refresh = select('#refresh');
    // btn_refresh.mousePressed(refresh);
    // let element = select('#canvas-container');
    cnv = p.createCanvas(width, height);
    // cnv.parent(element);
    refresh();
  }

  let step;
  let tallest;
  let l_tall;
  let l_short;

  function drawFunction() {
    p.background(0x80);
    p.fill(0xc0);
    p.stroke(0x80);
    if (buckets == null) {
      return;
    }

    step = (width-2*margin)/buckets.length;
    tallest = p.max(buckets);
    shortest = p.min(buckets);
    l_tall = p.log(height - 2*margin)/p.log(10);
    l_short = p.log(shortest/tallest * (height - 2*margin))/p.log(10);
    p.strokeWeight(p.floor(step/10));
    p.push();
    p.translate(0,height);
    for (let i = 0; i < buckets.length; i++) {
      // console.log(step, tallest);
      let h = buckets[i] / tallest * (height - 2*margin);
      h = p.log(h)/p.log(10);
      h = p.map(h, l_short, l_tall, 1, (height - 2*margin));
      p.rect(margin + step * i, -margin, step, -h);
    }

    for (let i = 0; i < rate; ++i) {
      update();
    }
  }

  function update() {
    let n = 0;
    for (let i = 0; i < level_count; ++i) {
      n += p.floor(p.random(2));
    }
    buckets[n]++;
  }

  function refresh() {
    // level_count = Number(inp_resolution.value());
    if (Number.isNaN(level_count)) {
      level_count = 10;
    }
    bucket_count = level_count + 1;
    console.log(`level_count: ${level_count}, bucket_count: ${bucket_count}`);

    buckets = Array(bucket_count).fill(1);
  }

  p.setup = setupFunction;
  p.draw = drawFunction;
}
