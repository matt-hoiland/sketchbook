import * as p5 from 'p5';
import { CANVAS_SIZE } from '../dimensions';

export namespace CircleIllusion {

  class Circle {
    static MAGNITUDE: number = 150;
    static SIZE: number = 30;
    static RATE: number = 2*Math.PI / 180;

    angle: number;
    position: number;

    constructor(angle: number, start: number) {
      this.angle = angle;
      this.position = start; // [0 ... TWO_PI]
    }

    draw(p: p5) {

      let hsv_value = p.floor(p.degrees(2*this.angle));

      p.push();
      {
        p.noStroke();
        p.fill(p.color(`hsl(${hsv_value}, 100%, 50%)`));
        p.translate(p.width/2, p.height/2);
        p.rotate(this.angle);
        p.ellipse(0, Circle.MAGNITUDE * p.sin(this.position), Circle.SIZE);
      }
      p.pop();
    }

    advance() {
      this.position -= Circle.RATE;
      if (this.position < 0) {
        this.position += 2*Math.PI;
      }
    }
  }

  export function initSketch(p: p5): void {

    let circle_count = 12;
    let circles: Circle[] = Array(circle_count).fill(null);

    p.setup = function() {
      p.createCanvas(CANVAS_SIZE.DEFAULT, CANVAS_SIZE.DEFAULT);
      p.background(0);
      circles = circles.map((v, i, a) => new Circle(Math.PI * i / circle_count, Math.PI * i / circle_count));
    }

    p.draw = function() {
      p.background(0);
      for (let circle of circles) {
        circle.draw(p);
        circle.advance();
      }
    }
  }
}
