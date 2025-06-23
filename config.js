export const config = {
  targetSize: 70,
};

export function targetMove() {
  const bounds = {
    width: window.innerWidth - config.targetSize,
    height: window.innerHeight - config.targetSize,
  };

  let direction = { x: 0, y: 0 };
  let distanceToTravel = 0;
  let distanceTraveled = 0;
  let pos = {
    x: Math.random() * bounds.width,
    y: Math.random() * bounds.height,
  };

  if (getTimeLeft() <= 0) {
    target.remove();
    IsOutOfTarget();
    return;
  }

  if (
    distanceTraveled === 0 ||
    pos.x <= 0 ||
    pos.x >= bounds.width ||
    pos.y <= 0 ||
    pos.y >= bounds.height ||
    distanceTraveled >= distanceToTravel
  ) {
    const angle = Math.random() * 2 * Math.PI;
    const maxDistance = Math.hypot(window.innerWidth, window.innerHeight);
    distanceToTravel = Math.random() * (maxDistance / 2 - 100) + 100;

    const speed = 2;
    direction.x = Math.cos(angle) * speed;
    direction.y = Math.sin(angle) * speed;

    distanceTraveled = 0;

    pos.x = Math.max(0, Math.min(bounds.width, pos.x));
    pos.y = Math.max(0, Math.min(bounds.height, pos.y));
  }

  pos.x += direction.x;
  pos.y += direction.y;
  distanceTraveled += Math.hypot(direction.x, direction.y);

  target.style.left = `${pos.x}px`;
  target.style.top = `${pos.y}px`;

  requestAnimationFrame(targetMove);
}
