import * as p5 from 'p5';

export function initSketch(colorA: string, colorB: string) {
  return function (p: p5): void {
    p.setup = (): void => {
      p.createCanvas(512, 512);
      p.background(p.color(colorA));
      p.fill(p.color(colorB));
      p.noStroke();
      p.rectMode(p.CENTER);
      p.push();
      p.translate(p.width/2, p.height/2);
      p.rect(0, 0, 128, 128);
      p.pop();
    };
  };
}
