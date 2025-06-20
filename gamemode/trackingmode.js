import { config } from "../config.js";
import { getTimeLeft } from "../index.js"; // pour arrêter proprement

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

  let pos = {
    x: Math.random() * bounds.width,
    y: Math.random() * bounds.height,
  };

  let velocity = { x: 0, y: 0 };
  const maxSpeed = 5;
  const acceleration = 0.5;

  let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

  document.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  let isHolding = false;
  let holdInterval = null;

  target.addEventListener("mousedown", () => {
    isHolding = true;
    holdInterval = setInterval(() => {
      if (getTimeLeft() > 0) {
        onTargetHit(target, { showEffect: false, mode: "tracking" });
      }
    }, 50);
  });

  document.addEventListener("mouseup", () => {
    isHolding = false;
    clearInterval(holdInterval);
  });

  function targetMove() {
    if (getTimeLeft() <= 0) {
      target.remove();
      return;
    }

    const dx = pos.x - mouse.x + config.targetSize / 2;
    const dy = pos.y - mouse.y + config.targetSize / 2;
    const dist = Math.hypot(dx, dy);

    if (dist < 150) {
      const angle = Math.atan2(dy, dx);
      velocity.x += Math.cos(angle) * acceleration;
      velocity.y += Math.sin(angle) * acceleration;
    }

    velocity.x = Math.max(-maxSpeed, Math.min(maxSpeed, velocity.x));
    velocity.y = Math.max(-maxSpeed, Math.min(maxSpeed, velocity.y));

    pos.x += velocity.x;
    pos.y += velocity.y;

    pos.x = Math.max(0, Math.min(bounds.width, pos.x));
    pos.y = Math.max(0, Math.min(bounds.height, pos.y));

    target.style.left = `${pos.x}px`;
    target.style.top = `${pos.y}px`;

    requestAnimationFrame(targetMove);
  }

  targetMove();
}
