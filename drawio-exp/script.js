import ham from 'https://hamilsauce.github.io/hamhelper/hamhelper1.0.0.js';
import { draggable } from '/services/draggable.js'
const { date, array, utils, text } = ham;

const app = document.querySelector('#app');
const appBody = document.querySelector('#app-body')
const containers = document.querySelectorAll('.container')
const svg = document.querySelector('svg');
const surface = document.querySelector('#surface');

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



export class Canvas {
  constructor(svg, config = DEFAULT_CANVAS_CONFIG) {
    this.root;
    this.self = svg || document.createElement('svg');
    this.surface = svg.querySelector('#surface') || this.createLayer('surface');

    Object.assign(this, config);
  }

  setView(x, y, width, height) {
    this.viewBox = { x, y, width, height };

  }

  createLayer(name, zIndex, options) {
    const l = document.createElement(this.namespaceURI, 'g');
    l.id = name
    Object.assign(l, options || {});
    this.self.appendChild(surface)
    return l;
  }
  setSize(width, height) {}

  setOrigin(x, y) {}

  setScale(x, y) {}

  setPosition(x, y) {}

  zoom() {}

  pan() {}

  makeDraggable(el) {
    const stopDrag = draggable(this.self, el);
    el.dataset.draggable = true;
    el.removeDrag = () => {
      stopDrag()
      el.dataset.draggable = false;
    }
  }

  createTransform() { return this.sel.createSVGTransform() }


  get viewBox() { return this.self.viewBox.baseVal }

  set viewBox({ x, y, width, height }) {
    Object.assign(this.viewBox, { x: x || 0, y: y || 0, width: width || 0, height: height || 0 })
  }

  get namespaceURI() { return 'http://www.w3.org/2000/svg' }

  get dataset() { return this.self.dataset }

  set dataset(val) { Object.entries(val).forEach(([prop, value]) => this.self.dataset[prop] = value) }

  get classList() { return this.self.classList }

  set classList(val) { this.self.classList.add(...val) }

  get draggables() { return [...this.self.querySelectorAll('[data-draggable="true"]')] }

  get layers() { return [...this.self.querySelectorAll('[data-layer="true"]')] }

  set background(val) { this.layers[0].querySelector('.face').style.fill = val }

  get id() { return this.self.id }

  set id(val) { this.self.id = val }

  get width() { return this.self.width.baseVal.value };

  set width(newValue) { this.self.width.baseVal.value = newValue };

  get height() { return this.self.height.baseVal.value };

  set height(newValue) { this.self.height.baseVal.value = newValue };
}

const canvas = new Canvas(svg)
canvas.makeDraggable(surface)

canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

console.log(canvas.self.viewBox.baseVal);
console.warn(canvas.draggables)

// canvas.self.addEventListener('removedrag', e => {
//   console.log('removed');

// });
canvas.self.addEventListener('dragstart', e => {
  console.log(e.detail);
  setTimeout(() => {
    // surface.removeDrag()
    console.log(' ', );
    // console.warn(canvas.draggables)
    console.warn(canvas.layers)
  }, 1000)
});