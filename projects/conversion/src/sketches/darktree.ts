import * as p5 from 'p5';
import { CANVAS_SIZE } from '../dimensions';

export namespace DarkTree {
  let tree: Tree;
  let factor = 150;

  class Tree {
    private h: number | undefined = undefined;
    private cs: Tree[] = [];

    constructor(public a: number, private l: number) {}

    add(t: Tree): void {
      this.cs.push(t);
      if (this.height() <= t.height()) {
        this.h = t.h + 1;
      }
    }

    draw(p: p5): void {
      p.push();
      {
        p.rotate(this.a);
        let w = this.height()**3 / factor;
        let h = this.l;
        p.rect(-w/2, 0, w, -h);
        // p.stroke(p.color('red'));
        // p.line(0, 0, 0, -h + 10);
        p.translate(0, -h);
        this.cs.forEach((v) => {
          v.draw(p);
        });
      }
      p.pop();
    }

    private height(): number {
      if (this.h !== undefined) {
        return this.h;
      }
      if (this.cs.length == 0) {
        this.h = 1;
      } else {
        this.h = this.cs.reduce((a, b) => {
          return Math.max(a, b.height());
        }, 0);
      }
      return this.h;
    }
  }

  export function initSketch(p: p5): void {
    let canvas: p5.Renderer;
    let interval: number;

    function generateTree(n: number): Tree {
        let t = new Tree(p.random(-p.QUARTER_PI, p.QUARTER_PI), p.random(1,8) * n);
        if (n == 0) {
          return t;
        }
        for (let i = p.floor(p.random(1,4)); i > 0; i--) {
          t.add(generateTree(n - 1));
        }
        return t;
    }

    p.setup = () => {
      canvas = p.createCanvas(CANVAS_SIZE.DEFAULT, CANVAS_SIZE.DEFAULT);
      tree = generateTree(12);
      tree.a = 0;
      interval = window.setInterval(() => {
        tree = generateTree(12);
        tree.a = 0;
      }, 5000);
    }

    p.draw = () => {
      p.background(42);
      p.fill(0);
      p.noStroke();
      p.translate(p.width/2, p.height);
      tree.draw(p);
    }
  }
}
