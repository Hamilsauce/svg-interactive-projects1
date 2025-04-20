import ham from 'https://hamilsauce.github.io/hamhelper/hamhelper1.0.0.js';
import { draggable } from 'https://hamilsauce.github.io/hamhelper/draggable.js';
const { pipeline, array, utils } = ham;

export class Point {
  #x;
  #y;
  #self;
  constructor(x = 0, y = 0) {
    this.#self = new DOMPoint(x, y)
  }
  
  static from(x, y) {
    return new Point(x, y)
  }
  
  get x() { return this.#self.x }
  set x(v) { this.#self = new DOMPoint(x, this.y) }
  get y() { return this.#self.y }
  set y(v) { this.#self = new DOMPoint(this.x, y) }
}



class SvgTransformListApi {
  #defaultMatrix = [1, 0, 0, 1, 0, 0];
  #TransformTypes = {
    translate: 'Translate',
    rotate: 'Rotate',
    scale: 'Scale',
    skew: 'Skew',
    get(k) { return this[k.toLowerCase()] ? this[k.toLowerCase()] : null }
  };
  
  constructor(svg = new SVGSVGElement()) {
    this.svg = svg;
    this.transforms = new Map();
    this.#self;
    this.translate;
    this.scale;
    this.rotate;
    this.init();
  }
  
  init(initialValues = {}) {
    this.createTransform('translate');
    this.setTranslate(0, 0);
    this.append(this.transforms.get('translate'));
    
    this.createTransform('rotate');
    this.setRotate(initialValues.rotate ? initialValues.rotate : 0);
    this.append(this.transforms.get('rotate'));
    
    this.createTransform('scale');
    this.setScale(initialValues.scale ? initialValues.scale : 1);
    this.append(this.transforms.get('scale'));
  }
  
  get matrix() { return this.#self.matrix.baseVal || this.#defaultMatrix };
  
  get translate() { return this.transforms.get('translate') }

  get scale() { return this.transforms.get('scale') }

  get rotate() { return this.transforms.get('rotate') }
  
  get #self() { return this.svg.transform.baseVal };
  
  
  getItem(i) { return this.#self.getItem(i) }
  
  setTranslate(x = 0, y = 0) {
    this.transforms.get('translate').setTranslate(x, y);
    return this;
  }
  
  setRotate(degrees = 0) {
    this.transforms.get('rotate').setRotate(degrees, 0, 0);
    return this;
  }
  
  setScale(s = 1) {
    this.transforms.get('scale').setScale(s, s);
    return this;
  }
  
  append(transform) {
    this.#self.appendItem(transform)
    return this
  }
  
  insert(transform) {
    this.#self.appendItem(transform)
    return this
  }
  
  createTransform(transformType = 'translate') {
    const t = this.svg.createSVGTransform();
    
    if (!this.transforms.has(transformType.toLowerCase())) {
      this.transforms.set(transformType.toLowerCase(), t)
    }
    return t;
  }
}


class SvgViewBox {
  constructor(svg) {
    this.svg = svg;
    this.init();
  }
  
  originCenter(w = this.width, h = this.height) {
    this.x = -(w / 2);
    this.y = -(h / 2);
  }
  
  originTopLeft() {
    this.x = 0;
    this.y = 0;
  }
  
  get center() { return Point.from(this.width / 2, this.height / 2) }
  
  get #self() { return this.svg.viewBox.baseVal };
  
  get x() { return this.#self.x };
  set x(x) { Object.assign(this.#self, { x }) };
  
  get y() { return this.#self.y }
  set y(y) { Object.assign(this.#self, { y }) }
  
  get width() { return this.#self.width };
  set width(width) { Object.assign(this.#self, { width }) };
  
  get height() { return this.#self.height };
  set height(height) { Object.assign(this.#self, { height }) };
  
  
  init(initialValues = {}) {}
}

class SvgElementContainer {
  constructor(svg, type, attrs) {
    this.svg = svg;
    this.init();
  }
  
  init() {}
  
  setAttrs() {}
  
  transformStack() {}
  
  
  static create(type, attrs) {
    return new SvgElementContainer(type, attrs)
  }
  
  get #self() { return this.svg.viewBox.baseVal };
  
  get parent() { return this.#self.parentElement };
  // get parent() { return this.svg.viewBox.baseVal };
  
  get x() { return this.#self.x };
  set x(x) { Object.assign(this.#self, { x }) };
  
  get y() { return this.#self.y }
  set y(y) { Object.assign(this.#self, { y }) }
  
  get width() { return this.#self.width };
  set width(width) { Object.assign(this.#self, { width }) };
  
  get height() { return this.#self.height };
  set height(height) { Object.assign(this.#self, { height }) };
}


const DEFAULT_CANVAS_CONFIG = {
  id: 'canvas',
  x: 0,
  y: 0,
  width: window.innerWidth,
  height: window.innerHeight,
  background: '#C7C7C7',
  viewBox: {
    x: -(window.innerWidth / 2),
    y: -(window.innerHeight / 2),
    width: window.innerWidth,
    height: window.innerHeight,
  }
}


const PatternTypes = {
  grid: 'grid',
  none: 'none',
}

export class SvgApi extends EventTarget {
  #self;
  #transformList;
  #viewBox;
  #selection;
  #layers = new Map();
  
  constructor(svg) {
    super()
    
    this.#self = svg
    this.#transformList = new SvgTransformListApi(this.#self)
    this.#viewBox = new SvgViewBox(this.#self)
    
    console.log('canvas api', this, this.#viewBox, this.#transformList);
  }
  
  /*
    Sets currently selected Object
    While selected, Object is target of
    actions/operations and is parent of 
    newly drawn elements
  */
  
  select(el) {
    console.log('el', { el })
    this.selection = el;
    this.dispatchFromSelection('select', { target: el })
  }
  
  clearSelection() {
    console.log('el', { el })
    this.selection.deselect()
  }
  
  initializeCanvas(config = DEFAULT_CANVAS_CONFIG) {
    Object.assign(this, config)
  }
  
  query(scope = '*', predicate = (el) => { return true }) {
    return [...this.#self.querySelectorAll(scope)]
      .filter(predicate) || []
  }
  
  find(predicateOrSelector = (el) => { return true }) {
    if (typeof predicateOrSelector === 'string') {
      return this.#self.querySelector(predicateOrSelector);
    } else {
      return [...this.#self.querySelectorAll('*')].find(predicate) || null
    }
  }
  
  
  on(evt, handler) {
    this.#self.addEventListener(evt, handler)
    return () => this.#self.removeEventListener(evt, handler)
  }
  
  dispatchFromSelection(evt, detail) {
    if (!this.selection) return
    this.selection.dispatchEvent(new CustomEvent(evt, { bubbles: true, detail }));
  }
  
  getPoint(element, x, y) {
    return new DOMPoint(x, y).matrixTransform(
      element.getScreenCTM().inverse()
    );
  }
  
  composeTransformPipeline(element, ...transforms) {
    const xpipe = pipeline(element, ...transforms);
  }
  
  setViewBox({ x, y, width, height }) {
    this.viewBox = { x, y, width, height };
  }
  
  sizeToViewport(overrides, origin) {
    const w = overrides.width ? overrides.width : window.innerWidth;
    const h = overrides.height ? overrides.height : window.innerHeight;
    
    this.setSize(window.innerWidth, window.innerHeight)
    
    if (origin === 'center') {
      this.setViewBox(-(w / 2), -(h / 2), w, h)
      
    }
  }
  
  zoom(factor = 1) {
    
    
    for (var i = 0; i < 4; i++) {
      this.#transformList.matrix[i] *= factor;
      // transformMatrix[i] *= scale;
    }
    this.#transformList.matrix[4] += (1 - scale) * this.#viewBox.center.x;
    this.#transformList.matrix[5] += (1 - scale) * this.#viewBox.center.y;
    
    var newMatrix = "matrix(" + this.#transformList.matrix.join(' ') + ")";
    matrixGroup.setAttributeNS(null, "transform", newMatrix);
  }
  
  setSize(width, height) {
    this.width = width
    this.height = height
  }
  
  setOrigin(viewPoint = 'center') {
    this.#viewBox.originCenter(this.width, this.height)
  }
  
  orginToCenter() {
    this.#viewBox.originCenter(this.width, this.height)
  }
  
  setScale(x, y) {}
  
  setTranslate(x, y) {
    this.#transformList.setTranslate(x, y)
  }
  
  setStyle(cssProp, v) {
    this.selection.setAttribute(cssProp, v)
  }
  
  setPosition(x, y) {}
  
  drawRect(vector) {
    const rect = document.createElementNS(this.namespaceURI, 'rect')
    rect.setAttribute('x', vector.p1.x)
    rect.setAttribute('y', vector.p1.y)
    rect.setAttribute('width', vector.p2.x - vector.p1.x)
    rect.setAttribute('height', vector.p2.y - vector.p1.y)
    this.selection.appendChild(rect)
  }
  
  createElement(type = 'circle') {
    return document.createElementNS(this.namespaceURI, type)
  }
  
  drawCircle(x = 0, y = 0, r = 100, fill = '#000000', stroke = '#000000', strokeWidth = 1) {
    const c = this.createElement('circle')
    
    c.setAttribute('cx', x)
    c.setAttribute('cy', y)
    c.setAttribute('r', r)
    c.setAttribute('fill', fill)
    
    this.selection.appendChild(c)
    return c
  }
  
  makeDraggable(el) {
    const stopDrag = draggable(this.#self, el);
    el.dataset.draggable = true;
    el.removeDrag = () => {
      stopDrag()
      el.dataset.draggable = false;
    }
  }
  
  get selection() { return this.#self.querySelector('[data-canvas-state="selected"]') || this.#self }
  
  set selection(el) {
    if (this.selection && this.selection !== this.#self) this.selection.deselect();
    console.log('el', { el })
    el.dataset.canvasState = 'selected';
    el.deselect = () => {
      delete el.dataset.canvasState;
      delete el.dataset.deselect;
      el.dispatchEvent(new CustomEvent('deselect', { bubbles: true, target: el }))
    }
    
  }
  
  // get transformList() { return this.#self.transform.baseVal };
  
  set transforms(newValue) { this._transforms = newValue };
  
  set background(newValue) { this.#self.style.background = newValue };
  
  // get viewBox() { return this.#self.viewBox.baseVal }
  set viewBox({ x, y, width, height }) {
    Object.assign(this.#viewBox, { x: x || 0, y: y || 0, width: width || 0, height: height || 0 })
  }
  
  get namespaceURI() { return 'http://www.w3.org/2000/svg' }
  
  get dataset() { return this.#self.dataset }
  
  set dataset(val) { Object.entries(val).forEach(([prop, value]) => this.#self.dataset[prop] = value) }
  
  get classList() { return this.#self.classList }
  
  set classList(val) { this.#self.classList.add(...val) }
  
  get draggables() { return [...this.#self.querySelectorAll('[data-draggable="true"]')] }
  
  get layers() { return [...this.#self.querySelectorAll('[data-scom-type="layer"]')] }
  
  get id() { return this.#self.id }
  
  set id(val) { this.#self.id = val }
  
  get width() { return this.#self.width.baseVal.value };
  
  set width(newValue) { this.#self.width.baseVal.value = newValue };
  
  get height() { return this.#self.height.baseVal.value };
  
  set height(newValue) { this.#self.height.baseVal.value = newValue };
}

// function transformMe(evt) {
//   // svg root element to access the createSVGTransform() function
//   var svgroot = evt.target.parentNode;

//   // SVGTransformList of the element that has been clicked on
//   var tfmList = evt.target.transform.baseVal;

//   // Create a seperate transform object for each transform
//   var translate = svgroot.createSVGTransform();
//   translate.setTranslate(50, 5);

//   var rotate = svgroot.createSVGTransform();
//   rotate.setRotate(10, 0, 0);

//   var scale = svgroot.createSVGTransform();
//   scale.setScale(0.8, 0.8);

//   // apply the transformations by appending the SVGTranform objects to the SVGTransformList associated with the element
//   tfmList.appendItem(translate);
//   tfmList.appendItem(rotate);
//   tfmList.appendItem(scale);
// }