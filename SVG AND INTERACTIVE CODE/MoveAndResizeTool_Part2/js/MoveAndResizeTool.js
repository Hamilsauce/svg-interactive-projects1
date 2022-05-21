// MoveAndResizeTool.js - Implementaion for MoveAndResizeTool. 
// This code uses JQuery so, include the JQuery library before including this file.

function WrapWithMoveAndResizeTool(jquerySelector) {
    var resizeTool = new MoveAndResizeTool(jquerySelector);
    resizeTool.show();

    return resizeTool;
}

// Define MoveAndResizeTool constructor
function MoveAndResizeTool(jquerySelector) {
    this.wrappedElements = new Array();
    this.isShown = false;

    var selectedElements = $(jquerySelector);

    for (var elementInx = 0; elementInx < selectedElements.length; elementInx++) {
        var currElement = selectedElements[elementInx];
        this.wrappedElements[elementInx] = new MoveAndResizeElementWrapper(currElement);
    }
}

// Define MoveAndResizeTool prototype
MoveAndResizeTool.prototype.show = function () {
    if (this.isShown == false) {
        for (var elementInx = 0; elementInx < this.wrappedElements.length; elementInx++) {
            var currElement = this.wrappedElements[elementInx];
            currElement.showWrapper();
        }

        this.isShown = true;
    }
}

MoveAndResizeTool.prototype.hide = function () {
    if (this.isShown == true) {
        for (var elementInx = 0; elementInx < this.wrappedElements.length; elementInx++) {
            var currElement = this.wrappedElements[elementInx];
            currElement.hideWrapper();
        }

        this.isShown = false;
    }
}

var MoveAndResizeTool_ElementWrapper_wrappersCounter = 0;

// Define MoveAndResizeElementWrapper constructor
function MoveAndResizeElementWrapper(elementToWrap) {
    this.originalElement = elementToWrap;

    // Since we want a unique id for each wrapper, we add a counter value to the end of each id.
    MoveAndResizeTool_ElementWrapper_wrappersCounter++;

    this.wrapperId = 'MoveAndResizeTool_ElementWrapper' +
        MoveAndResizeTool_ElementWrapper_wrappersCounter.toString();

    this.wrapperStr = '<div style="position:relative" id="' + this.wrapperId + '">' +
        '<div style="left:8px;top:8px;position:absolute" class="internalWrapper"></div>' +
        '</div>';

    this.externalWrapperQueryStr = '#' + this.wrapperId;
    this.internalWrapperQueryStr = this.externalWrapperQueryStr + ' .internalWrapper';

    // Query strings for the action-triggers.
    this.moveActionTriggerQueryStr = this.externalWrapperQueryStr + ' .moveActionTrigger';
    this.topActionTriggerQueryStr = this.externalWrapperQueryStr + ' .topActionTrigger';
    this.bottomActionTriggerQueryStr = this.externalWrapperQueryStr + ' .bottomActionTrigger';
    this.leftActionTriggerQueryStr = this.externalWrapperQueryStr + ' .leftActionTrigger';
    this.rightActionTriggerQueryStr = this.externalWrapperQueryStr + ' .rightActionTrigger';
    this.topLeftActionTriggerQueryStr = this.externalWrapperQueryStr + ' .topLeftActionTrigger';
    this.topRightActionTriggerQueryStr = this.externalWrapperQueryStr + ' .topRightActionTrigger';
    this.bottomLeftActionTriggerQueryStr = this.externalWrapperQueryStr + ' .bottomLeftActionTrigger';
    this.bottomRightActionTriggerQueryStr = this.externalWrapperQueryStr + ' .bottomRightActionTrigger';

    // Query strings for the resizing border's drawings.
    this.topDrawingQueryStr = this.externalWrapperQueryStr + ' .topDrawing';
    this.bottomDrawingQueryStr = this.externalWrapperQueryStr + ' .bottomDrawing';
    this.leftDrawingQueryStr = this.externalWrapperQueryStr + ' .leftDrawing';
    this.rightDrawingQueryStr = this.externalWrapperQueryStr + ' .rightDrawing';
    this.topLeftDrawingQueryStr = this.externalWrapperQueryStr + ' .topLeftDrawing';
    this.topRightDrawingQueryStr = this.externalWrapperQueryStr + ' .topRightDrawing';
    this.bottomLeftDrawingQueryStr = this.externalWrapperQueryStr + ' .bottomLeftDrawing';
    this.bottomRightDrawingQueryStr = this.externalWrapperQueryStr + ' .bottomRightDrawing';

    this.currentAction = this.ActionsEnum.None;

    this.lastMouseX = 0;
    this.lastMouseY = 0;
}

// Define MoveAndResizeElementWrapper prototype
MoveAndResizeElementWrapper.prototype.ActionsEnum = {
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

MoveAndResizeElementWrapper.prototype.cornerActionTriggerRadius = 8;

MoveAndResizeElementWrapper.prototype.resizingBorderStr =
    '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" style="left:0px;top:0px;position:relative;width:100%;height:100%" >' +
    '<style type="text/css"> .actionTrigger { transition: opacity 0.5s; opacity: 0;} .actionTrigger:hover{transition: opacity 0.3s;opacity: 0.3;}</style>' +
    '<line x1="0" y1="0" x2="100%" y2="0" stroke="#808080" stroke-width="1" stroke-dasharray="5,5" class="topDrawing" />' +
    '<line x1="0" y1="100%" x2="100%" y2="100%" stroke="#808080" stroke-width="1" stroke-dasharray="5,5" class="bottomDrawing" />' +
    '<line x1="0" y1="0" x2="0" y2="100%" stroke="#808080" stroke-width="1" stroke-dasharray="5,5" class="leftDrawing" />' +
    '<line x1="100%" y1="0" x2="100%" y2="100%" stroke="#808080" stroke-width="1" stroke-dasharray="5,5" class="rightDrawing" />' +
    '<circle cx="0" cy="0" r="3" stroke="#0000FF" stroke-width="1" fill="#CCCCFF" class="topLeftDrawing" />' +
    '<circle cx="100%" cy="0" r="3" stroke="#0000FF" stroke-width="1" fill="#CCCCFF" class="topRightDrawing" />' +
    '<circle cx="0" cy="100%" r="3" stroke="#0000FF" stroke-width="1" fill="#CCCCFF" class="bottomLeftDrawing" />' +
    '<circle cx="100%" cy="100%" r="3" stroke="#0000FF" stroke-width="1" fill="#CCCCFF" class="bottomRightDrawing" />' +
    '<rect x="0" y="0" width="100%" height="100%" fill-opacity="0.5" opacity="0" class="actionTrigger moveActionTrigger" style="cursor:move" />' +
    '<line x1="0" y1="0" x2="100%" y2="0" stroke="#000" stroke-width="5" opacity="0" class="actionTrigger topActionTrigger" style="cursor:n-resize" />' +
    '<line x1="0" y1="100%" x2="100%" y2="100%" stroke="#000" stroke-width="5" opacity="0" class="actionTrigger bottomActionTrigger" style="cursor:s-resize" />' +
    '<line x1="0" y1="0" x2="0" y2="100%" stroke="#000" stroke-width="5" opacity="0" class="actionTrigger leftActionTrigger" style="cursor:w-resize" />' +
    '<line x1="100%" y1="0" x2="100%" y2="100%" stroke="#000" stroke-width="5" opacity="0" class="actionTrigger rightActionTrigger" style="cursor:e-resize"/>' +
    '<circle cx="0" cy="0" r="8" stroke="#000" stroke-width="0" fill="#000" opacity="0" class="actionTrigger topLeftActionTrigger" style="cursor:nw-resize" />' +
    '<circle cx="100%" cy="0" r="8" stroke="#000" stroke-width="0" fill="#000" opacity="0" class="actionTrigger topRightActionTrigger" style="cursor:ne-resize" />' +
    '<circle cx="0" cy="100%" r="8" stroke="#000" stroke-width="0" fill="#000" opacity="0" class="actionTrigger bottomLeftActionTrigger" style="cursor:sw-resize" />' +
    '<circle cx="100%" cy="100%" r="8" stroke="#000" stroke-width="0" fill="#000" opacity="0" class="actionTrigger bottomRightActionTrigger" style="cursor:se-resize" />' +
    '</svg>';

MoveAndResizeElementWrapper.prototype.showWrapper = function () {
    this.addWrapperElements();
    this.initializeEventHandlers();
}

MoveAndResizeElementWrapper.prototype.hideWrapper = function () {
    // Set original element's position, to be in the same position, after the wrapper is removed.
    var wrapperLeft = parseInt($(this.externalWrapperQueryStr).css('left'));
    var wrapperTop = parseInt($(this.externalWrapperQueryStr).css('top'));
    var elemLeft = (wrapperLeft + this.cornerActionTriggerRadius) + 'px';
    var elemTop = (wrapperTop + this.cornerActionTriggerRadius) + 'px';
    $(this.originalElement).css('left', elemLeft);
    $(this.originalElement).css('top', elemTop);
    $(this.originalElement).css('position', $(this.externalWrapperQueryStr).css('position'));

    // Put the original element instead of the wrapped element.
    $(this.externalWrapperQueryStr).replaceWith(this.originalElement);
}

MoveAndResizeElementWrapper.prototype.addWrapperElements = function () {
    // Wrap the original element with a resizing border.
    $(this.originalElement).wrap(this.wrapperStr);
    $(this.internalWrapperQueryStr).after(this.resizingBorderStr);

    // Set the external wrapper's position to be 8 (the radius of the corner action trigger) pixels less than the original element's position.
    var elemLeft = parseInt($(this.originalElement).css('left'));
    var elemTop = parseInt($(this.originalElement).css('top'));
    var wrapperLeft = (elemLeft - this.cornerActionTriggerRadius) + 'px';
    var wrapperTop = (elemTop - this.cornerActionTriggerRadius) + 'px';
    $(this.externalWrapperQueryStr).css('left', wrapperLeft);
    $(this.externalWrapperQueryStr).css('top', wrapperTop);
    $(this.externalWrapperQueryStr).css('position', $(this.originalElement).css('position'));

    // Set original element's position to be at the top-left corner of the internal wrapper.
    $(this.originalElement).css('left', 0);
    $(this.originalElement).css('top', 0);
    $(this.originalElement).css('position', 'relative');

    this.adjustWrapper();
}

MoveAndResizeElementWrapper.prototype.initializeEventHandlers = function () {
    var wrapper = this;

    $(this.moveActionTriggerQueryStr).pointerdown(function (event) {
        wrapper.currentAction = wrapper.ActionsEnum.Move;
    });

    $(this.topActionTriggerQueryStr)(function (event) {
        wrapper.currentAction = wrapper.ActionsEnum.TopResize;
    });

    $(this.bottomActionTriggerQueryStr).pointerdown(function (event) {
        wrapper.currentAction = wrapper.ActionsEnum.BottomResize;
    });

    $(this.leftActionTriggerQueryStr).pointerdown(function (event) {
        wrapper.currentAction = wrapper.ActionsEnum.LeftResize;
    });

    $(this.rightActionTriggerQueryStr).pointerdown(function (event) {
        wrapper.currentAction = wrapper.ActionsEnum.RightResize;
    });

    $(this.topLeftActionTriggerQueryStr).pointerdown(function (event) {
        wrapper.currentAction = wrapper.ActionsEnum.TopLeftResize;
    });

    $(this.topRightActionTriggerQueryStr).pointerdown(function (event) {
        wrapper.currentAction = wrapper.ActionsEnum.TopRightResize;
    });

    $(this.bottomLeftActionTriggerQueryStr).pointerdown(function (event) {
        wrapper.currentAction = wrapper.ActionsEnum.BottomLeftResize;
    });

    $(this.bottomRightActionTriggerQueryStr).pointerdown(function (event) {
        wrapper.currentAction = wrapper.ActionsEnum.BottomRightResize;
    });

    $(document).mouseup(function (event) {
        // Clear the current action.
        wrapper.currentAction = wrapper.ActionsEnum.None;
    });

    $(document).mousemove(function (event) {
        wrapper.onMouseMove(event);
    });
}

MoveAndResizeElementWrapper.prototype.onMouseMove = function (event) {
    var currMouseX = event.clientX;
    var currMouseY = event.clientY;

    var deltaX = currMouseX - this.lastMouseX;
    var deltaY = currMouseY - this.lastMouseY;

    this.applyMouseMoveAction(deltaX, deltaY);

    this.lastMouseX = event.pageX;
    this.lastMouseY = event.pageY;
}

MoveAndResizeElementWrapper.prototype.applyMouseMoveAction = function (deltaX, deltaY) {
    var deltaTop = 0;
    var deltaLeft = 0;
    var deltaWidth = 0;
    var deltaHeight = 0;

    if (this.currentAction == this.ActionsEnum.RightResize ||
             this.currentAction == this.ActionsEnum.TopRightResize ||
             this.currentAction == this.ActionsEnum.BottomRightResize) {
        deltaWidth = deltaX;
    }

    if (this.currentAction == this.ActionsEnum.LeftResize ||
             this.currentAction == this.ActionsEnum.TopLeftResize ||
             this.currentAction == this.ActionsEnum.BottomLeftResize) {
        deltaWidth = -deltaX;
        deltaLeft = deltaX;
    }

    if (this.currentAction == this.ActionsEnum.BottomResize ||
             this.currentAction == this.ActionsEnum.BottomLeftResize ||
             this.currentAction == this.ActionsEnum.BottomRightResize) {
        deltaHeight = deltaY;
    }

    if (this.currentAction == this.ActionsEnum.TopResize ||
             this.currentAction == this.ActionsEnum.TopLeftResize ||
             this.currentAction == this.ActionsEnum.TopRightResize) {
        deltaHeight = -deltaY;
        deltaTop = deltaY;
    }

    if (this.currentAction == this.ActionsEnum.Move) {
        deltaLeft = deltaX;
        deltaTop = deltaY;
    }

    this.updatePosition(deltaLeft, deltaTop);
    this.updateSize(deltaWidth, deltaHeight);    
    this.adjustWrapper();
}

MoveAndResizeElementWrapper.prototype.updateSize = function (deltaWidth, deltaHeight) {
    // Calculate the new size.
    var elemWidth = parseInt($(this.originalElement).width());
    var elemHeight = parseInt($(this.originalElement).height());
    var newWidth = elemWidth + deltaWidth;
    var newHeight = elemHeight + deltaHeight;

    // Don't allow a too small size.
    var minumalSize = this.cornerActionTriggerRadius * 2;
    if (newWidth < minumalSize) {
        newWidth = minumalSize;
    }
    if (newHeight < minumalSize) {
        newHeight = minumalSize;
    }

    // Set the new size.
    $(this.originalElement).css('width', newWidth + 'px');
    $(this.originalElement).css('height', newHeight + 'px');
}

MoveAndResizeElementWrapper.prototype.updatePosition = function (deltaLeft, deltaTop) {
    // Calculate the new position.
    var elemLeft = parseInt($(this.externalWrapperQueryStr).css('left'));
    var elemTop = parseInt($(this.externalWrapperQueryStr).css('top'));
    var newLeft = elemLeft + deltaLeft;
    var newTop = elemTop + deltaTop;

    // Set the new position.
    $(this.externalWrapperQueryStr).css('left', newLeft + 'px');
    $(this.externalWrapperQueryStr).css('top', newTop + 'px');
}

MoveAndResizeElementWrapper.prototype.adjustWrapper = function () {
    var elemWidth = parseInt($(this.originalElement).width());
    var elemHeight = parseInt($(this.originalElement).height());
    var externalWrapperWidth = (elemWidth + this.cornerActionTriggerRadius * 2) + 'px';
    var externalWrapperHeight = (elemHeight + this.cornerActionTriggerRadius * 2) + 'px';

    $(this.internalWrapperQueryStr).width($(this.originalElement).width());
    $(this.internalWrapperQueryStr).height($(this.originalElement).height());
    $(this.externalWrapperQueryStr).width(externalWrapperWidth);
    $(this.externalWrapperQueryStr).height(externalWrapperHeight);

    // Adjust the resizing border.
    this.adjustResizingBorder();
}

MoveAndResizeElementWrapper.prototype.adjustResizingBorder = function () {
    var elemWidth = parseInt($(this.originalElement).width());
    var elemHeight = parseInt($(this.originalElement).height());

    // Get the minimum and maximum values for X and Y.
    var minX = this.cornerActionTriggerRadius + 'px';
    var minY = this.cornerActionTriggerRadius + 'px';
    var maxX = (this.cornerActionTriggerRadius + elemWidth) + 'px';
    var maxY = (this.cornerActionTriggerRadius + elemHeight) + 'px';

    // Adjust moving rectange.
    this.setRectangleAttributes(this.moveActionTriggerQueryStr, minX, minY, elemWidth + 'px', elemHeight + 'px');

    // Adjust resizing border lines.
    this.setLineAttributes(this.topDrawingQueryStr, minX, minY, maxX, minY);
    this.setLineAttributes(this.bottomDrawingQueryStr, minX, maxY, maxX, maxY);
    this.setLineAttributes(this.leftDrawingQueryStr, minX, minY, minX, maxY);
    this.setLineAttributes(this.rightDrawingQueryStr, maxX, minY, maxX, maxY);
    this.setLineAttributes(this.topActionTriggerQueryStr, minX, minY, maxX, minY);
    this.setLineAttributes(this.bottomActionTriggerQueryStr, minX, maxY, maxX, maxY);
    this.setLineAttributes(this.leftActionTriggerQueryStr, minX, minY, minX, maxY);
    this.setLineAttributes(this.rightActionTriggerQueryStr, maxX, minY, maxX, maxY);

    // Adjust resizing border circles.
    this.setCircleAttributes(this.topLeftDrawingQueryStr, minX, minY);
    this.setCircleAttributes(this.topRightDrawingQueryStr, maxX, minY);
    this.setCircleAttributes(this.bottomLeftDrawingQueryStr, minX, maxY);
    this.setCircleAttributes(this.bottomRightDrawingQueryStr, maxX, maxY);
    this.setCircleAttributes(this.topLeftActionTriggerQueryStr, minX, minY);
    this.setCircleAttributes(this.topRightActionTriggerQueryStr, maxX, minY);
    this.setCircleAttributes(this.bottomLeftActionTriggerQueryStr, minX, maxY);
    this.setCircleAttributes(this.bottomRightActionTriggerQueryStr, maxX, maxY);
}

MoveAndResizeElementWrapper.prototype.setRectangleAttributes = function (rectQueryStr, x, y, width, height) {
    var rectElem = $(rectQueryStr);
    rectElem.attr('x', x);
    rectElem.attr('y', y);
    rectElem.attr('width', width);
    rectElem.attr('height', height);
}

MoveAndResizeElementWrapper.prototype.setLineAttributes = function (lineQueryStr, x1, y1, x2, y2) {
    var lineElem = $(lineQueryStr);
    lineElem.attr('x1', x1);
    lineElem.attr('y1', y1);
    lineElem.attr('x2', x2);
    lineElem.attr('y2', y2);
}

MoveAndResizeElementWrapper.prototype.setCircleAttributes = function (circleQueryStr, cx, cy) {
    var circleElem = $(circleQueryStr);
    circleElem.attr('cx', cx);
    circleElem.attr('cy', cy);
}
