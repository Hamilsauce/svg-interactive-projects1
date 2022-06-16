import { toTrackPoint } from '/svg-trackpad/lib.js';

const { forkJoin, Observable, iif, BehaviorSubject, AsyncSubject, Subject, interval, of , fromEvent, merge, empty, delay, from } = rxjs;
const { flatMap, reduce, groupBy, toArray, mergeMap, switchMap, scan, map, tap, filter } = rxjs.operators;
const { fromFetch } = rxjs.fetch;

export class Crosshair {
  #inputSubscription

  constructor(initialPoint = { x: 0, y: 0 }, el) {
    this.name = 'crosshair';
    this.basePoint = { x: 0, y: 0 }
    this.size = 11;
    this.d = ''

    this.state = new BehaviorSubject(initialPoint)
      .pipe(
        map(this.update.bind(this)),
        scan((prevPoint, newPoint) => {
          const point = { ...prevPoint, ...newPoint }
          return {
            ...prevPoint,
            ...newPoint
          }
        }),
      )
  }

  connectInput(controlStream$) {
    this.$inputSubscription = controlStream$
      .pipe().subscribe(this.state)
    return this.$inputSubscription
  }

  watch() {
    return this.state.asObservable()
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
    this.basePoint = point //addVectors(this.basePoint, point)

    let d = `
     M ${this.bounds.left},${this.basePoint.y} 
       -50,${this.basePoint.y}
     M ${this.bounds.right},${this.basePoint.y} 
       50,${this.basePoint.y} 
     M ${this.basePoint.x},${this.bounds.top} 
       ${this.basePoint.x},-50
     M ${this.basePoint.x},${this.bounds.bottom} 
       ${this.basePoint.x},50
     M ${this.bounds.left},${this.bounds.top}
       ${this.bounds.right},${this.bounds.top}
       ${this.bounds.right},${this.bounds.bottom}
       ${this.bounds.left},${this.bounds.bottom}
    z`.trim();

    this.d = d;

    return {
      name: this.name,
      point,
      d,
      ...this.bounds,
    }
  }
}
