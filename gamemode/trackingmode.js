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

  const handleMouseDown = (e) => {
    e.preventDefault();
    IsInTarget(target);
  };

  const handleMouseEnter = (e) => {
    if (e.buttons === 1) {
      IsInTarget(target);
    }
  };

  function IsInTarget() {
    if (!isHolding) {
      isHolding = true;
      holdInterval = setInterval(() => {
        if (getTimeLeft() > 0) {
          onTargetHit(target, "tracking");
        }
      }, 50);
    }
  }

  function IsOutOfTarget() {
    if (isHolding) {
      isHolding = false;
      clearInterval(holdInterval);
    }
  }

  target.addEventListener("mousedown", handleMouseDown);
  target.addEventListener("mouseenter", handleMouseEnter);
  target.addEventListener("mouseup", IsOutOfTarget);
  target.addEventListener("mouseleave", IsOutOfTarget);

  targetMove(target, IsOutOfTarget, getTimeLeft);
}
