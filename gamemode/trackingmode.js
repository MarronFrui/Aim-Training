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

  const maxSpeed = 1;
  const acceleration = 0.3;
  const handleMouseMove = (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
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

  let velocity = { x: 0, y: 0 };
  let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  let isHolding = false;
  let holdInterval = null;
  let pos = {
    x: Math.random() * bounds.width,
    y: Math.random() * bounds.height,
  };

  function handleIsOutOfTarget() {
    if (isHolding) {
      isHolding = false;
      clearInterval(holdInterval);
    }
  }

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

  document.addEventListener("mousemove", handleMouseMove);
  target.addEventListener("mousedown", handleMouseDown);
  target.addEventListener("mouseenter", handleMouseEnter);
  target.addEventListener("mouseup", handleIsOutOfTarget);
  target.addEventListener("mouseleave", handleIsOutOfTarget);

  function targetMove() {
    let reboundFrames = 0;
    let reboundVelocity = { x: 0, y: 0 };
    if (getTimeLeft() <= 0) {
      target.remove();
      document.removeEventListener("mousemove", handleMouseMove);
      handleIsOutOfTarget();
      return;
    }

    // Si on est en rebond, priorité
    if (reboundFrames > 0) {
      pos.x += reboundVelocity.x;
      pos.y += reboundVelocity.y;
      reboundFrames--;
    } else {
      // Logique de fuite si la souris est proche
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
    }

    // Rebond sur bords (avec rebond de 200px à vitesse fixe)
    const rebondSpeed = 5;
    const rebondDistance = 400;
    if (pos.x <= 0 || pos.x >= bounds.width) {
      reboundVelocity.x = pos.x <= 0 ? rebondSpeed : -rebondSpeed;
      reboundVelocity.y = 0;
      reboundFrames = rebondDistance / Math.abs(reboundVelocity.x);
    } else if (pos.y <= 0 || pos.y >= bounds.height) {
      reboundVelocity.y = pos.y <= 0 ? rebondSpeed : -rebondSpeed;
      reboundVelocity.x = 0;
      reboundFrames = rebondDistance / Math.abs(reboundVelocity.y);
    }

    pos.x = Math.max(0, Math.min(bounds.width, pos.x));
    pos.y = Math.max(0, Math.min(bounds.height, pos.y));

    target.style.left = `${pos.x}px`;
    target.style.top = `${pos.y}px`;

    requestAnimationFrame(targetMove);
  }

  targetMove();
}
