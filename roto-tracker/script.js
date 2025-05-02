const app = document.querySelector('#app');
const canvas = app.querySelector('#canvas');
const scene = canvas.querySelector('#scene');
const surfaceLayer = scene.querySelector('#surface-layer');
const objectLayer = scene.querySelector('#objects-layer');
const line = objectLayer.querySelector('#line');
const arrow = objectLayer.querySelector('#arrow');
const appBody = app.querySelector('#app-body')
const containers = app.querySelectorAll('.container')


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

// const plotPoints = plotData.data
//   .map((record, i) => {
//     const className = record.currPointInLength > 0 ? 'plot-point' : 'plot-point-neg'
//     return createPoint(record.pointOnTrack.x, record.pointOnTrack.y, {className})
//   })


// objectLayer.append(...plotPoints)
function svgPoint(element, x, y) {
  var pt = canvas.createSVGPoint();
  pt.x = x;
  pt.y = y;
  return pt.matrixTransform(element.getScreenCTM().inverse());
}


function transformMe(evt) {
  // svg root element to access the createSVGTransform() function
  var svgroot = canvas //evt.target.parentNode;
  
  // SVGTransformList of the element that has been clicked on
  var tfmList = evt.target.transform.baseVal;
  
  // Create a separate transform object for each transform
  var translate = svgroot.createSVGTransform();
  translate.setTranslate(50, 5);
  
  var rotate = svgroot.createSVGTransform();
  rotate.setRotate(5, -0, -0);
  
  var scale = svgroot.createSVGTransform();
  scale.setScale(0.8, 0.8);
  
  // apply the transformations by appending the SVGTransform objects to the SVGTransformList associated with the element
  tfmList.appendItem(translate);
  tfmList.appendItem(rotate);
  tfmList.appendItem(scale);
}

scene.addEventListener('click', e => {
  let x = e.clientX
  let y = e.clientY
  let point = svgPoint(e.target, x, y)

  if (
    !e.composedPath().includes(surfaceLayer) && 
    !e.composedPath().includes(document.querySelector('#arrow'))
  ) {
    transformMe(e)
  }
  
  var tfmList = arrow.transform.baseVal;
  
  var translate = canvas.createSVGTransform();
  translate.setTranslate(0, 0);
  
  var rotate = canvas.createSVGTransform();
  rotate.setRotate(-10, -0, -0);
  // rotate.setRotate(5, -0, -0);
  // rotate.setRotate(5, -0, -0);
  
  tfmList.appendItem(translate)
  tfmList.appendItem(rotate)
  // console.group('before trans')
  
  // let x = e.clientX
  // let y = e.clientY
  // let point = svgPoint(canvas, x, y)
  
});