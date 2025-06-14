let lastTime = 0;

let x = 0;
const speed = 100;

const updateHandlers = []

function gameLoop(timestamp) {
  const deltaTime = timestamp - lastTime;
  lastTime = timestamp;
  
  update(deltaTime); // Update game state based on time passed
  render(); // Draw the game
  
  requestAnimationFrame(gameLoop); // Request next frame
}



function update(deltaTime) {
  x += speed * (deltaTime / 1000); // Convert ms to seconds
  
  updateHandlers.forEach((cb, i) => {
    cb(x)
  });
}


function render() {
  // Draw on canvas, update UI, etc.
}

// Start the loop

export const startLoop = () => {
  const animId = requestAnimationFrame(gameLoop);
  
  return () => cancelAnimationFrame(animId)
};

export const addUpdateHandler = (...fn) => {
  updateHandlers.push(...fn)
  // return () => updateHandlers.filter(_ => _ !== fn)
};

export default {
  start: startLoop,
  addUpdateHandler,
}