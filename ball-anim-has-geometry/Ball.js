class Ball {
  constructor(config) {
    this.radius = config.radius || 5
    this.color = "#4990D5"
  }
  init(ent) {
    ent.color = this.color
  }
  update(ent) {
    //empty
  }
  render(ent, con) {
    con.fillStyle = ent.color
    con.beginPath();
    con.arc(ent.position.x, ent.position.y, this.radius, 0, Math.PI * 2);
    con.fill();
  }
  create(config) {
    return createEnt(Object.assign({
      type: this
    }, config))
  }
}