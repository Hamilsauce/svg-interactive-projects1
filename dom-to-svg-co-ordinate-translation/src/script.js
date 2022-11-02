// initialize
const
  svg = document.getElementById('mysvg'),
  NS = svg.getAttribute('xmlns'),
  out = {};

'clientX,clientY,svgX,svgY,targetX,targetY,targetID,addX,addY'
.split(',')
  .map(s => {
    out[s] = { node: document.getElementById(s), value: '-' }
  });

// events
svg.addEventListener('pointermove', getCoordinates);
svg.addEventListener('pointerdown', getCoordinates);
svg.addEventListener('pointerdown', createCircle);


// update co-ordinates
function getCoordinates(event) {
  // DOM co-ordinate
  out.clientX.value = event.clientX;
  out.clientY.value = event.clientY;

  // SVG co-ordinate
  const svgP = svgPoint(svg, out.clientX.value, out.clientY.value);
  out.svgX.value = svgP.x;
  out.svgY.value = svgP.y;

  // target co-ordinate
  const svgT = svgPoint(event.target, out.clientX.value, out.clientY.value);
  out.targetX.value = svgT.x;
  out.targetY.value = svgT.y;

  updateInfo();

};
// add a circle to the target
function createCircle(event) {
  // circle clicked?
  if (event.target.nodeName === 'circle') return;

  // add circle to containing element
  const
    target = event.target.closest('g') || event.target.ownerSVGElement || event.target,
    svgP = svgPoint(target, event.clientX, event.clientY),
    cX = Math.round(svgP.x),
    cY = Math.round(svgP.y),
    circle = document.createElementNS(NS, 'circle');

  circle.setAttribute('cx', cX);
  circle.setAttribute('cy', cY);
  circle.setAttribute('r', 30);

  target.appendChild(circle);

  // output information
  out.targetID.value = target.id || target.nodeName;
  out.addX.value = cX;
  out.addY.value = cY;
  updateInfo();
}
// translate page to SVG co-ordinate
function svgPoint(element, x, y) {
  var pt = svg.createSVGPoint();
  pt.x = x;
  pt.y = y;
  return pt.matrixTransform(element.getScreenCTM().inverse());
}


// output values
function updateInfo() {

  for (p in out) {
    out[p].node.textContent = isNaN(out[p].value) ? out[p].value : Math.round(out[p].value);
  }

}
