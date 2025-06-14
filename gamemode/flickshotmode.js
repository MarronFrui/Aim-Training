export function spawnFlickTarget(container, onTargetHit, endTime) {
  const target = document.createElement("div");
  const targetSize = 40;

  let x, y;

  target.classList.add("target");

  x = window.innerWidth / 2 + 500;
  y = window.innerHeight / 2;

  // do {
  //   x = Math.random() * (window.innerWidth - targetSize);
  //   y = Math.random() * (window.innerHeight - targetSize);
  //   attempts++;
  // } while (
  //   attempts < maxAttempts &&
  //   Math.hypot(x - lastMousePosition.x, y - lastMousePosition.y) < 500

  // );

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

  if (endTime === 0) {
    target.remove();
    return;
  }
  container.appendChild(target);
}
