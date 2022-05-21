var outerSVG = document.querySelector('.outer');
var innerSVG = document.querySelector('.inner');
var svgns = "http://www.w3.org/2000/svg";

function makeRulers(svgElement, distance, units) {
  var vb = svgElement.getAttribute('viewBox').split(" "),
    svgWidth = vb[2],
    nbOfWSeparators = svgWidth / distance,
    nbOfWUnits = svgWidth / units,
    svgHeight = vb[3],
    nbOfHSeparators = svgHeight / distance,
    nbOfHUnits = svgHeight / units,
    pathstring = "",
    path = svgElement.querySelectorAll(".ruler"),
    i,
    g = document.createElementNS(svgns, "g");

  for (i = 0; i < path.length; i++) {
    if (path[i].parentNode == svgElement) {
      path = path[i];
      break;
    }
  }
  for (i = 0; i <= nbOfWUnits; i++) {
    pathstring += "M" + i * units + ",0v15";
  }
  for (i = 0; i <= nbOfWSeparators; i++) {
    pathstring += "M" + i * distance + ",0v30";
    var value = document.createElementNS(svgns, "text");
    value.setAttribute("x", i * distance - 15);
    value.setAttribute("y", 43);
    value.textContent = i * distance;
    g.appendChild(value);
  }
  for (i = 0; i <= nbOfHUnits; i++) {
    pathstring += "M0," + i * units + "h15";
  }

  for (i = 0; i <= nbOfHSeparators; i++) {
    pathstring += "M0," + i * distance + "h30";
    var value = document.createElementNS(svgns, "text");
    value.setAttribute("x", 30);
    value.setAttribute("y", i * distance + 5);
    value.textContent = i * distance;
    g.appendChild(value);
  }

  g.setAttribute("class", "labels");
  g.setAttribute("font-size", "16px");
  path.setAttribute("d", pathstring);
  svgElement.appendChild(g);
}

makeRulers(outerSVG, 100, 10);
makeRulers(innerSVG, 100, 10);

// preserveAspectRatio Controls
var aligmentOptions = document.querySelector('.preserveAspectRatio-options'),
  meetOrSlice = "meet",
  alignment = "xMidYMid",
  sliceOption = document.getElementById('slice'),
  meetOption = document.getElementById('meet');

sliceOption.onclick = function() {
  if (this.checked) meetOrSlice = "slice";
  setPreserveAspectRatio();
}
meetOption.onclick = function() {
  if (this.checked) meetOrSlice = "meet";
  setPreserveAspectRatio();
}

aligmentOptions.onchange = function() {
  alignment = this.options[this.selectedIndex].value;
  setPreserveAspectRatio();
}

function setPreserveAspectRatio() {
  innerSVG.setAttribute('preserveAspectRatio', alignment + " " + meetOrSlice);
}

var vbGuidelinesVisibility = document.getElementById('guidelines-visibility');
//when the checkbox is clicked
vbGuidelinesVisibility.onclick = function() {
  //get all the currently available guidelines
  var guidelines = document.querySelectorAll(".guidelines");
  if (this.checked) {
    guidelines[0].style.display = "";
    guidelines[1].style.display = "";
    drawXandYLines();
  } else {
    guidelines[0].style.display = "none";
    guidelines[1].style.display = "none";
  }
}
//viewBox input Controls
var vbMinX = document.getElementById('min-x'),
  vbMinY = document.getElementById('min-y'),
  vbWidth = document.getElementById('viewbox-width'),
  vbHeight = document.getElementById('viewbox-height');

var vbMinXvalue = vbMinX.value,
  vbMinYvalue = vbMinY.value,
  vbWidthValue = vbWidth.value,
  vbHeightValue = vbHeight.value;

vbMinX.addEventListener('blur', resetInput, false);
vbMinY.addEventListener('blur', resetInput, false);

function resetInput() {
  if (!this.value) this.value = 0;
  setViewboxAttributeValue();
}

vbMinX.addEventListener('change', vbMinXHandler, false);
vbMinX.addEventListener('input', vbMinXHandler, false);

function vbMinXHandler() {
  setViewboxAttributeValue();
  updateRulers();

  vbMinXvalue = this.value;
  if (vbGuidelinesVisibility.checked) drawXandYLines();
}

vbMinY.addEventListener('change', vbMinYHandler, false);
vbMinY.addEventListener('input', vbMinYHandler, false);

function vbMinYHandler() {
  setViewboxAttributeValue();
  updateRulers();

  vbMinYvalue = this.value;
  if (vbGuidelinesVisibility.checked) drawXandYLines();
}

vbWidth.addEventListener('change', vbWidthHandler, false);
vbWidth.addEventListener('input', vbWidthHandler, false);

function vbWidthHandler() {
  updateRangeOutput(this);
  setViewboxAttributeValue();
  updateRulers();
  vbWidthValue = this.value;
  if (vbGuidelinesVisibility.checked) drawXandYLines();
}

vbHeight.addEventListener('change', vbHeightHandler, false);
vbHeight.addEventListener('input', vbHeightHandler, false);

function vbHeightHandler() {
  updateRangeOutput(this);
  setViewboxAttributeValue();
  updateRulers();
  vbHeightValue = this.value;
  if (vbGuidelinesVisibility.checked) drawXandYLines();
}

var midlines = document.getElementById("midlines"),
  minx = document.getElementById("minx"),
  midmaxx = document.getElementById("midmaxx"),
  miny = document.getElementById("miny"),
  midmaxy = document.getElementById("midmaxy");

function drawXandYLines() {
  var vb = outerSVG.getAttribute("viewBox").split(" "),
    svgWidth = vb[2],
    svgHeight = vb[3],
    midx = +vbMinXvalue + vbWidthValue / 2,
    maxx = +vbMinXvalue + +vbWidthValue,
    midy = +vbMinYvalue + vbHeightValue / 2,
    maxy = +vbMinYvalue + +vbHeightValue;
  midlines.setAttribute("d", "M" + [svgWidth / 2, 0, svgWidth / 2, svgHeight] + "M" + [0, svgHeight / 2, svgWidth, svgHeight / 2]);
  minx.setAttribute("d", "M" + [vbMinXvalue, 0, vbMinXvalue, vbHeightValue]);
  midmaxx.setAttribute("d", "M" + [midx, 0, midx, vbHeightValue] + "M" + [maxx, 0, maxx, vbHeightValue]);
  miny.setAttribute("d", "M" + [0, vbMinYvalue, vbWidthValue, vbMinYvalue]);
  midmaxy.setAttribute("d", "M" + [0, midy, vbWidthValue, midy] + "M" + [0, maxy, vbWidthValue, maxy]);
}

function updateRangeOutput(self) {
  self.nextSibling.textContent = self.value;
}

function updateRulers() {
  //remove all previously added text
  var labels = innerSVG.querySelector(".labels");
  labels.parentNode.removeChild(labels);
  //redraw lines according to new viewBox width and height values
  makeRulers(innerSVG, 100, 10);
}

function setViewboxAttributeValue() {
  var viewBoxValue = vbMinX.value + " " + vbMinY.value + " " + vbWidth.value + " " + vbHeight.value;
  innerSVG.setAttribute('viewBox', viewBoxValue);
}