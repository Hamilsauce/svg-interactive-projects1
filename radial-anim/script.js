import { mainLoop } from './main-loop.js';

const svg = document.querySelector('svg')
const displayContainer = document.querySelector('#display-container')

svg.style.width = `${window.innerWidth}px`
svg.style.height = `${window.innerHeight}px`

let contrast = 1.5
let rotate = 0

const circs = svg.querySelectorAll('circle')
let direction = 1
let sumDelta = 0
  const circ20 = circs[20]
window.circ20 = circ20
circ20.style.transform = null
circ20.style.fill = 'pink'
circ20.r.baseVal.value = 600
circ20.cx.baseVal.value = -100
circ20.cy.baseVal.value = -100
// circ20.style.r = '600px'
circ20.parentElement.appendChild(circ20)

const updateCircles = (delta) => {
  // console.log('circ20', circ20.attributes.transform.value)
  const circTransform = circ20.transform.baseVal
  const circTransformCount = circ20.transform.baseVal.numberOfItems
  const circTranslate = circTransform.getItem(0)
  
  circTranslate.setTranslate(300 * direction, 300*direction)
  sumDelta += delta
  if (sumDelta >= 500) {
    console.log('delta', delta)
  direction = direction === 1 ? -1 : 1
  sumDelta = 0

  }
  // console.log('circTransformCount', circ20.transform.baseVal.numberOfItems)
  // console.log('circTranslate', circ20.transform.baseVal)
  
  
};

mainLoop.registerUpdates(updateCircles)
mainLoop.start()


svg.addEventListener('click', e => {
  // console.warn('contrast', contrast)
  displayContainer.classList.toggle('flip')
  contrast = contrast === 1 ? 1.5 : 1
  // rotate = rotate === true ? false : true
  svg.style.filter = `contrast(${contrast})`
  svg.classList.toggle('fade')
  
  if (rotate == 3) {
    rotate = 0
    svg.classList.remove('no-filter')
    
    svg.classList.remove('rotate')
    svg.classList.remove('counter-rotate')
  }
  else if (rotate == 0) {
    rotate = 1
    svg.classList.remove('counter-rotate')
    svg.classList.add('rotate')
    
  }
  else if (rotate == 1) {
    rotate = 2
    svg.classList.remove('rotate')
    svg.classList.add('counter-rotate')
  }
  else if (rotate == 2) {
    rotate = 3
    svg.classList.remove('rotate')
    svg.classList.remove('counter-rotate')
    
    svg.classList.add('no-filter')
  }
  // console.log({rotate})
  // els/e svg.classList.remove('rotate')
  
  // svg.style.transform = `rotate(${rotate})`
  
});