const plotPoints = (radius, numberOfPoints) => {
  const angleStep = (Math.PI * 2) / numberOfPoints;
  const points = [];
  
  for (let i = 1; i <= numberOfPoints; i++) {
    const x = Math.cos(i * angleStep) * radius;
    const y = Math.sin(i * angleStep) * radius;
    
    const dpt = domPoint(svg, x, y);
    
    const svgPoint = svg.createSVGPoint();
    
    svgPoint.x = x - (dpt.x - x) / 5;
    svgPoint.y = y - (dpt.y - y) / 5;
    
    points.push(svgPoint);
  }
  
  return points;
}

const drawShape = (radius, pointCount = 6) => {
  const points = plotPoints(radius, pointCount);
  const hex = document.createElementNS(SVG_NS, 'polygon');
  
  points.forEach((p) => hex.points.appendItem(p));
  
  hex.classList.add('hex');
  
  return hex;
};