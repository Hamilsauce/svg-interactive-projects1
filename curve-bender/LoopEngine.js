export class LoopEngine {
  #frameId = null
  constructor({ routines = [], state = {}, render }) {
    this.state = state;
    this.routines = new Set(routines);
    this.render = render;
    this.loop = this.init();
    this.running = false;
    this.frameThrottle = null;
  }
  
  throttleFrame(delta) {
    return this.frameThrottle ?
      (delta % this.frameThrottle) == 2 :
      true;
  }
  
  init() {
    let lastTime = performance.now();
    let routines = this.routines
    const state = this.state;
    
    function* loop() {
      // routines = [...this.routines]
      
      while (true) {
        const now = yield { ...state };
        const dt = (now - lastTime) / 1000;
        lastTime = now;
        
        for (const routine of routines) {
          // routine(state, dt);
          routine(dt);
          // console.log('routines count', routines.size) 
        }
      }
    }
    
    const generator = loop();
    generator.next(); // prime
    
    return generator;
  }
  
  start(frameThrottle) {
    this.frameThrottle = frameThrottle ?? this.frameThrottle
    
    this.running = true;
    
    const frame = (time) => {
      
      if (!this.running) return;
      
      if (this.throttleFrame(time)) {
        const { value } = this.loop.next(time);
        this.render(value);
        this.#frameId = requestAnimationFrame(frame);
      }
      
      // const { value } = this.loop.next(time);
      // this.render(value);
      // this.#frameId = requestAnimationFrame(frame);
    };
    
    this.#frameId = requestAnimationFrame(frame);
  }
  
  pause() {
    this.running = false;
  }
  
  stop() {
    this.running = false;
    cancelAnimationFrame(this.#frameId)
    this.#frameId = null;
  }
  
  addRoutine(routine) {
    this.routines.add(routine)
  }
}