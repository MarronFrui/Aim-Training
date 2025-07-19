export class accuracyTracker {
  constructor(getTimeLeft) {
    this.getTimeLeft = getTimeLeft;
    this.accuracyDisplay = document.getElementById("accuracy");
    this.shots = 0;
    this.hits = 0;
    this.isMouseDown = false;
    this.inTarget = false;
    this.timeSinceLastShot = 0;
    this.lastTime = 0;
    this.rafId = null;
    this.maxAccuracyAchieved = 0;
  }

  start(mode) {
    this.mode = mode;
    this.shots = 0;
    this.hits = 0;
    this.isRunning = true;
    this.updateDisplay();

    if (mode === "tracking") {
      document.addEventListener("mousedown", this._onMouseDown);
      document.addEventListener("mouseup", this._onMouseUp);
      // target events are registered via registerTarget()
    } else {
      document.addEventListener("click", this._onClick);
    }
  }

  stop() {
    this.isRunning = false;
    document.removeEventListener("mousedown", this._onMouseDown);
    document.removeEventListener("mouseup", this._onMouseUp);
    document.removeEventListener("click", this._onClick);

    if (this.targetEl) {
      this.targetEl.removeEventListener("mouseenter", this._onEnter);
      this.targetEl.removeEventListener("mouseleave", this._onLeave);
    }

    cancelAnimationFrame(this.rafId);
    this.rafId = null;
  }

  // Flickshot and classic accuracy
  _onClick = (e) => {
    if (this.getTimeLeft() <= 0) return;

    const isHit = e.target.classList.contains("target");
    if (e.target.closest("button")) return;
    this.shots++;
    if (isHit) this.hits++;
    this.updateDisplay();
  };

  // Tracking mode
  _onMouseDown = () => {
    if (!this.isRunning) return;

    this.isMouseDown = true;
    if (!this.rafId) {
      this.lastTime = performance.now();
      this._tick();
    }
  };

  _onMouseUp = () => {
    this.isMouseDown = false;
    this.timeSinceLastShot = 0;
    cancelAnimationFrame(this.rafId);
    this.rafId = null;
  };

  _onEnter = () => {
    this.inTarget = true;
  };

  _onLeave = () => {
    this.inTarget = false;
  };

  _tick = () => {
    if (!this.isMouseDown || !this.isRunning || this.getTimeLeft() <= 0) {
      this.rafId = null;
      return;
    }

    const now = performance.now();
    const delta = now - this.lastTime;
    this.lastTime = now;
    this.timeSinceLastShot += delta;

    while (this.timeSinceLastShot >= 50) {
      this.shots++;
      if (this.inTarget) this.hits++;
      this.timeSinceLastShot -= 50;
    }

    this.updateDisplay();
    this.rafId = requestAnimationFrame(this._tick);
  };

  getFinalAccuracy() {
    const maxAccuracy = 0;
    if (accuracy > current.maxAccuracy) current.maxAccuracy = accuracy;
    return maxAccuracy;
  }

  registerTarget(targetEl) {
    this.targetEl = targetEl;
    this.targetEl.addEventListener("mouseenter", this._onEnter);
    this.targetEl.addEventListener("mouseleave", this._onLeave);
  }

  updateDisplay() {
    const accuracy = this.shots > 0 ? (this.hits / this.shots) * 100 : 0;
    this.accuracyDisplay.textContent = `Accuracy : ${accuracy.toFixed(2)}%`;
  }
}
