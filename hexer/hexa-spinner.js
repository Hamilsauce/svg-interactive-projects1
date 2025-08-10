import { draggable } from 'https://hamilsauce.github.io/hamhelper/draggable.js';

const app = document.querySelector('#app');
const debugConsole = document.querySelector('#debug-console');
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
      this.lastBbox.x + ((bboxPoint1.x - this.lastBbox.x) - 0), //bb.width,
      this.lastBbox.y + ((bboxPoint1.y - this.lastBbox.y) - 0), //bb.height
    );
    
    const bboxPoint4 = domPoint(
      scene,
      this.lastBbox.y + ((bboxPoint2.y - bboxPoint1.y) - 0), //bb.width,
      this.lastBbox.x + ((bboxPoint2.x - bboxPoint1.x) - 0), //bb.height
    );
    
    
    const rect = drawRect({
      x: this.lastBbox.x + ((bboxPoint1.x - this.lastBbox.x) - 0),
      y: this.lastBbox.y + ((bboxPoint1.y - this.lastBbox.y) - 0),
      height: 50 - this.lastBbox.y + ((bboxPoint2.y - bboxPoint1.y) - 0),
      width: 50 + this.lastBbox.x + ((bboxPoint2.x - bboxPoint1.x) - 0),
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
    
    // const bb = this.shape.getBoundingClientRect()
    const bb = this.shape.getBBox()
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
    
    // const rect = drawRect({
    //   x: bb.x, 
    //   y: bb.y,
    //   height: bb.height,
    //   width: bb.width,
    // })
    
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

function generateStarPath(cx, cy, outerRadius, innerRadius, points) {
  const angleStep = Math.PI / points;
  let path = '';
  
  for (let i = 0; i < 2 * points; i++) {
    const angle = i * angleStep - Math.PI / 2; // start at the top
    const r = i % 2 === 0 ? outerRadius : innerRadius;
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    path += i === 0 ? `M${x},${y}` : `L${x},${y}`;
  }
  
  path += 'Z'; // close the path
  
  const svg = document.querySelector('svg');
  const pathEl = document.createElementNS(SVG_NS, 'path')
  const g = document.createElementNS(SVG_NS, 'g')
  
  g.classList.add('star');
  
  pathEl.setAttribute('d', path)
  pathEl.setAttribute('fill', 'gold');
  pathEl.setAttribute('stroke', 'black');
  
  g.appendChild(pathEl);
  
  return g;
}

function generateStarPoints(cx, cy, outerRadius, innerRadius, points) {
  const angleStep = Math.PI / points;
  let pts = [];
  
  for (let i = 0; i < 2 * points; i++) {
    const angle = i * angleStep - Math.PI / 2;
    const r = i % 2 === 0 ? outerRadius : innerRadius;
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    pts.push(`${x},${y}`);
  }
  
  return pts.join(' ');
}


const plotPoints = (radius, numberOfPoints) => {
  const angleStep = (Math.PI * 2) / numberOfPoints;
  const points = [];
  
  for (let i = 1; i <= numberOfPoints; i++) {
    const x = Math.cos(i * angleStep) * radius;
    const y = Math.sin(i * angleStep) * radius;
    
    const dpt = domPoint(svg, x, y);
    
    const svgPoint = svg.createSVGPoint();
    
    svgPoint.x = x - (dpt.x - x) / 5;
    svgPoint.y = y - (dpt.y - y) / 5;
    
    points.push(svgPoint);
  }
  
  return points;
}

const drawShape = (radius, pointCount = 6) => {
  const points = plotPoints(radius, pointCount)
  const g = document.createElementNS(SVG_NS, 'g');
  
  const hex = document.createElementNS(SVG_NS, 'polygon');
  g.appendChild(hex)
  
  points.forEach((p) => {
    const vert = document.createElementNS(SVG_NS, 'circle');
    vert.classList.add('vertex')
    vert.setAttribute('r', 2.5)
    vert.setAttribute('cx', p.x)
    vert.setAttribute('cy', p.y)
    
    hex.points.appendItem(p)
    g.appendChild(vert)
    
  })
  svg.appendChild(g)
  
  hex.classList.add('hex')
  g.classList.add('container')
  const radBCR = hex.getBoundingClientRect()
  const radBBox = hex.getBBox()
  const radScreenCTM = hex.getScreenCTM()
  const radCTM = hex.getCTM()
  const { width, height } = radBBox
  console.log(pointCount,
  {
    radBBox,
    radBCR,
    radScreenCTM,
    radCTM
  })
  g.setAttribute('transform', `translate(-${width/2},-${height/2}) rotate(0) scale(1)`)
  // hex.setAttribute('transform', `translate(-${radius},-${radius}) rotate(0) scale(1)`)
  // g.setAttribute('transform-origin', 'center center')
  
  
  return g
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


const hex1 = drawShape(26, 6);
const square1 = drawShape(26, 4);
const triangle1 = drawShape(26, 3);
const manyAngle1 = drawShape(26, 16);

const star5 = generateStarPath(0, 0, 26, 13, 5);
const star4 = generateStarPath(0, 0, 26, 13, 4);

// const stopdrag = 
draggable(svg, hex1)
draggable(svg, square1)
draggable(svg, triangle1)
draggable(svg, manyAngle1)

let starIntervalStart
let starIntervalEnd

let starAnimState = {
  scale: 1,
  rotate: 0,
  hueRotate: 0,
  active: false,
  mod: -1,
}

const initValueUpdater = (initial, min, max, step = 1, name) => {
  let val = initial
  let roundMod = step < 1 ? 100 : 1
  
  return (mod = -1) => {
    val = Math.round((val + (step * mod)) * roundMod) / roundMod
    
    const inRange = !(val <= min || val > max)
    
    if (!inRange) val = val <= min ? min : max
    
    return val
  }
};

const updateScale = initValueUpdater(1, 1, 5, 0.05, 'scale')
const updateRotate = initValueUpdater(0, 0, 720, 7.2, 'rotate')
const updateHueRotate = initValueUpdater(0, 0, 720, 7.2)

svg.addEventListener('dragstart', e => {
  if (starIntervalEnd) {
    clearInterval(starIntervalEnd)
    starIntervalEnd = null
  }
  
  
  if (starIntervalStart) {
    clearInterval(starIntervalStart)
    starIntervalStart = null
  } else {
    starIntervalStart = setInterval(() => {
      starAnimState.rotate = updateRotate(1);
      starAnimState.hueRotate = updateHueRotate(1);
      starAnimState.scale = updateScale(1);
      
      const { rotate, hueRotate, scale } = starAnimState;
      
      debugConsole.textContent = `r: ${Math.round(rotate)} s: ${Math.round(scale)} hr: ${hueRotate}`
      // star5.firstElementChild.style.transform = `translate(0,0) rotate(${rotate}deg) scale(${scale})`
      triangle1.firstElementChild.style.transform = `translate(0,0) rotate(${rotate}deg) scale(${scale})`
      
      star5.firstElementChild.style.fill = `hsl(${hueRotate}, 100%, 50%)`
      star5.firstElementChild.setAttribute(`hue-rotate`, hueRotate)
    }, 32)
  }
});

svg.addEventListener('dragend', e => {
  if (starIntervalStart) {
    clearInterval(starIntervalStart)
    starIntervalStart = null
  }
  
  starIntervalEnd = setInterval(() => {
    starAnimState.rotate = updateRotate(-1);
    starAnimState.hueRotate = updateHueRotate(-1);
    starAnimState.scale = updateScale(-1);
    
    const { rotate, hueRotate, scale } = starAnimState;
    
    if (rotate <= 0) {
      clearInterval(starIntervalEnd)
      starIntervalEnd = null
    }
    
    debugConsole.textContent = `r: ${rotate} s: ${scale} hr: ${hueRotate}`
    
    star5.firstElementChild.style.fill = `hsl(${hueRotate}, 100%, 50%)`
    star5.firstElementChild.style.transform = `translate(0,0) rotate(${rotate}deg) scale(${scale})`
  }, 32)
});


const svgParentWidth = getComputedStyle(svg.parentElement).width
const svgParentheight = getComputedStyle(svg.parentElement).height
svg.style.width = svgParentWidth
svg.style.height = svgParentheight

console.warn('svgParentheight', svgParentheight)
const vert = document.createElementNS(SVG_NS, 'circle');
vert.classList.add('origin')
vert.setAttribute('r', 16)
vert.setAttribute('cx', 0)
vert.setAttribute('cy', 0)



scene.append(
  star4,
  vert,
  // hex1,
  // triangle1,
  square1,
  manyAngle1,
  // star5
)


shapeHex.init(hex1)
const rect = drawRect(hex1.getBoundingClientRect());

anim.start(null, shapeHex)