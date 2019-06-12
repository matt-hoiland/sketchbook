class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  distanceTo(that) {
    return Math.sqrt((that.x - this.x) ** 2 + (that.y - this.y) ** 2);
  }

  compareTo(that) {
    return this.x - that.x + this.y - that.y;
  }
}
