export const addPinchZoom = (svg) => {
  const originalSvgOrigin = {
    x: svg.viewBox.baseVal.x,
    y: svg.viewBox.baseVal.y,
    width: svg.viewBox.baseVal.width,
    height: svg.viewBox.baseVal.height,
  }
  
  let viewBox = originalSvgOrigin;
  
  let initialDist = null;
  let pinchCenter = null;
  let pinchStart = null;
  let previousPinch = null;
  
  const getTouchDistance = (t1, t2) => {
    const dx = t2.clientX - t1.clientX;
    const dy = t2.clientY - t1.clientY;
    return Math.hypot(dx, dy);
  }
  
  const getTouchMidpoint = (t1, t2) => {
    return {
      x: (t1.clientX + t2.clientX) / 2,
      y: (t1.clientY + t2.clientY) / 2
    };
  }
  
  const screenToSvgCoords = (x, y) => {
    const svgRect = svg.getBoundingClientRect();
    const scaleX = viewBox.width / svgRect.width;
    const scaleY = viewBox.height / svgRect.height;
    return {
      x: viewBox.x + (x - svgRect.left) * scaleX,
      y: viewBox.y + (y - svgRect.top) * scaleY
    };
  }
  
  const handlePointerDown = (e) => {
    const { touches } = e;
    console.warn('down: ', touches.length)
    
    if (touches.length === 2) {
      e.preventDefault();
      
      const [t1, t2] = touches;
      const dist = getTouchDistance(t1, t2);
      const centerScreen = getTouchMidpoint(t1, t2);
      const centerSvg = screenToSvgCoords(centerScreen.x, centerScreen.y);
      
      pinchStart = {
        dist,
        centerSvg,
        viewBox: { ...viewBox }
      };
    } else {
      pinchStart = previousPinch
    }
    
  };
  
  const handlePointerMove = (e) => {
    const { touches } = e;
    
    // if (touches.length < 2) pinchStart = null
    console.warn('move: ', touches.length)
    
    if (touches.length === 2 && pinchStart) {
      e.preventDefault();
      
      const [t1, t2] = touches;
      const newDist = getTouchDistance(t1, t2);
      const scale = pinchStart.dist / newDist;
      
      const newWidth = pinchStart.viewBox.width * scale;
      const newHeight = pinchStart.viewBox.height * scale;
      
      const cx = pinchStart.centerSvg.x;
      const cy = pinchStart.centerSvg.y;
      
      // Center zoom
      const newX = cx - (cx - pinchStart.viewBox.x) * scale;
      const newY = cy - (cy - pinchStart.viewBox.y) * scale;
      
      svg.setAttribute("viewBox", `${newX} ${newY} ${newWidth} ${newHeight}`);
      viewBox = { x: newX, y: newY, width: newWidth, height: newHeight };
    }
  };
  
  const handlePointerUp = (e) => {
    const { touches } = e;
    
    if (touches.length === 1) {
      previousPinch = pinchStart;
    }
    else pinchStart = null
    // if (touches.length === 1) {
    //   previousPinch = pinchStart;
    // }
  };
  
  const addEventListeners = () => {
    svg.addEventListener('touchstart', handlePointerDown);
    svg.addEventListener('touchmove', handlePointerMove);
    svg.addEventListener('touchend', handlePointerUp);
   
    return removeEventListeners;
  };
  
  const removeEventListeners = () => {
    svg.removeEventListener('touchstart', handlePointerDown);
    svg.removeEventListener('touchmove', handlePointerMove);
    svg.removeEventListener('touchend', handlePointerUp);
    
    return addEventListeners;
  };
  
  return {
    start: addEventListeners,
    stop: removeEventListeners,
  }
}