import ham from 'https://hamilsauce.github.io/hamhelper/hamhelper1.0.0.js';
const { DOM, date, array, utils, text } = ham;
// import { getTileSelector } from './SelectionBox.js';
import { TileSelector } from './tile-selector.js';
// import { DetailPanel } from './view/detail-panel.view.js';

let currentPanel;
let currentSelection;

const State = {
  tileContainer: document.querySelector('#tile-container'),
  _selection: null,
  isSelecting: false,
  // get selection() { return this._selection; },
  get selection() { return [...document.querySelectorAll('.tile[data-selected="true"]')]; },
  set selection(v) {
    if (Array.isArray(v) && Array.isArray(this.selection)) {
      const deselected = this.selection.filter(t => !v.includes(t));
      
      // this.selection.forEach((t, i) => {
      deselected.forEach((t, i) => {
        t.dataset.selected = false;
      });
    }
    
    v.forEach((t, i) => {
      t.dataset.selected = true;
    });
    
    this._selection = v;
  }
};

export class UnitBoundingBox extends DOMRect {
  constructor(context, x = 0, y = 0, width = 0, height = 0) {
    super(x, y, width, height);
    
    this.ctx = context;
    this.normalize();
  }
  
  static roundPoint(p, dir = 'floor') {
    return { x: dir === 'floor' ? Math.floor(p.x) : Math.ceil(p.x), y: dir === 'floor' ? Math.floor(p.y) : Math.ceil(p.y) };
  }
  
  normalize() {
    Object.assign(this, UnitBoundingBox.roundPoint(this.domPoint(this.x, this.y)));
    this.width = this.width / this.ctx.closest('svg').viewBox.baseVal.width;
    this.height = this.height / this.ctx.closest('svg').viewBox.baseVal.height;
  }
  
  domPoint(x, y) {
    return new DOMPoint(x, y).matrixTransform(
      this.ctx.getScreenCTM().inverse()
    );
  }
}

const domPoint = (element, x, y) => {
  return new DOMPoint(x, y).matrixTransform(
    element.getScreenCTM().inverse()
  );
};

const roundPoint = (p, dir = 'floor') => {
  return { x: dir === 'floor' ? Math.floor(p.x) : Math.ceil(p.x), y: dir === 'floor' ? Math.floor(p.y) : Math.ceil(p.y) };
};

const translateElement = (svg, el, point) => {
  const elTransforms = el.transform.baseVal;
  const translate = svg.createSVGTransform();
  
  elTransforms.clear();
  
  translate.setTranslate(point.x, point.y);
  elTransforms.appendItem(translate);
};

const drawRect = (p, s = 1, fill = 'black', className = 'tile', dataset) => {
  const rect = document.createElementNS(SVG_NS, 'rect');
  rect.classList.add(className);
  rect.width.baseVal.value = s;
  rect.height.baseVal.value = s;
  
  // rect.setAttribute('fill', fill)
  rect.dataset.x = p.x;
  rect.dataset.y = p.y;
  rect.dataset.selected = false;
  
  translateElement(canvas, rect, {
    x: p.x, // (p.x == 0 ? 0 : p.x + (p.x * 0.5)),
    y: p.y,
  });
  
  return rect;
};


const append = (...tiles) => {
  tileContainer.append(...tiles);
};

const renderTiles = (container, w = 5, h = 20) => {
  container.innerHTML = '';
  
  const tiles = [];
  
  for (let i = 0; i < h; i++) {
    for (let j = 0; j < w; j++) {
      const tile = drawRect({ x: j, y: i + 0.0 }, 1);
      
      tiles.push(tile);
    }
  }
  
  append(...tiles);
};

const getPointOnBoard = (contextEl = scene, e) => {
  const p = domPoint(scene, e.clientX, e.clientY);
  const adjustedPoint = roundPoint(p, 'floor');
  return adjustedPoint;
};

const getTileAtPoint = (contextEl = scene, e) => {
  const point = getPointOnBoard(contextEl, e);
  
  const targetTile = getTiles()
    .find((t, i) => {
      const unitTile = {
        x: t.x.baseVal.value,
        y: t.y.baseVal.value,
      };
      
      return +t.dataset.x == point.x && +t.dataset.y == point.y;
      return unitTile.x == point.x && unitTile.y == point.y;
      
      return !(
        point.y > unitTile.bottom ||
        point.x < unitTile.left ||
        point.y < unitTile.top ||
        point.x > unitTile.right
      );
    });
  
  return targetTile;
};

const getTileAtScenePoint = (e) => getTileAtPoint(scene, e);

const getTiles = () => [...document.querySelectorAll('.tile')];

const tileAt = (x, y) => State.tileContainer.querySelector(`.tile[data-y="${y}"][data-x="${x}"]`);

const initScene = (svg = new SVGSVGElement, scene = new SVGPathElement()) => {
  const sceneTransforms = scene.transform.baseVal;
  const translate = svg.createSVGTransform();
  sceneTransforms.clear();
  sceneTransforms.appendItem(translate);
  translate.setTranslate(-5, -10);
  surface.width.baseVal.value = 10;
  surface.height.baseVal.value = 20;
};

// const getRange = ({ start, end }) => {
//   const tileContainer = document.querySelector('#tile-container');
//   let range = [];

//   for (let x = start.x; x < end.x; x++) {
//     for (let y = start.y; y < end.y; y++) {
//       const tile = tileAt(x, y);

//       tile.dataset.selected = true;

//       range.push(tile);
//     }
//   }

//   return range;
// };
const getRange = ({ points, start, end }) => {
  const tileContainer = document.querySelector('#tile-container');
  let range = [];
  
  if (points) {
    points.forEach(({ x, y }) => {
      const tile = tileAt(x, y);
      
      tile.dataset.selected = true;
      
      range.push(tile);
    })
    
    return range
  }
  
  for (let x = start.x; x < end.x; x++) {
    for (let y = start.y; y < end.y; y++) {
      const tile = tileAt(x, y);
      
      tile.dataset.selected = true;
      
      range.push(tile);
    }
  }
  
  return range;
};

const handleTileClick = (e) => {
  const isPanelClick = e.target.classList.contains('content-container') || e.target.classList.contains('panel-content');
  
  if (isPanelClick) return;
  
  const currFocused = [...document.querySelectorAll('rect[data-focused="true"]')];
  const activePanel = document.querySelector('.panel');
  const selectedTiles = document.querySelectorAll('.tile[data-selected="true"]');
  
  selectedTiles.forEach((t, i) => {
    t.dataset.selected = false;
  });
  
  const tile = getTileAtScenePoint(e);
  
  // if (activePanel && currentPanel && currentPanel instanceof DetailPanel) {
  //   activePanel.remove();
  // }
  
  if (tile && tile.dataset.focused === 'true') {
    tile.dataset.focused = false;
  }
  
  else if (tile) {
    currFocused.forEach((t, i) => {
      t.dataset.focused = false;
    });
    
    tile.dataset.focused = true;
    selectionBox.insertAt({ x: +tile.dataset.x, y: +tile.dataset.y });
  }
};

const handleContextMenu = (e) => {
  const currFocused = [...document.querySelectorAll('rect[data-focused="true"]')][0];
  // const activePanel = document.querySelector('.panel');
  
  const tile = getTileAtScenePoint(e);
  
  // if (activePanel && currentPanel && currentPanel instanceof DetailPanel) {
  //   activePanel.remove();
  // }
  
  // else if (tile) {
  //   currentPanel = new DetailPanel(currFocused);
  
  //   currentPanel.appendTo(scene);
  // }
};

const canvas = document.querySelector('#svg');
const scene = document.querySelector('#scene');
const tileContainer = scene.querySelector('#tile-container');
const surface = scene.querySelector('#surface');
const viewBox = canvas.viewBox;


const selectionBox = new TileSelector(scene);

selectionBox.on('selection', ({ type, points, ...range }) => {
  
  
  const tileRange = getRange({ points, ...range });
  
  const currFocused = [...document.querySelectorAll('rect[data-focused="true"]')];
  
  currFocused.forEach((t, i) => {
    t.dataset.focused = false;
  });
  
  // tileRange[0].dataset.focused = true;
  
  State.selection = tileRange
});

let pixelScale;

canvas.style.width = window.innerWidth + 'px';
canvas.style.height = window.innerHeight + 'px';

const canvasBBox = canvas.getBoundingClientRect();
export const dispatchPointerEvent = (target, type, options = {}) => {
  target = target ?? document;
  // type = pointerEventSet.has(type) ? type : 'pointermove';
  
  options = Object.assign({
    view: window,
    bubbles: true,
    cancelable: true
  }, (options ?? {}));
  
  const ev = new PointerEvent(type, options);
  target.dispatchEvent(ev);
};
Object.assign(viewBox.baseVal, {
  x: -(5),
  y: -(10),
  width: (10),
  height: (20),
});

selectionBox.setBounds({
  minX: 0,
  minY: 0,
  maxX: 10,
  maxY: 20,
})

pixelScale = canvasBBox.width / viewBox.baseVal.width;
const unitBbox = new UnitBoundingBox(scene);

scene.append(selectionBox.dom);

canvas.addEventListener('click', (e = new PointerEvent('pointerdown')) => {
  if (e.metaKey) {
    console.log('metaKey NEWBS');
  }
  // e.stopPropagation();
  // e.preventDefault();
  selectionBox.insertAt({ x: +e.target.dataset.x, y: +e.target.dataset.y });
  
  if (!State.isSelecting) {
    handleTileClick(e);
  }
  
  State.isSelecting = false;
});

canvas.addEventListener('pointerdown', (e = new PointerEvent('pointerdown')) => {
  selectionBox.insertAt({ x: +e.target.dataset.x, y: +e.target.dataset.y });
  // dispatchPointerEvent(selectionBox.dom, 'pointerdown', { clientX: e.clientX, clientY: e.clientY })
  
  // if (!State.isSelecting) {
  //   handleTileClick(e);
  // }
  
  State.isSelecting = false;
});

document.addEventListener('keydown', e => {
  console.log(' [ KEY PRESS ]: ', e.metaKey);
});

// canvas.addEventListener('contextmenu', e => {
//   console.log(' [ CONTEXT MENU ]: ', e);
//   handleContextMenu(e);
// });

console.time('RENDER TILES');
renderTiles(tileContainer, 10, 20);
console.timeEnd('RENDER TILES');

initScene(canvas, scene);