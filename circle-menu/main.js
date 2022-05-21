// import { dot } from "./dot.js";
// import { anim } from "./anim.js";
const durin = document.querySelector('#time-input')

let angleInDegrees
let angleInRadians = -angleInDegrees * Math.PI / 180.0;
let centerX = 0;
let centerY = 0;
let radius = 0;

//get the cartesian x coordinate (centerX = x coordinate of the center of the circle == 250px in our case)
let x = centerX + radius * Math.cos(angleInRadians);
//get the cartesian y coordinate (centerY = y coordinate of the center of the circle == 250px in our case)
let y = centerY + radius * Math.sin(angleInRadians);


const durin = document.querySelector('#time-input')
durin.value = 1000

durin.addEventListener('change', e => {
  anim.duration = +durin.value
});

window.onload = () => {
  // dot.init('dot', 'curve');
  // anim.start(durin.value);
}
const app = document.querySelector('#app');
const appBody = document.querySelector('#app-body')



const fanPathTransforms = {
  matrix1: [
    0.5, 0.866, -0.866, 
    0.5, 349.7025, -93.7025
  ],
  
  
  matrix2: [-0.5, 0.866, -0.866, -0.5, 605.7025, 162.2975],
  matrix3: [-1, 0, 0, -1, 512, 512],
  matrix4: [-0.5, -0.866, 0.866, -0.5, 162.2975, 605.7025],

}
