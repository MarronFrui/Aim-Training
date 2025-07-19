// UIController.js
export class UIController {
  constructor() {
    this.scoreDisplay = document.getElementById("score");
    this.timer = document.getElementById("timer");
    this.maxScoreDisplay = document.getElementById("max-score");
    this.accuracyDisplay = document.getElementById("accuracy");
    this.menu = document.getElementById("menu");
  }

  updateScore(score) {
    this.scoreDisplay.textContent = `Score : ${score}`;
  }

  updateStatsDisplay(statsManager) {
    const modes = ["classic", "flickshot", "tracking"];
    modes.forEach((mode) => {
      const stats = statsManager.getStats(mode) || {
        highScore: 0,
        maxAccuracy: 0,
        TPM: 0,
      };
      document.getElementById(
        `${mode}-highscore`
      ).textContent = `High Score: ${stats.highScore}`;
      document.getElementById(
        `${mode}-accuracy`
      ).textContent = `Max Accuracy: ${stats.maxAccuracy}%`;
      document.getElementById(`${mode}-tpm`).textContent = `TPM: ${stats.TPM}`;
    });
  }

  updateTimer(timeLeft) {
    const min = Math.floor(timeLeft / 60);
    const sec = timeLeft % 60;
    this.timer.textContent = `${min}:${sec < 10 ? "0" : ""}${sec}`;
  }

  resetUI(mode, highScore, initialTime) {
    this.menu.style.display = "none";
    this.scoreDisplay.style.display = "block";
    this.accuracyDisplay.style.display = "block";
    this.updateScore(0);
    this.updateTimer(initialTime);
    this.maxScoreDisplay.textContent = `High Score (${mode}) : ${highScore}`;
  }

  showMenu() {
    this.menu.style.display = "flex";
    this.scoreDisplay.style.display = "none";
    this.accuracyDisplay.style.display = "none";
    this.timer.textContent = "";
  }

  showHighScore(mode, score) {
    this.maxScoreDisplay.textContent = `High Score (${mode}) : ${score}`;
  }

  showHitEffect(target) {
    const hitEffect = document.createElement("div");
    hitEffect.className = "hit-effect";
    const rect = target.getBoundingClientRect();

    hitEffect.style.width = `${rect.width}px`;
    hitEffect.style.height = `${rect.height}px`;
    hitEffect.style.left = `${rect.left}px`;
    hitEffect.style.top = `${rect.top}px`;

    document.body.appendChild(hitEffect);
    setTimeout(() => document.body.removeChild(hitEffect), 300);
  }
}
