import * as p5 from 'p5';
import { CANVAS_SIZE } from '../dimensions';

export namespace Galton {
  export function initSketch(p: p5): void {
    const WIDTH = CANVAS_SIZE.DEFAULT;
    const HEIGHT = CANVAS_SIZE.DEFAULT;
    const V_MARGIN = HEIGHT * 3/8;
    const H_MARGIN = WIDTH * -1;
    const MAX_BAR_HEIGHT = HEIGHT - 2*V_MARGIN;
    const MAX_RATE = 1000;
    const LEVEL_COUNT = 300;
    const BUCKET_COUNT = LEVEL_COUNT + 1;

    let rate = 1;
    let cnv: p5.Renderer = null;
    let buckets = new Array<number>(BUCKET_COUNT).fill(1);

    // Utility Lambdas
    let log10 = (n: number): number => Math.log(n) / Math.log(10);

    p.setup = function(): void {
      cnv = p.createCanvas(WIDTH, HEIGHT);
    }

    p.draw = function(): void {
      p.background(0x80);
      p.fill(0xC0);
      p.noStroke();

      let step = (WIDTH - 2*H_MARGIN)/buckets.length;
      let tallest = p.max(buckets);
      let shortest = p.min(buckets);
      let l_tall = /*log10*/(MAX_BAR_HEIGHT);
      let l_short = /*log10*/(shortest/tallest * MAX_BAR_HEIGHT);

      p.push();
      {
        p.translate(0, HEIGHT);
        for (let i = 0; i < buckets.length; i++) {
          let h = buckets[i] * MAX_BAR_HEIGHT/tallest;
          // h = log10(h);
          h = p.map(h, l_short, l_tall, 1, MAX_BAR_HEIGHT);
          p.rect(H_MARGIN + step*i, -V_MARGIN, step, -h);
        }
      }
      p.pop();

      for (let i = 0; i < rate; ++i) {
        update();
      }
      if (rate < MAX_RATE) {
        rate++;
      }
    }

    function update(): void {
      let n = 0;
      for (let i = 0; i < LEVEL_COUNT; ++i) {
        n += p.floor(p.random(2));
      }
      buckets[n]++;
    }
  }
}
