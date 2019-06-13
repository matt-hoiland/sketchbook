import * as p5 from 'p5';
import { CANVAS_SIZE } from '../dimensions';

export namespace Hexagons {
  let rand = (n: number): number => Math.floor(n*Math.random());

  class Hexagon {
    private fading: boolean = rand(2) ? true : false;
    private rate: number = ((3*Math.random() + 1)) / 3;

    constructor(
      private center: p5.Vector,
      private s: number,
      private color: {h: number, s: number, b: number}
    ) {}

    draw(p: p5): void {
      let up = p.createVector(0, -this.s);
      let { h, s, b } = this.color;
      p.fill(h, s, b);
      p.beginShape();
      for (let i = 0; i < 6; i++) {
        let v = p5.Vector.add(up, this.center);
        p.vertex(v.x, v.y);
        up.rotate(p.radians(60));
      }
      p.endShape(p.CLOSE);
    }

    shiftColor(): void {
      if (this.color.b >= 99) {
        this.fading = true;
      }
      if (this.color.b <= 25) {
        this.fading = false;
      }
      this.color.b += this.fading ? -this.rate : this.rate;
    }
  }

  export function initSketch(p: p5): void {
    let points: p5.Vector[] = [];
    let hexes: Hexagon[] = [];
    let s: number = 40;
    let cnv: p5.Renderer;

    p.setup = function() {
      cnv = p.createCanvas(CANVAS_SIZE.DEFAULT, CANVAS_SIZE.DEFAULT);
      p.colorMode(p.HSB, 100);

      let i = p.createVector(1, 0); // dew east
      let j = p.createVector(0, -1).rotate(p.radians(-30)); // 60 degrees north of east
      let transform = (x: number, y: number) =>
        p5.Vector.add(
          p5.Vector.mult(i, x*s),
          p5.Vector.mult(j, y*s)
        );

      for (let x = 0; x < p.width/s; x++) {
        for (let y = 0; y < p.height/s; y++) {
          points.push(transform(x, y));
          if (x != 0) {
            points.push(transform(-x, y));
          }
          if (x != 0 && y != 0) {
            points.push(transform(-x, -y))
          }
          if (y != 0) {
            points.push(transform(x, -y));
          }
        }
      }
      for (let point of points) {
        hexes.push(new Hexagon(point, s/2, {
          h: 5300/360, s: 100, b: p.random(50) + 50
        }));
      }
    }

    p.draw = function() {
      p.background(0);
      p.fill(0xff);
      p.ellipseMode(p.RADIUS);
      p.push();
      {
        p.translate(p.width/2, p.height/2);
        for (let hex of hexes) {
          hex.draw(p);
          hex.shiftColor();
        }
      }
      p.pop();
    }
  }
}
