import { dot } from './dot.js'

export const anim = {
  start: function(duration) {
    this.duration = duration;
    this.startTime = Date.now();
 let u = Math.min((Date.now() - this.startTime) / this.duration, 1);

    requestAnimationFrame(() => this.run(u));
  },

  run: function() {
    // let u = 10000
    // / this.duration //), 1000);
    // Math.min(
    // let u = Math.min((Date.now() - this.startTime) / this.duration, 1);
    // let u = Math.min((Date.now() - this.startTime) / this.duration, 1000);
      // requestAnimationFrame(() => this.run());
 let u = Math.min((Date.now() - this.startTime) / this.duration, 1);
       
    if (u < 1) {
      // Keep requesting frames, till animation is ready
      requestAnimationFrame(() => this.run(u));
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
