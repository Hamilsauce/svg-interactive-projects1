import { toTrackPoint } from '/svg-trackpad/lib.js';

const { forkJoin, Observable, iif, BehaviorSubject, AsyncSubject, Subject, interval, of, fromEvent, merge, empty, delay, from } = rxjs;
const { distinctUntilChanged, flatMap, reduce, groupBy, toArray, mergeMap, switchMap, scan, map, tap, filter } = rxjs.operators;
const { fromFetch } = rxjs.fetch;

export class Pawn {
  #inputSubscription;
  #isTargeted;
  currentInput;

  constructor(point = { x: 0, y: 0 }, el) {
    this.name = 'pawn';

    this.basePoint = point//{ x: -25, y: -25 };

    this.size = 4;

    this.position$ = new BehaviorSubject(this.basePoint)
      .pipe(
        tap(this.update.bind(this)),
        scan((prevPoint, { x, y }) => ({
          ...prevPoint,
          ...{ cx: x, cy: y },
          ...this.bounds,
          r: this.size,
        }), {
          cx: this.basePoint.x,
          cy: this.basePoint.y,
          r: this.size,
          name: this.name,
        }),
      );
  }

  get isTargeted() { return this.#isTargeted }

  set isTargeted(newValue) { this.#isTargeted = newValue };

  connectInput(controlStream$) {
    this.$inputSubscription = controlStream$.subscribe(this.position$);

    return this.$inputSubscription;
  }

  disconnectInput() {
    if (!this.$inputSubscription.unsubscribe) throw new Error('');
    this.$inputSubscription.unsubscribe();
    
    return this.$inputSubscription;
  }

  watch() {
    return this.position$.asObservable();
  }

  get bounds() {
    return {
      top: (this.basePoint.y - (this.size / 2)),
      bottom: (this.basePoint.y + (this.size / 2)),
      left: (this.basePoint.x - (this.size / 2)),
      right: (this.basePoint.x + (this.size / 2)),
    };
  }

  update(point = { x: 0, y: 0 }) {
    this.basePoint = point;

    return {
      ...this.bounds,
      name: this.name,
      r: this.size,
      point
    }
  }
}