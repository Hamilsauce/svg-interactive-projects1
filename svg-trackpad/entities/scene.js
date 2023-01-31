import { toTrackPoint, toScenePoint, addVectors } from '../lib.js';
import { Pawn } from './pawn.js';
import { Crosshair } from './crosshair.js';

const { combineLatest, iif, ReplaySubject, AsyncSubject, BehaviorSubject, Subject, interval, of, fromEvent, merge, empty, delay, from } = rxjs;
const { sampleTime, throttleTime, mergeMap, switchMap, scan, take, takeWhile, map, tap, startWith, filter, mapTo } = rxjs.operators;


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
    this.viewBox = this.scene.viewBox.baseVal

    if (config) {
      const { viewport, viewBox } = config;

      this.scene.setAttribute('width', viewport.width)
      this.scene.setAttribute('height', viewport.height)
      Object.assign(this.viewBox, { ...viewBox })
    }

    this.objectsLayer = document.querySelector('#objects');
    this.sceneSurface = document.querySelector('#scene-surface');

    this.parent = parent ? parent : document.body;
    this.padSurface = document.querySelector('#surface');

    this.crosshair = new Crosshair({ x: 0, y: 0 });
    this.crosshairEl = document.querySelector('#crosshair-path');
    this.addEntity(this.crosshair.name, this.crosshairEl);

    this.pawn = new Pawn({ x: 0, y: 0 }) //, this.createEl('circle',{size:5, id:'actor'})
    this.actorEl = document.querySelector('#actor');
    this.addEntity(this.pawn.name, this.actorEl);

    /*
     * CONNECT INPUT STREAMS TO ENTITIES
     * CONNECT ENTITY UPDATES TO SCENE
     */

    const grabPress$ = fromEvent(this, 'grabAction')
      .pipe(
        map(({ detail }) => detail.action),
        tap(x => console.log('grabPress$', x))
      );

    this.collisions$ = new BehaviorSubject(null)
      .pipe(
        filter((_) => _),
        filter(({ crosshair, pawn }) => this.detectEnclosure(crosshair, pawn)),
        switchMap(({ crosshair, pawn }) => grabPress$
          .pipe(
            filter((e) => this.detectEnclosure(crosshair, pawn)),
            tap(action => {
              if (action == 'capture') {
                this.capture(crosshair, pawn)
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

    this.crosshair$ = (this.crosshair.watch()).pipe(
      filter(_ => _),
      filter((crosshair) => {
        const { point } = crosshair
        const { x, y, width, height } = this.viewBox;

        return crosshair.left >= x &&
          crosshair.top >= y &&
          crosshair.right < width + x &&
          crosshair.bottom < height + y;
      }),
    );

    this.crosshair.connectInput(
      fromEvent(this.padSurface, 'pointermove')
      .pipe(
        map(({ clientX, clientY }) => toTrackPoint(clientX, clientY)),
        // tap(x => console.log('x', x)),
        // map(({ x, y }) => ({x:x+this.lastDragPoint, y: y+this.lastDragPoint})),
      ),
    );

    this.dragStop$ = fromEvent(this.padSurface, 'pointerup')
      .pipe(
        tap(({ clientX, clientY }) => {
          this.lastDragPoint = toTrackPoint(clientX, clientY)
        }),
        tap(x => console.log('dragStop$', this.lastDragPoint))
      );

    this.dragStop$.subscribe();

    this.pawn$ = this.pawn.watch().pipe(
      tap(x => console.log('this.pawn$', x)),
    );


    this.scene$ = combineLatest(
      this.crosshair$,
      this.pawn$.pipe(startWith({})),
      (crosshair, pawn) => ({ crosshair, pawn })
    ).pipe(
      sampleTime(24),
      tap(({ crosshair, pawn }) => {
        this.collisions$.next({ crosshair, pawn });
      })
    );

    this.scene$.subscribe(this.render.bind(this));
  }

  static create(parent, config = {}) {
    return Object.assign(new Game(parent), config).init()
  }

  handleGrab(e) {
    console.log('grab');
    // this.addEventListener('drop', this.handleDrop.bind(this))
    // this.removeEventListener('grab', this.handleGrab.bind(this))
  }

  handleDrop(e) {
    console.log('drop');
    // this.addEventListener('grab', this.handleGrab.bind(this))
    // this.removeEventListener('drop', this.handleDrop.bind(this))
  }

  createEl(tag, config = {}) {
    const el = document.createElementNS(SVG_NS, tag);
    el.id = config.id;
    el.setAttribute('transform', 'translate(0,0)');

    return Object.assign(el, config);
  }

  init() {
    this.crosshair.connectInput(this.pawn$);
    this.scene$.subscribe(this.render.bind(this));

    return this;
  }

  render({ crosshair, pawn }) {
    this.#paintEntity(this.crosshairEl, crosshair)
    this.#paintEntity(this.actorEl, pawn)
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
    )
  }

  detectEnclosure(a, b) {
    let bel = this.actorEl
    let ael = this.crosshairEl

    return (
      b.top > a.top &&
      b.bottom < a.bottom &&
      b.right < a.right &&
      b.left > a.left
    );
  }

  capture(capturer, targ) {
    if (!capturer || !targ) return
    let capturer$
    let targ$

    if (capturer.name = 'crosshair') {

      capturer$ = this.crosshair$ //(this.crosshair.watch()).pipe()
    }

    if (capturer.name = 'pawn') {
      // const capturer$ = (capturer.watch()).pipe()
      this.pawn.connectInput(
        capturer$.pipe(map(({ point }) => ({ ...point })))
      );
    }
  }

  release(targ) {
    console.log('targ', targ)

    if (this.pawn && targ.name === 'pawn') {
      this.pawn.disconnectInput()

    }
  }

  #paintEntity(el, attrs = {}) {
    Object.entries(attrs)
      .forEach(([k, v], i) => {
        el.setAttribute(k, v)
      });
  }

  getEntityElement(name, el) {
    return this.entities.get(name);
  }

  addEntity(name, el) {
    return this.entities.set(name, el);
    return this.entities.get(name);
  }
}