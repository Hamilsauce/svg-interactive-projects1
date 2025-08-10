/*
  Keeps a value that when invoked/receives event
  rapidly increments (over short time)
  to a max then slowly decrements
  
  at any time if invoked/event received will 
  increment from current value
*/


export class Accelerator {
  #min;
  #max;
  #step;
  #value;
  #velocity;
  #rate;
  #isAccelerating;
  
  constructor({ min = 1, max = 100, step = 1, velocity = 8 }) {
    this.#min = min > 0 ? min : 1;
    this.#max = max;
    this.#step = step;
    this.#value = min;
    this.#velocity = velocity;
    this.#rate = 50
    this.#isAccelerating = false
  };
  
  accelerate(duration = 5000, cb) {
    if (!this.#isAccelerating) {
      this.#isAccelerating = true
      
      const intervalId = setInterval(() => {
        if (cb) cb(this.#value)
        
        this.#value = this.#value + (this.#value * (this.#velocity / 100))
      }, this.#rate)
      
      setTimeout(() => {
        clearInterval(intervalId)
        
        this.#value = this.#min
        this.#isAccelerating = false;
      }, duration)
    }
  }
  
  printValue(targetEl, round = false) {
    targetEl.innerHTML = round ? Math.round(this.#value) : this.#value;
  }
  
  get min() { return this.#min };
  get max() { return this.#max };
  get step() { return this.#step };
  get value() { return this.#value };
}