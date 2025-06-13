let lastMousePosition = null;
let timeLeft = 60;

window.addEventListener("mousemove", (e) => {
  lastMousePosition = { x: e.clientX, y: e.clientY };
});

function getTimeLeft() {
  return timeLeft;
}

export function spawnFlickTarget(container, onTargetHit) {
  if (getTimeLeft() <= 0) return;
  const target = document.createElement("div");
  const targetSize = 40;

  target.classList.add("target");

  let x, y;
  const maxAttempts = 20;
  let attempts = 0;

  do {
    x = Math.random() * (window.innerWidth - targetSize);
    y = Math.random() * (window.innerHeight - targetSize);
    attempts++;
  } while (
    lastMousePosition &&
    attempts < maxAttempts &&
    Math.hypot(x - lastMousePosition.x, y - lastMousePosition.y) < 300
  );

  target.style.left = `${x}px`;
  target.style.top = `${y}px`;

  const timeout = setTimeout(() => {
    target.remove();
    spawnFlickTarget(container, onTargetHit);
  }, 700);

  target.addEventListener("click", () => {
    clearTimeout(timeout);
    onTargetHit();
    target.remove();
    spawnFlickTarget(container, onTargetHit);
  });

  container.appendChild(target);
}
