import { toTrackPoint, toScenePoint, addVectors } from '../lib.js';
import { Pawn } from './pawn.js';
import { Crosshair } from './crosshair.js';

import ham from 'https://hamilsauce.github.io/hamhelper/hamhelper1.0.0.js';
const { template, utils, addDragAction } = ham;




const { switchAll, combineLatest, iif, ReplaySubject, BehaviorSubject, Subject, interval, of, fromEvent, merge, empty, delay, from } = rxjs;
const { toArray, groupBy, distinctUntilChanged, takeUntil, sampleTime, throttleTime, mergeMap, switchMap, scan, take, takeWhile, map, tap, startWith, filter, mapTo } = rxjs.operators;

const DEFAULT_CONF = {
  id: 'canvas',
  width: window.innerWidth,
  height: 380,
};

export class Scene extends EventTarget {
  enclosures$ = new Subject();
  lastDragPoint = 0;
  config = {
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
  }

  constructor(svg, parent, config) {
    super()

    this.entities = new Map();

    this.canvas = svg || document.createElement('svg');
    this.scene = document.querySelector('#scene');
    this.viewBox = this.scene.viewBox.baseVal;

    if (config) {
      const { viewport, viewBox } = config;

      this.scene.setAttribute('width', viewport.width);
      this.scene.setAttribute('height', viewport.height);
      Object.assign(this.viewBox, { ...viewBox });
    }

    this.objectsLayer = document.querySelector('#objects');
    this.sceneSurface = document.querySelector('#scene-surface');

    this.parent = parent ? parent : document.body;
    this.padSurface = document.querySelector('#surface');

    this.crosshair = new Crosshair({ x: 0, y: 0 });
    this.crosshairEl = document.querySelector('#crosshair-path');
    this.addEntity(this.crosshair.name, this.crosshairEl);

    this.pawn = new Pawn({ x: 0, y: 0 });
    this.actorEl = document.querySelector('#actor');
    this.addEntity(this.pawn.name, this.actorEl);

    /*
     * CONNECT INPUT STREAMS TO ENTITIES
     * CONNECT ENTITY UPDATES TO SCENE
     */

    const dragEvents$ = new Subject()

    addDragAction(this.padSurface, e => {
      dragEvents$.next(e);
    }).subscribe();

    this.trackpad$ = dragEvents$
      .pipe(
        groupBy(x => x.type),
        tap(x => console.log('TAP', x)),
      )
      .subscribe();


    const click$ = fromEvent(this.padSurface, 'click');

    this.collisions$ = new BehaviorSubject(null)
      .pipe(
        filter((_) => _),
        switchMap(({ crosshair, pawn }) => click$
          .pipe(
            filter((e) => this.detectEnclosure(crosshair, pawn)),
            tap(action => {
              if (!this.actorEl.classList.contains('captured')) {
                this.capture(crosshair, pawn);

                this.crosshairEl.setAttribute('transform', 'translate(0,0)')

                this.actorEl.classList.add('captured');
              }
              else {
                this.release(pawn);

                this.actorEl.classList.remove('captured');
              }
            })
          )
        )
      );

    this.collisions$.subscribe();

    this.crosshair$ = (this.crosshair.watch())
      .pipe(
        filter(_ => _),
        filter((crosshair) => {
          const { point } = crosshair
          const { x, y, width, height } = this.viewBox;

          return crosshair.left >= x &&
            crosshair.top >= y &&
            crosshair.right <= width + x &&
            crosshair.bottom <= height + y;
        }),
        tap(),
        scan((prev, curr) => {
          return {
            ...curr,
            x: this.isInBoundsX(curr) ? curr.x : prev.x,
            y: this.isInBoundsY(curr) ? curr.y : prev.y,
          }
        }, { x: 0, y: 0 }),
      );

    this.dragStartStop$ = merge(
      fromEvent(this.padSurface, 'pointerdown').pipe(
        map(({ clientX, clientY }) => {
          this.dragStartPoint = toTrackPoint(clientX, clientY)
          this.crosshair.dragStartPoint = this.dragStartPoint

          return this.dragStartPoint
        }),
        distinctUntilChanged((a, b) => Math.abs(a.x - b.x) > 5 || Math.abs(a.y - b.y) > 5),
      ),
      fromEvent(this.padSurface, 'pointermove').pipe(
        map(({ clientX, clientY }) => toTrackPoint(clientX, clientY)),
      ),
      fromEvent(this.padSurface, 'pointerup').pipe(
        map(({ clientX, clientY }) => null),
      )
    );

    this.crosshair.connectInput(this.dragStartStop$);

    this.pawn$ = this.pawn.watch().pipe();

    this.scene$ = combineLatest(
      this.crosshair$,
      this.pawn$.pipe(startWith({})),
      (crosshair, pawn) => ({ crosshair, pawn })
    ).pipe(
      sampleTime(40),
      tap(({ crosshair, pawn }) => {
        this.collisions$.next({ crosshair, pawn });
      }),
      // tap(({ crosshair }) => console.warn('scene$ - crosshair', crosshair)),
      tap(({ crosshair }) => {
        this.scene.dispatchEvent(new CustomEvent('scenechange', { bubbles: true, detail: { crosshair: crosshair.point } }))
      }),
    );

    this.scene$.subscribe(this.render.bind(this));
  }

  static create(parent, config = {}) {
    return Object.assign(new Game(parent), config).init();
  }

  init() {
    this.scene$.subscribe(this.render.bind(this));

    return this;
  }

  render({ crosshair, pawn }) {
    this.#paintEntity(this.crosshairEl, crosshair);

    this.#paintEntity(this.actorEl, pawn);
  }

  gameOver(crosshair, pawns) {
    // return pawns.some(enemy => {
    //   if (this.collision(crosshair, enemy)) return true;
    //   return enemy.shots.some(shot => this.collision(ship, shot))
    // });
  }

  collision(target1, target2) {
    return (
      target1.x > target2.x - 20 &&
      target1.x < target2.x + 20 &&
      (target1.y > target2.y - 20 && target1.y < target2.y + 20)
    );
  }

  isInBounds(entity) {
    const { point } = entity;

    const { x, y, width, height } = this.viewBox;

    return entity.left >= x &&
      entity.top >= y &&
      entity.right < width + x &&
      entity.bottom < height + y;
  }

  isInBoundsX(entity) {
    const { x, width } = this.viewBox;

    return entity.left >= x && entity.right < width + x;
  }

  isInBoundsY(entity) {
    const { y, height } = this.viewBox;

    return entity.top >= y && entity.bottom < height + y;
  }

  detectEnclosure(a, b) {
    return !(
      a.top > b.top ||
      a.bottom < b.bottom ||
      a.right < b.right ||
      a.left > b.left
    );
  }

  capture(capturer, targ) {
    if (!capturer || !targ) return;
    let capturer$;

    if (capturer.name === 'crosshair') {
      capturer$ = this.crosshair$;
    }

    if (targ.name === 'pawn') {
      this.pawn.connectInput(
        capturer$.pipe(
          map(({ point }) => ({ ...point }))
        )
      );
    }
  }

  release(targ) {
    if (this.pawn && targ.name === 'pawn') {
      this.pawn.disconnectInput();
    }
  }

  #paintEntity(el, attrs = {}) {
    Object.entries(attrs).forEach(([k, v], i) => {
      el.setAttribute(k, v);
    });
  }

  getEntityElement(name, el) {
    return this.entities.get(name);
  }

  addEntity(name, el) {
    return this.entities.set(name, el);
  }
}