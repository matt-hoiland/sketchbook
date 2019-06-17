import * as p5 from 'p5';
import { CANVAS_SIZE } from '../dimensions';
import { Point, AxisAlignedBoundingBox, QuadTree } from '../math/quadtree';

export namespace BetterEntropy {

  class Particle extends Point {
    hasBounced = false;

    constructor(
      x: number,
      y: number,
      private _radius: number,
      private _speed: number,
      private _dir: number
    ) {
      super(x, y);
    }

    // get center() { return this._center; }
    get energy() { return this.mass * this._speed**2 / 2; }
    set energy(e: number) { this._speed = Math.sqrt(2*e/this.mass); }
    get mass() { return Math.PI * this._radius**2; }
    get radius() { return this._radius; }
    get speed() { return this._speed; }
    get north() { return this.y - this.radius; }
    set north(v) { this.y = v + this.radius; }
    get south() { return this.y + this.radius; }
    set south(v) { this.y = v - this.radius; }
    get east() { return this.x + this.radius; }
    set east(v) { this.x = v - this.radius; }
    get west() { return this.x - this.radius; }
    set west(v) { this.x = v + this.radius; }
    get velocity() {
      return {
        dx: this._speed * Math.cos(this._dir),
        dy: this._speed * Math.sin(this._dir)
      };
    }

    advance(bounds?: AxisAlignedBoundingBox): void {
      let { dx, dy } = this.velocity;
      this.x += dx;
      this.y += dy;

      if (bounds) {
        const MIN_X = -bounds.halfWidth;
        const MAX_X = +bounds.halfWidth;
        const MIN_Y = -bounds.halfHeight;
        const MAX_Y = +bounds.halfHeight;

        if (this.west < MIN_X || this.east > MAX_X) {
          this._dir = Math.PI - this._dir;
          if (this.west < MIN_X) {
            this.west = MIN_X;
          }
          if (this.east > MAX_X) {
            this.east = MAX_X;
          }
        }
        if (this.north < MIN_Y ||this.south > MAX_Y) {
          this._dir = 2*Math.PI - this._dir;
          if (this.north < MIN_Y) {
            this.north = MIN_Y;
          }
          if (this.south > MAX_Y) {
            this.south = MAX_Y;
          }
        }
      }
    }

    collides(that: Particle): boolean {
      return this != that && (this.radius + that.radius) >=
        Math.sqrt((this.x - that.x)**2 +
        (this.y - that.y)**2);
    }

    approaches(that: Particle): boolean {
      let this_new_pos = new Point(this.x + Math.cos(this._dir), this.y + Math.sin(this._dir));
      let that_new_pos = new Point(that.x + Math.cos(that._dir), that.y + Math.sin(that._dir));

      return (this.x - that.x)**2 + (this.y - that.y)**2 >
        (this_new_pos.x - that_new_pos.x)**2 + (this_new_pos.y - that_new_pos.y)**2;
    }

    bounce(that: Particle): void {
      if (!this.approaches(that)) { return; }
      this.hasBounced = true;
      that.hasBounced = true;

      // // Reverse direction and back it up (to prevent sticking)
      // this._dir = Math.PI - this._dir;
      // that._dir = Math.PI - that._dir;
      // this.advance();
      // that.advance();
      // // Put it back into forward
      // this._dir = Math.PI - this._dir;
      // that._dir = Math.PI - that._dir;

      let sum_energy = this.energy + that.energy;
      this.energy = sum_energy/2;
      that.energy = sum_energy/2;

      [ this._dir, that._dir ] = [ that._dir, this._dir ];
      // [ this.energy, that.energy ] = [ that.energy, this.energy ];

    }
  }

  export function initSketch(p: p5): void {
    const NUM_PARTICLES = 1500;
    let [ w, h ] = CANVAS_SIZE.DEFAULTS;
    let canvas = new AxisAlignedBoundingBox(new Point(w/2, h/2), w/2, h/2);
    let particles: Particle[] = [];

    const MIN_RADIUS = 3;
    const MAX_RADIUS = 5;
    const MIN_MASS = Math.PI * MIN_RADIUS**2;
    const MAX_MASS = Math.PI * MAX_RADIUS**2;
    const MAX_SPEED = 1;
    const MIN_ENERGY = 0;
    const MAX_ENERGY = MAX_MASS * MAX_SPEED**2 / 2;

    p.setup = function() {
      p.angleMode(p.RADIANS);
      p.colorMode(p.HSB);
      p.ellipseMode(p.RADIUS);
      p.rectMode(p.RADIUS);

      p.createCanvas(w, h);
      let colds = 0;
      let hots = 0;
      for (let i = 0; i < NUM_PARTICLES; i++) {
        let particle = new Particle(
          p.random(-canvas.halfWidth + MAX_RADIUS, canvas.halfWidth - MAX_RADIUS),
          p.random(-canvas.halfHeight + MAX_RADIUS, canvas.halfHeight - MAX_RADIUS),
          p.random(MIN_RADIUS, MAX_RADIUS),
          p.random() * MAX_SPEED,
          p.random() * p.TWO_PI
        );
        if (particle.x < 0) {
          colds++;
          particle.energy = MIN_ENERGY;
        } else {
          hots++;
          particle.energy = MAX_ENERGY;
        }
        console.log(hots, colds);
        particles.push(particle);
      }
    }

    p.draw = function() {
      buildQuadTree();
      drawParticles();
      drawGraph();
      collideParticles();
      advanceParticles();
    }

    let qtree: QuadTree<Particle> = null;

    function buildQuadTree() {
      qtree = new QuadTree<Particle>(
        new AxisAlignedBoundingBox(
          new Point(0, 0),
          canvas.halfWidth,
          canvas.halfHeight
        )
      );
      for (let particle of particles) {
        particle.hasBounced = false;
        qtree.insert(particle);
      }
    }

    let heat = (n: number): string =>
    `hsb(${p.floor(p.map(n, MIN_ENERGY, MAX_ENERGY, 240, 360))}, 100%, 75%)`;

    function drawParticles() {

      p.background(p.color('#EEE'));
      p.push();
      {
        p.translate(w/2, h/2);
        for (let particle of particles) {
          let color = heat(particle.energy);
          // console.log(color)
          // let color = p.map(particle.energy, MIN_ENERGY, MAX_ENERGY, 0, 0xFF);

          // console.log(particle.velocity);
          p.fill(p.color(color));
          p.noStroke();
          p.circle(particle.x, particle.y, particle.radius);
        }
      }
      p.pop();
    }

    function drawGraph() {
      const NUM_BINS = 64;
      const BIN_WIDTH = w / NUM_BINS;
      p.stroke(p.color('#0f0'));
      p.strokeWeight(8);
      p.noFill();
      p.beginShape();
      for (let i = 0; i < NUM_BINS; i++) {
        let bin = new AxisAlignedBoundingBox(
          new Point(BIN_WIDTH/2 + i*BIN_WIDTH - w/2, 0),
          BIN_WIDTH/2,
          canvas.halfHeight
        );
        let points = qtree.query(bin);
        let avg_heat = points
          .map((particle) => particle.energy)
          .reduce((sum, e) => sum + e, 0)
          /points.length;

        let height = p.map(avg_heat, MIN_ENERGY, MAX_ENERGY, 0, h);
        let color = heat(avg_heat);
        p.vertex((i + 0.5)*BIN_WIDTH, h - height);
      }
      p.endShape();
    }

    function collideParticles() {
      for (let particle of particles) {
        let range = new AxisAlignedBoundingBox(
          particle,
          MAX_RADIUS + particle.radius,
          MAX_RADIUS + particle.radius
        );
        let candidates = qtree.query(range);

        for (let other of candidates) {
          if (particle.collides(other) &&
              !particle.hasBounced &&
              !other.hasBounced) {
            particle.bounce(other);
            break;
          }
        }
      }
    }

    function advanceParticles() {
      for (let particle of particles) {
        particle.advance(canvas);
      }
    }
  }
}
