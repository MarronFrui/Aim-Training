export const diameter = {
  targetSize: 70,
};

export function targetMove(target, IsOutOfTarget, getTimeLeft, state = null) {
  const bounds = {
    width: window.innerWidth - diameter.targetSize,
    height: window.innerHeight - diameter.targetSize,
  };

  // Initialiser l'état s'il n'existe pas encore
  if (!state) {
    state = {
      direction: { x: 0, y: 0 },
      distanceToTravel: 0,
      distanceTraveled: 0,
      pos: {
        x: Math.random() * bounds.width,
        y: Math.random() * bounds.height,
      },
    };
  }

  if (getTimeLeft() <= 0) {
    target.remove();
    IsOutOfTarget();
    return;
  }

  const { direction, pos } = state;

  if (
    state.distanceTraveled === 0 ||
    pos.x <= 0 ||
    pos.x >= bounds.width ||
    pos.y <= 0 ||
    pos.y >= bounds.height ||
    state.distanceTraveled >= state.distanceToTravel
  ) {
    const angle = Math.random() * 2 * Math.PI;
    const maxDistance = Math.hypot(window.innerWidth, window.innerHeight);
    state.distanceToTravel = Math.random() * (maxDistance / 2 - 100) + 100;

    const speed = 2;
    direction.x = Math.cos(angle) * speed;
    direction.y = Math.sin(angle) * speed;

    state.distanceTraveled = 0;
  }

  pos.x += direction.x;
  pos.y += direction.y;
  state.distanceTraveled += Math.hypot(direction.x, direction.y);

  target.style.left = `${pos.x}px`;
  target.style.top = `${pos.y}px`;

  requestAnimationFrame(() =>
    targetMove(target, IsOutOfTarget, getTimeLeft, state)
  );
}
