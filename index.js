import { spawnTarget } from "./gamemode/classicmode.js";

const menu = document.getElementById("menu");
const button = document.getElementById("StartButton");
const timer = document.getElementById("timer");
const container = document.getElementById("target-container");
const scoreDisplay = document.getElementById("score");
const maxScoreDisplay = document.getElementById("max-score");

let gameTime;
let score = 0;
let maxScore = 0;
const targetsPositions = [];

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
      timer.textContent = "";
      container.innerHTML = "";
      button.style.display = "block";
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
  container.innerHTML = "";
  score = 0;
  targetsPositions.length = 0;
  updateScore();

  for (let i = 0; i < 5; i++) {
    spawnTarget(container, targetsPositions, onTargetHit);
  }
}
