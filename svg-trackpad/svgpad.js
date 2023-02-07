import {
  toTrackPoint,
  toScenePoint,
  addVectors
} from './lib.js';
import { Scene } from './entities/scene.js'

const { forkJoin, Observable, iif, BehaviorSubject, AsyncSubject, Subject, interval, of, fromEvent, merge, empty, delay, from } = rxjs;
const { flatMap, reduce, groupBy, toArray, mergeMap, switchMap, scan, map, tap, filter } = rxjs.operators;
const { fromFetch } = rxjs.fetch;

const app = document.querySelector('#app');
const coordsDisplay = document.querySelector('#coordsDisplay');
const coordsDisplay2 = document.querySelector('#coordsDisplay2');
const pawnPointDisplay = document.querySelector('#pawn-point-display');

const sceneEl = document.querySelector('#scene');
const padSurface = document.querySelector('#surface');
const pointerMarker = document.querySelector('#pointer-marker');

const scene = new Scene(sceneEl, sceneEl.parentElement, {
  viewport: {
    width: 412,
    height: 412,
  },
  viewBox: {
    x: -50,
    y: -50,
    width: 100,
    height: 100,
  }
});



const onTrackpadStart = (e) => {
  pointerMarker.classList.add('active');
  pointerMarker.r.baseVal.value = pointerMarker.r.baseVal.value + 1 > 100 ?
    pointerMarker.r.baseVal.value :
    pointerMarker.r.baseVal.value + 1.5;

  padSurface.addEventListener('pointermove', onTrackpadDrag);

  app.addEventListener('pointerup', onTrackpadStop);
}

const onTrackpadStop = (e) => {
  const tp = toTrackPoint(e.clientX, e.clientY)
  const trackpoint = { x: Math.round(tp.x), y: Math.round(tp.y) };

  pointerMarker.r.baseVal.value = 5;

  pointerMarker.classList.remove('active');
  pointerMarker.setAttribute('transform', `translate(${0},${0})`);


  coordsDisplay.textContent = `trackpad:  [ ${0} , ${0} ]`;

  app.removeEventListener('pointerup', onTrackpadStop);
}

const previousPoint = { x: 0, y: 0 }
// this.#viewBox.x = this.#panOrigin.x - ((point.x - this.#pointerOrigin.x) * this.ratio);
// this.#viewBox.y = this.#panOrigin.y - ((point.y - this.#pointerOrigin.y) * this.ratio);

const onTrackpadDrag = (e) => {
  const tp = toTrackPoint(e.clientX, e.clientY)
  const trackpoint = { x: Math.round(tp.x), y: Math.round(tp.y) };

  const delta = {
    x: (trackpoint.x - previousPoint.x),
    y: (trackpoint.y - previousPoint.y),
  }

  if (!(delta.x > 10 || delta.y > 10)) {
    e.preventDefault();
    e.stopPropagation();
  }
  pointerMarker.setAttribute('transform', `translate(${trackpoint.x},${trackpoint.y})`);

  coordsDisplay.textContent = `trackpad:  [ ${trackpoint.x} , ${trackpoint.y} ]`;
};

const onSceneChange = ({ detail }) => {
  const { crosshair, pawn } = detail;
  coordsDisplay2.textContent = `crosshair: [ ${Math.round(crosshair.x)} , ${Math.round(crosshair.y)} ]`;
  pawnPointDisplay.textContent = `pawn: [ ${Math.round(pawn.x)} , ${Math.round(pawn.y)} ]`;
};

padSurface.addEventListener('pointerdown', onTrackpadStart);
app.addEventListener('scenechange', onSceneChange);