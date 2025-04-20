/* 
   Makes an element in an SVG document draggable.
   Fires custom `dragstart`, `drag`, and `dragend` events on the
   element with the `detail` property of the event carrying XY
   coordinates for the location of the element.
*/

export const draggable = (parent, element) => {
  let svg = parent;
  let el = element;

  if (!(svg instanceof SVGElement && el instanceof Element)) {
    console.error('Draggable parent not an SVG element or target not an element');
    return;
  };

  while (svg && svg.tagName != 'svg') svg = svg.parentNode;
  let pt = svg.createSVGPoint();
  let doc = svg.ownerDocument;

  const root = doc.rootElement || doc.body || svg;
  let xlate, txStartX, txStartY, pointerStart;
  let xforms = el.transform.baseVal;

  el.addEventListener('pointerdown', startMove, false);

  function startMove(evt) {
    xlate = xforms.numberOfItems > 0 && xforms.getItem(0);
    if (!xlate || xlate.type != SVGTransform.SVG_TRANSFORM_TRANSLATE) {
      xlate = xforms.createSVGTransformFromMatrix(svg.createSVGMatrix());
      xforms.insertItemBefore(xlate, 0);
    }

    txStartX = xlate.matrix.e;
    txStartY = xlate.matrix.f;
   
    pointerStart = inElementSpace(evt);
   
    fireEvent('dragstart');
   
    el.addEventListener('pointermove', elMove, true);
    el.addEventListener('pointerup', finishMove, true);
  }

  function elMove(evt) {
    const point = inElementSpace(evt);
    xlate.setTranslate(
      txStartX + point.x - pointerStart.x,
      txStartY + point.y - pointerStart.y
    );
    
    fireEvent('drag');
  }

  function finishMove(evt) {
    svg.removeEventListener('pointerup', finishMove, false);
    svg.removeEventListener('pointermove', elMove, false);
    fireEvent('dragend');
  }

  function fireEvent(eventName) {
    const event = new Event(eventName);
    event.detail = { x: xlate.matrix.e, y: xlate.matrix.f, target: el };
    return svg.dispatchEvent(event);
  }

  // Convert pointer position from screen space to coordinates of el
  function inElementSpace(evt) {
    pt.x = evt.clientX;
    pt.y = evt.clientY;
    return pt.matrixTransform(svg.getScreenCTM().inverse());
  }

  return () => {
    el.removeEventListener('pointerdown', startMove, false);
    el.removeEventListener('pointermove', elMove, true);
    el.removeEventListener('pointerup', finishMove, true);
    fireEvent('removedrag');
  }
}
