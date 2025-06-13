export function spawnFlickTarget(container, onTargetHit) {
  const target = document.createElement("div");
  const targetSize = 40;

  target.classList.add("target");

  let x, y;
  x = Math.random() * (window.innerWidth - targetSize);
  y = Math.random() * (window.innerHeight - targetSize);

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
