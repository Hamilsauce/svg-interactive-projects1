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

const rotateMenu = (dx) => {
  const isFrame = !((Math.trunc(dx)) % 1)
  const newRoto = (currRoto + dx) % 10
  
  if (isFrame) {
    currRoto = currRoto + 1
    
    svgMenu.setAttribute('transform', `translate(0, -100) rotate(${currRoto}, 0, 0) scale(1)`)
    svgMenu.style.filter = `contrast(1.5) drop-shadow(0px 4px 8px #1010109E) hue-rotate(${currRoto}deg)`;
    // console.warn(Math.round(isFrame))
    // app.innerHTML = Math.round(newRoto)
    
  }
  
};

loop.addUpdateHandler((dx) => {
    // console.log(Math.round(dx))
  },
  rotateMenu
)

loop.start()