export const dot = {
  sprite: null,
  track: null,
  dir: -1,

  init: function(sprite, track) {
    this.sprite = document.getElementById(sprite);
    this.track = document.getElementById(track);
  },

  move: function(u) {
    let spot;

    if (this.dir > 0) {
      spot = this.track.getTotalLength() - (u * this.track.getTotalLength());
    }

    else spot = (u * this.track.getTotalLength());

    if (u >= 1) {
      this.dir = -this.dir;
      console.warn('this.dir', this.dir);
    }

    const p = this.track.getPointAtLength(spot);


    this.sprite.setAttribute("transform", `translate(${p.x}, ${p.y})`);

    if (this.audio) {
      this.audio.oscillator.frequency.value = 100 + p.y * 2;
    }
  },
};


export const anim = {
  start: function(duration) {
    this.duration = duration;
    this.tZero = Date.now();

    requestAnimationFrame(() => this.run());
  },

  run: function() {
    let u = Math.min((Date.now() - this.tZero) / this.duration, 1);

    if (u < 1) {
      requestAnimationFrame(() => this.run());
    } else {
      this.onFinish();
    }

    dot.move(u);
  },

  onFinish: function() {
    this.start(this.duration);
  }
};


// window.onload = () => {
//   dot.init('dot', 'curve');
//   anim.start(2000);
// }