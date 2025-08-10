import { LoopEngine } from '../LoopEngine.js';

const appState = {
  circle: {
    position: { x: 0, y: 0 },
    r: 5,
    strokeWidth: 0.5,
    isExpanding: true,
  },
  
  routine2: 0,
}

const app = document.querySelector('#app');
const appBody = document.querySelector('#app-body')
const svgCanvas = appBody.querySelector('#svg-canvas');
const squigglyEl = svgCanvas.querySelector('#squiggly');
const circ = svgCanvas.querySelector('circle');
console.warn('squigglyEl', squigglyEl)

const routine1 = (state, dt) => {
  state.routine2 = state.routine1++
  
  // console.warn('routine1', dt, state.routine1)
};


const routine2 = (state, dt) => {
  state.routine2 = state.routine2++
  // console.warn('routine1', dt, state.routine2)
};
let dtSum = 0
let isMovingForward = false
let dirMod = 1
const moveCirc = (state, dt) => {
  dtSum = dtSum + dt
  
  if (dtSum >= 1) {
    // y = (y + 0.5) * yDir
    isMovingForward = !isMovingForward
    
    dtSum = 0
    console.warn('isMovingForward', isMovingForward)
  }
  
  if (dtSum >= 1.33) {
    // y = (y + 0.5) * yDir
    
    dirMod = dirMod * -1
    
    
  }
  
  
  let { x, y } = state.circle.position
  const xDir = dt ? 1 : -1
  const yDir = dt % 500 ? 1 : -1
  
  if (isMovingForward) {
    x = x - (0.5 * dirMod)
    y = y + (0.3 * dirMod)
  } else {
    x = x + (0.5 * dirMod)
    y = y - (0.3 * dirMod)
  }
  
  
  console.warn(dtSum)
  state.circle.position.x = x;
  state.circle.position.y = y;
  
  circ.setAttribute('transform', `translate(${x},${y}) rotate(0) scale(2)`)
};

let strokeModSum = 0

const pulseCirc = (state, dt) => {
  let { x, y, r } = state.circle
  state.circle.isExpanding
  if (r <= 0.0) {
    state.circle.isExpanding = true
  }
  else if (r >= 10) {
    state.circle.isExpanding = false
  }
  
  if (state.circle.isExpanding) {
    r = r + 0.1
    state.circle.r = r // - 0.25
    state.circle.strokeWidth = (r / 1.5) + 0.1
  }
  
  if (!state.circle.isExpanding) {
    r = r - 0.2
    state.circle.r = r //- 0.4
    state.circle.strokeWidth = (r / 1.5) - 0.1
  }
  
  state.circle.r = r
  circ.setAttribute('transform', `translate(0,0) rotate(0) scale(2)`)
  circ.setAttribute('r', state.circle.r)
  // circ.setAttribute('stroke-width', state.circle.strokeWidth)
  // console.warn('pulseCirc', appState.circle)
  strokeModSum += dt
  if (strokeModSum > 1) {
    circ.setAttribute('stroke-width', state.circle.strokeWidth)
    strokeModSum = 0
    
  }
};

const render = () => {
  // console.warn('render')
};

const engine = new LoopEngine({
  routines: [pulseCirc, moveCirc],
  state: appState,
  render
});

document.addEventListener('click', e => {
  if (engine.running) {
    engine.pause()
  }
  else {
    engine.start()
  }
});

setTimeout(() => {
  // engine.addRoutine(pulseCirc)
}, 2000)