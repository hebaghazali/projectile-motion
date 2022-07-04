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
let Y0 = canvas.height - (groundHeight + 2);
let X = X0;
let Y = Y0;
let T = 0;
let deltaX = 0;
let deltaY = 0;
let velocity = Number(velocityInput.value) || 0;
let angle = Number(angleInput.value) || 0;
const radius = 4;
const g = 9.8;

let v0X = velocity * Math.cos((angle * Math.PI) / 180);
let v0Y = velocity * Math.sin((angle * Math.PI) / 180);

// draw the ball on load
draw();

// display the distance on the screen
const distance = document.getElementById('distance');
updateDistanceText();

let requestID;
function init() {
  requestID = window.requestAnimationFrame(animationLoop);
}

function animationLoop() {
  update();
  draw();

  const ballIsOnLeft = X <= radius;
  const ballIsOnRight = X >= canvas.width - radius;
  const ballIsOnBottom = Y >= canvas.height - (groundHeight + radius);

  if (!ballIsOnLeft && !ballIsOnRight && !ballIsOnBottom) {
    requestID = window.requestAnimationFrame(animationLoop);
  } else {
    launchBtn.setAttribute('disabled', true);
  }
}

function update() {
  T += 0.18;

  v0X = velocity * Math.cos((angle * Math.PI) / 180);
  v0Y = velocity * Math.sin((angle * Math.PI) / 180);

  deltaX = v0X * T;
  deltaY = v0Y * T - 0.5 * g * Math.pow(T, 2);
  X = X0 + deltaX;
  Y = Y0 - deltaY;

  updateDistanceText();
}

function updateDistanceText() {
  distance.innerHTML = `
    <p><strong>X: </strong>${X.toFixed(2)}</p>
    <p><strong>Y: </strong>${Y.toFixed(2)}</p>
  `;
}

function draw() {
  ctx.beginPath();
  ctx.arc(X, Y, radius, 0, 2 * Math.PI);
  ctx.fillStyle = '#e73146';
  ctx.fill();
}

function reset(e) {
  if (ballIsTraveling()) return;

  if (e && e.target.id === 'reset') {
    launchBtn.removeAttribute('disabled');

    velocityInput.value = '';
    angleInput.value = '';

    X0 = 30;
    Y0 = canvas.height - (groundHeight + 2);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
  } else {
    X0 = X;
  }

  X = X0;
  Y = Y0;
  T = 0;

  v0X = velocity * Math.cos((angle * Math.PI) / 180);
  v0Y = velocity * Math.sin((angle * Math.PI) / 180);

  draw();
  updateDistanceText();
}

function launch() {
  if (ballIsTraveling()) return;

  velocity = Number(velocityInput.value) || 0;
  angle = Number(angleInput.value) || 0;
  reset();
  init();
}

launchBtn.addEventListener('click', launch);
resetBtn.addEventListener('click', reset);

function ballIsTraveling() {
  const yIsOnEdge = Y >= canvas.height - (groundHeight + radius);
  const xIsOnEdge = X >= canvas.width - radius || X <= radius;

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
