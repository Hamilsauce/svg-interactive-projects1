import { dataRecorder } from '../data-recorder.js';

export const _dot = {
  sprite: null,
  track: null,

  // Initialize the dot: connect sprite and track properties with supplied SVG elements
  init: function(sprite, track) {
    this.sprite = document.getElementById(sprite);
    this.track = document.getElementById(track);
  },

  // Put the dot on its spot
  walk: function(u) {
    const p = this.track.getPointAtLength(u * this.track.getTotalLength());
    this.sprite.setAttribute("transform", `translate(${p.x}, ${p.y})`);
  }
};

const round2 = (num) => Math.round((num + Number.EPSILON) * 100) / 100;

export const dot = {
  sprite: null,
  track: null,
  dir: 1,
  vel: 0.01,
  delta: 0,
  recordPointData: dataRecorder(),
  // Initialize the dot: connect sprite and track properties with supplied SVG elements
  init: function(sprite, track) {
    this.sprite = document.getElementById(sprite);
    this.track = document.getElementById(track);
  },

  chooseDir() {},
  move: function(u) {
    // let spot = (u * this.track.getTotalLength()) - this.track.getTotalLength() ;
    // console.log('this.dir', this.dir)
    let spot

    if (this.dir > 0) {
      spot = this.track.getTotalLength() - (u * this.track.getTotalLength())
    }
    else spot = (u * this.track.getTotalLength())

console.log('spot', spot)
    if (u >= 1) {
      this.dir = -this.dir
      console.warn('this.dir', this.dir)
    }

    // console.log('spot', spot)

    const p = this.track.getPointAtLength(spot);
    console.log('p', p)
    this.sprite.setAttribute("transform", `translate(${p.x}, ${p.y})`);
  },
  // move: function(u) {
  //   const tl = this.track.getTotalLength()
  //   let p = {}
  //   // const p = this.track.getPointAtLength(u * this.track.getTotalLength());
  //   this.delta += this.vel

  //   if (this.dir > 0) {
  //     //p = this.track.getPointAtLength(((this.delta) * this.track.getTotalLength()));
  //     p = this.track.getPointAtLength(((u) * this.track.getTotalLength()));
  //     // console.log(p);
  //   }
  //   else if (this.dir < 0) {
  //     // p = this.track.getPointAtLength(((this.delta) * this.track.getTotalLength()));
  //     p = this.track.getPointAtLength(((u * 1) * this.track.getTotalLength()));

  //     // p.x = this.track.getPointAtLength(this.track.getTotalLength() - ((this.delta) * this.track.getTotalLength()));
  //     // p.y = this.track.getPointAtLength(this.track.getTotalLength() - ((u) * this.track.getTotalLength()));

  //   }
  //   const currPoint1 = ((p.x + p.y) * this.dir);

  //   this.sprite.setAttribute("transform", `translate(${p.x*this.dir}, ${p.y*this.dir})`);

  //   this.recordPointData({
  //     trackLength: round2(tl),
  //     pointOnTrack: {
  //       x: round2(p.x),
  //       y: round2(p.y)
  //     },
  //     currPointInLength: round2(currPoint1),
  //   })


  //   if (this.audio) {
  //     this.audio.oscillator.frequency.value = 100 + p.y * 2
  //   }

  //   if (Math.abs(currPoint1 / 2) >= tl) {
  //     this.dir = -(this.dir)
  //     // this.dir = -this.dir
  //   }

  //   else this.dir = 1

  //   this.delta = currPoint1 // 0.01 * this.dir
  //   // console.log('this.delta', this.delta)


  //   return


  //   u = (u * (p.x - p.y)) * 100
  //   // console.log(tl);
  //   // let currPoint1 = (p.x + p.y) * 2
  //   let pathPoint = this.track.getPointAtLength(currPoint1)

  //   console.log('pathPoint', pathPoint)
  //   console.log((pathPoint.x + pathPoint.y) * 2);

  //   if (currPoint1 >= tl || currPoint1 === 0) {
  //     this.dir = -this.dir
  //     this.delta = 0.01
  //   }
  //   else {

  //   }
  //   this.sprite.setAttribute("transform", `translate(${ pathPoint.x }, ${ pathPoint.y})`);
  //   // this.sprite.setAttribute("transform", `translate(${ p.x }, ${ p.y})`);

  //   if (this.audio) {
  //     this.audio.oscillator.frequency.value = 100 + p.y * 2
  //   }



  // },
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