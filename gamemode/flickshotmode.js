export function spawnFlickTarget(container, onTargetHit) {
  const maxAttempts = 100;
  const target = document.createElement("div");
  const targetSize = 40;

  let x, y;
  let lastMousePosition = { x: 0, y: 0 };
  let attempts = 0;

  window.addEventListener("mousemove", (e) => {
    lastMousePosition = { x: e.clientX, y: e.clientY };
  });

  target.classList.add("target");

  do {
    x = Math.random() * (window.innerWidth - targetSize);
    y = Math.random() * (window.innerHeight - targetSize);
    attempts++;
  } while (
    attempts < maxAttempts &&
    Math.hypot(x - lastMousePosition.x, y - lastMousePosition.y) < 500
  );

  target.style.left = `${x}px`;
  target.style.top = `${y}px`;

  const timeout = setTimeout(() => {
    target.remove();
    spawnFlickTarget(container, onTargetHit);
  }, 800);

  target.addEventListener("click", () => {
    clearTimeout(timeout);
    onTargetHit();
    target.remove();
    spawnFlickTarget(container, onTargetHit);
  });
  container.appendChild(target);
}
