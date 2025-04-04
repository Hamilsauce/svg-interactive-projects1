const app = document.querySelector('#app');
const appBody = document.querySelector('#app-body')
const containers = document.querySelectorAll('.container')
const svg = document.querySelector('#svg');
const scene = svg.querySelector('#scene');
import { anim } from './anim.js';


export class Hexagon {
  shape = null;
  rotation = 0;
  lastBbox = { x: 0, y: 0 };;
  rect2 = null;

  constructor(options) {
    this.root;
  };

  // get prop() { return this.#prop };

  // set prop(v) { this.#prop = v };

  init(shapeEl) {
    this.shape = shapeEl
  }

  rotate(degree = 0) {
    el.setAttribute("transform", `translate(0,0) rotate(${degree})`);
  }

  move(u) {
    this.rotation += 1;
    this.shape.setAttribute("transform", `translate(0,0) rotate(${0})`);

    const bb = this.shape.getBoundingClientRect()
    const bboxPoint1 = domPoint(scene, bb.x, bb.y, );
    const bboxPoint2 = domPoint(scene, bb.width, bb.height);

    // const bboxPoint1 = { x: bb.x/4, y: bb.y/4 } //  domPoint(scene, bb.x, bb.y, );
    // const bboxPoint2 = { width: bb.width/4, height: bb.height/4 } //  domPoint(scene, bb.x, bb.y, );

    let oldRect = svg.querySelector('.bbox')

    oldRect.remove();


    const bboxPoint3 = domPoint(
      scene,
      this.lastBbox.x + ((bboxPoint1.x - this.lastBbox.x) - 0),//bb.width,
      this.lastBbox.y + ((bboxPoint1.y - this.lastBbox.y) - 0),//bb.height
    );

    const bboxPoint4 = domPoint(
      scene,
      this.lastBbox.y + ((bboxPoint2.y - bboxPoint1.y) - 0),//bb.width,
      this.lastBbox.x + ((bboxPoint2.x - bboxPoint1.x) - 0),//bb.height
    );


    const rect = drawRect({
      x: this.lastBbox.x + ((bboxPoint1.x - this.lastBbox.x) - 0),
      y: this.lastBbox.y + ((bboxPoint1.y - this.lastBbox.y) - 0),
      height:50 - this.lastBbox.y + ((bboxPoint2.y - bboxPoint1.y) - 0),
      width:50 + this.lastBbox.x + ((bboxPoint2.x - bboxPoint1.x) - 0),
      // width: this.lastBbox.x + ((bboxPoint2.x - bboxPoint1.x) - 0),
    })

    const rects = [...scene.querySelectorAll('rect')]

    if (rects.length > 40) { rects[0].remove() }
    this.lastBbox = bboxPoint1
  }
}

const shapeHex = {
  shape: null,
  rotation: 0,
  lastBbox: { x: 0, y: 0 },
  rect2: null,

  init: function(shapeEl) {
    this.shape = shapeEl
  },
  rotate(degree = 0) {
    el.setAttribute("transform", `translate(0,0) rotate(${degree})`);
  },
  move: function(u) {
    this.rotation += 1;
    this.shape.setAttribute("transform", `translate(0,0) rotate(${this.rotation})`);

    const bb = this.shape.getBoundingClientRect()
    const bboxPoint1 = domPoint(scene, bb.x, bb.y, );
    const bboxPoint2 = domPoint(scene, bb.width, bb.height);

    let oldRect = svg.querySelector('.bbox')

    oldRect.remove();

    const rect = drawRect({
      x: this.lastBbox.x + ((bboxPoint1.x - this.lastBbox.x) - 0),
      y: this.lastBbox.y + ((bboxPoint1.y - this.lastBbox.y) - 0),
      height: 50 - this.lastBbox.y + ((bboxPoint2.y - bboxPoint1.y) - 0),
      width: 50 + this.lastBbox.x + ((bboxPoint2.x - bboxPoint1.x) - 0),
    })

    const rects = [...scene.querySelectorAll('rect')]

    if (rects.length > 40) { rects[0].remove() }
    this.lastBbox = bboxPoint1
  }
};

// const shapeHex = new Hexagon()


const domPoint = (element, x, y) => {
  return new DOMPoint(x, y).matrixTransform(
    element.getScreenCTM().inverse()
  );
}


const plotPoints = (radius, numberOfPoints) => {
  const angleStep = (Math.PI * 2) / numberOfPoints
  const points = []

  for (let i = 1; i <= numberOfPoints; i++) {
    const x = Math.cos(i * angleStep) * radius
    const y = Math.sin(i * angleStep) * radius

    const dpt = domPoint(svg, x, y)

    console.log('dpt', dpt)
    const svgPoint = svg.createSVGPoint()


    svgPoint.x = x - (dpt.x - x) / 5
    svgPoint.y = y - (dpt.y - y) / 5
    // svgPoint.matrixTransform(
    //   svg.getScreenCTM().inverse()
    // );

    console.warn('svgPoint.x, svgPoint.y', svgPoint.x, svgPoint.y)

    points.push(svgPoint)
  }

  return points
}


const drawShape = (radius) => {
  const points = plotPoints(radius, 6)
  const hex = document.createElementNS(SVG_NS, 'polygon');

  points.forEach((p) => hex.points.appendItem(p))

  hex.classList.add('hex')
  scene.appendChild(hex)

  return hex
};

let rotation = 0

const drawRect = (bb) => {
  const rect = document.createElementNS(SVG_NS, 'rect');

  rect.x.baseVal.value = bb.x
  rect.y.baseVal.value = bb.y
  rect.setAttribute('width', bb.width)
  rect.setAttribute('height', bb.height)
  rect.classList.add('bbox')
  const hexbb = document.querySelector('.hex').getBoundingClientRect()
  const bbRect = document.createElementNS(SVG_NS, 'rect');
  bbRect.x.baseVal.value = hexbb.x
  bbRect.y.baseVal.value = hexbb.y
  bbRect.setAttribute('width', hexbb.width)
  bbRect.setAttribute('height', hexbb.height)
  rotation = rotation += 1
  bbRect.setAttribute("transform", `translate(0,0) rotate(${rotation})`);

  bbRect.classList.add('hexbounds', '_bbox')
  scene.appendChild(rect)

  return rect
};


const hex1 = drawShape(26);

shapeHex.init(hex1)
const rect = drawRect(hex1.getBoundingClientRect());

anim.start(null, shapeHex)