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
    console.log("[StatsManager] Requested stats for mode:", mode);
    console.log("[StatsManager] Current stats object:", this.stats);

    if (!this.stats[mode]) {
      console.warn(`[StatsManager] WARNING: No stats found for mode "${mode}"`);
      return { highScore: 0, maxAccuracy: 0 }; // Fallback so your app doesn't crash
    }

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
