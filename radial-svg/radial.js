import { draggable } from 'https://hamilsauce.github.io/hamhelper/draggable.js'
import { svgToPng } from '../svgToPng.js'
import { polarToCartesian, cartesianToPolar } from '../lib/cartesian-polar.js'
// import { anim } from "./anim.js";
import { getColor } from '../lib/colors.js';
// const durin = document.querySelector('#time-input')
const SVG_NS = 'http://www.w3.org/2000/svg';

// await  svgToPng(document.querySelector('svg'), 'radial-png')


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
  console.log({ x, y });

  return { x, y }

};



const app = document.querySelector('#app');
const appBody = document.querySelector('#app-body')
const svg = document.querySelector('svg');
const hud = document.querySelector('#hud');

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
// const menuRoot = document.querySelector('menu-outer');
draggable(svg, menu.container)
// draggable(svg, hud)


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

const rotateHue = (c) => {
  let deg = 1

  setInterval(() => {
    // console.log(' ', )
    deg *= (Math.random() / Math.PI)
    c.setAttribute('filter', `contrast(170%) saturate(150%) hue-rotate(${deg}deg)`)
  }, 1000)

  return () => {
    // console.warn({deg});
    return deg
  }
}
const createCircle = (x, y, fill, r = 10) => {
  // console.log('fill', fill)
  // fill = ''
  const c = document.createElementNS(SVG_NS, 'circle');
  const rotatingHue = rotateHue(c)
  c.setAttribute('stroke', `#FFFFFF50`)
  // c.setAttribute('stroke', `#00000030`)
  c.setAttribute('fill', fill)
  // c.setAttribute('fill', '#00000030')
  c.setAttribute('fill-opacity', 0.4)
  // c.setAttribute('filter', `invert(100%) saturate(100%) hue-rotate(0%)`)
  c.setAttribute('filter', `contrast(170%) saturate(150%) hue-rotate(${rotatingHue()}deg)`)
  // c.setAttribute('filtear', `invert(100%) saturate(150%)`)
  c.setAttribute('transform', `translate(-${(r)},0)`)
  // c.setAttribute('transform', `translate(-${(r)},0) rotate(${(r*Math.random())})`)
  c.r.baseVal.value = r
  c.classList.add('menu-item');
  c.cy.baseVal.value = y + c.r.baseVal.value * Math.sin(DEGREE_TO_RADIANS);
  c.cx.baseVal.value = x + c.r.baseVal.value * Math.cos(DEGREE_TO_RADIANS);


  return c
};

const size = 120
let rad = 0
let dir = 1

const oscillate = (stepSize) => {
  if (rad >= 200) {
    dir = -1
  } else if (rad <= 0) {
    dir = 1
  } {
    rad += 1 * dir / size
    // spiralStep += stepSize * dir
  }
  return rad
}




const createPolygon1 = (shape, numberOfPoints, radius) => {

  // const radius = radInput.value
  // const numberOfPoints = pointsInput.value
  const angleStep = (Math.PI * 2) / numberOfPoints
  const xPosition = shape.clientWidth / 2
  const yPosition = shape.clientHeight / 2

  const points = []
  for (let i = 1; i <= numberOfPoints; i++) {
    oscillate()
    // rad += radius + rad > 150 ? -1 : +1

    const radiusAtPoint = i % 5 === 0 ? radius + rad : size
    const x = xPosition + Math.cos(i * angleStep) * radiusAtPoint
    const y = yPosition + Math.sin(i * angleStep) * radiusAtPoint

    points.push({ x, y, fill: getColor() })
    // points.push({ x, y })
  }

  const polygonCoordinates = points
    .map(({ x, y }) => {
      return `${x}px ${y}px`
    }).join(',')

  // shape.style.setProperty('--clip', `polygon(${polygonCoordinates})`)

  // pointsLabel.innerText = numberOfPoints
  // radLabel.innerText = `${Math.round(radius / size * 100)}%`

  return points

}

const createPolygon = (shape, numberOfPoints, radius, stepSize = 25) => {
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
    if (spiralStep >= 10) {
      dir = -1
    } else if (spiralStep <= 0) {
      dir = 1

    } {

      spiralStep += stepSize * dir
    }
    return spiralStep
  }


  for (let i = 1; i <= numberOfPoints; i++) {
    let rad = addSpiral(stepSize)
    const radiusAtPoint = i % 3 === 0 ? rad : 50
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

const render = (cnt = 225, radius = 33, stepSize = 25) => {
  const points = createPolygon(menu.inner, cnt, menu.inner.r.baseVal.value, stepSize)
  points.forEach((pt, i) => {
    const c = createCircle(pt.x, pt.y, pt.fill, radius)
    svg.appendChild(c)
  });

}

const ins = {
  count: document.querySelector('#count-input'),
  radius: document.querySelector('#radius-input'),
  step: document.querySelector('#spiral-step-input'),
  camera: document.querySelector('#camera'),

}

const rangeInputs = [...document.querySelectorAll('input[type="range"]')]
const controlContainer = document.querySelector('#control-container')

controlContainer.addEventListener('pointermove', e => {
  // e.preventDefault()

});

document.addEventListener('pointerdown', e => {
  // e.preventDefault()
});
document.addEventListener('touchstart', e => {
  // e.preventDefault()
});

rangeInputs.forEach((el, i) => {
  const curryRender = (count) => {
    return (radius) => (steps) => render(+count, +radius, +steps)
  }

  el.addEventListener('pointermove', ({ target, clientX, clientY }) => {
    menu.items.forEach((item, i) => {
      item.remove()
    });
    if (+target.value % 3 === 0) {

      render(+ins.count.value * 2, +ins.radius.value * 2, +ins.step.value * 2)

    }
  });

});

ins.camera.addEventListener('click', async (e) => {
  menu.items.forEach((item, i) => {
    item.remove()
  })

  const hud2 = svg.removeChild(hud)
  // const m en = svg.inneremoveChild(menu.container)
  setTimeout(() => {
    // svgToPng(svg.querySelector('#menu-container'), 'radial-pn1g')
    // console.log(' ', menu.items);
    // svgToPng(svg, 'radial-png')
    // svgToPng(svg.querySelector('#menu-container'), 'radial-png')
  }, 1000)
});

rangeInputs[0].addEventListener('pointermove', ({ target, clientX, clientY, value }) => {
  // menu.items.forEach((item, i) => {
  //   item.remove()
  // });
  render(225, 33, parseInt(target.value))


  // const menuCenter = getMenuCenter(menu.outer)
  // const c = createCircle(p.x, p.y, 25)
  // const points = createPolygon(menu.inner, 225, menu.inner.r.baseVal.value)
  // console.log('points', points)
  // points.forEach((pt, i) => {
  //   // const pString =  `${x}px ${y}px`
  //   const c = createCircle(pt.x, pt.y, pt.fill, 37)
  //   // const c = createCircle(p.x + ((pt.x*Math.random())/0.5), p.y + ((pt.y*Math.random())/0.5),   pt.fill, 40)

  //   menu.container.appendChild(c)

  // });

});
menu.container.addEventListener('click', ({ target, clientX, clientY }) => {
  // menu.items.forEach((item, i) => {
  //   item.remove()
  // });
  // const p = domPoint(menu.outer, clientX, clientY)


  // const menuCenter = getMenuCenter(menu.outer)
  // const c = createCircle(p.x, p.y, 25)
  // const points = createPolygon(menu.inner, 225, menu.inner.r.baseVal.value)
  // points.forEach((pt, i) => {
  //   // const pString =  `${x}px ${y}px`
  //   const c = createCircle(pt.x, pt.y, pt.fill, 37)
  //   // const c = createCircle(p.x + ((pt.x*Math.random())/0.5), p.y + ((pt.y*Math.random())/0.5),   pt.fill, 40)

  //   menu.container.appendChild(c)

  // });

});