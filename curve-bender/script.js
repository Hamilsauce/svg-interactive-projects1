import { CurvePathModel } from '../curve-bender/CurvePathModel.js';
import { LoopEngine } from '../curve-bender/LoopEngine.js';
// import { frameRate } from '../game-loop/lib/frame-rate.js';
import ham from 'https://hamilsauce.github.io/hamhelper/hamhelper1.0.0.js';
const { template, utils, sleep } = ham;

const domPoint = (element, x, y) => {
  return new DOMPoint(x, y).matrixTransform(
    element.getScreenCTM().inverse()
  );
}


const app = document.querySelector('#app');
const appBody = document.querySelector('#app-body')
const appHeaderRight = document.querySelector('#app-header-right')
const svgCanvas = appBody.querySelector('#svg-canvas');
const squigglyEl = svgCanvas.querySelector('#squiggly');
const controlPoints = [...svgCanvas.querySelectorAll('.control-point')];
const vertex2 = svgCanvas.querySelector('.vertex2');


const pointStrings = [
  '0,80',
  '-50,120',
  '0,160',
  '50,200',
  '0,240',
  '-50,280',
  '0,320',
]

const pointDict = {
  vertex1: [0, 80],
  'control-point1': [-50, 120],
  vertex2: [0, 160],
  'control-point2': [50, 200],
  vertex3: [0, 240],
  'control-point3': [-50, 280],
  vertex4: [0, 320],
}

const pointMap = new Map(Object.entries(pointDict))

console.warn('pointMap', pointMap)

const squigglyPoints = pointStrings.map((ptString, i) => {
  const [x, y] = ptString.split(',').map(_ => +_)
  return { x, y }
});

// const curveModel = new CurvePathModel(squigglyPoints)
const curveModel = new CurvePathModel(pointMap)
let fps = 0

const updateFPS = (delta) => {
  fps = Math.round((1 / (delta)))
}

let xCounter = 0
let yCounter = 0
let startPathLength = squigglyEl.getTotalLength()
let newPathLength = squigglyEl.getTotalLength()
// let currentPathLength = squigglyEl.getTotalLength()

const adjustYCounter = (newPathLength, yCnt, offsetMod = 0.80) => {
  const offset = newPathLength - startPathLength
  return (yCnt - offset) * offsetMod;
}

let yMod = 1
let mod = 1


let limit = 250
let currentPoint = 0

const updateCurve = async (delta) => {
  const counterAbs = Math.abs(xCounter)
  const adjustedY = adjustYCounter(newPathLength, yCounter)
  if (counterAbs == 150) {
    mod = mod * -1
    limit = mod > 0 ? 250 : 150
    
    xCounter = -50
  }
  
  if (xCounter === 0) {
    // await sleep(500)
    // return
    // console.warn('xCounter', xCounter)
  }
  
  // if (yCounter >= startPathLength) {
  //   yMod = -1
  // }
  
  if (yCounter <= 0) {
    yMod = 1
  }
  
  
  yCounter = adjustYCounter(newPathLength, yCounter) + yMod
  
  curveModel.vertices.forEach((v, i) => {
    if (i === 1) {
      if (mod >= 0) v.update({ x: v.x + 1 })
      else v.update({ x: v.x - 1 })
      
    } else if (i === 3) {
      if (mod > 0) v.update({ x: v.x - 1 })
      else v.update({ x: v.x + 1 })
    }
    else if (i === 5) {
      if (mod > 0) v.update({ x: v.x + 1 })
      else v.update({ x: v.x - 1 })
    }
  });
  
  // const adjustedY = adjustYCounter(newPathLength, yCounter)
  // console.warn('adjustedY', adjustedY)
  // currentPoint = squigglyEl.getPointAtLength(adjustedY)
  currentPoint = squigglyEl.getPointAtLength(yCounter)
  // newPathLength = startPathLength - squigglyEl.getTotalLength()
  newPathLength = squigglyEl.getTotalLength()
  
  
  xCounter++
  
  yCounter++
};

// const updateSquiggly = (curve, points) => updateCurve(curveModel)

const render = (delta) => {
  
  const newD = curveModel.toPathString();
  squigglyEl.setAttribute('d', newD)
  
  vertex2.setAttribute('transform', `translate(${currentPoint.x},${currentPoint.y}) rotate(0) scale(1)`)
  setTimeout(() => {}, 333)
  
  // console.warn('delta', delta)
  const lastFps = +appHeaderRight.textContent ?? 0;
  appHeaderRight.textContent = Math.abs(fps - lastFps) < 3 ? lastFps : fps;
};



const engine = new LoopEngine({
  routines: [updateCurve, updateFPS],
  state: {},
  render: render
});

document.addEventListener('click', e => {
  if (engine.running) {
    engine.pause()
  }
  else {
    engine.start()
  }
});

const handlePointerDown = (e) => {
  
}
const handlePointerMove = (e) => {}
const handlePointerUp = (e) => {}

controlPoints.forEach((el, i) => {
  el.addEventListener('pointermove', e => {
    e.stopPropagation();
    
    const { clientX, clientY } = e;
    const id = el.dataset.id
    const point = domPoint(svgCanvas, clientX, clientY);
    
    const vTrans = el.getAttribute('transform');
    const result = vTrans.replace(/(?<=translate\()\s*[^,]+/, point.x);
    el.setAttribute('transform', result);
    
    const v = curveModel.getVertexById(id)
    
    curveModel.updateVertex(id, { x: point.x })
    render()
  });
});







const pointAt200 = squigglyEl.getPointAtLength(200)

console.warn('pointAt200', pointAt200)
vertex2.setAttribute('transform', `translate(${pointAt200.x},${pointAt200.y}) rotate(0) scale(1)`)