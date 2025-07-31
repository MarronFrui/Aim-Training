export class UIController {
  constructor(statsManager, onStartGame) {
    this.onStartGame = onStartGame;
    this.statsManager = statsManager;
    // UI Elements
    this.scoreDisplay = document.getElementById("score");
    this.timer = document.getElementById("timer");
    this.maxScoreDisplay = document.getElementById("max-score");
    this.accuracyDisplay = document.getElementById("accuracy");
    this.menu = document.getElementById("menu");
    this.statsMenu = document.getElementById("statsMenu");
    this.settingsMenu = document.getElementById("settingsMenu");

    // Bind buttons
    document
      .getElementById("statsButton")
      .addEventListener("click", () => this.toggleStatsMenu());
    document
      .getElementById("settingsButton")
      .addEventListener("click", () => this.toggleSettingMenu());
    document
      .getElementById("startButton")
      .addEventListener("click", this.onStartGame);
    document
      .getElementById("resetStatsButton")
      .addEventListener("click", () => {
        this.statsManager.resetStats();
        alert("Stats have been reset.");
        this.updateStatsDisplay();
      });
  }

  toggleStatsMenu() {
    const isVisible = this.statsMenu.style.display === "flex";
    this.statsMenu.style.display = isVisible ? "none" : "flex";
    if (!isVisible) {
      this.updateStatsDisplay();
    }
  }

  toggleSettingMenu() {
    const isVisible = this.settingsMenu.style.display === "flex";
    this.settingsMenu.style.display = isVisible ? "none" : "flex";
  }

  updateScore(score) {
    this.scoreDisplay.textContent = `Score : ${score}`;
  }

  updateStatsDisplay() {
    const modes = ["classic", "flickshot", "tracking"];
    modes.forEach((mode) => {
      const stats = this.statsManager.getStats(mode) || {
        highScore: 0,
        maxAccuracy: 0,
      };
      document.getElementById(
        `${mode}-highScore`
      ).textContent = `High Score: ${stats.highScore}`;
      document.getElementById(
        `${mode}-accuracy`
      ).textContent = `Max Accuracy: ${stats.maxAccuracy.toFixed(2)}%`;
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

export function initSliderUI() {
  const sliders = [
    { id: "gameTime", labelId: "gameTimeValue" },
    { id: "classicTargets", labelId: "classicTargetsValue" },
    { id: "flickshotSpeed", labelId: "flickShotValue" },
    { id: "trackingSpeed", labelId: "trackingTargetSpeed" },
  ];

  sliders.forEach(({ id, labelId }) => {
    const slider = document.getElementById(id);
    const label = document.getElementById(labelId);

    if (!slider || !label) return;

    label.textContent = slider.value;
    slider.addEventListener("input", () => {
      label.textContent = slider.value;
    });
  });
}
