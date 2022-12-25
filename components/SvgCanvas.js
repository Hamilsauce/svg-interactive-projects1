import { draggable } from 'https://hamilsauce.github.io/hamhelper/draggable.js';
import { Point } from './Point.js';
import { SvgPath } from './SvgPath.js';
// import { Dot } from './SvgPath.js';
import ham from 'https://hamilsauce.github.io/hamhelper/hamhelper1.0.0.js';

const { date, array, utils, text } = ham;

const { combineLatest, forkJoin, Observable, iif, BehaviorSubject, AsyncSubject, Subject, interval, of , fromEvent, merge, empty, delay, from } = rxjs;
const { flatMap, reduce, groupBy, toArray, mergeMap, switchMap, scan, map, tap, filter } = rxjs.operators;
const { fromFetch } = rxjs.fetch;

const SVG_NS = 'http://www.w3.org/2000/svg';


const createText = (value, parent) => {
  const textNode = document.createElementNS(SVG_NS, "text");
  const text = document.createTextNode(value);
  textNode.appendChild(text);
  textNode.classList.add('text-node');
  textNode.setAttributeNS(null, 'text-anchor', 'middle');
  textNode.setAttribute('x', 0.5)
  textNode.setAttribute('y', 0.6)

  textNode.setAttribute('transform', 'translate(0,0)')
  parent.prepend(textNode);

  return textNode;
}


export class SvgCanvas {
  constructor(el, options = {}) {
    this.self = el;
    this.self.setAttribute('width', window.innerWidth)
    this.self.setAttribute('height', window.innerHeight)
    this.boundPost = this.post.bind(this)

    // this.draggers = [...this.self.querySelectorAll('.draggable')]

    // this.draggers.forEach(_ => {
    //   draggable(this.self, _)
    // })

    this.state = {
      objectRegistry: new Map(),
      eventPoint$: new Subject(),
    };

    this.pointerEvents$ = fromEvent(this.self, 'pointermove')
      .pipe(
        map(({ target, clientX, clientY }) => ({ target: target, x: clientX, y: clientY })),
        groupBy(_ => _.target.id),
      );

    this.eventResponses$ = new Subject();

    this.pathPoints$ = this.pointerEvents$
      .pipe(
        mergeMap(group$ => group$
          .pipe(
            filter(_ => _.target.closest('.control-set')),
            tap(({ target, x, y }) => {
              const value = this.domPoint.bind(this)(target, x, y)

              target.cx.baseVal.value = value.x
              target.cy.baseVal.value = value.y

              const pointType = target.classList.contains('path-vertex') ? 'vertex' : 'control'
              const line = target.closest('.control-set').querySelector('.control-line')
              if (pointType === 'vertex') {
                line.x2.baseVal.value = value.x
                line.y2.baseVal.value = value.y
              } else {
                line.x1.baseVal.value = value.x
                line.y1.baseVal.value = value.y
              }

              if (this.audio) {
                this.audio.oscillator.frequency.value = value.y
              }

            }),
            map(({ target, x, y }) => ({
              [target.id]: this.domPoint(target, x, y)
            })),
          )
        ),
        scan((inputDict, input) => ({ ...inputDict, ...input })),
      )

    this.eventChannel = {
      events$: this.state.eventPoint$.pipe(map(e => ({ x: e.pageX, y: e.pageY }))),
      respond: this.boundPost
    }

    Object.assign(this, options);

    this.sceneLayer = this.self.querySelector('#scene');
    this.hudLayer = this.self.querySelector('#hud');
    this.surface = this.self.querySelector('#surface-layer');

    this.pathElement = this.self.querySelector('#curve');
    this.pathModel = SvgPath.createPath(this.pathElement, this.pathPoints$)

    this.pathData$ = this.pathModel.connect()
      .pipe(
        tap(x => this.pathElement.setAttribute('d', x)),
      );

    this.pathData$.subscribe();

    console.warn('this.draggers', this.draggers)
  }


  update(x, y) {
    this.audio.oscillator.frequency.value = y
  }

  post(data) {
    this.eventResponses$.next(data);
  }

  getElementAtPoint(point) {}

  queryElements(selector, predicateFn) {
    return this.elements.find(predicateFn)
  }

  draw() {}

  domPoint(element, x, y) {
    return new DOMPoint(x, y).matrixTransform(
      element.getScreenCTM().inverse()
    );
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
}