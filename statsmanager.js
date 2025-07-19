export class StatsManager {
  constructor() {
    this.defaultStats = {
      classic: { highScore: 0, maxAccuracy: 0, maxTPM: 0 },
      "flick shot": { highScore: 0, maxAccuracy: 0, maxTPM: 0 },
      tracking: { highScore: 0, maxAccuracy: 0, maxTPM: 0 },
    };

    const stored = JSON.parse(localStorage.getItem("stats"));
    this.stats = stored || structuredClone(this.defaultStats);
  }

  getStats(mode) {
    return this.stats[mode];
  }

  updateStats(mode, score, accuracy, tpm) {
    const current = this.stats[mode];

    if (score > current.highScore) current.highScore = score;
    if (accuracy > current.maxAccuracy) current.maxAccuracy = accuracy;
    if (tpm > current.maxTPM) current.maxTPM = tpm;

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
