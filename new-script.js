import loop from './gpt-looper.js';
import { addPanAction } from './pan-viewport.js';



const app = document.querySelector('#app');
const svgCanvas = document.querySelector('svg')
const svgMenu = document.querySelector('#menu-container')
let currRoto = 0
let currSec = 0

const panaction$ = addPanAction(svgCanvas, (vb) => {
  svgCanvas.viewBox.baseVal.x = vb.x
  svgCanvas.viewBox.baseVal.y = vb.y
});
panaction$.subscribe()

let outFrame = 0
let inframe = 0
let useFrameMod = false

const rotateMenu = (dx) => {
  const dxRounded = Math.round(dx)
  const dxTrunc = Math.trunc(dx)
  // const isFrame = ((Math.round(dx)) % 1.75)
  const isFrame = ((Math.round(dx)) % 1.5)
  
  const isTruncFrame = !(dxTrunc % 4)
  const newRoto = (currRoto + dx) % 10
  // console.log(isFrame, isTrunc)Frame)
  outFrame++
  const shouldUseMod = useFrameMod ? !!isFrame : true
  
  if (isFrame) {
    // console.warn(isFrame)
    inframe++
    
    currRoto = currRoto + 1
    
    svgMenu.setAttribute('transform', `translate(0, -100) rotate(${currRoto}, 0, 0) scale(1)`)
    svgMenu.style.filter = `contrast(1.5) drop-shadow(0px 4px 8px #1010109E) hue-rotate(${currRoto}deg)`;
    // app.innerHTML = Math.round(newRoto)
  }
  
  document.querySelector('h1').innerHTML =
    `all frames: ${outFrame}  
    isFrame: ${inframe} 
    difference: ${outFrame - inframe}
  `
  
};

loop.addUpdateHandler((dx) => {
    // console.log(Math.round(dx))
  },
  rotateMenu
)

loop.start()

svgMenu.addEventListener('click', () =>{
  useFrameMod = !useFrameMod
  console.warn('useFrameMod', useFrameMod)
});

// svgMenu.addEventListener('click', e => {
//   if (location.origin.includes('hamilsauce.github.io')) {
//     location.href = location.origin + '/svg-interactive-projects1/hexer/hexa.html'
//   } else {
//     location.href = location.origin + '/hexer/hexa.html'
//   }
  
// });