export class VertexModel {
  #x = null;
  #y = null;
  #id = null;
  
  constructor(x, y, id) {
    
    this.#id = id;
    this.#x = x;
    this.#y = y;
  };
  
  get id() { return this.#id };
  
  get x() { return this.#x };
  
  get y() { return this.#y };
  
  get point() { return { x: this.x, y: this.y } }
  
  toCoordinateString() { return `${this.x},${this.y}` }
  
  update({ x, y }) {
    this.#x = x ?? this.#x;
    this.#y = y ?? this.#y;
  }
}