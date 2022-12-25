const INITIAL_CURVE = 'M -25,25 C -25,-25 25,-25 25,25'

const sourcePath = './path-point-data-default.json'

const plotData = await (await fetch(sourcePath)).json();
console.log('plotData', plotData);


const app = document.querySelector('#app');
const scene = document.querySelector('#scene');
const objectLayer = document.querySelector('#objects-layer');
const appBody = document.querySelector('#app-body')
const containers = document.querySelectorAll('.container')


const createCircle = (cx, cy, r, className = 'plot-point') => {
  const c = document.createElementNS(SVG_NS, 'circle');
  c.setAttribute('cx', cx);
  c.setAttribute('cy', cy);
  c.setAttribute('fill', '#FFFFFF');
  c.setAttribute('r', r);
  c.classList.add(className);

  return c;
};

const createPoint = (x, y, options) => {
  
  return createCircle(x, y, 0.5, options.className);
};

const plotPoints = plotData.data
  .map((record, i) => {
    const className = record.currPointInLength > 0 ? 'plot-point' : 'plot-point-neg'
    return createPoint(record.pointOnTrack.x, record.pointOnTrack.y, {className})
  })


objectLayer.append(...plotPoints)