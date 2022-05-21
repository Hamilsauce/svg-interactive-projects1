export class Point {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  static create(x, y) { return new Point(x, y) }
}
