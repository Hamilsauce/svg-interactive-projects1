import { Point } from './Point.js';

const { forkJoin, asObservable, Observable, iif, BehaviorSubject, AsyncSubject, Subject, interval, of , fromEvent, merge, empty, delay, from } = rxjs;
const { flatMap, reduce, groupBy, toArray, mergeMap, switchMap, scan, map, tap, filter } = rxjs.operators;
const { fromFetch } = rxjs.fetch;

export const DEFAULT_PATH_DATA = {
  points: {
    start: Point.create(-25, 25),
    controlA: Point.create(-25, -25),
    controlB: Point.create(25, -25),
    end: Point.create(25, 25),
  }
}
export class SvgPath {
  #data$;
  constructor(input$, initialData = DEFAULT_PATH_DATA, options = {}) {
    this.input$ = input$;

    this.inputSubscription = this.input$
      .pipe(
        tap(x => this.#data$.next(x))
      )
      .subscribe()

    this.#data$ = new BehaviorSubject(initialData.points)
      .pipe(
        map(x => x),
        scan((previousPoints, points) => {
          return { ...previousPoints, ...points }
        },{}),
        map(this.update.bind(this)),
      )

    this.state$ = {
      selected: false,
      rendered: true,
    };

    this.initialData = initialData;

    // this.channel.events$
    // .pipe(
    //   map(x => x),
    //   tap(x => console.log('IN PATH', x)),
    //   tap(p => {
    //     console.log('this.containsPoint(p)', this.containsPoint(p))
    //     if (this.containsPoint(p)) {
    //       this.channel.respond(this.self)
    //     }
    //   }),
    // ).subscribe()
  }

  update(dict) {
    return `${this.moveTo(dict.start)} ${this.cubic(dict)}`
  }
  
  updateCurve() {}
  connect() {
    return this.#data$//.asObservable()
  }
  


  containsPoint(p) {
    return (
      p.y >= this.boundingBox.top &&
      p.y < this.boundingBox.bottom &&
      p.x >= this.boundingBox.left &&
      p.x < this.boundingBox.right
    )
  }

  toggleSelect(p) {
    this.selected = !this.selected
  }


  get dataset() {
    return this.self.dataset
  }
  get boundingBox() {
    return this.self.getBoundingClientRect();
  }
  set selected(v) {
    this.container.dataset.selected = v
  }
  get selected() {
    return this.container.dataset.selected === 'true' ? true : false
  }



  moveTo({ x, y }, positioning = 'abs') {
    const cmd = positioning === 'abs' ? 'M' : 'm'
    const point = ` ${cmd}${Math.round(x)},${Math.round(y)}`
    return point;
  }
  
  
  cubic({ controlA, controlB, end }, positioning = 'abs') {
    const cmd = positioning === 'abs' ? 'C' : 'c'
    const point = ` ${cmd}${this.getPointString(controlA)} ${this.getPointString(controlB)} ${this.getPointString(end)}`
    return point;
  }
  
  // LineTo() { ' L, l, H, h, V, v' }
  // Cubic() { 'Bézier Curve: C, c, S, s' }
  // Quadratic() { 'Bézier Curve: Q, q, T, t' }
  // Elliptical() { 'Arc Curve: A, a' }
  // ClosePath() { ' Z, z' }
  getPointString({x,y}){
    return `${Math.round(x)},${Math.round(y)}`
    
  }

  // static createPath(options) { return new SvgPath(document.createElementNS(SVG_NS, 'svg'), options || {}) }
  static createPath(input$) { return new SvgPath(input$) }
  // static attachPath(el, options) { return new SvgPath(el, options || {}) }
  get def() { return this.self.getAttribute('d') }
  set def(newValue) { this._def = newValue }
}
