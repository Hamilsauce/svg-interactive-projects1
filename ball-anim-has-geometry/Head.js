class Head extends Ball {
  constructor(config) {
    super(config)
    this.bodyCount = config.bodyCount
    this.segmentOffset = config.segmentOffset
    this.segmentType = config.segmentType
    this.color = "#D54949"
  }
  init(ent) {
    ent.data = {
      timer: 0,
      segments: []
    }
    super.init(ent)
  }
  createSegments(ent) {
    for (let i = 0; i < this.bodyCount; i++) {
      this.addSegment(ent, this.segmentType)
    }
  }
  segmentMove(ent) {
    //a bit jittery
    let seg = ent.data.segments
    // loop through each position
    for (let i = 0; i < seg.length; i++) {
      // get last and current position
      const last = seg[i - 1] ? seg[i - 1].position : ent.position
      const curr = seg[i].position;

      // get difference in x and y of each position
      const dx = curr.x - last.x;
      const dy = curr.y - last.y;

      // calculate the angle between the two parts of the snake
      let angle = Math.atan2(dy, dx);

      // get the new x and new y using polar coordinates
      const nx = this.segmentOffset * Math.cos(angle);
      const ny = this.segmentOffset * Math.sin(angle);
      // add the new x and new y to the last snake's position to "join" the two together without a gap
      curr.setPos(nx + last.x, ny + last.y)
    }
  }
  addSegment(ent, segmentType){
    let seg = ent.data.segments
    let lseg = seg[seg.length - 1] ? seg[seg.length - 1] : ent //check if last segment is defined
    let nseg = segmentType.create({});
    nseg.color = ((Math.random() * 10) > 5)? "#D54949" : "#4990D5" //random color
    nseg.setPosv(lseg.position)
    seg.push(nseg)
  }
  removeSegment(ent, index){
    let seg = ent.data.segments[index]
    if(seg) seg.remove();
  }
  update(ent) {
    /*if(ent.data.timer >= 60){
      this.addSegment(ent, this.segmentType)
      ent.data.timer = 0
    }*/
    
    let segments = ent.data.segments,
    filtered = segments.filter(seg => seg != null && !seg.removed)
    if(filtered.length != segments.length){
      ent.data.segments = filtered
      //check if segments are removed and remove it
    }
    
    this.segmentMove(ent)
    super.update(ent)
    ent.data.timer++
  }
  create(config) {
    let ent = createEnt(Object.assign({
      type: this
    }, config))
    this.createSegments(ent)
    return ent
  }
}