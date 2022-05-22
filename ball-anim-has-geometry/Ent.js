class Ent {
  constructor(config) {
    this.data = {} //for some not messy storage
    this.type = config.type
    this.position = new Vec(config.x, config.y)
    this.velocity = new Vec(config.velX, config.velY)
    this.removed = false
    this.init();
  }
  init() {
    this.type.init(this)
  }
  update() {
    this.velocity.scl(0.997, 0.997) //friction i guess
    this.position.addv(this.velocity)
    this.type.update(this)
  }
  accel(x, y) {
    this.velocity.add(x, y)
  }
  render(con) {
    this.type.render(this, con);
  }
  setPos(x, y) {
    this.position.setPos(x, y)
    return this
  }
  setPosv(v) {
    return this.setPos(v.x, v.y)
  }
  setVelv(v) {
    return this.setVel(v.x, v.y)
  }
  setVel(x, y) {
    this.velocity.setPos(x, y)
    return this
  }
  remove(){
    for(let j = 0; j < entities.length; j++){
      if(entities[j] && this){
        if(entities[j].id == this.id){
          this.removed = true
          entities.splice(j, 1)
        }
      }
    }
  }
}