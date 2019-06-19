import * as p5 from 'p5';
import { CANVAS_SIZE } from '../dimensions';

export namespace Rainbows {
  export function initSketch(p: p5): void {
    let canvas: p5.Renderer;
    let boxes = [];
    let angle: number;
    let amp: number;
    let lambda: number;
    let rate: number;
    let cangle: number;

    // let ampFunc = (a: number) => { if (a) amp = a; return amp; }
    // let angleFunc = (a: number) => { if (a) angle = a; return angle; }
    // let lambdaFunc = (l: number) => { if (l) lambda = l; return lambda; }
    // let rateFunc = (r: number) => { if (r) rate = r; return rate; }

    p.setup = function() {
      canvas = p.createCanvas(CANVAS_SIZE.DEFAULT, CANVAS_SIZE.DEFAULT);
      cangle = 0;
      angle = 0;
      amp = 200;
      lambda = p.PI * 0.5;
      rate = -4;
      boxes = [];
      for (let i = 0; i < 40; i++) {
        let n = amp * p.sin(angle + i * lambda/40);
        boxes.push(n + p.height/2);
      }
    }

    p.draw = function() {
      p.background(0);
      p.fill(0x88);
      p.stroke(0xff);
      p.colorMode(p.HSB);
      let wid = p.width/boxes.length;
      boxes.forEach((v, i, a) => {
        p.fill((p.map(v, p.height/2-amp, p.height/2+amp, 0, 360) + cangle) % 360, 100, 100);
        cangle += p.radians(rate * -1);
        p.rect(i * wid, v, wid, p.height);
        a[i] = amp * p.sin(angle + i * lambda/40) + p.height/2;
      });
      angle += p.radians(rate);
    }
  }
}
