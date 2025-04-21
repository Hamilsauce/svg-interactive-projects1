import { mainLoop } from './main-loop.js';

const svg = document.querySelector('svg');
const displayContainer = document.querySelector('#display-container');
const circs = svg.querySelectorAll('circle');

svg.style.width = `${window.innerWidth}px`;
svg.style.height = `${window.innerHeight}px`;

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

removeEls(circs);

const animateCircles = (timeout) => {
  setTimeout(() => {
    const spread = [...groupedCircs.values()].map((elSet, i) => [...elSet.values()]);
    
    spread.reverse().forEach((els, i) => {
      setTimeout(() => {
        els.reverse().forEach((el, k) => {
          el.dataset.fresh = true;
          
          setTimeout(() => {
            displayContainer.appendChild(el);
            
            setTimeout(() => {
              el.dataset.fresh = false;
            }, timeout + (timeout * ((k + 5) * 2)));
          }, timeout + (timeout * (k * 5)));
        });
      }, timeout + (timeout * i));
    });
  }, 0);
  
  setTimeout(() => {
    const spread = [...groupedCircs.values()].map((elSet, i) => [...elSet.values()]);
    
    spread.reverse().forEach((els, i) => {
      setTimeout(() => {
        els.forEach((el, k) => {
          el.dataset.fresh = false;
          
          setTimeout(() => {
            const hasChild = displayContainer.contains(el);
            if (!hasChild) displayContainer.removeChild(el);
            
            setTimeout(() => {
              if (!hasChild) displayContainer.appendChild(el);
              
              el.dataset.fresh = true;
            }, timeout + (timeout * ((k + 5) * 2)));
            
          }, timeout + (timeout * (k * 5)));
        });
      }, timeout + (timeout * i));
    });
  }, 8000);
}

const updateCircle20 = (delta) => {
  const circTransform = circ20.transform.baseVal
  const circTransformCount = circ20.transform.baseVal.numberOfItems
  const circTranslate = circTransform.getItem(0)
  
  sumDelta += delta
  
  if (sumDelta >= 1000) {
    const transformValue = circ20.attributes.transform.value
    const translateValue = transformValue.match(/translate\(\s*(-?\d+\.?\d*)/);
    
    if (translateValue && typeof translateValue[0] === 'string') {
      const transX = translateValue[1];
    }
    
    direction = direction === 1 ? -1 : 1;
    sumDelta = 0;
  }
};

animateCircles(50);

let shouldShuffle = false;

setInterval(() => {
  groupedCircs = shouldShuffle ? groupByTransX(shuffleArray([...circs])) : groupByTransX([...circs]);
  
  sleep(100, () => {
    displayContainer.classList.toggle('flip');
  });
  
  animateCircles(75);
}, 8000);

setInterval(async () => {
  dispatchClick(svg);
}, 5000);

let turboOn = false;

const turboButton = document.querySelector('#turbo');

mainLoop.registerUpdates(
  updateCircle20,
  () => turboOn ? animateCircles(10000) : () => {},
);

mainLoop.start();

turboButton.addEventListener('click', e => {
  turboOn = !turboOn;
});

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