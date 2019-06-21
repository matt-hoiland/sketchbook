import * as p5 from 'p5';
import { CANVAS_SIZE } from '../dimensions';

export namespace Entropy {
  class Particle {
    private dx: number;
    private dy: number;

    constructor(
      private x: number,
      private y: number,
      private theta: number,
      private speed: number,
      private color: string
    ) {
      this.dx = this.speed * Math.cos(this.theta);
      this.dy = this.speed * Math.sin(this.theta);
    }

    advance(): void {
      this.x += this.dx;
      this.y += this.dy;
    }

    bounce(X: number, Y: number): void {
      if (this.x <= 0 || this.x >= X) {
        this.dx = -this.dx;
      }
      if (this.y <=0 || this.y >= Y) {
        this.dy = -this.dy;
      }
    }

    draw(p: p5): void {
      p.push();
      {
        p.translate(this.x, this.y);
        p.noStroke();
        p.fill(p.color(this.color));
        p.ellipse(0, 0, 5, 5);
      }
      p.pop();
    }


  }

  export function initSketch(p: p5): void {

    let cnv: p5.Renderer = null;
    let blues: Particle[] = [];
    let reds: Particle[] = [];
    let count = 500;
    let width = CANVAS_SIZE.DEFAULT;
    let height = CANVAS_SIZE.DEFAULT;

    p.setup = function() {
      cnv = p.createCanvas(width, height);
      p.ellipseMode(p.CENTER);
      p.angleMode(p.RADIANS);
      for (let i = 0; i < count; i++) {
        blues.push(new Particle(p.random(0, width/2), p.random(0, height), p.random(0, p.TWO_PI), 8, 'rgb(65, 187, 244)'));
        reds.push(new Particle(p.random(width*3/4, width), p.random(0, height), p.random(0, p.TWO_PI), 8, 'rgb(244, 66, 66)'));
      }
    }

    p.draw = function() {
      p.background(0xc0);
      for (let i = 0; i < count; i++) {
        blues[i].draw(p);
        blues[i].advance();
        blues[i].bounce(width, height);
        reds[i].draw(p);
        reds[i].advance();
        reds[i].bounce(width, height);
      }
    }
  }

}
