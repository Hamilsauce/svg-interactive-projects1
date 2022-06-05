class MakeDraggable {
  constructor() {
    this.root;
  };
  get prop() { return this._prop };
  set prop(newValue) { this._prop = newValue };
}

var makeDraggable = (function() {
  function makeDraggable(svg, element) {
    var selected = false;

    // Make sure the first transform on the element is a translate transform
    console.log('element.transform.baseVal', element.transform)
    var transforms = element.transform.baseVal;

    if (transforms.length === 0) { 
      // || transforms.getItem(0).type !== SVGTransform.SVG_TRANSFORM_TRANSLATE) {
      // Create an transform that translates by (0, 0)
      var translate = svg.createSVGTransform();
      translate.setTranslate(0, 0);
      // element.transform.baseVal 
      transforms.insertItemBefore(translate, 0);
      // console.log('element.transform.baseVal', element.transform.baseVal)
    }

    svg.addEventListener('mousedown', startDrag);
    svg.addEventListener('mousemove', drag);
    svg.addEventListener('mouseup', endDrag);
    svg.addEventListener('touchstart', startDrag);
    svg.addEventListener('touchmove', drag);
    svg.addEventListener('touchend', endDrag);

    function getMousePosition(evt) {
      var CTM = svg.getScreenCTM();
      if (evt.touches) { evt = evt.touches[0]; }
      return {
        x: (evt.clientX - CTM.e) / CTM.a,
        y: (evt.clientY - CTM.f) / CTM.d
      };
    }

    function startDrag(evt) {
      selected = element;
      transform = transforms.getItem(0);

      // Get initial translation
      offset = getMousePosition(evt);
      offset.x -= transform.matrix.e;
      offset.y -= transform.matrix.f;
    }

    function drag(evt) {
      if (selected) {
        evt.preventDefault();
        var coord = getMousePosition(evt);
        transform.setTranslate(coord.x - offset.x, coord.y - offset.y);
        console.log('instance svg.querySelector(rect1)',  document.querySelector('#rect1') instanceof SVGRectElement)
      console.log('svg.getIntersectionList()', svg.getIntersectionList( document.querySelector('#rect1'),document.querySelector('#rect2'),))
    // console.log('svg.currentTranslate', svg.currentTranslate))
        
      }
    }

    function endDrag(evt) {
      selected = false;
    }

    function zoom(evt) {
      evt.stopPropagation();
      evt.preventDefault();

      var scaleStep = evt.wheelDelta > 0 ? 1.25 : 0.8;

      var newMatrix = currentZoomMatrix.multiply(matrix);
      container.transform.baseVal.initialize(svg.createSVGTransformFromMatrix(newZoomMatrix));
    }
  }

  return {
    byClassName: function(className) {
      // Get SVGs
      document.querySelectorAll('svg').forEach(function(svg) {
        // Get elements
        var elements = svg.getElementsByClassName(className);
        for (var i = 0; i < elements.length; i++) {
          makeDraggable(svg, elements[i]);
        }
      });
    }
  };
})();