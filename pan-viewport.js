// import { domPoint } from './utils.js';
import ham from 'https://hamilsauce.github.io/hamhelper/hamhelper1.0.0.js';
const { template, utils , rxjs} = ham;
const domPoint = (element, x, y) => {
  return new DOMPoint(x, y).matrixTransform(
    element.getScreenCTM().inverse()
  );
}


const { forkJoin, Observable, iif, BehaviorSubject, AsyncSubject, Subject, interval, of, fromEvent, merge, empty, delay, from } = rxjs;
const { exhaustMap, startWith, flatMap, reduce, groupBy, toArray, mergeMap, switchMap, scan, map, tap, filter } = rxjs.operators;
const { fromFetch } = rxjs.fetch;

const createPanEvent = ({ svg, target, clientX, clientY } = new PointerEvent()) => {
  return domPoint((target ? target : svg), clientX, clientY);
};

const calculateOrigimDelta = ({ viewBox, x, y, clientY } = new PointerEvent()) => {
  return domPoint((target ? target : svg), clientX, clientY);
};


export const addPanAction = (svg, callback) => {
  let currentOrigin = domPoint(svg, 0, 0)
  let panOrigin = null;
  
  const scene = svg.querySelector('#scene');
  const viewBox = svg.viewBox.baseVal;
  
  const touchstart$ = fromEvent(svg, 'touchstart').pipe(filter(({ touches }) => touches.length <= 2), )
  const touchmove$ = fromEvent(svg, 'touchmove').pipe(filter(({ touches }) => touches.length >= 2), )
  const touchend$ = fromEvent(svg, 'touchend').pipe(filter(({ touches }) => touches.length >= 2), )
  
  const multitouch$ = fromEvent(svg, 'touchstart').pipe(filter(({ touches }) => touches.length >= 2))
  
  multitouch$
    .pipe(
      map(x => x),
      // tap(e => console.log('multitouch$'))
    )
    // .subscribe()
  
  const pointerdown$ = fromEvent(svg, 'pointerdown')
    .pipe(
      tap((e) => {
        e.preventDefault();
        e.stopPropagation();
      }),
      // exhaustMap(value => {
      //   return touchstart$; // this must complete for next `value` to be considered
      // }),
      
      map(createPanEvent),
      tap(point => panOrigin = point),
    );
  
  const pointermove$ = fromEvent(svg, 'pointermove')
    .pipe(
      tap((e) => {
        e.preventDefault();
        e.stopPropagation();
      }),
      // exhaustMap(value => {
      //   return multitouch$; // this must complete for next `value` to be considered
      // }),
      
      map(createPanEvent),
      map(({ x, y }) => {
        return {
          type: 'pointermove',
          x: viewBox.x - ((x - panOrigin.x)),
          y: viewBox.y - ((y - panOrigin.y))
        }
      }),
      tap((origin) => {
        callback(origin)
      }),
      
    );
  
  const pointerup$ = fromEvent(svg, 'pointerup')
    .pipe(
      exhaustMap(value => {
        return touchend$; // this must complete for next `value` to be considered
      }),
      map(createPanEvent),
      map(({ x, y }) => {
        return {
          type: 'pointerdown',
          x: viewBox.x - ((x - panOrigin.x)),
          y: viewBox.y - ((y - panOrigin.y))
        }
      }),
    );
  
  return pointerdown$.pipe(
    // exhaustMap(value => {
    //   return multitouch$; // this must complete for next `value` to be considered
    // }),
    switchMap(panOrigin => pointermove$.pipe(
      // tap(x => console.log('swotch map move')),
      // tap(({ x, y }) => {
      //   const o = {
      //     x: viewBox.x + (viewBox.width / 2),
      //     y: viewBox.y + (viewBox.height / 2),
      //   }
      // }),
    )),
    switchMap(delta => pointerup$)
  )
};