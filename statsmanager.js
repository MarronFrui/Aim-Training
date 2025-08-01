export class StatsManager {
  constructor() {
    this.defaultStats = {
      classic: { highScore: 0, maxAccuracy: 0 },
      flickshot: { highScore: 0, maxAccuracy: 0 },
      tracking: { highScore: 0, maxAccuracy: 0 },
    };

    const stored = JSON.parse(localStorage.getItem("stats"));
    this.stats = stored || structuredClone(this.defaultStats);
  }

  getStats(mode) {
    return this.stats[mode];
  }

  updateStats(mode, score, accuracy) {
    const current = this.stats[mode];
    if (score > current.highScore) current.highScore = score;
    if (accuracy > current.maxAccuracy) current.maxAccuracy = accuracy;

    this.saveStats();
  }

  resetStats() {
    this.stats = structuredClone(this.defaultStats);
    this.saveStats();
  }

  saveStats() {
    localStorage.setItem("stats", JSON.stringify(this.stats));
  }
}
