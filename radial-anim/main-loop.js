let lastTm = 0;
let frameRateModifier = 1;
let time = 0;

const config = {
  lastTm: 0,
  frameRateModifier: 1,
  time: 0,
}

const updates = new Set();

const main = (timestamp) => {
  requestAnimationFrame(main);
  const delta = Math.round(timestamp - lastTm);

  if (delta % config.frameRateModifier === 0) {
    doUpdates(delta);
    lastTm = timestamp;
  }
};


const registerUpdates = (...updatefns) => {
  updatefns.forEach(fn => updates.add(fn));
}

const start = (frameRateModifier = 1) => {
  config.frameRateModifier = frameRateModifier;
  main(0);
}

const stop = (updatefn) => {
  return cancelAnimationFrame(main);
}

const doUpdates = (delta) => {
  updates.forEach((update) => update(delta));
}

export const mainLoop = {
  start,
  stop,
  registerUpdates,
}