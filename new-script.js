import loop from './gpt-looper.js';
import { addPanAction } from './pan-viewport.js';
import { addPinchZoom } from './pinch-zoom.js';
import { Accelerator } from './accelerator.js';
const app = document.querySelector('#app');
const appTitle = document.querySelector('#app-title');
const svgCanvas = document.querySelector('svg');
const svgMenu = document.querySelector('#menu-container');
let currRoto = 0;
let currSec = 0;

const addPanning = () => addPanAction(svgCanvas, (vb) => {
  svgCanvas.viewBox.baseVal.x = vb.x
  svgCanvas.viewBox.baseVal.y = vb.y
});

let panaction$ = addPanning();
const pinchZoom = addPinchZoom(svgCanvas);

const accelerator = new Accelerator({
  min: 1,
  max: 10000,
  step: 1,
})




let outFrame = 0;
let inframe = 0;
let useFrameMod = false;

const rotateMenu = (dx) => {
  const dxRounded = Math.round(dx);
  const isFrame = ((Math.round(dx)) % 1.5);
  
  outFrame++;
  
  if (isFrame) {
    inframe++;
    currRoto = currRoto + 1;
    
    svgMenu.setAttribute('transform', `translate(0, -100) rotate(${currRoto}, 0, 0) scale(1)`);
    svgMenu.style.filter = `brightness(1.2) contrast(1.3) drop-shadow(0px 4px 8px #1010109E) hue-rotate(${currRoto}deg)`;
  }
  /*
  document.querySelector('h1').innerHTML = `
    all frames: ${outFrame}  
    isFrame: ${inframe} 
    difference: ${outFrame - inframe}
  `;
  */
};

loop.addUpdateHandler(
  rotateMenu
);

loop.start();

let isPanning = true;

svgCanvas.addEventListener('click', e => {
  if (isPanning) {
    panaction$.unsubscribe();
    pinchZoom.start();
  } else {
    pinchZoom.stop();
    panaction$ = addPanning();
  }
  
  isPanning = !isPanning;
});

// document.addEventListener('click', e => {
//   accelerator.accelerate(10000, (value) => {
//     console.warn('VALUE IN ACCEL CALLBACK', accelerator.value)
//     accelerator.printValue(appTitle, true)
//   });
// });

svgMenu.addEventListener('click', e => {
  if (location.origin.includes('hamilsauce.github.io')) {
    location.href = location.origin + '/svg-interactive-projects1/hexer/hexa.html';
  } else {
    location.href = location.origin + '/hexer/hexa.html';
  }
});