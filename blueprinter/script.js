// import { mainLoop } from './main-loop.js';
import { draggable } from 'https://hamilsauce.github.io/hamhelper/draggable.js';

export const getSVGTemplate = (context, type, options) => {
  const template = context
    .querySelector('#templates')
    .querySelector(`[data-template="${type}"]`)
    .cloneNode(true)
  
  template.dataset.type = template.dataset.template;
  template.removeAttribute('data-template');
  delete template.dataset.template;
  
  
  const { classList, translate, dims } = (options || {})
  if (classList) template.classList.add(...options.classList)
  if (translate) template.setAttribute('transform', `translate(${options.translate.x}, ${options.translate.y}) rotate(0) scale(1)`)
  if (translate) template.setAttribute('transform', `translate(${options.translate.x}, ${options.translate.y}) rotate(0) scale(1)`)
  
  if (dims) {
    if (dims.width) template.firstElementChild.setAttribute('width', dims.width)
    if (dims.height) template.firstElementChild.setAttribute('height', dims.height)
    if (dims.r) template.firstElementChild.setAttribute('r', dims.r)
  }
  
  
  return template;
}

const buildCar = () => {
  const svg = document.querySelector('svg');
  const objectLayer = svg.querySelector('#object-layer');
  
  const carContainer = getSVGTemplate(svg, 'container');
  const boundingBox = carContainer.querySelector('.bounding-box');
  
  const carBody = getSVGTemplate(svg, 'rectangle', {
    classList: ['car-body'],
    dims: { width: 2.75, height: 1 }
  });
  
  const wheels = [
    getSVGTemplate(svg, 'circle', {
      classList: ['wheel'],
      translate: { x: 0.5, y: 1 },
      dims: { r: 0.4 },
    }),
    getSVGTemplate(svg, 'circle', {
      classList: ['wheel'],
      translate: { x: 2.25, y: 1 },
      dims: { r: 0.4 },
    }),
  ];
  
  carContainer.append(carBody, ...wheels) //[0], wheels[1])
  objectLayer.append(carContainer)
  
  return { carContainer, boundingBox, carBody, wheels }
};

const car = buildCar()

car.carContainer.setAttribute('transform', 'translate(2.5, 2.5) rotate(0) scale(1)');
const svg = document.querySelector('svg');
const stopdrag = draggable(svg, car.carContainer)
const displayContainer = document.querySelector('#display-container');
const circs = svg.querySelectorAll('circle');

svg.style.width = `${svg.parentElement.innerWidth}px`;
svg.style.height = `${svg.parentElement.innerHeight}px`;

let contrast = 1.5;
let rotate = 0;

let direction = 1;
let sumDelta = 0;
let circ20 = circs[20];

const dispatchClick = target => {
  const ev = new PointerEvent('click', {
    view: window,
    bubbles: true,
    cancelable: true,
  });
  target.dispatchEvent(ev);
};


export const sleep = async (time = 500, cb) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(() => cb());
    }, time);
  });
};

const shuffleArray = (array = []) => {
  const arr = [...array];
  
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i
    
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  
  return arr;
}

const removeEl = (svgEl) => {
  if (svgEl.parentElement) {
    return svgEl.parentElement.removeChild(svgEl);
  }
  
  svgEl.remove();
  
  return svgEl;
};

const removeEls = (svgEls) => {
  [...svgEls].forEach(removeEl);
  
  return svgEls;
};

const getTranslateXValue = (svgEl) => {
  const transformValue = svgEl.attributes.transform.value;
  const translateValue = transformValue.match(/translate\(\s*(-?\d+\.?\d*)/);
  
  return translateValue && +translateValue[1] ? +translateValue[1] : null;
};

const groupByTransX = (svgEls = []) => [...svgEls].reduce((acc, el, i) => {
  const transX = getTranslateXValue(el);
  
  if (acc.has(transX)) acc.get(transX).add(el);
  else acc.set(transX, new Set([el]));
  
  return acc;
}, new Map());

let groupedCircs = groupByTransX([...circs]);
// shuffleArray([...circs]// )

// removeEls(circs);


// setInterval(async () => {
//   dispatchClick(svg);
// }, 5000);

let turboOn = false;

const turboButton = document.querySelector('#turbo');

// mainLoop.registerUpdates(
//   updateCircle20,
//   () => turboOn ? animateCircles(10000) : () => {},
// );

// mainLoop.start();

// turboButton.addEventListener('click', e => {
//   turboOn = !turboOn;
// });

svg.addEventListener('click', e => {
  displayContainer.classList.toggle('flip');
  contrast = contrast === 1 ? 1.5 : 1;
  svg.style.filter = `contrast(${contrast})`;
  svg.classList.toggle('fade');
  
  if (rotate == 3) {
    rotate = 0;
    svg.classList.remove('no-filter');
    svg.classList.remove('rotate');
    svg.classList.remove('counter-rotate');
  }
  else if (rotate == 0) {
    rotate = 1;
    svg.classList.remove('counter-rotate');
    svg.classList.add('rotate');
  }
  else if (rotate == 1) {
    rotate = 2;
    svg.classList.remove('rotate');
    svg.classList.add('counter-rotate');
  }
  else if (rotate == 2) {
    rotate = 3;
    svg.classList.remove('rotate');
    svg.classList.remove('counter-rotate');
    
    svg.classList.add('no-filter');
  }
});