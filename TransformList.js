/*
  THIS IS LATEST VERSION OF TRANSFORMLIST
*/

// import ham from 'ham';
// const { template, utils, download } = ham;
export const roundTwo = (num) => Math.round((num + Number.EPSILON) * 100) / 100

const TransformIndexMap = {
  translate: 0,
  rotate: 1,
  scale: 2,
};

const TransformListOptions = {
  transforms: Array,
}

const TransformMatrixMap = {
  e: 'tx',
  f: 'ty',
}

export const DEFAULT_TRANSFORMS = [{
  type: 'translate',
  values: [0, 0],
  position: 0,
},
{
  type: 'rotate',
  values: [0, 0.0, 0.0],
  position: 1,
},
{
  type: 'scale',
  values: [1, 1],
  position: 2,
}];

export const DEFAULT_TRANSFORM_MAP = DEFAULT_TRANSFORMS
  .reduce((acc, curr, i) => {
    return { ...acc, [curr.type]: curr }
  }, {});

const transformTypeMap = new Map([
  ['translate', SVGTransform.SVG_TRANSFORM_TRANSLATE],
  ['rotate', SVGTransform.SVG_TRANSFORM_ROTATE],
  ['scale', SVGTransform.SVG_TRANSFORM_SCALE],
])

export class TransformList {
  #self = null;
  #canvas = null;
  #transforms = null;
  #rotation = { deg: 0, x: 0, y: 0 };
  
  constructor(svgCanvas, element, transforms = DEFAULT_TRANSFORMS) {
    this.#canvas = svgCanvas;
    this.#self = (element.dom ?? element).transform.baseVal;
    this.init(transforms);
  };
  
  init(transforms = []) {
    transforms.forEach(({ type, values }, i) => {
      if (type?.toLowerCase() === 'rotate') {
        const [deg = 0, x = 0, y = 0] = values || [];
        this.#rotation = { deg, x, y };
      }
      
      const t = this.createTransform(type, ...(values || []))
      
      if (i === 0) {
        this.#self.initialize(t);
      }
      else {
        this.insert(t);
      }
    });
  }
  
  getMatrixAt(index = 0) {
    const { a, b, c, d, e, f } = index < this.#self.numberOfItems ? this.#self.getItem(index).matrix : null;
    
    return [a, b, c, d, e, f].some(_ => isNaN(_)) ? null : { a, b, c, d, e, f, }
  }
  
  createTransform(typeName, ...values) {
    typeName = typeName.toLowerCase();
    
    const t = (this.#canvas.dom ?? this.#canvas).createSVGTransform();
    
    switch (typeName) {
      case 'translate': {
        t.setTranslate(...values);
        break;
      }
      case 'rotate': {
        t.setRotate(...values);
        break;
      }
      case 'scale': {
        t.setScale(...values);
        break;
      }
      default: {}
    }
    
    return t;
  }
  
  consolidate() {
    return this.#self.consolidate();
  }
  
  translateTo(x = 0, y = 0) {
    const translate = this.getItem(TransformIndexMap.translate);
    
    translate.setTranslate(x, y);
    
    return this;
  }
  
  rotateTo(deg = 0, x = 0, y = 0) {
    const rotate = this.getItem(TransformIndexMap.rotate);
    this.#rotation = { deg, x, y };
    rotate.setRotate(deg, x, y);
    
    return this;
  }
  
  scaleTo(x = 1, y) {
    const scale = this.getItem(TransformIndexMap.scale);
    if (y) {
      scale.setScale(x, y);
    } else {
      scale.setScale(x, x);
    }
    
    return this;
  }
  
  insert(transform, beforeIndex) {
    if (!beforeIndex) {
      this.#self.appendItem(transform)
    } else {
      this.#self.insertItemBefore(transform, beforeIndex)
    }
    
    return this;
  }
  
  getItem(index) {
    return this.#self.getItem(index)
  }
  
  get transforms() {
    return {
      translate: this.getItem(TransformIndexMap.translate),
      rotate: this.getItem(TransformIndexMap.rotate),
      scale: this.getItem(TransformIndexMap.scale),
    }
  }
  
  get transformItems() { return [...this.#self] };
  
  get translation() {
    const { e, f } = this.getMatrixAt(TransformIndexMap.translate)
    
    return { x: roundTwo(e), y: roundTwo(f) }
  }
  
  get rotation() {
    return {
      deg: roundTwo(this.#rotation.deg),
      x: roundTwo(this.#rotation.x),
      y: roundTwo(this.#rotation.y),
    }
  }
  
  get scale() {
    const { a, d } = this.getMatrixAt(TransformIndexMap.scale)
    
    return { x: roundTwo(a), y: roundTwo(d) }
  }
}