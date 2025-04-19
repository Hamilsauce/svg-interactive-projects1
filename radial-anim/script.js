`s = 490 / 980 = 0.5
New height = 1861 * 0.5 = 930.5
`

const svg = document.querySelector('svg')
const displayContainer = document.querySelector('#display-container')
const oldWidth = +getComputedStyle(svg).width.replace('px', '')
const oldHeight = +getComputedStyle(svg).height.replace('px', '')

const newWidth = 300;

const ratio = newWidth / oldWidth

const newHeight = oldHeight * ratio;

svg.style.width = `${window.innerWidth}px`
svg.style.height = `${window.innerHeight}px`
// console.warn('oldHeight, newHeight', oldHeight, newHeight)

setTimeout(() => {
  const oldWidth2 = +getComputedStyle(svg).width.replace('px', '')
  const oldHeight2 = +getComputedStyle(svg).height.replace('px', '')
  // console.warn('oldHeight2, oldWidth2', oldHeight2, oldWidth2)
  
}, 1000)

let contrast = 1.5
let rotate = 0


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