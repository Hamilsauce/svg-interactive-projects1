export class HexShape {
  constructor(velocity=1){
    this.rotation = 0;
    this.shape;
    this.velocity;
    
  }
  
  init(shapeEl) {
    this.shape = shapeEl
  }

  move(u) {
    this.rotation += this.velocity
    this.shape.setAttribute('transform', `translate(0,-25) rotate(${this.rotation})`);
  }
}
