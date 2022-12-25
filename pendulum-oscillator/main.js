import { dot, anim } from "./pendulum.js";
import { AudioController } from './AudioController.js'

let context;

const app = document.querySelector('#app');
const appBody = document.querySelector('#app-body')
const durin = document.querySelector('#time-input')

durin.value = 1000;

const audio = new AudioController();

audio.attachOscillator(dot);
dot.audio.play();
dot.audio.gain.value = 1;


durin.addEventListener('change', e => {
  anim.duration = +durin.value
});


function init() {
  try {
    // Fix up for prefixing
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    context = new AudioContext();
  }
  catch (e) {
    alert('Web Audio API is not supported in this browser');
  }
}

// window.addEventListener('load', init, false);

window.onload = () => {
  dot.init('dot', 'curve');
  anim.start(durin.value);
}