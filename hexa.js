const SVG_NS = 'http://www.w3.org/2000/svg';
const canvas = document.querySelector('svg')
const center = {
  x: window.innerWidth / 2,
  y: window.innerHeight / 2,
}

const createHex = (x, y, r) => {
  // const circ = getCircle(-0, -0, 40);
  const l1 = getLine({ x: 0, y: -50 }, { x:0, y: 50 });
  const l2 = getLine({ x: -50, y: 0 }, { x:50, y: 0 });
  // const l3 = getLine({ x: -7, y: -7.25 }, { x:7, y: 7.25 });
  // const l4 = getLine({ x: 7, y: -7.25 }, { x:-7, y: 7.25 });
  // const l4 = getLine({ x: 0, y: -10 }, { x:0, y: 10 });
  canvas.appendChild(l1)
  canvas.appendChild(l2)
  // canvas.appendChild(l3)
  // canvas.appendChild(l4)
  // canvas.appendChild(circ)
}


const getCircle = (x, y, r) => {
  const circ = document.createElementNS(SVG_NS, 'circle');
  circ.cx.baseVal.value = x;
  circ.cy.baseVal.value = y;
  circ.r.baseVal.value = r;
  // circ.classList.add('circ1')
  circ.setAttribute('transform', 'translate(0,0) scale(1)')
  circ.setAttribute('fill', '#FFFFFF50')
  return circ;
}


const getLine = (pointA, pointB) => {
  const line = document.createElementNS(SVG_NS, 'line');
  line.x1.baseVal.value = pointA.x;
  line.y1.baseVal.value = pointA.y;
  line.x2.baseVal.value = pointB.x;
  line.y2.baseVal.value = pointB.y;
  line.classList.add('line')
  line.setAttribute('stroke-width', 1);
  line.setAttribute('stroke', '#FF00FF50');
  line.setAttribute('transform', 'translate(0,0) scale(1)')
  return line;
}


createHex()
