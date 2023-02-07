import { toTrackPoint } from '/svg-trackpad/lib.js';

const { forkJoin, Observable, iif, BehaviorSubject, AsyncSubject, Subject, interval, of, fromEvent, merge, empty, delay, from } = rxjs;
const { flatMap, reduce, groupBy, toArray, mergeMap, switchMap, scan, map, tap, filter } = rxjs.operators;
const { fromFetch } = rxjs.fetch;

export class Crosshair {
  #inputSubscription
  lastDragPoint = { x: 0, y: 0 }
  dragStartPoint = { x: 0, y: 0 }

  constructor(initialPoint = { x: 0, y: 0 }, el) {
    this.name = 'crosshair';
    this.basePoint = { x: 0, y: 0 }
    this.size = 11;
    this.pointSize = 2.5;

    this.state = new BehaviorSubject(initialPoint)
      .pipe(
        scan((prevPoint, currPoint) => {
          this.dragStartPoint = prevPoint ? this.dragStartPoint : currPoint;

          if (!currPoint) {
            this.lastDragPoint = this.basePoint;

            return this.basePoint;
          }

          return {
            x: this.lastDragPoint.x + (currPoint.x - this.dragStartPoint.x),
            y: this.lastDragPoint.y + (currPoint.y - this.dragStartPoint.y),
          }
        }, this.basePoint),
        map(this.update.bind(this)),
        // tap(x => console.warn('[[ Crosshair:Point ]]', x)),
        // tap(x => {
        //   console.warn('x', x)
        //   console.groupCollapsed('CROSSHAIR STATE RUN: ');
        //   console.log('this.basePoint', this.basePoint)
        //   console.log('this.dragStartPoint', this.dragStartPoint)
        //   console.log('this.lastDragPoint', this.lastDragPoint)
        //   console.groupEnd('CROSSHAIR STATE RUN: ');
        // }),
      );
  }

  get bounds() {
    return {
      top: (this.basePoint.y - (this.size / 2)),
      bottom: (this.basePoint.y + (this.size / 2)),
      left: (this.basePoint.x - (this.size / 2)),
      right: (this.basePoint.x + (this.size / 2)),
    }
  }

  get centerPoint() {
    return {
      top: (this.basePoint.y - (this.pointSize / 2)),
      bottom: (this.basePoint.y + (this.pointSize / 2)),
      left: (this.basePoint.x - (this.pointSize / 2)),
      right: (this.basePoint.x + (this.pointSize / 2)),
    }
  }

  get axisLines() {
    return `
      M ${this.bounds.left},${this.basePoint.y} -50,${this.basePoint.y}
      M ${this.bounds.right},${this.basePoint.y} 50,${this.basePoint.y}
      M ${this.basePoint.x},${this.bounds.top} ${this.basePoint.x},-50
      M ${this.basePoint.x},${this.bounds.bottom} ${this.basePoint.x},50
    `.trim();
  }

  get sightBox() {
    return `
      M ${this.bounds.left},${this.bounds.top}
        ${this.bounds.right},${this.bounds.top}
        ${this.bounds.right},${this.bounds.bottom}
        ${this.bounds.left},${this.bounds.bottom}
      z`.trim();
  }

  get sightPoint() {
    return `
      M ${this.centerPoint.left},${this.centerPoint.top}
        ${this.centerPoint.right},${this.centerPoint.top}
        ${this.centerPoint.right},${this.centerPoint.bottom}
        ${this.centerPoint.left},${this.centerPoint.bottom}
      z
    `.trim();
  }

  get d() {
    return `
      ${this.axisLines} 
      ${this.sightBox} 
      ${this.sightPoint}
    `.trim();
  }

  connectInput(controlStream$) {
    this.$inputSubscription = controlStream$
      .subscribe(this.state);

    return this.$inputSubscription;
  }

  watch() {
    return this.state.asObservable();
  }

  update(point = { x: 0, y: 0 }) {
    this.basePoint = point;

    return {
      ...this.bounds,
      name: this.name,
      point: this.basePoint,
      d: this.d,
    }
  }
}