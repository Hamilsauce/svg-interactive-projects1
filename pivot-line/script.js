import { TransformList } from '../TransformList.js';
const svg = document.querySelector('svg');

const arrow1 = {
	g: svg.querySelector('#arrow1'),
	line: svg.querySelector('.arrow-line'),
	startHandle: svg.querySelector('[data-handle="start"]'),
	endHandle: svg.querySelector('[data-handle="end"]'),
}

svg.style.width = window.innerWidth;
svg.style.height = '100%'

window.arrow1 = arrow1
const arrowTransforms = new TransformList(svg, arrow1.g)
const arrowLineTransforms = new TransformList(svg, arrow1.line)
const arrowEndHandleTransforms = new TransformList(svg, arrow1.endHandle)
const arrowStartHandleTransforms = new TransformList(svg, arrow1.startHandle)

arrowTransforms.translateTo(-40, 0)
arrowStartHandleTransforms.translateTo(15, 0)
arrowEndHandleTransforms.translateTo(60, 0)

export const makeRotato = (svg, arrow) => {
	let rotation = 0;
	let dragging = false;
	let startAngle = 0;
	let startRotation = 0;
	
	const getPoint = (event) => {
		const pt = svg.createSVGPoint();
		
		pt.x = event.clientX;
		pt.y = event.clientY;
		
		return pt.matrixTransform(
			svg.getScreenCTM().inverse()
		);
	};
	
	const getPivotCenter2 = () => {
		const bbox = arrow1.startHandle.getBBox();
		const ctm = arrow1.startHandle.getCTM();
		
		const center = svg.createSVGPoint();
		
		// center.x = bbox.x + bbox.width / 2;
		// center.y = bbox.y + bbox.height / 2;
		center.x = arrowStartHandleTransforms.translation.x
		center.y = arrowStartHandleTransforms.translation.y
		
		return center.matrixTransform(ctm);
	};
	
	const getPivotCenter = () => {
		const pt = svg.createSVGPoint();
		
		// pt.x = 0;
		// pt.y = 0;
		// console.table([arrowStartHandleTransforms.translation, arrowEndHandleTransforms.translation])
		
		pt.x =  arrowStartHandleTransforms.translation.x
		pt.y =  arrowStartHandleTransforms.translation.y
		
		return pt.matrixTransform(
			arrow1.startHandle.getCTM()
		);
	};
	
	const getAngle = (point, center) => {
		return Math.atan2(
			point.y - center.y,
			point.x - center.x
		) * (180 / Math.PI);
	};
	const worldPivot = getPivotCenter()
	const render = () => {
		// console.table({
		// 	worldPivot: { x: worldPivot.x, y: worldPivot.y },
		// 	localPivot: arrowStartHandleTransforms.translation,
		// });
		arrowTransforms.rotateTo(rotation, arrowStartHandleTransforms.translation.x, arrowStartHandleTransforms.translation.y)
	};
	
	arrow1.endHandle.addEventListener('pointerdown', (event) => {
		dragging = true;
		
		const point = getPoint(event);
		const center = getPivotCenter();
		
		startAngle = getAngle(point, center);
		startRotation = rotation;
		
		svg.setPointerCapture(event.pointerId);
	});
	
	svg.addEventListener('pointermove', (event) => {
		if (!dragging) return;
		
		const point = getPoint(event);
		const center = getPivotCenter();
		
		const currentAngle = getAngle(point, center);
		
		const delta = currentAngle - startAngle;
		
		rotation = startRotation + delta;
		
		render();
	});
	
	svg.addEventListener('pointerup', () => {
		dragging = false;
	});
};

makeRotato(svg, arrow1)