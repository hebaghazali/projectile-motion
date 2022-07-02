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
let velocity = Number(velocityInput.value) || 0;
let angle = Number(angleInput.value) || 0;
const radius = 15;
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
  const ballIsOnBottom = Y >= canvas.height - groundHeight;
  const ballIsOnTop = Y <= radius + 2;

  if (!ballIsOnLeft && !ballIsOnRight) {
    requestID = window.requestAnimationFrame(animationLoop);
    if (ballIsOnTop) {
      T = 0;
      X0 = X;
      Y0 = Y;

      angle = -angle;
      velocity *= 0.45;
    } else if (ballIsOnBottom) {
      T = 0;
      X0 = X;
      Y0 = Y;

      if (angle < 0) {
        angle = -angle;
        velocity *= 1 / 0.45;
      }

      velocity *= 0.8;
    }
  } else {
    launchBtn.setAttribute('disabled', true);
  }

  if (Math.floor(velocity) === 0) {
    window.cancelAnimationFrame(requestID);
  }
}

function update() {
  T += 0.15;

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
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  ctx.arc(X, Y, radius, 0, 2 * Math.PI);
  ctx.fillStyle = '#e73146';
  ctx.fill();
}

function reset(e) {
  if (ballIsMoving(X, Y)) return;

  if (e && e.target.id === 'reset') {
    launchBtn.removeAttribute('disabled');

    velocityInput.value = '';
    angleInput.value = '';

    X0 = 30;
    Y0 = canvas.height - groundHeight;
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
  if (ballIsMoving(X, Y)) return;

  velocity = Number(velocityInput.value) || 0;
  angle = Number(angleInput.value) || 0;
  reset();
  init();
}

launchBtn.addEventListener('click', launch);
resetBtn.addEventListener('click', reset);

function ballIsMoving(x, y) {
  const yIsOnEdge = y >= canvas.height - (groundHeight + 0.1);
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
