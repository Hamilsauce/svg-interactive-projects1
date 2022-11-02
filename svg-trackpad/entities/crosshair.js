import { toTrackPoint } from '/svg-trackpad/lib.js';

const { forkJoin, Observable, iif, BehaviorSubject, AsyncSubject, Subject, interval, of , fromEvent, merge, empty, delay, from } = rxjs;
const { flatMap, reduce, groupBy, toArray, mergeMap, switchMap, scan, map, tap, filter } = rxjs.operators;
const { fromFetch } = rxjs.fetch;

export class Crosshair {
  #inputSubscription

  constructor(initialPoint = { x: 0, y: 0 }, el) {
    this.name = 'crosshair';
    this.basePoint = { x: 0, y: 0 }
    this.size = 22;
    this.d = '';

    this.state = new BehaviorSubject(initialPoint)
      .pipe(
        map(this.update.bind(this)),
        scan((prevPoint, newPoint) => {
          // const point = { ...prevPoint, ...newPoint }
          return {
            ...prevPoint,
            ...newPoint
          }
        }),
      )
  }

  connectInput(controlStream$) {
    this.$inputSubscription = controlStream$
      .pipe().subscribe(this.state);

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
