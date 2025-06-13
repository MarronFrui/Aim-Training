import { spawnTarget } from "./gamemode/classicmode.js";
import * as flickshotmode from "./gamemode/flickshotmode.js";
import { spawnTrackingTarget } from "./gamemode/trackingmode.js";

const menu = document.getElementById("menu");
const button = document.getElementById("StartButton");
const timer = document.getElementById("timer");
const container = document.getElementById("target-container");
const scoreDisplay = document.getElementById("score");
const maxScoreDisplay = document.getElementById("max-score");
const targetsPositions = [];

let gameTime;
let score = 0;
let maxScore = 0;
let timeLeft = 60;

function getTimeLeft() {
  return timeLeft;
}

button.addEventListener("click", () => {
  clearInterval(gameTime);
  let timeLeft = 60;
  updateTimer(timeLeft);
  startGame();
  button.style.display = "none";
  menu.style.display = "none";
  scoreDisplay.style.display = "block";

  gameTime = setInterval(() => {
    timeLeft--;
    updateTimer(timeLeft);
    if (timeLeft <= 0) {
      clearInterval(gameTime);
      flickshotmode.stopFlickTargets();
      timer.textContent = "";
      container.innerHTML = "";
      button.style.display = "block";
      menu.style.display = "flex";
      scoreDisplay.style.display = "none";
      targetsPositions.length = 0;

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
    flickshotmode.spawnFlickTarget(container, onTargetHit, getTimeLeft);
  } else if (mode === "tracking") {
    spawnTrackingTarget(container, onTargetHit);
  }
}
