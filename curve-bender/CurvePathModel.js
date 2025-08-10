import { VertexModel } from '../curve-bender/VertexModel.js';

export class CurvePathModel {
  #vertices = new Map();
  
  constructor(pointMap = new Map()) {
    [...pointMap].forEach(([id, [x, y]], i) => {
      this.#vertices.set(id, new VertexModel(x, y, id))
    });
  };
  
  get vertices() { return [...this.#vertices.values()] }
  
  getVertexById(id) {
    return this.#vertices.get(id);
  }
  
  toPathString(id) {
    return this.vertices.map((v, i) => {
      if (i === 0) {
        return `M ${v.toCoordinateString()}`
      } else if (i === 1) {
        return `Q ${v.toCoordinateString()}`
      }
      
      return v.toCoordinateString()
    }).join('\n');
  }
  
  updateVertex(id, { x, y }) {
    const v = this.getVertexById(id);
    v.update({x, y});
  }
}