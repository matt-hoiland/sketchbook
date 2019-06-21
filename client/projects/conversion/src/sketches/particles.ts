import * as p5 from 'p5';
import { CANVAS_SIZE } from '../dimensions';

export namespace Particles {
  class Particle {
    width: number = 25;
    expansion: number = 1;
    transparency: number = 1.0;
    color: string = '100%, 100%, 100%';

    constructor(
      public x: number,
      public y: number,
      public dx: number,
      public dy: number,
      public decay: number
    ) {}

    next() {
      this.transparency -= this.decay;
      this.transparency = this.transparency > 0 ? this.transparency : 0;
      this.x += this.dx;
      this.y += this.dy;
      this.width += this.expansion;
      this.expansion -= .01;
      this.dy -= 0.01;
    }

    draw(p: p5): void {
      p.push()
      {
        p.translate(this.x, this.y);
        p.noStroke();
        p.fill(p.color(`rgba(${this.color}, ${this.transparency})`));
        p.ellipse(0,0, this.width);
      }
      p.pop();
    }
  }

  export function initSketch(p: p5): void {
    let a: Particle[] = [];

    function generatePoint() {
      const min_theta = - p.radians(90 - 35);
      const max_theta = - p.radians(90 + 35);

      let angle = p.random() * (max_theta - min_theta) + min_theta;
      let mag = (p.random(5) + 5) / 5;
      let [dx, dy] = [mag * p.cos(angle), mag * p.sin(angle)];
      let [x, y] = [p.width * 0.5, p.height * 0.90];

      return new Particle(x, y, dx, dy, (p.random(10) + 80) / 20000.0);
    }

    p.setup = function() {
      p.createCanvas(CANVAS_SIZE.DEFAULT, CANVAS_SIZE.DEFAULT);
      p.background(0);
      a = new Array<Particle>(50).fill(null).map(generatePoint);
    }

    p.draw = function() {
      let deletes: Particle[] = [];
      p.background(0);
      for (let pnt of a) {
        pnt.draw(p);
        pnt.next();
        if (pnt.transparency === 0) {
          deletes.push(pnt);
        }
      }

      a = a.filter(pnt => !deletes.includes(pnt));
      a.push(generatePoint());
    }
  }
}
