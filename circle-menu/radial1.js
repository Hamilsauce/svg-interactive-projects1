import { polarToCartesian, cartesianToPolar } from '../lib/cartesian-polar.js'
// import { anim } from "./anim.js";
import { getColor } from '../lib/colors.js';
const SVG_NS = 'http://www.w3.org/2000/svg';
import { engine } from '../render-engine/loop.engine.js';


let RADIANS_TO_DEGREE = 180 / Math.PI
let DEGREE_TO_RADIANS = Math.PI / 180

const domPoint = (element, x, y) => {
  return new DOMPoint(x, y).matrixTransform(
    element.getScreenCTM().inverse()
  );
}

const getDisplayCenter = (m) => {
  let x = m.cx.baseVal.value + m.r.baseVal.value * Math.cos(DEGREE_TO_RADIANS);
  let y = m.cy.baseVal.value + m.r.baseVal.value * Math.sin(DEGREE_TO_RADIANS);

  return { x, y }
};

const app = document.querySelector('#app');
const appBody = document.querySelector('#app-body')
const svg = document.querySelector('svg');
svg.style.width = window.innerWidth;
svg.style.height = window.innerHeight;
console.log('svg.style.width svg.style.height', svg.style.width ,svg.style.height)


const ins = {
  count: svg.querySelector('#count-input'),
  radius: svg.querySelector('#radius-input'),
  step: svg.querySelector('#spiral-step-input'),
}


const display = {
  svg: document.querySelector('svg'),
  get container() { return this.svg.querySelector('#display-container') },
  get outer() { return this.container.querySelector('#display-outer') },
  get inner() { return this.container.querySelector('#display-inner') },
  get items() { return [...this.container.querySelectorAll('.display-item')] },
  onItemClick() {},
  onDisplayClick() {},
  addItem() {},
  expand() {},
  shrink() {},
}

const createCircle = (x, y, fill, r = 10) => {
  const c = document.createElementNS(SVG_NS, 'circle');

  // c.setAttribute('stroke', `#00000050`)
  c.setAttribute('stroke', `#FFFFFF50`)
  c.setAttribute('stroke-width', 2)
  c.setAttribute('fill', fill)
  c.setAttribute('fill-opacity', 0.4)
  c.setAttribute('filter', `contrast(125%) saturate(150%)`)
  c.setAttribute('transform', `translate(-${(r)},0)`)
  c.r.baseVal.value = r
  c.classList.add('display-item');
  c.cy.baseVal.value = y + c.r.baseVal.value * Math.sin(DEGREE_TO_RADIANS);
  c.cx.baseVal.value = x + c.r.baseVal.value * Math.cos(DEGREE_TO_RADIANS);

  setInterval(() => {
  c.setAttribute('stroke', `#000000`)
    
  }, 1000)


  return c
};

const size = 120
let rad = 0
let dir = 1

const oscillate = (stepSize) => {
  if (rad >= 200) { dir = -1 }
  else if (rad <= 0) { dir = 1 }
  rad += 1 * dir / size
  // spiralStep += stepSize * dir

  return rad
}

const createPolygon = (shape, numberOfPoints, radius, stepSize = 25) => {
  const angleStep = (Math.PI * 2) / numberOfPoints
  const xPosition = shape.clientWidth / 2
  const yPosition = shape.clientHeight / 2

  const points = []
  let spiralStep = 0
  let cnt = 0
  let dir = 1;

  const addSpiral = (stepSize) => {
    if (spiralStep >= 300) { dir = -1 }
    else if (spiralStep <= 0) { dir = 1 }

    spiralStep += stepSize * dir
    return spiralStep
  }

  for (let i = 1; i <= numberOfPoints; i++) {
    let rad = addSpiral(stepSize)
    const radiusAtPoint = i % 4 === 0 ? rad : 50
    const x = xPosition + Math.cos(i * angleStep) * radiusAtPoint
    const y = yPosition + Math.sin(i * angleStep) * radiusAtPoint

    points.push({ x, y, fill: getColor() })
  }

  return points
}


/* RADIAL UPDATE */

let radialValues = {
  count: 200,
  radius: 33,
  stepSize: 25,
  limit: 100,
}


const clampNumber = (num, a, b) => Math.max(Math.min(num, Math.max(a, b)), Math.min(a, b));

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}


const renderRadial = (cnt = 225, radius = 33, stepSize = 25) => {
  while (display.items.length >= radialValues.limit) {
    display.items[0].remove()
    display.items[0].remove()
    display.items[0].remove()
    display.items[0].remove()
    display.items[0].remove()
  }
  if (display.items.length < radialValues.limit) {
    const points = createPolygon(display.inner, cnt, display.outer.r.baseVal.value, stepSize)
    points.forEach((pt, i) => {
      const c = createCircle(pt.x, pt.y, pt.fill, radius)
      display.container.appendChild(c)
    });
  }
  else {

    // while (display.items.length >= radialValues.limit) {
    //   display.items[0].remove()
    //   display.items[0].remove()
    //   display.items[0].remove()
    //   display.items[0].remove()
    //   display.items[0].remove()
    // }
  }
}



const updateRadial = (changedTime) => {
  // console.log(changedTime);
  // if (changedTime > 0.25) {

  radialValues.stepSize = getRandomInt(radialValues.stepSize + 50)
  radialValues.radius = getRandomInt(radialValues.radius + 50)
  radialValues.count = getRandomInt(radialValues.count + 50)

  renderRadial(radialValues.count, radialValues.radius, radialValues.stepSize)
  // }
}


ins.count.setAttribute('max', radialValues.count)

const rangeInputs = [...document.querySelectorAll('input[type="range"]')]

rangeInputs.forEach((el, i) => {
  const curryRenderRadial = (count) => {
    return (radius) => (steps) => renderRadial(+count, +radius, +steps)
  }

  el.addEventListener('pointermove', ({ target, clientX, clientY, value }) => {
    el.nextElementSibling.textContent = el.value
    renderRadial(+ins.count.value, +ins.radius.value * 2, +ins.step.value * 2)
  });
});

engine.addUpdate(updateRadial)
// engine.start()



display.container.addEventListener('click', ({ target, clientX, clientY }) => {
  const svg = document.querySelector('svg');
  // display.container.classList.toggle('invert')
  svg.classList.toggle('invert')
});
