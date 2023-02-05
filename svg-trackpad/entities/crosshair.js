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
    this.d = '';

    this.state = new BehaviorSubject(initialPoint)
      .pipe(
        scan((prevPoint, currPoint) => {
          this.dragStartPoint = prevPoint ? this.dragStartPoint : currPoint;

          if (currPoint === null) {
            this.lastDragPoint = this.basePoint;

            return this.basePoint;
          }

          return {
            x: this.lastDragPoint.x + (currPoint.x - this.dragStartPoint.x),
            y: this.lastDragPoint.y + (currPoint.y - this.dragStartPoint.y),
          }
        }, this.basePoint),
        map(this.update.bind(this)),
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

  connectInput(controlStream$) {
    this.$inputSubscription = controlStream$
      .subscribe(this.state);

    return this.$inputSubscription;
  }

  watch() {
    return this.state.asObservable();
  }

  get bounds() {
    return {
      top: (this.basePoint.y - (this.size / 2)),
      bottom: (this.basePoint.y + (this.size / 2)),
      left: (this.basePoint.x - (this.size / 2)),
      right: (this.basePoint.x + (this.size / 2)),
    }
  }

  update(point = { x: 0, y: 0 }) {
    this.basePoint = point;

    const { top, bottom, left, right } = this.bounds;

    const { x, y } = point;

    let d = `
     M ${left},${y}
       -50,${y}
     M ${right},${y} 
       50,${y} 
     M ${x},${top} 
       ${x},-50
     M ${x},${bottom} 
       ${x},50
     M ${left},${top}
       ${right},${top}
       ${right},${bottom}
       ${left},${bottom}
    z`.trim();

    this.d = d;

    return {
      ...this.bounds,
      name: this.name,
      point,
      d,
    }
  }
}