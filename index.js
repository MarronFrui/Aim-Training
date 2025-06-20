import { spawnTarget } from "./gamemode/classicmode.js";
import { spawnFlickTarget } from "./gamemode/flickshotmode.js";
import { spawnTrackingTarget } from "./gamemode/trackingmode.js";
import { config } from "./config.js";

const menu = document.getElementById("menu");
const button = document.getElementById("StartButton");
const timer = document.getElementById("timer");
const container = document.getElementById("target-container");
const scoreDisplay = document.getElementById("score");
const maxScoreDisplay = document.getElementById("max-score");
const targetsPositions = [];
const highScores = {
  classic: 0,
  "flick shot": 0,
  tracking: 0,
};

let timerInterval = undefined;
let score = 0;
let timeLeft = null;

export function getTimeLeft() {
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
    // Animation on hit
    const hitEffect = document.createElement("div");
    hitEffect.className = "hit-effect";

    const rect = target.getBoundingClientRect();
    hitEffect.style.width = `${config.targetSize}px`;
    hitEffect.style.height = `${config.targetSize}px`;
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

function startGame() {
  const mode = document.querySelector('input[name="mode"]:checked').value;
  container.innerHTML = "";
  score = 0;
  targetsPositions.length = 0;
  updateScore();

  maxScoreDisplay.textContent = `High Score (${mode}) : ${highScores[mode]}`;

  if (mode === "classic") {
    for (let i = 0; i < 5; i++) {
      spawnTarget(container, targetsPositions, onTargetHit);
    }
  } else if (mode === "flick shot") {
    flickShotLoop();
  } else if (mode === "tracking") {
    spawnTrackingTarget(container, onTargetHit);
  }

  menuBehavior(mode);
}

button.addEventListener("click", () => {
  clearInterval(timerInterval);
  timeLeft = 20;
  updateTimer(timeLeft);
  startGame();
});
