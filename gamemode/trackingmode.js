import { config } from "../config.js";
import { getTimeLeft } from "../index.js";

export function spawnTrackingTarget(container, onTargetHit) {
  const target = document.createElement("div");
  target.classList.add("target");
  target.style.width = `${config.targetSize}px`;
  target.style.height = `${config.targetSize}px`;
  container.appendChild(target);

  const bounds = {
    width: window.innerWidth - config.targetSize,
    height: window.innerHeight - config.targetSize,
  };

  const handleMouseDown = (e) => {
    e.preventDefault();
    handleIsInTarget(target);
  };

  const handleMouseEnter = (e) => {
    if (e.buttons === 1) {
      handleIsInTarget(target);
    }
  };

  let isHolding = false;
  let holdInterval = null;
  let pos = {
    x: Math.random() * bounds.width,
    y: Math.random() * bounds.height,
  };

  function handleIsInTarget(target) {
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

  let direction = { x: 0, y: 0 };
  let distanceToTravel = 0;
  let distanceTraveled = 0;

  function chooseNewDirection() {
    const angle = Math.random() * 2 * Math.PI;
    const maxDistance = Math.hypot(window.innerWidth, window.innerHeight);
    distanceToTravel = Math.random() * (maxDistance / 2 - 100) + 100;

    const speed = 2;
    direction.x = Math.cos(angle) * speed;
    direction.y = Math.sin(angle) * speed;

    distanceTraveled = 0;
  }

  chooseNewDirection();

  function targetMove() {
    if (getTimeLeft() <= 0) {
      target.remove();
      IsOutOfTarget();
      return;
    }

    pos.x += direction.x;
    pos.y += direction.y;
    distanceTraveled += Math.hypot(direction.x, direction.y);

    const hitLeft = pos.x <= 0;
    const hitRight = pos.x >= bounds.width;
    const hitTop = pos.y <= 0;
    const hitBottom = pos.y >= bounds.height;

    if (
      hitLeft ||
      hitRight ||
      hitTop ||
      hitBottom ||
      distanceTraveled >= distanceToTravel
    ) {
      chooseNewDirection();
      pos.x = Math.max(0, Math.min(bounds.width, pos.x));
      pos.y = Math.max(0, Math.min(bounds.height, pos.y));
    }

    target.style.left = `${pos.x}px`;
    target.style.top = `${pos.y}px`;

    requestAnimationFrame(targetMove);
  }

  targetMove();
}
