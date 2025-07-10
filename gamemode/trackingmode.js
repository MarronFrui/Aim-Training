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
    if (!isHolding && getTimeLeft() > 0) {
      isHolding = true;
      holdInterval = setInterval(() => {
        onTargetHit(target, "tracking");
      }, 50);
    }
  }

  function stopHold() {
    if (isHolding) {
      isHolding = false;
      clearInterval(holdInterval);
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
