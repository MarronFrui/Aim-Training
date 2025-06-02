const button = document.getElementById("StartButton");
const timer = document.getElementById("timer");
const container = document.getElementById("target-container");
const scoreContainer = document.getElementById("score-container");
const scoreDisplay = document.getElementById("score");
const maxScoreDisplay = document.getElementById("max-score");

let intervalId;
let score = 0;
let maxScore = 0;
const targetsPositions = [];

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

function startGame() {
  container.innerHTML = "";
  score = 0;
  targetsPositions.length = 0;
  updateScore();
  for (let i = 0; i < 5; i++) {
    spawnTarget();
  }
}

function spawnTarget() {
  const target = document.createElement("div");
  target.classList.add("target");

  const targetSize = 40;

  const scoreZone = {
    x: window.innerWidth - 150,
    y: 0,
    width: 150,
    height: 60,
  };

  let x, y;
  let tries = 0;
  const maxTries = 100;

  do {
    x = Math.random() * (window.innerWidth - targetSize);
    y = Math.random() * (window.innerHeight - targetSize);

    const overlapsScoreZone =
      x + targetSize > scoreZone.x && y < scoreZone.height;

    const overlapsOtherTarget = targetsPositions.some((pos) => {
      const dx = pos.x - x;
      const dy = pos.y - y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      return distance < targetSize;
    });

    if (!overlapsScoreZone && !overlapsOtherTarget) break;

    tries++;
  } while (tries < maxTries);

  target.style.left = `${x}px`;
  target.style.top = `${y}px`;

  targetsPositions.push({ x, y });

  target.addEventListener("click", () => {
    score++;
    updateScore();
    target.remove();

    const index = targetsPositions.findIndex(
      (pos) => pos.x === x && pos.y === y
    );
    if (index > -1) targetsPositions.splice(index, 1);

    spawnTarget();
  });

  container.appendChild(target);
}
