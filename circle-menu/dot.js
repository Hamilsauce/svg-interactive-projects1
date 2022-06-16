export const dot = {
  sprite: null,
  track: null,
  dir: 1,
  vel: 0.01,
  delta: 0,
  // Initialize the dot: connect sprite and track properties with supplied SVG elements
  init: function(sprite, track) {
    this.sprite = document.getElementById(sprite);
    this.track = document.getElementById(track);
  },

  chooseDir() {},

  walk: function(u) {
    const tl = this.track.getTotalLength()
    let p;
    this.delta += this.vel
    if (this.dir > 0) {
      p = this.track.getPointAtLength(((this.delta) * this.track.getTotalLength()));
      // p = this.track.getPointAtLength(((u) * this.track.getTotalLength()));
      // console.log(p);
    } else if (this.dir < 0) {
      p = this.track.getPointAtLength(this.track.getTotalLength() - ((this.delta) * this.track.getTotalLength()));
      // p = this.track.getPointAtLength(this.track.getTotalLength() - ((u) * this.track.getTotalLength()));

    } else {


    }
    // u = (u * (p.x-p.y)) * 100
    // console.log(tl);
    let currPoint1 = (p.x + p.y) * 2
    let pAtLength = this.track.getPointAtLength(currPoint1)

    console.log('pAtLength', pAtLength)
    console.log((p.x + p.y) * 2);

    if (currPoint1 >= tl || currPoint1 === 0) {
      this.dir = -this.dir
      this.delta = 0.01
    } else{
      
    }
    this.sprite.setAttribute("transform", `translate(${ p.x }, ${ p.y})`);
    // this.sprite.setAttribute("transform", `translate(${ p.x }, ${ p.y})`);

    if (this.audio) {
      this.audio.oscillator.frequency.value = 100 + p.y * 2
    }



  },
  // walk2: function(u) {
  //   const tl = this.track.getTotalLength()
  //   let p;

  //   if (this.dir > 0) {
  //     p = this.track.getPointAtLength(((u) * this.track.getTotalLength()));
  //     // console.log(p);
  //   } else if (this.dir < 0) {
  //     p = this.track.getPointAtLength(this.track.getTotalLength() - ((u) * this.track.getTotalLength()));

  //   } else {


  //   }
  //   // u = (u * (p.x-p.y)) * 100
  //   // console.log(tl);
  //   let currPoint1 = (p.x + p.y) * 2
  //   let pAtLength = this.track.getPointAtLength(currPoint1)

  //   console.log('pAtLength', pAtLength)
  //   console.log((p.x + p.y) * 2);
  //   if (u >= 1) { this.dir = -this.dir }
  //   this.sprite.setAttribute("transform", `translate(${ p.x}, ${ p.y})`);

  //   if (this.audio) {
  //     this.audio.oscillator.frequency.value = 100 + p.y * 2
  //   }

  //   if (u >= 1) { this.dir = -this.dir }
  //   this.sprite.setAttribute("transform", `translate(${ p.x}, ${ p.y})`);

  //   if (this.audio) {
  //     this.audio.oscillator.frequency.value = 100 + p.y * 2
  //   }


  // },
  walkBack: function(u) {
    const backu = 1 - u;
    const p = this.track.getPointAtLength(backu * this.track.getTotalLength());
    this.sprite.setAttribute("transform", `translate(${p.x}, ${p.y})`);
  }
};