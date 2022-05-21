import { anim } from "./anim.js";
import { dot } from "./dot.js";
import { AudioController } from './AudioController.js'
const audio = new AudioController()
audio.attachOscillator(dot)
dot.audio.play()
dot.audio.gain.value = 1

const durin = document.querySelector('#time-input')
durin.value = 1000

durin.addEventListener('change', e => {
  anim.duration = +durin.value
});

window.onload = () => {
  dot.init('dot', 'curve');
  anim.start(durin.value);
}
const app = document.querySelector('#app');
const appBody = document.querySelector('#app-body')

var context;
window.addEventListener('load', init, false);

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
