import { spawnTarget } from "./gamemode/classicmode.js";
import { spawnFlickTarget } from "./gamemode/flickshotmode.js";
import { spawnTrackingTarget } from "./gamemode/trackingmode.js";
import { diameter } from "./config.js";
import { isTargetBeingHeld } from "./gamemode/trackingmode.js";

const menu = document.getElementById("menu");
const button = document.getElementById("StartButton");
const timer = document.getElementById("timer");
const container = document.getElementById("target-container");
const scoreDisplay = document.getElementById("score");
const maxScoreDisplay = document.getElementById("max-score");
const accuracyDisplay = document.getElementById("accuracy");
const targetsPositions = [];
const highScores = {
  classic: 0,
  "flick shot": 0,
  tracking: 0,
};

let timerInterval = undefined;
let score = 0;
let timeLeft = null;
let trackingInterval = null;

let shotFired = 0;
let hit = 0;
let wasHit = false;
let ignoreNextClick = true;
function getTimeLeft() {
  return timeLeft;
}

function updateTimer(seconds) {
  const min = Math.floor(seconds / 60);
  const s = seconds % 60;
  timer.textContent = `${min}:${s < 10 ? "0" : ""}${s}`;
}

function updateScore() {
  scoreDisplay.textContent = `Score : ${score}`;
}

function onTargetHit(target, mode = "classic") {
  if (mode !== "tracking") {
    const hitEffect = document.createElement("div");
    hitEffect.className = "hit-effect";

    const rect = target.getBoundingClientRect();
    hitEffect.style.width = `${diameter.targetSize}px`;
    hitEffect.style.height = `${diameter.targetSize}px`;
    hitEffect.style.left = `${rect.left}px`;
    hitEffect.style.top = `${rect.top}px`;

    document.body.appendChild(hitEffect);
    setTimeout(() => document.body.removeChild(hitEffect), 300);
  }
  score++;
  updateScore();
}

async function flickShotLoop() {
  while (timeLeft > 0) {
    spawnFlickTarget(container, onTargetHit);
    await new Promise((resolve) => setTimeout(resolve, 700));
  }
}

function menuBehavior(mode) {
  button.style.display = "none";
  menu.style.display = "none";
  scoreDisplay.style.display = "block";
  accuracyDisplay.style.display = "block";

  timerInterval = setInterval(() => {
    timeLeft--;
    updateTimer(timeLeft);

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      timer.textContent = "";
      container.innerHTML = "";
      button.style.display = "block";
      menu.style.display = "flex";
      scoreDisplay.style.display = "none";
      accuracyDisplay.style.display = "none";

      if (score > highScores[mode]) {
        highScores[mode] = score;
      }

      maxScoreDisplay.textContent = `High Score (${mode}) : ${highScores[mode]}`;
      scoreDisplay.textContent = `Score : 0`;
      score = 0;
      updateScore();
    }
  }, 1000);
}

function handleAccuracy() {
  const mode = document.querySelector('input[name="mode"]:checked').value;

  shotFired = 0;
  hit = 0;
  ignoreNextClick = true;

  let mouseDown = false; // Handle interval

  const onMouseDown = () => {
    if (mouseDown) return;
    mouseDown = true;
  };

  const onMouseUp = () => {
    mouseDown = false;
    clearInterval(trackingInterval);
    trackingInterval = null;
  };

  const accuracyClick = (event) => {
    if (ignoreNextClick) {
      ignoreNextClick = false;
      return;
    }

    const target = event.target;
    const isHit = target.classList.contains("target");

    shotFired++;
    if (isHit) hit++;

    const accuracyValue = shotFired > 0 ? (hit / shotFired) * 100 : 0;
    accuracyDisplay.textContent = `Accuracy : ${accuracyValue.toFixed(2)}%`;

    if (getTimeLeft() <= 0) {
      document.removeEventListener("click", accuracyClick);
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("mouseup", onMouseUp);
    }
  };

  function accuracyTick(isTargetBeingHeld) {
    console.log("isHeld", isTargetBeingHeld);

    do {
      if (isTargetBeingHeld) {
        tick();
      }
    } while (getTimeLeft > 0);
  }
  const tick = (event) => {
    if (ignoreNextClick) {
      ignoreNextClick = false;
      return;
    }

    let accuracyValue = 0;
    trackingInterval = setInterval(() => {
      shotFired++;
      if (isTargetBeingHeld()) hit++;
      accuracyValue = shotFired > 0 ? (hit / shotFired) * 100 : 0;
      accuracyDisplay.textContent = `Accuracy : ${accuracyValue.toFixed(2)}%`;
    }, 50);

    if (getTimeLeft() <= 0) {
      document.removeEventListener("mousedown", tick);
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("mouseup", onMouseUp);
    }
    console.log("acc", accuracyValue);
    console.log("total", shotFired);
    console.log("hit", hit);
  };

  if (mode === "tracking") {
    document.addEventListener("mousedown", accuracyTick);
    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("mouseup", onMouseUp);
  } else {
    document.addEventListener("click", accuracyClick);
  }
}

function startGame() {
  const mode = document.querySelector('input[name="mode"]:checked').value;
  container.innerHTML = "";
  score = 0;

  updateScore();

  maxScoreDisplay.textContent = `High Score (${mode}) : ${highScores[mode]}`;

  if (mode === "classic") {
    for (let i = 0; i < 5; i++) {
      spawnTarget(container, targetsPositions, onTargetHit);
    }
  } else if (mode === "flick shot") {
    flickShotLoop();
  } else if (mode === "tracking") {
    spawnTrackingTarget(container, onTargetHit, getTimeLeft);
  }

  menuBehavior(mode);
}

button.addEventListener("click", () => {
  clearInterval(timerInterval);
  timeLeft = 10;
  updateTimer(timeLeft);
  handleAccuracy();
  startGame();
});
