const detectCollision = () => {
  if (x + radius + dX > width || x - radius + dX < 0) {
    dX = -dX;
  }

  if (y + radius + dY > height || y - radius + dY <= 0) {
    dY = -dY;
  }
};

const updateBallPosition = () => {
  dY = dY > 0 ? dY -= dragY : dY += dragY;
  dX = dX > 0 ? dX -= dragX : dX += dragX;
};





const updates = [];

const doUpdates = () => {
  updates .forEach((update, i) => {
    update()
    
  });
  dY = dY > 0 ? dY -= dragY : dY += dragY;
  dX = dX > 0 ? dX -= dragX : dX += dragX;
};

function run() {
  doUpdates()
  render()
  var ball = document.getElementById('ball');
  detectCollision()
  // console.log({dX,dY});
  // ball.cx.baseVal.value = ball.cx.baseVal.value + dX;
  x = x + dX;
  y = y + dY;
  dY += gravity;
  ball.setAttribute("cx", x);
  ball.setAttribute("cy", y);

  updateBallPosition()
  // time += 16;

  // if (time > 10000) {
  //   reset();
  // }
}


const start = () => {
  const anim = window.setInterval(bounceBall, 16);
  return () => window.clearInterval(anim);
}


function bounceBall() {
  var ball = document.getElementById('ball');
  detectCollision()
  // console.log({dX,dY});
  // ball.cx.baseVal.value = ball.cx.baseVal.value + dX;
  x = x + dX;
  y = y + dY;
  dY += gravity;
  ball.setAttribute("cx", x);
  ball.setAttribute("cy", y);

  updateBallPosition()
  // time += 16;

  // if (time > 10000) {
  //   reset();
  // }
}

function reset() {
  // dX = 1.5;
  // dY = 0;
  // x = radius;
  // y = radius;
  time = 0;

  // ball.setAttribute("cx", x);
  // ball.setAttribute("cy", y);
  return start()
}

let animation;

const startAnimation = (target) => {
  if (!animation) {
    animation = start();
  }
};

const addUpdate = (fn) => {
  if (!animation) {
    animation = start();
  }
};


const app = document.querySelector('#app');
const ball = document.querySelector('#ball');
const surface = document.querySelector('#surface');

surface.addEventListener('click', startAnimation);
