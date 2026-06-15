import { EventEmitter } from 'https://hamilsauce.github.io/hamhelper/event-emitter.js';
import { attachTileSelectorStyle } from './attach-style.js';
import { supercover_line, linePoints, outlineFromPoints, edgesToPath } from './lib/geometry-utils.js';
const SELECTOR_TEMPLATE = `
  <rect class="selection-box" stroke-width="0.1" _stroke="green" width="1" height="1" x="2" y="2" transform="translate(-0.5,-0.5)"></rect>
  <path class="line-outline" transform="translate(-0.5,-0.5)" />
  <circle class="selection-handle" data-handle="a" id="a-handle" r="0.4" _fill="white" stroke-width="0.07" stroke="green" cx="0" cy="0" transform="translate(-0.0,-0.0)"></circle>
  <circle class="selection-handle" data-handle="b" id="b-handle" r="0.4" _fill="white" stroke-width="0.07" stroke="green" cx="0" cy="0" transform="translate(-0.0,-0.0)" data-is-dragging="false"></circle>`;

const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

const clampPoint = (pt, bounds, upperTrim = 1) => ({
  x: clamp(pt.x, bounds.minX, bounds.maxX - upperTrim),
  y: clamp(pt.y, bounds.minY, bounds.maxY - upperTrim),
});

const clampPointWithBounds = (bounds) => (pt, upperTrim = 0) => clampPoint(pt, bounds, upperTrim)

const ROLES = ['a', 'b']

const getHandles = () => ({
  handleKeys: ROLES,
  a: document.querySelector('#a-handle'), //handleA,
  b: document.querySelector('#b-handle'), //handleB,
  anchor: null,
  focus: null,
  
  isHandle(el) {
    return this.handleKeys.some(k => this[k] === el)
  },
  
  setFocus(label = null) {
    if (!label && this.focus) {
      delete this.focus.dataset.role
      delete this.anchor.dataset.role
      this.focus = null;
      this.anchor = null;
      return;
    }
    
    const anchorLabel = this.handleKeys.filter(_ => _ !== label)[0]
    
    this.focus = this[label] ?? null;
    this.anchor = this[anchorLabel] ?? null;
    
    if (this.focus) {
      this.focus.dataset.role = 'focus'
      this.anchor.dataset.role = 'anchor'
    }
  },
});

const getPoints = () => ({
  pointKeys: ROLES,
  a: new DOMPoint(),
  b: new DOMPoint(),
  translation: new DOMPoint(),
  anchor: null,
  focus: null,
  
  get x() { return Math.min(this.anchor?.x, this.focus?.x); },
  get y() { return Math.min(this.anchor?.y, this.focus?.y); },
  get x2() { return (Math.max(this.anchor?.x, this.focus?.x)) <= 0 ? 0 : (Math.max(this.anchor.x, this.focus.x)) + 0 },
  get y2() { return (Math.max(this.anchor?.y, this.focus?.y)) <= 0 ? 0 : (Math.max(this.anchor.y, this.focus.y)) + 0 },
  get width() { return Math.max((this.x2 - this.x), 1) },
  get height() { return Math.max((this.y2 - this.y), 1) },
  
  setFocus(label) {
    const anchorLabel = this.pointKeys.find(_ => _ !== label)
    if (!label || !anchorLabel) return;
    
    this.focus = this[label] ?? null;
    this.anchor = this[anchorLabel] ?? null;
  },
});

const SELECTOR_DEFAULTS = {
  handles: getHandles,
  points: getPoints,
  unitSize: 1,
}

const SVG_NS = 'http://www.w3.org/2000/svg';

export class TileSelector extends EventEmitter {
  #self;
  #handles = getHandles();
  #points = getPoints();
  
  constructor(svgContext) {
    super();
    this.svgContext = svgContext
    this.#self = document.createElementNS(SVG_NS, 'g');
    this.#self.classList.add('tile-selector');
    this.#self.id = 'tile-selector';
    this.mode = 'box';
    
    this.#self.setAttribute('transform', 'translate(-1,-1)');
    
    this.#self.innerHTML = SELECTOR_TEMPLATE;
    
    this.#handles.a = this.#self.querySelector('[data-handle="a"]');
    this.#handles.b = this.#self.querySelector('[data-handle="b"]');
    
    this.dragStartHandler = this.onDragStart.bind(this);
    this.dragHandler = this.onDragHandle.bind(this);
    this.dragEndHandler = this.onDragEnd.bind(this);
    
    this.#self.style.touchAction = 'none';
    
    this.#self.addEventListener('pointerdown', this.dragStartHandler);
    
    this.#self.addEventListener('click', (e) => {
      e.stopPropagation();
      e.stopImmediatePropagation();
      e.preventDefault();
    });
    
    this.#self.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      
      this.mode = this.mode === 'box' ? 'line' : 'box';
    });
    
    this.#handles.a.addEventListener('click', (e) => {
      e.stopPropagation();
      e.stopImmediatePropagation();
      e.preventDefault();
    });
    
    this.#handles.b.addEventListener('click', (e) => {
      e.stopPropagation();
      e.stopImmediatePropagation();
      e.preventDefault();
    });
    
    this.bounds = {
      minX: -Infinity,
      minY: -Infinity,
      maxX: Infinity,
      maxY: Infinity
    };
    
    this.clampToBounds = clampPointWithBounds(this.bounds)
    this.render = this.#render.bind(this);
    this.emitRange = this.#emitRange.bind(this);
    this.dragMode = 'handle'
    
    attachTileSelectorStyle();
  };
  
  get parent() { return this.#self.parentElement };
  get dom() { return this.#self };
  
  get selectBox() { return this.#self.querySelector('.selection-box') }
  
  get isRendered() { return !!this.parent; };
  
  get isDragging() { return this.#self.dataset.isDragging === 'true' ? true : false; };
  
  set isDragging(v) { return this.#self.dataset.isDragging = v; }
  
  get mode() { return this.#self.dataset.mode; }
  
  set mode(v) { return this.#self.dataset.mode = v; }
  get linePath() { return this.#self.querySelector('.line-outline') }
  
  get linePoints() {
    if (this.mode !== 'line') return null;
    return linePoints(this.#points.anchor, this.#points.focus)
  }
  
  setBounds(bounds = { minX: null, minY: null, maxX: null, maxY: null }) {
    Object.assign(this.bounds, bounds);
    return this;
  }
  
  domPoint(x, y, clamp = false) {
    const p = new DOMPoint(x, y).matrixTransform(
      this.svgContext.getScreenCTM().inverse()
    );
    
    return !clamp ? p : {
      x: clamp === 'floor' ? Math.floor(p.x) : Math.ceil(p.x),
      y: clamp === 'floor' ? Math.floor(p.y) : Math.ceil(p.y)
    };
  }
  
  remove() {
    if (this.isRendered) { this.#self.remove(); }
    return this;
  }
  
  // intended as only public method
  insertAt(x, y) {
    const pt = {
      x: x.x !== undefined ? +x.x : +x,
      y: x.y !== undefined ? +x.y : +y,
    };
    
    Object.assign(this.#points.a, { x: pt.x, y: pt.y })
    Object.assign(this.#points.b, { x: pt.x, y: pt.y })
    this.#points.setFocus('a')
    
    this.render();
    this.emitRange();
  }
  
  onDragStart(e) {
    const { target, currentTarget, clientX, clientY } = e;
    const isTargetHandle = this.#handles.isHandle(target);
    const isSelBox = this.selectBox === target || this.linePath === target;
    e.stopPropagation();
    
    if (isTargetHandle) {
      this.dragMode = 'handle'
      
      const handleLabel = isTargetHandle ? target.dataset.handle : null;
      
      this.#handles.setFocus(handleLabel);
      this.#points.setFocus(handleLabel);
    }
    
    else if (isSelBox) {
      const pt = this.domPoint(clientX, clientY);
      this.dragMode = 'translation'
      this.pointerStart = pt
      
      this.#points.translation.x = 0
      this.#points.translation.y = 0
      this.isDragging = true;
      
    }
    
    this.render();
    
    document.addEventListener('pointermove', this.dragHandler);
    document.addEventListener('pointerup', this.dragEndHandler);
  }
  
  onDragHandle(e) {
    const { target, currentTarget, clientX, clientY } = e;
    
    const focusPoint = this.#points.focus;
    const isSelBox = this.selectBox === target
    const pt = this.domPoint(clientX, clientY) //, 'floor');
    
    e.stopPropagation();
    
    if (this.dragMode === 'translation') {
      this.#points.translation.x = pt.x - this.pointerStart.x
      this.#points.translation.y = pt.y - this.pointerStart.y
      
      this.render();
      return
    }
    
    if (!focusPoint) return;
    const clamped = this.clampToBounds(pt)
    
    focusPoint.x = this.mode === 'line' ? clamped.x : pt.x;
    focusPoint.y = this.mode === 'line' ? clamped.y : pt.y;
    
    this.render();
  };
  
  async onDragEnd(e) {
    const { target, currentTarget, clientX, clientY } = e;
    
    const focusPoint = this.#points.focus;
    const focusHandle = this.#handles.focus;
    
    if (this.dragMode === 'translation') {
      const dx = Math.floor(this.#points.translation.x);
      const dy = Math.floor(this.#points.translation.y);
      
      const aPoint = this.clampToBounds({
        x: this.#points.a.x + dx,
        y: this.#points.a.y + dy,
      });
      
      const bPoint = this.clampToBounds({
        x: this.#points.b.x + dx,
        y: this.#points.b.y + dy,
      });
      
      this.#points.a.x = aPoint.x;
      this.#points.a.y = aPoint.y;
      this.#points.b.x = bPoint.x;
      this.#points.b.y = bPoint.y;
      
      this.#points.translation.x = 0;
      this.#points.translation.y = 0;
      this.pointerStart = null;
      this.dragMode = 'handle';
    } else {
      const pt = this.domPoint(clientX, clientY, 'floor');
      
      if (!focusHandle || !focusPoint) return;
      
      const clamped = this.clampToBounds(pt)
      
      focusPoint.x = pt.x //clamped.x;
      focusPoint.y = pt.y //clamped.y;
    }
    
    this.#handles.setFocus(null);
    
    document.removeEventListener('pointermove', this.dragHandler);
    document.removeEventListener('pointerup', this.dragEndHandler);
    this.isDragging = false;
    
    await this.render();
    
    this.emitRange();
  }
  
  async #render() {
    if (!this.isRendered) {
      this.svgContext.append(this.#self);
    }
    
    if (this.mode === 'line') {
      const a = { x: this.#points.anchor.x, y: this.#points.anchor.y }
      const b = { x: this.#points.focus.x, y: this.#points.focus.y }
      const points = linePoints(a, b);
      const edges = outlineFromPoints(this.linePoints);
      const d = edgesToPath(edges);
      this.linePath.setAttribute('d', d);
    } else {
      this.linePath.setAttribute('d', '');
    }
    
    if (this.dragMode === 'translation') {
      const x = this.#points.translation.x;
      const y = this.#points.translation.y;
      this.#self.setAttribute('transform', `translate(${x+0.5},${y+0.5})`);
      return;
    }
    else {
      this.#self.setAttribute('transform', `translate(${0.5},${0.5})`);
    }
    
    this.selectBox.setAttribute('x', this.#points.x);
    this.selectBox.setAttribute('y', this.#points.y);
    
    this.selectBox.setAttribute('width', this.#points.width);
    this.selectBox.setAttribute('height', this.#points.height);
    
    if (this.#handles.focus) {
      const pt = this.domPoint(this.#points.focus.x, this.#points.focus.y, );
      
      this.#handles.focus.setAttribute('cx', this.#points.focus.x);
      this.#handles.focus.setAttribute('cy', this.#points.focus.y);
    }
    else {
      const a = this.domPoint(this.#points.a.x, this.#points.a.y, ) // 'floor');
      const b = this.domPoint(this.#points.b.x, this.#points.b.y, ) // 'floor');
      
      this.#handles.a.setAttribute('cx', this.#points.a.x);
      this.#handles.a.setAttribute('cy', this.#points.a.y);
      this.#handles.b.setAttribute('cx', this.#points.b.x);
      this.#handles.b.setAttribute('cy', this.#points.b.y);
    }
  }
  
  #emitRange() {
    if (this.mode === 'line') {
      const p0 = { x: this.#points.a.x, y: this.#points.a.y };
      const p1 = { x: this.#points.b.x, y: this.#points.b.y };
      
      const points = linePoints(p0, p1);
      
      this.emit('selection', {
        type: 'line',
        points,
        start: p0,
        end: p1,
      });
      
      return;
    }
    
    // existing behavior untouched
    const payload = {
      start: { x: this.#points.x, y: this.#points.y },
      end: { x: this.#points.x2, y: this.#points.y2 },
    };
    
    this.emit('selection', payload);
  }
}

let SelectorInstance = null;

export const getTileSelector = (ctx = document.querySelector('#scene')) => {
  return new TileSelector(ctx);
  
  if (SelectorInstance !== null) {
    return SelectorInstance;
  }
  
  SelectorInstance = new TileSelector(ctx);
  return SelectorInstance;
};