var gravity = 0.25;
var dX = 1.5;
var dY = 0;
var width = 412;
var height = 300;
var radius = 15;
var x = radius;
var y = radius;
var dragY = 0.035;
var dragX = 0.001;
var time = 0;

const app = document.querySelector('#app');
const ball = document.querySelector('#ball');
const surface = document.querySelector('#surface');
const debounceEl = document.querySelector('#debouncer');


const detectCollision = () => {
  if (x + radius + dX > width || x - radius + dX < 0) {
    dX = -dX;
  }
  
  if (y + radius + dY > height || y - radius + dY <= 0) {
    dY = -dY;
  }
};

const start = () => {
  const anim = window.setInterval(bounceBall, 24);
  return () => window.clearInterval(anim);
}

const updateBallPosition = () => {
  dY = dY > 0 ?
    dY -= dragY :
    dY += dragY;
  
  dX = dX > 0 ?
    dX -= dragX :
    dX += dragX;
};

const updateRadius = () => {
  radius = radius < 40 ?
    radius += 0.02 :
    radius
};

let debounceTracker = 0

function bounceBall() {
  var ball = document.getElementById('ball');
  debounceEl.textContent = debounceTracker

  updateRadius()
  detectCollision()
  
  x = x + dX;
  y = y + dY;
  dY += gravity;
  ball.setAttribute("r", radius);
  ball.setAttribute("cx", x);
  ball.setAttribute("cy", y);
  
  updateBallPosition()
  // time += 16;
  
  // if (time > 10000) {
  //   reset();
  // }
  
  if (debounceTracker >= 20) {
    printScreenCTM()
    debounceTracker = 0;
  } else debounceTracker++;
}

function ballHit() {
  alert("You Hit Me!");
  if (radius > 6) {
    radius -= 2;
  }
  
  animation()
  
  var ball = document.getElementById('ball');
  ball.setAttribute("r", radius);
  animation = reset();
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

var animation

const startAnimation = (target) => {
  if (!animation) {
    ball.addEventListener('click', ballHit);
    animation = start();
  }
};



surface.addEventListener('click', startAnimation);


const printScreenCTM = () => {
  // Get the current screen transformation matrix
  const screenCTM = ball.getScreenCTM();
  console.log("Screen transformation matrix:");
  console.warn(
    `a: ${screenCTM.a}, 
     b: ${screenCTM.b}, 
     c: ${screenCTM.c}, 
     d: ${screenCTM.d}, 
     e: ${screenCTM.e}, 
     f: ${screenCTM.f}`,
  );
};