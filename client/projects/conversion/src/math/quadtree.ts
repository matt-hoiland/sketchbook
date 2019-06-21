// Adapted from https://en.wikipedia.org/wiki/Quadtree

export class Point {
  constructor(public x: number, public y: number) {}
}

export class AxisAlignedBoundingBox {
  constructor(
    public center: Point,
    public halfWidth: number,
    public halfHeight: number
  ) {}

  contains(point: Point): boolean {
    return (
      this.center.x - this.halfWidth <= point.x &&
      this.center.x + this.halfWidth >= point.x &&
      this.center.y - this.halfHeight <= point.y &&
      this.center.y + this.halfHeight >= point.y
    );
  }

  intersects(that: AxisAlignedBoundingBox): boolean {
    return !(
      this.center.x - this.halfWidth > that.center.x + that.halfWidth ||
      this.center.x + this.halfWidth < that.center.x - that.halfWidth ||
      this.center.y - this.halfHeight > that.center.y + that.halfHeight ||
      this.center.y + this.halfHeight < that.center.y - that.halfHeight
    );
  }
}

export class QuadTree<T extends Point> {
  readonly CAPACITY: number;

  points: T[] = [];
  nw: QuadTree<T>;
  ne: QuadTree<T>;
  se: QuadTree<T>;
  sw: QuadTree<T>;

  constructor(
    public boundary: AxisAlignedBoundingBox,
    capacity: number = 4
  ) {
    this.CAPACITY = capacity;
  }


  /**
   * insert - Adds a point to the QuadTree
   *
   * @param {T} point - The point to be added
   * @return {boolean} Whether the point was added to the QuadTree
   */
  insert(point: T): boolean {
    if (!this.boundary.contains(point)) {
      return false;
    }

    if (this.points.length < this.CAPACITY && !this.nw) {
      this.points.push(point);
      return true;
    }

    if (!this.nw) {
      this.subdivide();
    }

    return (
      this.nw.insert(point) ||
      this.ne.insert(point) ||
      this.se.insert(point) ||
      this.sw.insert(point)
    );
  }


  /**
   * query - Locates all points within the given range
   *
   * @param {AxisAlignedBoundingBox} range - The range to be searched
   * @return {T[]} The set of points within the range
   */
  query(range: AxisAlignedBoundingBox, points?: T[]): T[] {
    if (!points) {
      points = [];
    }

    if (!this.boundary.intersects(range)) {
      return points;
    }

    for (let point of this.points) {
      if (range.contains(point)) {
        points.push(point);
      }
    }

    if (!this.nw) {
      return points;
    }

    this.nw.query(range, points);
    this.ne.query(range, points);
    this.se.query(range, points);
    this.sw.query(range, points);

    return points;
  }

  /**
   * boundaries - Retrieves the boundary regions of this QuadTree and its
   *   children
   *
   * @return {AxisAlignedBoundingBox[]} All boundary regions of this QuadTree
   *   and its children
   */
  boundaries(boxes?: AxisAlignedBoundingBox[]): AxisAlignedBoundingBox[] {
    if (!boxes) {
      boxes = [];
    }
    boxes.push(this.boundary);
    if (this.nw) {
      this.nw.boundaries(boxes);
      this.ne.boundaries(boxes);
      this.se.boundaries(boxes);
      this.sw.boundaries(boxes);
    }
    return boxes;
  }

  /**
   * subdivide - Subdivide this QuadTree's boundary region into 4 parts
   *
   * @return {boolean} `true` if subdivision is performed, `false` otherwise
   */
  private subdivide(): boolean {
    if (this.nw) {
      return false; // Already subdivided
    }

    let aabb: AxisAlignedBoundingBox;
    let w = this.boundary.halfWidth;
    let h = this.boundary.halfHeight;
    let x = this.boundary.center.x;
    let y = this.boundary.center.y;

    aabb = new AxisAlignedBoundingBox(new Point(x - w/2, y - h/2), w/2, h/2);
    this.nw = new QuadTree(aabb, this.CAPACITY);
    aabb = new AxisAlignedBoundingBox(new Point(x + w/2, y - h/2), w/2, h/2);
    this.ne = new QuadTree(aabb, this.CAPACITY);
    aabb = new AxisAlignedBoundingBox(new Point(x - w/2, y + h/2), w/2, h/2);
    this.se = new QuadTree(aabb, this.CAPACITY);
    aabb = new AxisAlignedBoundingBox(new Point(x + w/2, y + h/2), w/2, h/2);
    this.sw = new QuadTree(aabb, this.CAPACITY);

    return true;
  }
}
