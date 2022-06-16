import { dot } from './dot.js'

export const anim = {
  start: function(duration, shape) {
    this.duration = duration;
    this.tZero = Date.now();

    requestAnimationFrame(() => this.run(shape));
  },

  run: function(shape) {
    let u = Math.min((Date.now() - this.tZero) / this.duration, 1);

    if (u < 2) {
      requestAnimationFrame(() => this.run(shape));
    } else {
      this.onFinish();
    }

    shape.move(u);
  },

  onFinish: function() {
    setTimeout(() => this.start(this.duration), 1000);
  }
}
