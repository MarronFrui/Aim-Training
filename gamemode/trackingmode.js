// trackingmode.js
import { diameter } from "../config.js";
import { targetMove } from "../config.js";

export function spawnTrackingTarget(container, onTargetHit, getTimeLeft) {
  const target = document.createElement("div");
  target.classList.add("target");
  target.style.width = `${diameter.targetSize}px`;
  target.style.height = `${diameter.targetSize}px`;
  container.appendChild(target);

  let isHolding = false;
  let holdInterval = null;

  function startHold() {
    if (isHolding || holdInterval) return; //prevent from starHold to be called again if running

    if (getTimeLeft() <= 0) return;

    isHolding = true;
    holdInterval = setInterval(() => {
      if (getTimeLeft() <= 0) {
        stopHold();
        return;
      }
      onTargetHit(target, "tracking");
    }, 50);
  }

  function stopHold() {
    if (!isHolding) return;
    isHolding = false;

    if (holdInterval) {
      clearInterval(holdInterval);
      holdInterval = null;
    }
  }

  target.addEventListener("mousedown", (e) => {
    e.preventDefault();
    startHold();
  });

  target.addEventListener("mouseenter", (e) => {
    if (e.buttons === 1) startHold();
  });

  target.addEventListener("mouseup", stopHold);
  target.addEventListener("mouseleave", stopHold);

  targetMove(target, getTimeLeft);
  return target;
}
