import * as p5 from 'p5';
import { CANVAS_SIZE } from '../dimensions';
import { Point, AxisAlignedBoundingBox, QuadTree } from '../math/quadtree';

export namespace BetterEntropy {

  class Particle {
    constructor(
      private _center: Point,
      private _radius: number,
      private _speed: number,
      private _dir: number
    ) {}

    get center() { return this._center; }
    get energy() { return this.mass * this._speed**2 / 2; }
    get mass() { return Math.PI * this._radius**2; }
    get radius() { return this._radius; }
    get speed() { return this._speed; }
    get north() { return this.center.y - this.radius; }
    get south() { return this.center.y + this.radius; }
    get east() { return this.center.x + this.radius; }
    get west() { return this.center.x - this.radius; }
    get velocity() {
      return {
        dx: this._speed * Math.cos(this._dir),
        dy: this._speed * Math.sin(this._dir)
      };
    }

    advance(bounds?: AxisAlignedBoundingBox): void {
      let { dx, dy } = this.velocity;
      this._center.x += dx;
      this._center.y += dy;

      if (bounds) {
        const MIN_X = bounds.center.x - bounds.halfWidth;
        const MAX_X = bounds.center.x + bounds.halfWidth;
        const MIN_Y = bounds.center.y - bounds.halfHeight;
        const MAX_Y = bounds.center.y + bounds.halfHeight;

        if (this.west <= MIN_X || this.east >= MAX_X) {
          this._dir = Math.PI - this._dir;
        }
        if (this.north <= MIN_Y ||this.south >= MAX_Y) {
          this._dir = 2*Math.PI - this._dir;
        }
      }
    }

    collides(that: Particle): boolean {
      return this != that && (this.radius + that.radius) >=
        Math.sqrt((this.center.x - that.center.x)**2 +
        (this.center.y - that.center.y)**2);
    }
  }

  export function initSketch(p: p5): void {
    const NUM_PARTICLES = 50;
    let [ w, h ] = CANVAS_SIZE.DEFAULTS;
    let canvas = new AxisAlignedBoundingBox(new Point(w/2, h/2), w/2, h/2);
    let particles: Particle[] = [];

    const MIN_RADIUS = 5;
    const MAX_RADIUS = 20;
    const MIN_MASS = Math.PI * MIN_RADIUS**2;
    const MAX_MASS = Math.PI * MAX_RADIUS**2;
    const MAX_SPEED = 10;
    const MIN_ENERGY = 0;
    const MAX_ENERGY = MAX_MASS * MAX_SPEED**2 / 2;

    function heat(n: number): string {
      n = p.floor(p.map(n, MIN_ENERGY, MAX_ENERGY, 0, 360));
      return `hsb(${n}, 100%, 75%)`;
    }

    p.setup = function() {
      p.angleMode(p.RADIANS);
      p.ellipseMode(p.RADIUS);
      p.colorMode(p.HSB);

      p.createCanvas(w, h);
      for (let i = 0; i < NUM_PARTICLES; i++) {
        particles.push(new Particle(
          new Point(
            p.random(1 + MAX_RADIUS, w - (1 + MAX_RADIUS)),
            p.random(1 + MAX_RADIUS, w - (1 + MAX_RADIUS))
          ),
          p.random(MIN_RADIUS, MAX_RADIUS),
          p.random() * MAX_SPEED,
          p.random() * p.TWO_PI
        ));
      }
      console.log(particles);
    }

    p.draw = function() {
      p.background(p.color('#EEE'));
      for (let particle of particles) {
        let color = heat(particle.energy);
        // let color = p.map(particle.energy, MIN_ENERGY, MAX_ENERGY, 0, 0xFF);

        // console.log(particle.velocity);
        p.fill(p.color(color));
        p.noStroke();
        p.circle(particle.center.x, particle.center.y, particle.radius);

        // Naive collision detection
        for (let other of particles) {
          if (particle.collides(other)) {
            p.fill('white');
            p.circle(particle.center.x, particle.center.y, particle.radius);
            p.circle(other.center.x, other.center.y, other.radius);
          }
        }
      }
      for (let particle of particles) {
        particle.advance(canvas);
      }
    }
  }
}
