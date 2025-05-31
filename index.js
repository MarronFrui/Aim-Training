const button = document.getElementById("StartButton");
const timer = document.getElementById("timer");

let intervalId;

button.addEventListener("click", () => {
  clearInterval(intervalId);
  let timeLeft = 60;
  updateTimer(timer, timeLeft);

  intervalId = setInterval(() => {
    timeLeft--;
    updateTimer(timer, timeLeft);
    if (timeLeft <= 0) {
      clearInterval(intervalId);
      timer.textContent = "";
    }
  }, 1000);
});

function updateTimer(timer, seconds) {
  const min = Math.floor(seconds / 60);
  const s = seconds % 60;
  timer.textContent = `${min}:${s < 10 ? "0" : ""}${s}`;
}
