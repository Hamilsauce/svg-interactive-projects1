import { dot } from './dot.js'

export const anim = {
  start: function(duration) {
    this.duration = duration;
    this.startTime = Date.now();

    requestAnimationFrame(() => this.run());
  },

  run: function() {
    // let u = 10000
    // / this.duration //), 1000);
    // Math.min(
    // let u = 1000/60//Math.min((Date.now() - this.startTime) / this.duration, 1000);
    let u = Math.min((Date.now() - this.startTime) / this.duration, 1000);
      // requestAnimationFrame(() => this.run());

    if (u < 1) {
      // Keep requesting frames, till animation is ready
      requestAnimationFrame(() => this.run());
    } else {
      this.onFinish();
    }

    dot.walk(u);
  },

  onFinish: function() {
    // Schedule the animation to restart
    setTimeout(() => this.start(this.duration), 0);
  }
};
