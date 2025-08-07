import { spawnTarget } from "./gamemode/classicmode.js";
import { spawnFlickTarget } from "./gamemode/flickshotmode.js";
import { spawnTrackingTarget } from "./gamemode/trackingmode.js";
import { UIController } from "./UIController.js";
import { accuracyTracker } from "./accuracytracker.js";
import { StatsManager } from "./statsmanager.js";
import { initSliderUI } from "./UIController.js";
import { renderChart } from "./chartsmanager.js";

initSliderUI();

class GameManager {
  constructor() {
    this.container = document.getElementById("target-container");
    this.targetsPositions = [];
    this.statsManager = new StatsManager();

    this.ui = new UIController(this.statsManager, this.startGame.bind(this));
    this.ui.gameManager = this; //related to charts ?

    this.accuracy = new accuracyTracker(this.getTimeLeft.bind(this));
  }

  resetStats() {
    this.statsManager.resetStats();
    this.ui.updateStatsDisplay();
  }

  getTimeLeft() {
    return this.timeLeft;
  }

  updateScore() {
    this.ui.updateScore(this.score);
  }

  onTargetHit = (target, mode = "classic") => {
    if (mode !== "tracking") {
      this.ui.showHitEffect(target);
    }
    this.score++;
    this.updateScore();
  };

  async flickShotLoop() {
    while (this.timeLeft > 0) {
      spawnFlickTarget(this.container, this.onTargetHit);
      await new Promise((resolve) => setTimeout(resolve, 700));
    }
  }

  startTimer() {
    this.timerInterval = setInterval(() => {
      this.timeLeft--;
      this.ui.updateTimer(this.timeLeft);

      if (this.timeLeft <= 0) this.endGame();
    }, 1000);
  }

  renderCharts() {
    const limit = parseInt(document.getElementById("chartDataLimit").value, 10);

    ["classic", "flickshot", "tracking"].forEach((mode) => {
      const container = document.getElementById(`${mode}-chart`);
      const history = this.statsManager.getStats(mode)?.history || [];

      const limitedData = history.slice(-limit).map((entry) => ({
        score: entry.score,
        accuracy: entry.accuracy,
      }));

      renderChart(container, limitedData);
    });
  }
  startGame() {
    this.mode = document
      .querySelector('input[name="mode"]:checked')
      .value.toLowerCase();
    let currentStats = this.statsManager.getStats(this.mode);
    this.ui.resetUI(this.mode, currentStats.highScore, this.timeLeft);
    this.container.innerHTML = "";
    this.score = 0;
    this.timeLeft = Number(document.getElementById("gameTime").value) || 5;
    this.accuracy.start(this.mode);
    this.updateScore();
    this.startTimer();

    switch (this.mode) {
      case "classic":
        const targetNumber = parseInt(
          document.getElementById("classicTargets").value,
          10
        );
        for (let i = 0; i < targetNumber; i++) {
          spawnTarget(this.container, this.targetsPositions, this.onTargetHit);
        }
        break;
      case "flickshot":
        this.flickShotLoop();
        break;
      case "tracking":
        const trackingTarget = spawnTrackingTarget(
          this.container,
          this.onTargetHit.bind(this),
          this.getTimeLeft.bind(this)
        );

        this.accuracy.registerTarget(trackingTarget);
        break;
      default:
        console.warn("Unknown game mode:", this.mode);
    }
  }

  endGame() {
    const stats = this.statsManager.getStats(this.mode);
    const finalAccuracy = this.accuracy.getFinalAccuracy();

    clearInterval(this.timerInterval);
    this.ui.showMenu();
    this.container.innerHTML = "";
    this.ui.showHighScore(this.mode, stats.highScore);
    this.statsManager.updateStats(this.mode, this.score, finalAccuracy);

    this.accuracy.stop();
  }
}

new GameManager();
