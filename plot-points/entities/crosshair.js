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
        scan((prevPoint, newPoint) => {
          return {
            // this.#viewBox.x = this.#panOrigin.x - ((point.x - this.#pointerOrigin.x) * this.ratio);
            // this.#viewBox.y = this.#panOrigin.y - ((point.y - this.#pointerOrigin.y) * this.ratio);

            x: this.prevPoint.x - this.dragStartPoint.x - (newPoint.x - this.lastDragPoint.x),
            y: this.prevPoint.y - this.dragStartPoint.y - (newPoint.y - this.lastDragPoint.y),
            // x: this.lastDragPoint.x - (newPoint.x - prevPoint.x),
            // y: this.lastDragPoint.y - (newPoint.y - prevPoint.y),
          }
        }, this.basePoint),
        map(this.update.bind(this)),
        tap(x => console.warn('END OF CROSSHAIR STATE PIPE', this)),
      )
  }

  connectInput(controlStream$) {
    console.log('controlStream$', controlStream$)
    this.$inputSubscription = controlStream$
      .pipe(
        
        tap(x => console.warn(' CROSSHAIR connectInput PIPE', this)),
        ).subscribe(this.state);

    return this.$inputSubscription;
  }

  watch() {
    return this.state.asObservable()
      .pipe(
        scan((prevPoint, newPoint) => {
          return {
            // this.#viewBox.x = this.#panOrigin.x - ((point.x - this.#pointerOrigin.x) * this.ratio);
            // this.#viewBox.y = this.#panOrigin.y - ((point.y - this.#pointerOrigin.y) * this.ratio);

            x: this.prevPoint.x - this.dragStartPoint.x - (newPoint.x - this.lastDragPoint.x),
            y: this.prevPoint.y - this.dragStartPoint.y - (newPoint.y - this.lastDragPoint.y),
            // x: this.lastDragPoint.x - (newPoint.x - prevPoint.x),
            // y: this.lastDragPoint.y - (newPoint.y - prevPoint.y),
          }
        }, this.basePoint),
        map(this.update.bind(this)),
        tap(x => console.warn('END OF CROSSHAIR STATE PIPE', this)),
      )

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
    console.warn('END OF CROSSHAIR STATE PIPE', this)

    return {
      ...this.bounds,
      name: this.name,
      point,
      d,
    }
  }
}