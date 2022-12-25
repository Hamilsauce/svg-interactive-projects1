export class Point extends DOMPoint {
  constructor(x = 0, y = 0) {
    super(x, y);
  }


  static create(x, y) { return new Point(x, y) }
}