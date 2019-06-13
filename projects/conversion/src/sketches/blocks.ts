import * as p5 from 'p5';
import { CANVAS_SIZE } from '../dimensions';

export namespace Blocks {


  class Block {

    // Squish control with spring physics
    private readonly DEP_RATE = 1;
    private readonly MAX_THETA = 10;
    private squished = false;
    private theta = 0;
    private t = -1;

    // Falling control with gravity phsyics
    private readonly GRAVITY = -4;
    private readonly MAX_V = 40;
    private jumping = false;
    private v = 0;
    private y = 0;


    constructor(
      private orgn: p5.Vector,
      private phi: number,
      private l: number,
      private clr: p5.Color
    ) {}

    draw(p: p5): void {
      p.push();
      {
        p.fill(this.clr);
        p.translate(this.orgn.x, this.orgn.y - this.y);
        let a = p.radians(this.phi - this.theta);
        let x = this.l * p.cos(a);
        let y = this.l * p.sin(a);
        p.rect(-x/2, -y, x, y);
      }
      p.pop();

      this.update(p);
    }

    update(p: p5): void {
      if (this.squished) {
        this.theta += (this.theta >= this.MAX_THETA ? 0 : this.DEP_RATE);
      } else if (this.t >= 0 && this.t < 20) {
        this.theta = -this.MAX_THETA * p.cos(p.radians(this.t)) / (1 + this.t);
        this.t += this.DEP_RATE;
      } else {
        this.t = -1;
      }

      if (this.jumping) {
        this.v += this.GRAVITY;
        this.y += this.v;
        if (this.y < 0) {
          this.y = 0;
          this.jumping = false;
          this.theta = this.MAX_THETA;
          this.t = 0;
        }
      }
    }

    press(): void {
      this.squished = true;
    }

    release(): void {
      this.squished = false;
      this.t = 0;
      this.v = this.MAX_V;
      this.jumping = true;
    }
  }

  export function initSketch(p: p5): void {
    let canvas: p5.Renderer;
    let ratio = 0.90;
    let sam: Block;

    p.setup = function() {
      canvas = p.createCanvas(CANVAS_SIZE.DEFAULT, CANVAS_SIZE.DEFAULT);
      sam = new Block(p.createVector(p.width/2, p.height * 0.75), 60, 100, p.color(245,0,0));
    }

    p.draw = function() {
      p.noStroke();
      p.background(0xcc);
      p.fill(0x88);
      p.rect(0, p.height * 0.75, p.width, p.height * 0.25);
      sam.draw(p);
    }

    p.keyPressed = function() {
      if (p.keyCode == 0x20) { // space
        sam.press();
      }
    }

    p.keyReleased = function() {
      if (p.keyCode == 0x20) { // space
        sam.release();
      }
    }
  }
}
