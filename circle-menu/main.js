import { polarToCartesian, cartesianToPolar } from '../lib/cartesian-polar.js'
import { anim } from "./anim.js";
import { getColor } from '/lib/colors.js';
// const durin = document.querySelector('#time-input')
const SVG_NS = 'http://www.w3.org/2000/svg';


let RADIANS_TO_DEGREE = 180 / Math.PI
let DEGREE_TO_RADIANS = Math.PI / 180

const domPoint = (element, x, y) => {
  return new DOMPoint(x, y).matrixTransform(
    element.getScreenCTM().inverse()
  );
}


const getMenuCenter = (m) => {

  let x = m.cx.baseVal.value + m.r.baseVal.value * Math.cos(DEGREE_TO_RADIANS);
  let y = m.cy.baseVal.value + m.r.baseVal.value * Math.sin(DEGREE_TO_RADIANS);

  return { x, y }

};


const app = document.querySelector('#app');
const appBody = document.querySelector('#app-body')
const svg = document.querySelector('svg');

const menu = {
  svg: document.querySelector('svg'),
  get container() { return this.svg.querySelector('#menu-container') },
  get outer() { return this.container.querySelector('#menu-outer') },
  get inner() { return this.container.querySelector('#menu-inner') },
  get items() { return this.container.querySelectorAll('.menu-item') },
  onItemClick() {},
  onMenuClick() {},
  addItem() {},
  expand() {},
  shrink() {},
}

const fanPathTransforms = {
  matrix1: [0.5, 0.866, -0.866, 0.5, 349.7025, -93.7025],
  matrix2: [-0.5, 0.866, -0.866, -0.5, 605.7025, 162.2975],
  matrix3: [-1, 0, 0, -1, 512, 512],
  matrix4: [-0.5, -0.866, 0.866, -0.5, 162.2975, 605.7025],
}

window.onload = () => {
  // dot.init('dot', 'curve');
  // anim.start(durin.value);
}

const createCircle = (x, y, fill, r = 10) => {
  const c = document.createElementNS(SVG_NS, 'circle');
  c.setAttribute('stroke', `#00000040`)
  c.setAttribute('stroke', `#FFFFFF40`)
  c.setAttribute('fill', fill)
  c.setAttribute('filter', `invert(100%) saturate(100%)`)
  c.setAttribute('filter', `invert(1000%) saturate(100%) hue-rotate(330%)`)
  c.setAttribute('transform', `translate(-${(r)},0)`)
  // c.setAttribute('transform', `translate(-${(r)},0) rotate(${(r*Math.random())})`)
  c.r.baseVal.value = r
  c.classList.add('menu-item');
  c.cy.baseVal.value = y + c.r.baseVal.value * Math.sin(DEGREE_TO_RADIANS);
  c.cx.baseVal.value = x + c.r.baseVal.value * Math.cos(DEGREE_TO_RADIANS);

  console.log({ x, y });

  return c
};


const createPolygon = (shape, numberOfPoints, radius) => {
  // const radius = r
  // const numberOfPoints = pointsInput.value
  const angleStep = (Math.PI * 2) / numberOfPoints
  const xPosition = shape.clientWidth / 2
  const yPosition = shape.clientHeight / 2

  const points = []
  let spiralStep = 0
  let cnt = 0
  let dir = 1;
  const addSpiral = (stepSize) => {
    if (spiralStep >= 250) {
      dir = -1
    } else if (spiralStep <= 0) {
      dir = 1

    } {

      spiralStep += stepSize * dir
    }
    return spiralStep
  }


  for (let i = 1; i <= numberOfPoints; i++) {
    let rad = addSpiral(16)

    // const radiusAtPoint = i % 2 === 0 ? radius : 50
    const radiusAtPoint = i % 2 === 0 ? rad : 50
    const x = xPosition + Math.cos(i * angleStep) * radiusAtPoint
    const y = yPosition + Math.sin(i * angleStep) * radiusAtPoint

    points.push({ x, y, fill: getColor() })
  }

  const polygonCoordinates = points
    .map(({ x, y }) => {
      return `${x}px ${y}px`
    }).join(',')

  // shape.style.setProperty('--clip', `polygon(${polygonCoordinates})`)
  return points
}

menu.container.addEventListener('click', ({ target, clientX, clientY }) => {
  menu.items.forEach((item, i) => {
    item.remove()
  });
  const p = domPoint(menu.outer, clientX, clientY)


  // const menuCenter = getMenuCenter(menu.outer)
  // const c = createCircle(p.x, p.y, 25)
  const points = createPolygon(menu.inner, 80, 10)//menu.inner.r.baseVal.value)
  points.forEach((pt, i) => {
    // const pString =  `${x}px ${y}px`
    const c = createCircle(pt.x ,pt.y,    pt.fill, 26)
    // const c = createCircle(p.x + ((pt.x*Math.random())/0.5), p.y + ((pt.y*Math.random())/0.5),   pt.fill, 40)

    menu.container.appendChild(c)

  });

});
