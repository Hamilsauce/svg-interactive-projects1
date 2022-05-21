const $ = (string) => document.querySelector(string)


var ActionsEnum = {
  None: 0,
  LeftResize: 1,
  TopResize: 2,
  RightResize: 3,
  BottomResize: 4,
  TopLeftResize: 5,
  BottomLeftResize: 6,
  TopRightResize: 7,
  BottomRightResize: 8,
  Move: 9
}

var externalWrapperQueryStr = '#wrapper';
var internalWrapperQueryStr = externalWrapperQueryStr + ' .internalWrapper';

// Query strings for the action-triggers.
var moveActionTriggerQueryStr = externalWrapperQueryStr + ' .moveActionTrigger';
var topActionTriggerQueryStr = externalWrapperQueryStr + ' .topActionTrigger';
var bottomActionTriggerQueryStr = externalWrapperQueryStr + ' .bottomActionTrigger';
var leftActionTriggerQueryStr = externalWrapperQueryStr + ' .leftActionTrigger';
var rightActionTriggerQueryStr = externalWrapperQueryStr + ' .rightActionTrigger';
var topLeftActionTriggerQueryStr = externalWrapperQueryStr + ' .topLeftActionTrigger';
var topRightActionTriggerQueryStr = externalWrapperQueryStr + ' .topRightActionTrigger';
var bottomLeftActionTriggerQueryStr = externalWrapperQueryStr + ' .bottomLeftActionTrigger';
var bottomRightActionTriggerQueryStr = externalWrapperQueryStr + ' .bottomRightActionTrigger';

// Query strings for the resizing border's drawings.
var topDrawingQueryStr = externalWrapperQueryStr + ' .topDrawing';
var bottomDrawingQueryStr = externalWrapperQueryStr + ' .bottomDrawing';
var leftDrawingQueryStr = externalWrapperQueryStr + ' .leftDrawing';
var rightDrawingQueryStr = externalWrapperQueryStr + ' .rightDrawing';
var topLeftDrawingQueryStr = externalWrapperQueryStr + ' .topLeftDrawing';
var topRightDrawingQueryStr = externalWrapperQueryStr + ' .topRightDrawing';
var bottomLeftDrawingQueryStr = externalWrapperQueryStr + ' .bottomLeftDrawing';
var bottomRightDrawingQueryStr = externalWrapperQueryStr + ' .bottomRightDrawing';

var currentAction = ActionsEnum.None;

var lastPointerX = 0;
var lastPointerY = 0;

var cornerActionTriggerRadius = 8;

function initializeEventHandlers() {
  $(moveActionTriggerQueryStr).addEventListener('pointerdown', e => {
    currentAction = ActionsEnum.Move;
  });

  $(topActionTriggerQueryStr).addEventListener('pointerdown', e => {
    currentAction = ActionsEnum.TopResize;
  });

  $(bottomActionTriggerQueryStr).addEventListener('pointerdown', e => {
    currentAction = ActionsEnum.BottomResize;
  });

  $(leftActionTriggerQueryStr).addEventListener('pointerdown', e => {
    currentAction = ActionsEnum.LeftResize;
  });

  $(rightActionTriggerQueryStr).addEventListener('pointerdown', e => {
    currentAction = ActionsEnum.RightResize;
  });

  $(topLeftActionTriggerQueryStr).addEventListener('pointerdown', e => {
    currentAction = ActionsEnum.TopLeftResize;
  });

  $(topRightActionTriggerQueryStr).addEventListener('pointerdown', e => {
    currentAction = ActionsEnum.TopRightResize;
  });

  $(bottomLeftActionTriggerQueryStr).addEventListener('pointerdown', e => {

    currentAction = ActionsEnum.BottomLeftResize;
  });

  $(bottomRightActionTriggerQueryStr).addEventListener('pointerdown', e => {
    currentAction = ActionsEnum.BottomRightResize;
  });

  const pointerup = (event) => {
    // Clear the current action.
    currentAction = ActionsEnum.None;
    console.log('POINTER IP');
    
    document.removeEventListener('pointermove', onPointerMove);
    document.removeEventListener('pointerup', onPointerUp);
  };

  document.addEventListener('pointerdown', onPointerD);
  document.addEventListener('pointermove', onPointerMove);
  document.addEventListener('pointerup', onPointerUp);

  // onpointermove(function(event) {
  //   onPointerMove(event);
  // });
}

function onPointerMove(event) {
  var currPointerX = event.clientX;
  var currPointerY = event.clientY;

  var deltaX = currPointerX - lastPointerX;
  var deltaY = currPointerY - lastPointerY;

  applyPointerMoveAction(deltaX, deltaY);

  lastPointerX = event.pageX;
  lastPointerY = event.pageY;
  console.log('event', event)
}

function applyPointerMoveAction(deltaX, deltaY) {
  var deltaTop = 0;
  var deltaLeft = 0;
  var deltaWidth = 0;
  var deltaHeight = 0;

  if (currentAction == ActionsEnum.RightResize ||
    currentAction == ActionsEnum.TopRightResize ||
    currentAction == ActionsEnum.BottomRightResize) {
    deltaWidth = deltaX;
  }

  if (currentAction == ActionsEnum.LeftResize ||
    currentAction == ActionsEnum.TopLeftResize ||
    currentAction == ActionsEnum.BottomLeftResize) {
    deltaWidth = -deltaX;
    deltaLeft = deltaX;
  }

  if (currentAction == ActionsEnum.BottomResize ||
    currentAction == ActionsEnum.BottomLeftResize ||
    currentAction == ActionsEnum.BottomRightResize) {
    deltaHeight = deltaY;
  }

  if (currentAction == ActionsEnum.TopResize ||
    currentAction == ActionsEnum.TopLeftResize ||
    currentAction == ActionsEnum.TopRightResize) {
    deltaHeight = -deltaY;
    deltaTop = deltaY;
  }

  if (currentAction == ActionsEnum.Move) {
    deltaLeft = deltaX;
    deltaTop = deltaY;
  }

  updatePosition(deltaLeft, deltaTop);
  updateSize(deltaWidth, deltaHeight);
  adjustWrapper();
}

function updateSize(deltaWidth, deltaHeight) {
  // Calculate the new size.
  var elemWidth = parseInt($("#myShape").width());
  var elemHeight = parseInt($("#myShape").height());
  var newWidth = elemWidth + deltaWidth;
  var newHeight = elemHeight + deltaHeight;

  // Don't allow a too small size.
  var minumalSize = cornerActionTriggerRadius * 2;
  if (newWidth < minumalSize) {
    newWidth = minumalSize;
  }
  if (newHeight < minumalSize) {
    newHeight = minumalSize;
  }

  // Set the new size.
  $("#myShape").css('width', newWidth + 'px');
  $("#myShape").css('height', newHeight + 'px');
}

function updatePosition(deltaLeft, deltaTop) {
  // Calculate the new position.
  var elemLeft = parseInt($(externalWrapperQueryStr).css('left'));
  var elemTop = parseInt($(externalWrapperQueryStr).css('top'));
  var newLeft = elemLeft + deltaLeft;
  var newTop = elemTop + deltaTop;

  // Set the new position.
  $(externalWrapperQueryStr).css('left', newLeft + 'px');
  $(externalWrapperQueryStr).css('top', newTop + 'px');
}

function adjustWrapper() {
  var elemWidth = parseInt($("#myShape").width());
  var elemHeight = parseInt($("#myShape").height());
  var externalWrapperWidth = (elemWidth + cornerActionTriggerRadius * 2) + 'px';
  var externalWrapperHeight = (elemHeight + cornerActionTriggerRadius * 2) + 'px';

  $(internalWrapperQueryStr).width($("#myShape").width());
  $(internalWrapperQueryStr).height($("#myShape").height());
  $(externalWrapperQueryStr).width(externalWrapperWidth);
  $(externalWrapperQueryStr).height(externalWrapperHeight);

  // Adjust the resizing border.
  adjustResizingBorder();
}

function adjustResizingBorder() {
  var elemWidth = parseInt($("#myShape").width());
  var elemHeight = parseInt($("#myShape").height());

  // Get the minimum and maximum values for X and Y.
  var minX = cornerActionTriggerRadius + 'px';
  var minY = cornerActionTriggerRadius + 'px';
  var maxX = (cornerActionTriggerRadius + elemWidth) + 'px';
  var maxY = (cornerActionTriggerRadius + elemHeight) + 'px';

  // Adjust moving rectange.
  setRectangleAttributes(moveActionTriggerQueryStr, minX, minY, elemWidth + 'px', elemHeight + 'px');

  // Adjust resizing border lines.
  setLineAttributes(topDrawingQueryStr, minX, minY, maxX, minY);
  setLineAttributes(bottomDrawingQueryStr, minX, maxY, maxX, maxY);
  setLineAttributes(leftDrawingQueryStr, minX, minY, minX, maxY);
  setLineAttributes(rightDrawingQueryStr, maxX, minY, maxX, maxY);
  setLineAttributes(topActionTriggerQueryStr, minX, minY, maxX, minY);
  setLineAttributes(bottomActionTriggerQueryStr, minX, maxY, maxX, maxY);
  setLineAttributes(leftActionTriggerQueryStr, minX, minY, minX, maxY);
  setLineAttributes(rightActionTriggerQueryStr, maxX, minY, maxX, maxY);

  // Adjust resizing border circles.
  setCircleAttributes(topLeftDrawingQueryStr, minX, minY);
  setCircleAttributes(topRightDrawingQueryStr, maxX, minY);
  setCircleAttributes(bottomLeftDrawingQueryStr, minX, maxY);
  setCircleAttributes(bottomRightDrawingQueryStr, maxX, maxY);
  setCircleAttributes(topLeftActionTriggerQueryStr, minX, minY);
  setCircleAttributes(topRightActionTriggerQueryStr, maxX, minY);
  setCircleAttributes(bottomLeftActionTriggerQueryStr, minX, maxY);
  setCircleAttributes(bottomRightActionTriggerQueryStr, maxX, maxY);
}

function setRectangleAttributes(rectQueryStr, x, y, width, height) {
  var rectElem = $(rectQueryStr);
  rectElem.attr('x', x);
  rectElem.attr('y', y);
  rectElem.attr('width', width);
  rectElem.attr('height', height);
}

function setLineAttributes(lineQueryStr, x1, y1, x2, y2) {
  var lineElem = $(lineQueryStr);
  lineElem.attr('x1', x1);
  lineElem.attr('y1', y1);
  lineElem.attr('x2', x2);
  lineElem.attr('y2', y2);
}

function setCircleAttributes(circleQueryStr, cx, cy) {
  var circleElem = $(circleQueryStr);
  circleElem.attr('cx', cx);
  circleElem.attr('cy', cy);
}

window.load = function() {
  adjustWrapper();
  initializeEventHandlers();
};

console.log('{window}', { window })
