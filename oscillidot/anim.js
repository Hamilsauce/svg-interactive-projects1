import { dot } from './dot.js'

export const anim = {
  start: function(duration) {
    this.duration = duration;
    this.startTime = Date.now();
    let u = Math.min((Date.now() - this.startTime) / this.duration, 1);

    requestAnimationFrame(() => this.run(u));
  },

  run: function() {
    let u = Math.min((Date.now() - this.tZero) / this.duration, 1);
console.log('u', u)
    if (u < 1) {
      // Keep requesting frames, till animation is ready
      requestAnimationFrame(() => this.run());
    } else {
      this.onFinish();
    }

    dot.move(u);
  },

  onFinish: function() {
    this.start(this.duration)
  }
};