const canvas = document.getElementById('canvas');
const velocityInput = document.getElementById('velocity');
const angleInput = document.getElementById('angle');
const canvasBox = document.querySelector('.box');

const launchBtn = document.getElementById('launch');
const resetBtn = document.getElementById('reset');

const ctx = canvas.getContext('2d');
canvas.width = canvasBox.offsetWidth;
canvas.height = canvasBox.offsetHeight;

const groundHeight = 50;

let X0 = 30;
let Y0 = canvas.height - groundHeight;
let X = X0;
let Y = Y0;
let T = 0;
let deltaX = 0;
let deltaY = 0;
let velocity = Number(velocityInput.value) || 70;
let angle = Number(angleInput.value) || 70;
const radius = 15;
const g = 9.8;

let v0X = velocity * Math.cos((angle * Math.PI) / 180);
let v0Y = velocity * Math.sin((angle * Math.PI) / 180);

// draw the object on load
draw();

// display the distance on the screen
const distance = document.getElementById('distance');
updateDistanceText();

function init() {
  window.requestAnimationFrame(animationLoop);
}

function animationLoop() {
  update();
  draw();

  const xIsOnEdge = X >= canvas.width - radius || X <= radius;

  if (objectIsMoving(X, Y)) window.requestAnimationFrame(animationLoop);
  else {
    if (xIsOnEdge) launchBtn.setAttribute('disabled', true);
    else {
      // Move the object to its initial Y value if it doesn't touch the final X value
      Y += deltaY;
      draw();
    }
  }
}

function update() {
  T += 0.16;

  deltaX = v0X * T;
  deltaY = v0Y * T - 0.5 * g * Math.pow(T, 2);
  X = X0 + deltaX;
  Y = Y0 - deltaY;

  updateDistanceText();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  ctx.arc(X, Y, radius, 0, 2 * Math.PI);
  ctx.fillStyle = '#e73146';
  ctx.fill();
}

function updateDistanceText() {
  distance.innerHTML = `
    <p style="font-weight: bold">x: ${X}</p>
    <p style="font-weight: bold">y: ${Y}</p>
  `;
}

function reset(e) {
  if (objectIsMoving(X, Y)) return;

  if (e && e.target.id === 'reset') {
    launchBtn.removeAttribute('disabled');
    X0 = 30;
  } else {
    X0 = X;
  }

  X = X0;
  Y = canvas.height - groundHeight;
  T = 0;

  v0X = velocity * Math.cos((angle * Math.PI) / 180);
  v0Y = velocity * Math.sin((angle * Math.PI) / 180);

  draw();
  updateDistanceText();
}

function launch() {
  console.log(Y);

  if (objectIsMoving(X, Y)) return;

  velocity = Number(velocityInput.value) || 70;
  angle = Number(angleInput.value) || 70;
  reset();
  init();
}

launchBtn.addEventListener('click', launch);
resetBtn.addEventListener('click', reset);

function objectIsMoving(x, y) {
  const yIsOnEdge = y >= canvas.height - groundHeight;
  const xIsOnEdge = x >= canvas.width - radius || X <= radius;

  return !yIsOnEdge && !xIsOnEdge;
}

/////////////////////////////////////////////////////////

// Input validation

function validateInput(input, maxNum) {
  return function () {
    if (input.value < 0) input.value = 0;
    if (input.value > maxNum) input.value = maxNum;
  };
}

velocityInput.addEventListener('change', validateInput(velocityInput, 100));
angleInput.addEventListener('change', validateInput(angleInput, 180));
