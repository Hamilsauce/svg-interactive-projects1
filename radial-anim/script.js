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

export const sleep = async (time = 500, cb) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(cb()); // Yay! Everything went well!
    }, time);
  });
  
};



const removeEl = (svgEl) => {
  if (svgEl.parentElement) {
    return svgEl.parentElement.removeChild(svgEl)
  }
  
  svgEl.remove()
  
  return svgEl
};

const removeEls = (svgEls) => {
  [...svgEls].forEach((el) => {
    removeEl(el)
  });
  
  return svgEls
};

const getTranslateXValue = (svgEl) => {
  const transformValue = svgEl.attributes.transform.value
  const translateValue = transformValue.match(/translate\(\s*(-?\d+\.?\d*)/);
  
  return translateValue && +translateValue[1] ? +translateValue[1] : null;
};

const groupByTransX = (svgEls = []) => [...svgEls].reduce((acc, el, i) => {
  const transX = getTranslateXValue(el);
  
  if (acc.has(transX)) acc.get(transX).add(el);
  else acc.set(transX, new Set([el]))
  
  // el.remove()
  return acc
}, new Map());



const groupedCircs = groupByTransX(circs)

removeEls(circs)
// let timeout = 150

const animateCircles = (timeout) => {
  setTimeout(() => {
    const spread = [...groupedCircs.values()].map((elSet, i) => [...elSet.values()])
    
    spread.reverse().forEach((els, i) => {
      setTimeout(() => {
        els.reverse().forEach((el, k) => {
          el.dataset.fresh = true
          
          setTimeout(() => {
            displayContainer.appendChild(el)
            setTimeout(() => {
              el.dataset.fresh = false
            }, timeout + (timeout * ((k + 5) * 2)))
            
            // displayContainer.attributes.transform.value = `translate(0,0) rotate(${k}deg)`
            
          }, timeout + (timeout * (k * 5)))
        });
        
      }, timeout + (timeout * i))
    });
  }, 0)
  
  setTimeout(() => {
    const spread = [...groupedCircs.values()].map((elSet, i) => [...elSet.values()])
    
    spread.reverse().forEach((els, i) => {
      setTimeout(() => {
        els.forEach((el, k) => {
          el.dataset.fresh = false
          
          setTimeout(() => {
            const hasChild = displayContainer.contains(el)
            if (!hasChild) {
              
              displayContainer.removeChild(el)
            }
            
            
            
            setTimeout(() => {
              if (!hasChild) {
                displayContainer.appendChild(el)
              }
              
              el.dataset.fresh = true
            }, timeout + (timeout * ((k + 5) * 2)))
            
          }, timeout + (timeout * (k * 5)))
        });
      }, timeout + (timeout * i))
    });
  }, 8000)
  
}
animateCircles(50)
 displayContainer.classList.add('flip')

setInterval(async () => {
// displayContainer.classList.toggle('flip')
 
  animateCircles(75)
  // await sleep(20000, () =>{
  //   displayContainer.classList.toggle('flip')
  // })
}, 8000)

const updateCircles = (delta) => {
  // console.log('circ20', circ20.attributes.transform.value)
  const circTransform = circ20.transform.baseVal
  const circTransformCount = circ20.transform.baseVal.numberOfItems
  const circTranslate = circTransform.getItem(0)
  
  // circTranslate.setTranslate(300 * direction, 0)
  sumDelta += delta
  
  if (sumDelta >= 1000) {
    const transformValue = circ20.attributes.transform.value
    const translateValue = transformValue.match(/translate\(\s*(-?\d+\.?\d*)/);
    
    if (translateValue && typeof translateValue[0] === 'string') {
      const transX = translateValue[1]
      console.log('transX', transX)
    }
    
    // console.log('circ20.attributes.transfor,.m.value', circ20.attributes.transform.value)
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