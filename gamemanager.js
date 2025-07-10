import { spawnTarget } from "./gamemode/classicmode.js";
import { spawnFlickTarget } from "./gamemode/flickshotmode.js";
import { spawnTrackingTarget } from "./gamemode/trackingmode.js";
import { UIController } from "./UIController.js";
import { accuracyTracker } from "./accuracytracker.js";

class GameManager {
  constructor() {
    this.container = document.getElementById("target-container");
    this.targetsPositions = [];
    this.highScores = {
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

    statsButton.addEventListener("click", this.toggleStatsMenu);
    startButton.addEventListener("click", () => {
      this.startGame();
    });
  }

  toggleStatsMenu() {
    const statsMenu = document.getElementById("statsMenu");
    statsMenu.style.display =
      statsMenu.style.display === "none" ? "flex" : "none";
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

  startGame() {
    this.mode = document.querySelector('input[name="mode"]:checked').value;
    this.container.innerHTML = "";
    this.score = 0;
    this.timeLeft = 10;

    this.ui.resetUI(this.mode, this.highScores[this.mode]);
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
      this.highScores[this.mode] = this.score;
    }

    this.ui.showHighScore(this.mode, this.highScores[this.mode]);
    this.accuracy.stop();
  }
}

new GameManager();
