import { toTrackPoint } from '/svg-trackpad/lib.js';

const { forkJoin, Observable, iif, BehaviorSubject, AsyncSubject, Subject, interval, of , fromEvent, merge, empty, delay, from } = rxjs;
const { distinctUntilChanged, flatMap, reduce, groupBy, toArray, mergeMap, switchMap, scan, map, tap, filter } = rxjs.operators;
const { fromFetch } = rxjs.fetch;

export class Pawn {
  #inputSubscription;
  #isTargeted;
  constructor(point = { x: 0, y: 0 }, el) {
    this.name = 'pawn'
    this.basePoint = { x: -25, y: -25 };
    this.size = 5;
    this.currentInput;

    this.position$ = new BehaviorSubject(this.basePoint)
      .pipe(
        tap(this.update.bind(this)),
        scan((prevPoint, { x, y }) => {
          return { ...prevPoint, ...{ cx: x, cy: y }, r: this.size, ...this.bounds }
        }, {
          cx: this.basePoint.x,
          cy: this.basePoint.y,
          r: this.size,
          name: this.name,
        }),
      )
  }

  get isTargeted() { return this.#isTargeted }

  set isTargeted(newValue) { this.#isTargeted = newValue };

  connectInput(controlStream$) {
    this.$inputSubscription = controlStream$
      .pipe().subscribe(this.position$)
    return this.$inputSubscription
  }
  
  disconnectInput() {
    this.$inputSubscription.unsubscribe()
    return this.$inputSubscription
  }

  watch() {
    return this.position$.asObservable()
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
    this.basePoint = point
    return { 
      name: this.name,
      point, 
      r: this.size, 
      ...this.bounds 
      
    }
  }
}
