import * as p5 from 'p5';
import { CANVAS_SIZE } from '../dimensions';

export namespace KruskalsAlgorithm {
  let rand = (a: number, b: number) =>
    Math.floor((b-a) * Math.random()) + a;

  interface IComparable {
    compareTo(that: IComparable): number;
  }

  class Point implements IComparable {
    constructor(public x: number, public y: number) {}

    distanceTo(that:  Point): number {
      return Math.sqrt((that.x - this.x)**2 + (that.y - this.y)**2);
    }

    compareTo(that: Point): number {
      return this.x - this.x + this.y - this.y;
    }
  }

  class PointArray extends Array<Point> {
    isAtLeastKFromAll(pnt: Point, k = 20) {
      for (let n of this) {
        if (pnt.distanceTo(n) < k) {
          return false;
        }
      }
      return true;
    }

    draw(p: p5): void {
      for (let pnt of this) {
        p.push();
        {
          p.translate(pnt.x, pnt.y);
          p.fill(230);
          p.stroke(0);
          p.strokeWeight(2);
          p.ellipse(0, 0, 6, 6);
        }
        p.pop();
      }
    }
  }

  function generatePoints(width: number, height: number, margin=20, num=100) {

    let points = new PointArray();

    while (points.length < num) {
      let pnt = new Point(rand(margin, width - margin), rand(margin, height - margin));
      if (points.isAtLeastKFromAll(pnt)) {
        points.push(pnt);
      }
    }

    return points;
  }

  class Node<K extends IComparable> {
    d: K; l: Node<K>; r: Node<K>;
    constructor(datum: K) {
      this.d = datum;
      this.l = null;
      this.r = null;
    }
  }

  class Set<T extends IComparable> {
    root: Node<T>;

    constructor(data?: T[]) {
      this.root = null;
      if (data) {
        for (let datum of data) {
          this.insert(datum);
        }
      }
    }


    insert(t: T): void;
    insert(t: T, groot: Node<T>): Node<T>;
    insert(t: T, groot?: Node<T>): void | Node<T> {
      if (groot === undefined) {
        this.root = this.insert(t, this.root);
      } else {
        if (groot === null) {
          return new Node<T>(t);
        }
        if (t.compareTo(groot.d) < 0) {
          groot.l = this.insert(t, groot.l);
        } else {
          groot.r = this.insert(t, groot.r);
        }
        return groot;
      }
    }

    has(t: T): boolean;
    has(t: T, groot: Node<T>): boolean;
    has(t: T, groot?: Node<T>): boolean {
      if (groot === undefined) {
        return this.has(t, this.root);
      }

      if (groot === null) {
        return false;
      }

      if (t === groot.d) {
        return true;
      }

      if (t.compareTo(groot.d) < 0) {
        return this.has(t, groot.l);
      } else {
        return this.has(t, groot.r);
      }
    }

    merge(that: Set<T>): void;
    merge(groot: Node<T>): void;
    merge(that_or_groot: Set<T> | Node <T>): void {
      if (that_or_groot instanceof Set) {
        let that = that_or_groot;
        this.merge(that.root);
        that.root = null;
      } else {
        let groot = that_or_groot;
        if (groot === null) {
          return;
        }
        this.merge(groot.l);
        this.merge(groot.r);
        this.insert(groot.d);
      }
    }
  }

  class DisjointSet<T extends IComparable> extends Array<Set<T>> {
    constructor(data: T[]) {
      super();
      if (data) {
        for (let datum of data) {
          this.push(new Set<T>([datum]));
        }
      }
    }

    get num_sets(): number {
      return this.length;
    }

    locate(a: T): Set<T> {
      for (let s of this) {
        if (s.has(a)) {
          return s;
        }
      }
      return null;
    }

    areDisjoint(a: T, b: T): boolean {
      return this.locate(a) !== this.locate(b);
    }

    union(a: T, b: T): void {
      let sa = this.locate(a);
      let sb = this.locate(b);
      sa.merge(sb);
      let ib = this.indexOf(sb);
      this[ib] = this[this.length - 1];
      this.pop();
    }
  }


  interface Edge {
    d: number;
    a: Point;
    b: Point;
  }

  function createSortedEdges(points: PointArray) {
    let edges: Edge[] = [];
    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
        let [ a, b ] = [ points[i], points[j] ];
        edges.push({d: a.distanceTo(b), a: a, b: b});
      }
    }

    return edges.sort((a: Edge, b: Edge): number => {
      if (a.d < b.d) {
        return -1;
      }
      if (b.d < a.d) {
        return 1;
      }
      return 0;
    });
  }

  export function initSketch(p: p5): void {
    let points: PointArray = null;
    let edges: Edge[] = null;
    let saved_edges: Edge[] = [];
    let i = 0;
    let sets: DisjointSet<Point> = null;

    p.setup = function() {
      let cnv = p.createCanvas(CANVAS_SIZE.DEFAULT, CANVAS_SIZE.DEFAULT);
      points = generatePoints(p.width, p.height);
      sets = new DisjointSet<Point>(points);
      edges = createSortedEdges(points);
      p.frameRate(5);
    }

    p.draw = function() {
      p.background(230);

      for (let e of saved_edges) {
        p.push();
        {
          p.stroke('red');
          p.strokeWeight(3);
          p.line(e.a.x, e.a.y, e.b.x, e.b.y);
        }
        p.pop();
      }

      if (sets.num_sets > 1) {
        let candidate = edges[i];
        if (sets.areDisjoint(candidate.a, candidate.b)) {
          sets.union(candidate.a, candidate.b);
          saved_edges.push(candidate);
        }

        p.push();
        {
          p.stroke('blue');
          p.strokeWeight(3);
          p.line(candidate.a.x, candidate.a.y, candidate.b.x, candidate.b.y);
        }
        p.pop();

      }

      points.draw(p);
      i++;
    }
  }
}
