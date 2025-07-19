import { spawnTarget } from "./gamemode/classicmode.js";
import { spawnFlickTarget } from "./gamemode/flickshotmode.js";
import { spawnTrackingTarget } from "./gamemode/trackingmode.js";
import { UIController } from "./UIController.js";
import { accuracyTracker } from "./accuracytracker.js";
import { StatsManager } from "./statsmanager.js";

class GameManager {
  constructor() {
    this.container = document.getElementById("target-container");
    this.targetsPositions = [];
    this.statsManager = new StatsManager();
    this.highScores = {
      // old method to save score, need to merge it with statmanager
      classic: 0,
      "flick shot": 0,
      tracking: 0,
    };
    this.ui = new UIController();
    this.accuracy = new accuracyTracker(this.getTimeLeft.bind(this));

    this.init();
  }

  init() {
    const statsButton = document.getElementById("StatsButton");
    const startButton = document.getElementById("StartButton");
    const resetStatsButton = document.getElementById("ResetStatsButton");

    statsButton.addEventListener("click", this.toggleStatsMenu);
    startButton.addEventListener("click", () => {
      this.startGame();
    });

    resetStatsButton.addEventListener("click", () => {
      this.statsManager.resetStats();
      alert("Stats have been reset.");
      this.ui.updateStatsDisplay(this.statsManager); // Optional: refresh the stats display
    });
  }

  toggleStatsMenu = () => {
    const statsMenu = document.getElementById("statsMenu");
    const isVisible = statsMenu.style.display === "flex";
    statsMenu.style.display = isVisible ? "none" : "flex";
    if (!isVisible) {
      this.ui.updateStatsDisplay(this.statsManager);
    }
  };

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
    console.log("Tracking hit at", Date.now());
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

  startGame() {
    this.mode = document.querySelector('input[name="mode"]:checked').value;
    this.container.innerHTML = "";
    this.score = 0;
    this.timeLeft = 5;

    this.ui.resetUI(this.mode, this.highScores[this.mode], this.timeLeft);
    this.accuracy.start(this.mode);
    this.updateScore();
    this.startTimer();

    switch (this.mode) {
      case "classic":
        for (let i = 0; i < 5; i++) {
          spawnTarget(this.container, this.targetsPositions, this.onTargetHit);
        }
        break;
      case "flick shot":
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
    clearInterval(this.timerInterval);
    this.ui.showMenu();
    this.container.innerHTML = "";

    if (this.score > this.highScores[this.mode]) {
      //old method
      this.highScores[this.mode] = this.score;
    }

    this.ui.showHighScore(this.mode, this.highScores[this.mode]);

    const maxAccuracy = this.accuracy.getFinalAccuracy();
    const currentTPM = this.accuracy.getCurrentTPM
      ? this.accuracy.getCurrentTPM()
      : 0;

    this.statsManager.updateStats(
      this.mode,
      this.score,
      maxAccuracy,
      currentTPM
    );

    this.accuracy.stop();
  }
}

new GameManager();
