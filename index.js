import { spawnTarget } from "./gamemode/classicmode.js";
import { spawnFlickTarget } from "./gamemode/flickshotmode.js";
import { spawnTrackingTarget } from "./gamemode/trackingmode.js";

const menu = document.getElementById("menu");
const button = document.getElementById("StartButton");
const timer = document.getElementById("timer");
const container = document.getElementById("target-container");
const scoreDisplay = document.getElementById("score");
const maxScoreDisplay = document.getElementById("max-score");
const targetsPositions = [];

let timerInterval;
let score = 0;
let maxScore = 0;
let timeLeft = 5;

export function getTimeLeft() {
  return timeLeft;
}

button.addEventListener("click", () => {
  clearInterval(timerInterval);
  timeLeft = 5;
  updateTimer(timeLeft);
  startGame();
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

      if (score > maxScore) {
        maxScore = score;
        maxScoreDisplay.textContent = `High Score : ${maxScore}`;
      }

      scoreDisplay.textContent = `Score : 0`;
      score = 0;
      updateScore();
    }
  }, 1000);
});

function updateTimer(seconds) {
  const min = Math.floor(seconds / 60);
  const s = seconds % 60;
  timer.textContent = `${min}:${s < 10 ? "0" : ""}${s}`;
}

function updateScore() {
  scoreDisplay.textContent = `Score : ${score}`;
  if (score > maxScore) {
    maxScore = score;
    maxScoreDisplay.textContent = `High Score : ${maxScore}`;
  }
}

function onTargetHit() {
  score++;
  updateScore();
}

// Boucle asynchrone qui créer les cibles FlickShot tant que le temps n'est pas écoulé
async function flickShotLoop() {
  while (timeLeft > 0) {
    spawnFlickTarget(container, onTargetHit);
    await new Promise((resolve) => setTimeout(resolve, 700));
  }
}

function startGame() {
  const mode = document.querySelector('input[name="mode"]:checked').value;
  container.innerHTML = "";
  score = 0;
  targetsPositions.length = 0;
  updateScore();

  if (mode === "classic") {
    for (let i = 0; i < 5; i++) {
      spawnTarget(container, targetsPositions, onTargetHit);
    }
  } else if (mode === "flick shot") {
    flickShotLoop();
  } else if (mode === "tracking") {
    spawnTrackingTarget(container, onTargetHit);
  }
}
