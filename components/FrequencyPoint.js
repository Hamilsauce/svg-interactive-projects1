export class FrequencyPoint {
  constructor() {
    this.self 
  };
  get prop() { return this._prop };
  set prop(newValue) { this._prop = newValue };
}

const SVG_NS = 'http://www.w3.org/2000/svg';
const canvas = document.querySelector('svg')
const center = {
  x: window.innerWidth / 2,
  y: window.innerHeight / 2,
}

const createHex = (x, y, r) => {
  const circ = getCircle(-0, -0, 10);
  canvas.appendChild(circ)
}


const getCircle = (x, y, r) => {
  const circ = document.createElementNS(SVG_NS, 'circle');
  circ.cx.baseVal.value = x;
  circ.cy.baseVal.value = y;
  circ.r.baseVal.value = r;
  circ.classList.add('circ1')
  circ.setAttribute('transform', 'translate(0,0) scale(1)')
  return circ;
}


createHex()