const SVG_NS = 'http://www.w3.org/2000/svg';
const canvas = document.querySelector('svg')
const center = {
  x: window.innerWidth / 2,
  y: window.innerHeight / 2,
}

const createAxes = (x, y, r) => {
  const l1 = drawLine({ x: 0, y: -100 }, { x: 0, y: 100 });
  const l2 = drawLine({ x: -100, y: 0 }, { x: 100, y: 0 });
  canvas.insertAdjacentElement('afterbegin', l1)
  canvas.insertAdjacentElement('afterbegin', l2)
}

const drawCircle = (x, y, r) => {
  const circ = document.createElementNS(SVG_NS, 'circle');
  circ.cx.baseVal.value = x;
  circ.cy.baseVal.value = y;
  circ.r.baseVal.value = r;
  // circ.classList.add('circ1')
  circ.setAttribute('transform', 'translate(0,0) scale(1)')
  circ.setAttribute('fill', '#FFFFFF50')
  return circ;
}

const drawLine = (pointA, pointB) => {
  const line = document.createElementNS(SVG_NS, 'line');
  line.x1.baseVal.value = pointA.x;
  line.y1.baseVal.value = pointA.y;
  line.x2.baseVal.value = pointB.x;
  line.y2.baseVal.value = pointB.y;
  line.classList.add('line')
  line.setAttribute('stroke-width', 0.5);
  line.setAttribute('stroke', '#FF00FF50');
  line.setAttribute('transform', 'translate(0,0) scale(1)')
  return line;
}


export class Body {
  constructor(w, h, units) {
    this.w = w
    this.h = h
    this.units = units
  }

  get prop() { return this._prop };
  set prop(newValue) { this._prop = newValue };
}




export class Wheel {
  constructor(cx, cy, r, attrs) {
    this.self = document.createElementNS(SVG_NS, 'circle');
    this.cx = cx;
    this.cy = cy;
    this.r = r;
    this.attrs = attrs;
  }

  rotate(angle = 0) {
this.self.setAttribute('transform',`rotate(${angle})`)
  }

  get cx() { return this.self.cx.baseVal.value }
  set cx(v) { this.self.cx.baseVal.value = v }

  get cy() { return this.self.cy.baseVal.value }
  set cy(v) { this.self.cy.baseVal.value = v }

  get r() { return this.self.r.baseVal.value }
  set r(v) { this.self.r.baseVal.value = v }

  get attrs() { return this.self.attrs }
  set attrs(v) { this.self.attrs = v }
}



export class Car {
  constructor() {


  }
  get prop() { return this._prop };
  set prop(newValue) { this._prop = newValue };
}

export class CarBuilder {
  constructor() {}

  createBody() {}

  createWheel() {}

  assemble() {}
}


createAxes()