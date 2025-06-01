const button = document.getElementById("StartButton");
const timer = document.getElementById("timer");
const container = document.getElementById("target-container");

let intervalId;
let score = 0;

button.addEventListener("click", () => {
  clearInterval(intervalId);
  let timeLeft = 60;
  updateTimer(timeLeft);
  startGame();

  intervalId = setInterval(() => {
    timeLeft--;
    updateTimer(timeLeft);
    if (timeLeft <= 0) {
      clearInterval(intervalId);
      timer.textContent = "";
      container.innerHTML = "";
      alert(`Temps écoulé ! Score : ${score}`);
    }
  }, 1000);
});

function updateTimer(seconds) {
  const min = Math.floor(seconds / 60);
  const s = seconds % 60;
  timer.textContent = `${min}:${s < 10 ? "0" : ""}${s}`;
}

function startGame() {
  container.innerHTML = "";
  score = 0;
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
    target.remove();
    spawnTarget();
  });

  container.appendChild(target);
}
