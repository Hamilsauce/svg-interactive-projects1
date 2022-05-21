const app = document.querySelector('#app');
const appBody = document.querySelector('#app-body')
const containers = document.querySelectorAll('.container')

const svg = document.querySelector('svg');


svg.addEventListener('click', e => {
  const { clientX, clientY } = e;
const point = svg.createSVGPoint();
const domPoint = new DOMPoint(clientX,clientY);

console.log({clientX,clientY});
console.log({domPoint});
})
