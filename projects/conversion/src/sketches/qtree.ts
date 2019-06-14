import * as p5 from 'p5';
import { CANVAS_SIZE } from '../dimensions';
import { Point, AxisAlignedBoundingBox, QuadTree} from '../math/quadtree';

export namespace QTree {
  let rand = (a: number, b: number) => Math.floor((b-a)*Math.random()) + a;

  export function initSketch(p: p5): void {
    let [ w, h ] = CANVAS_SIZE.DEFAULTS;
    let qtree = new QuadTree(new AxisAlignedBoundingBox(new Point(w/2, h/2), w/2, h/2));
    let points: Point[] = [];
    let range = new AxisAlignedBoundingBox(new Point(rand(0, w), rand(0, h)), rand(50, 100), rand(50, 100));


    p.setup = function() {
      p.createCanvas(w, h);

      let num_points = 1000;
      for (let i = 0; i < num_points; i++) {
        let point = new Point(
          p.floor(p.randomGaussian(w/2, w/6)),
          p.floor(p.randomGaussian(h/2, h/6))
        );
        points.push(point);
        qtree.insert(point);
      }

    };

    p.draw = function() {
      let boxes = qtree.boundaries();

      if (p.mouseIsPressed) {
        range.center.x = p.mouseX;
        range.center.y = p.mouseY;
      }

      let locus = qtree.queryRange(range);

      p.background(0);
      p.stroke(0xff);
      p.noFill();
      p.rectMode(p.RADIUS);

      p.strokeWeight(1);
      for (let box of boxes) {
        p.rect(box.center.x, box.center.y, box.halfWidth, box.halfHeight);
      }

      p.strokeWeight(3);
      for (let point of points) {
        p.point(point.x, point.y);
      }

      p.stroke(p.color('#0f0'));
      p.strokeWeight(3);
      p.rect(range.center.x, range.center.y, range.halfWidth, range.halfHeight);

      p.strokeWeight(6);
      for (let point of locus) {
        p.point(point.x, point.y);
      }
    }
  }
}
