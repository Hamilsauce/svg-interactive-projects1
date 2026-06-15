export const makeRotato = (svg, wheel) => {
  // const svg = document.querySelector('#svg');
  // const wheel = document.querySelector('#wheel');
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
  
  const getWheelCenter = () => {
    const bbox = wheel.dom.getBBox();
    const ctm = wheel.dom.getCTM();
    
    const center = svg.createSVGPoint();
    
    center.x = bbox.x + bbox.width / 2;
    center.y = bbox.y + bbox.height / 2;
    
    return center.matrixTransform(ctm);
  };
  
  const getAngle = (point, center) => {
    return Math.atan2(
      point.y - center.y,
      point.x - center.x
    ) * (180 / Math.PI);
  };
  
  const render = () => {
    wheel.transformList.rotateTo(rotation)
    
    // .setAttribute(
    //   'transform',
    //   `rotate(${rotation})`
    // );
  };
  
  svg.addEventListener('pointerdown', (event) => {
    dragging = true;
    
    const point = getPoint(event);
    const center = getWheelCenter();
    
    startAngle = getAngle(point, center);
    startRotation = rotation;
    
    svg.setPointerCapture(event.pointerId);
  });
  
  svg.addEventListener('pointermove', (event) => {
    if (!dragging) return;
    
    const point = getPoint(event);
    const center = getWheelCenter();
    
    const currentAngle = getAngle(point, center);
    
    const delta = currentAngle - startAngle;
    
    rotation = startRotation + delta;
    
    render();
  });
  
  svg.addEventListener('pointerup', () => {
    dragging = false;
  });
};