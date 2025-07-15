export const diameter = {
  targetSize: 70,
};

export function targetMove(target, getTimeLeft) {
  const bounds = {
    width: window.innerWidth - diameter.targetSize - 80,
    height: window.innerHeight - diameter.targetSize - 80,
  };

  const state = {
    direction: { x: 0, y: 0 },
    distanceToTravel: 0,
    distanceTraveled: 0,
    pos: {
      x: Math.random() * bounds.width,
      y: Math.random() * bounds.height,
    },
    lastTime: null,
  };

  const speed = 300; // pixels per second

  function pickNewDirection() {
    const angle = Math.random() * 2 * Math.PI;
    const maxDistance = Math.hypot(window.innerWidth, window.innerHeight);
    state.distanceToTravel = Math.random() * (maxDistance / 2 - 100) + 100;

    state.direction.x = Math.cos(angle) * speed;
    state.direction.y = Math.sin(angle) * speed;
    state.distanceTraveled = 0;
  }

  pickNewDirection();

  function step(timestamp) {
    if (getTimeLeft() <= 0) return; // stop animating if game ended

    if (state.lastTime === null) {
      state.lastTime = timestamp;
    }

    const deltaTime = (timestamp - state.lastTime) / 1000; // in seconds
    state.lastTime = timestamp;

    const dx = state.direction.x * deltaTime;
    const dy = state.direction.y * deltaTime;

    state.pos.x += dx;
    state.pos.y += dy;
    state.distanceTraveled += Math.hypot(dx, dy);

    // If we hit the bounds or finished distance, change direction
    if (
      state.pos.x <= 0 ||
      state.pos.x >= bounds.width ||
      state.pos.y <= 0 ||
      state.pos.y >= bounds.height ||
      state.distanceTraveled >= state.distanceToTravel
    ) {
      pickNewDirection();
    }

    target.style.left = `${state.pos.x}px`;
    target.style.top = `${state.pos.y}px`;

    requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}
