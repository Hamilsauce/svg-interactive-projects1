import ham from 'https://hamilsauce.github.io/hamhelper/hamhelper1.0.0.js';
const { date, array, utils, text } = ham;
import { SvgCanvas } from './components/SvgCanvas.js'
import { AudioController } from './AudioController.js'

const canvas = SvgCanvas.attachCanvas(document.querySelector('svg'))
const audio = new AudioController()

// audio.attachOscillator(canvas)
// canvas.audio.play()
console.log('canvas', canvas)
const widthDivisibles = [1, 2, 3, 4, 6, 8, 12, 16, 24, 32, 48, 64, 96, 128, 192, 384]
const heightDivisibles = [1, 2, 19, 38, 361, 722];