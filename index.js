const button = document.getElementById("StartButton");
const timer = document.getElementById("timer");
const container = document.getElementById("target-container");
const scoreContainer = document.getElementById("score-container");
const scoreDisplay = document.getElementById("score");
const maxScoreDisplay = document.getElementById("max-score");

let intervalId;
let score = 0;
let maxScore = 0;

button.addEventListener("click", () => {
  clearInterval(intervalId);
  let timeLeft = 60;
  updateTimer(timeLeft);
  startGame();
  button.style.display = "none";
  scoreDisplay.style.display = "block";

  intervalId = setInterval(() => {
    timeLeft--;
    updateTimer(timeLeft);
    if (timeLeft <= 0) {
      clearInterval(intervalId);
      timer.textContent = "";
      container.innerHTML = "";
      button.style.display = "block";
      // Update max score if needed
      scoreDisplay.style.display = "none";
      if (score > maxScore) {
        maxScore = score;
        maxScoreDisplay.textContent = `High Score : ${maxScore}`;
      }
      // Reset current score display
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

function startGame() {
  container.innerHTML = "";
  score = 0;
  updateScore();
  for (let i = 0; i < 5; i++) {
    spawnTarget();
  }
}

function spawnTarget() {
  const target = document.createElement("div");
  target.classList.add("target");

  const x = Math.random() * (window.innerWidth - 40);
  const y = Math.random() * (window.innerHeight - 40);

  target.style.left = `${x}px`;
  target.style.top = `${y}px`;

  target.addEventListener("click", () => {
    score++;
    updateScore();
    target.remove();
    spawnTarget();
  });

  container.appendChild(target);
}
