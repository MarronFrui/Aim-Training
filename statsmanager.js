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
    const stat = this.stats[mode];
    stat.highScore = Math.max(stat.highScore, score);
    stat.maxAccuracy = Math.max(stat.maxAccuracy, accuracy);

    if (!stat.history) stat.history = [];
    stat.history.push({
      score,
      accuracy,
      timestamp: Date.now(),
    });

    if (stat.history.length > 50) {
      stat.history = stat.history.slice(-50);
    }

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
