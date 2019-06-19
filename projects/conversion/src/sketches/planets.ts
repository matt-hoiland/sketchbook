import * as p5 from 'p5';
import { CANVAS_SIZE } from '../dimensions';

export namespace Planets {
  class Planet {
    speed = 0;
    force = new p5.Vector();
    trail: {x: number, y: number}[] = [];
    readonly MAX_TRAIL_LENGTH = 512;

    constructor(
      public pos: p5.Vector,
      public mass: number,
      public vel: p5.Vector
    ) {
      this.force.x = 0;
      this.force.y = 0;
    }

    draw(p: p5): void {
      p.push();
      {
        p.translate(this.pos.x, this.pos.y);
        p.ellipse(0, 0, this.mass, this.mass);
        p.stroke('green');
        p.strokeWeight(1);
        let arrow = p5.Vector.mult(this.vel, 10);
        p.line(0, 0, arrow.x, arrow.y);
        arrow = p5.Vector.mult(this.force, 100);
        p.stroke('red');
        p.strokeWeight(2);
        p.line(0, 0, arrow.x, arrow.y);
      }
      p.pop();
      p.push();
      {
        p.noFill();
        p.strokeWeight(1);
        p.stroke(p.color('#4DD'));
        p.beginShape();
        for (let pnt of this.trail) {
          p.vertex(pnt.x, pnt.y);
        }
        p.endShape();
      }
      p.pop();
    }

    update(ps: Planet[]): void {
      this.force.mult(0);
      ps.forEach((v, i, a) => {
        let dir = p5.Vector.sub(v.pos, this.pos).normalize();
        let acc = 0.004 * this.mass * v.mass / (p5.Vector.dist(this.pos, v.pos));
        this.force.add(p5.Vector.mult(dir, acc));
      });
    }

    advance() {
      if (this.trail.length >= this.MAX_TRAIL_LENGTH) {
        this.trail.shift();
      }
      this.trail.push({x: this.pos.x, y: this.pos.y});
      this.vel.add(this.force);
      this.pos.add(this.vel);
    }
  }

  export function initSketch(p: p5): void {
    let earth: Planet;
    let moon: Planet;

    p.setup = function() {
      p.createCanvas(CANVAS_SIZE.DEFAULT, CANVAS_SIZE.DEFAULT);
      earth = new Planet(
        p.createVector(0.25*p.width, 0.5*p.height),
        200,
        p.createVector(0, 4)
      );
      moon = new Planet(
        p.createVector(0.75*p.width, 0.5*p.height),
        50,
        p.createVector(0, -4)
      );
    }

    p.draw = function() {
      p.background(0xCC);
      p.fill(0x44);
      p.stroke(0xEE);
      earth.update([moon]);
      moon.update([earth]);
      earth.draw(p);
      moon.draw(p);
      earth.advance();
      moon.advance();
    }
  }
}
