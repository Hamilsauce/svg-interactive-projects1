import ham from 'https://hamilsauce.github.io/hamhelper/hamhelper1.0.0.js';
const { date, array, utils, text } = ham;
import { SvgCanvas } from '/components/SvgCanvas.js'
import { AudioController } from './AudioController.js'
const audio = new AudioController()

const canvas = SvgCanvas.attachCanvas(document.querySelector('svg'))
// audio.attachOscillator(canvas)
// canvas.audio.play()
console.log('canvas', canvas)
// console.log('array', array)
const widthDivisibles = [1, 2, 3, 4, 6, 8, 12, 16, 24, 32, 48, 64, 96, 128, 192, 384]
const heightDivisibles = [1, 2, 19, 38, 361, 722];

// const sharedDiv = array.intersection(
//   widthDivisibles,
//   heightDivisibles
//   )
  // console.log('sharedDiv', sharedDiv)
