const canvas = document.getElementById('canvas');
const velocityInput = document.getElementById('velocity');
const angleInput = document.getElementById('angle');
const canvasBox = document.querySelector('.box');

const launchBtn = document.getElementById('launch');
const resetBtn = document.getElementById('reset');

const ctx = canvas.getContext('2d');
canvas.width = canvasBox.offsetWidth;
canvas.height = canvasBox.offsetHeight;

const X0 = 30;
const Y0 = canvas.height - 50;
let X = X0;
let Y = Y0;
let T = 0;
let velocity = Number(velocityInput.value) || 0;
let angle = Number(angleInput.value) || 0;
const radius = 15;
const g = 9.8;

let v0X = velocity * Math.cos((angle * Math.PI) / 180);
let v0Y = velocity * Math.sin((angle * Math.PI) / 180);

function init() {
  window.requestAnimationFrame(animationLoop);
}

function animationLoop() {
  update();
  draw();
  const yIsNotOnEdge = Y < canvas.height - (radius + 35);
  const xIsNotOnEdge = X < canvas.width - (radius + 2);

  if (yIsNotOnEdge && xIsNotOnEdge) window.requestAnimationFrame(animationLoop);
  else {
    window.cancelAnimationFrame(animationLoop);

    if (Math.round(X) !== X0) launchBtn.setAttribute('disabled', true);
  }
}

function update() {
  T += 0.15;

  const deltaX = v0X * T;
  const deltaY = v0Y * T - 0.5 * g * Math.pow(T, 2);
  X = X0 + deltaX;
  Y = Y0 - deltaY;
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  ctx.arc(X, Y, radius, 0, 2 * Math.PI);
  ctx.fillStyle = '#e73146';
  ctx.fill();
}

function reset(e) {
  const yIsNotOnEdge = Y < canvas.height - (radius + 35);
  const xIsNotOnEdge = X < canvas.width - (radius + 2);
  if (yIsNotOnEdge && xIsNotOnEdge) return;

  X = 30;
  Y = canvas.height - 50;
  T = 0;

  v0X = velocity * Math.cos((angle * Math.PI) / 180);
  v0Y = velocity * Math.sin((angle * Math.PI) / 180);

  draw();

  if (e && e.target.id === 'reset') {
    launchBtn.removeAttribute('disabled');
  }
}

function launch() {
  const yIsNotOnEdge = Y < canvas.height - (radius + 35);
  const xIsNotOnEdge = X < canvas.width - (radius + 2);
  if (yIsNotOnEdge && xIsNotOnEdge) return;

  if (Math.round(X) !== X0) {
    return;
  }

  velocity = Number(velocityInput.value) || 0;
  angle = Number(angleInput.value) || 0;

  reset();
  init();
}

draw();

launchBtn.addEventListener('click', launch);
resetBtn.addEventListener('click', reset);
