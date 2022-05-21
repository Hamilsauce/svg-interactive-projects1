const { forkJoin, Observable, iif, BehaviorSubject, AsyncSubject, Subject, interval, of , fromEvent, merge, empty, delay, from } = rxjs;
const { flatMap, reduce, groupBy, toArray, mergeMap, switchMap, scan, map, tap, filter } = rxjs.operators;
const { fromFetch } = rxjs.fetch;


export const pointerStream = (el, startHandler, moveHandler, endHandler) => {
  return fromEvent(el, 'pointerdown')
    .pipe(map(startHandler))
    .pipe(switchMap(e => fromEvent(document, 'pointermove').pipe(map(moveHandler))
      .pipe(switchMap(e => fromEvent(document, 'pointerup').pipe(map(endHandler))))
    ))
}


export class SvgPen {
  constructor(canvas, options = {}) {
    this.canvas = canvas;

    this.state = {
      color: {
        fill: '#FFFFFF',
        stroke: '#000000',
      },
      shape: 'rect',
      point: {},

      eventPoint$: new Subject(),
    };

    this.drawStreams$ = {
      start: fromEvent(this.canvas, 'pointerdown').pipe(map(dragHandler)),
      move: fromEvent(document, 'pointermove').pipe(map(dragHandler)),
      end: fromEvent(document, 'pointerup').pipe(map(dragHandler)),
    }

    this.penEventSubscription = this.drawStreams$.start.pipe(
      switchMap(e => drawStreams$.move
        .pipe(
          switchMap(e => drawStreams$.end))
      )
    ).subscribe();

    this.pointerEventSub$ = this.pointerEvents$.subscribe(this.state.eventPoint$)
    this.eventResponseSub$ = this.eventResponses$
      .pipe(
        map(_ => this.state.objectRegistry.get(_)),
        map(_ => _.toggleSelect()),
        tap(x => console.log('EVENT RESP', x))
      )
      .subscribe()

    this.eventChannel = {
      events$: this.state.eventPoint$.pipe(map(e => ({ x: e.pageX, y: e.pageY }))),
      respond: this.boundPost
    }

    Object.assign(this, options);
  }

  startAt(x, y) {}
  drawTo(x, y) {}
  drawTo(x, y) {}

  setFillColor() {}

  setStrokeColor() {}

  setStrokeWidth() {}

  getElementAtPoint(point) {}

  queryElements(selector, predicateFn) {
    return this.elements.find(predicateFn)
  }

  draw() {
    // const
  }

  domPoint(element, x, y) {
    let pt = svg.DOMPoint();
    pt.x = x;
    pt.y = y;
    return pt.matrixTransform(
      element.getScreenCTM().inverse()
    );

  }


  makeDraggable(element) {
    draggable(this.self, element.container)
  }

  get elements() {
    return [...this.objectRegistry.keys()]
  }

  get objectRegistry() {
    return this.state.objectRegistry
  }

  static createCanvas(options) { return new SvgCanvas(document.createElement('svg'), options || {}) }

  static attachCanvas(el, options) { return new SvgCanvas(el, options || {}) }

  get children() { return [...this.self.children] };
  // set children(newValue) { this._children = newValue };
}
