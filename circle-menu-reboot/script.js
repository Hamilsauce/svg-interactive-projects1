import { drawShape } from '../circle-menu-reboot/hexa-spinner.js';
import { makeRotato } from '../circle-menu-reboot/menu-rotation.js';
import { TransformList } from '../TransformList.js';


const app = document.querySelector('#app');
const debugConsole = document.querySelector('#debug-console');
const appBody = document.querySelector('#app-body')
const containers = document.querySelectorAll('.container')
const svg = document.querySelector('svg');
const scene = svg.querySelector('#scene');
const gptWheelEl = svg.querySelector('#wheel-root');


const wheelEl = drawShape(svg, 26, 8);
const wheelTransformList = new TransformList(svg, wheelEl)
// const gptWheelTransformList = new TransformList(svg, gptWheelEl)


const gptWheel = {
	_transformList: null,
	dom: svg.querySelector('#wheel-root'),
	get transformList() {
		if (!this._transformList) {
			this._transformList = new TransformList(svg, this.dom)
		}
		
		return this._transformList;
	},
}

// const wheel = {
// 	_transformList: null,
// 	dom: drawShape(svg, 26, 8),
// 	get transformList() {
// 		if (!this._transformList) {
// 			this._transformList = new TransformList(svg, this.dom)
// 		}

// 		return this._transformList;
// 	},
// }

// const wheel = { dom: wheelEl, transformList: wheelTransformList }

let currWheel = gptWheel

scene.append(currWheel.dom)
makeRotato(svg, currWheel)
console.warn('f')