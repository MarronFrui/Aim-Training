export function spawnFlickTarget(container, onTargetHit) {
  const target = document.createElement("div");
  const targetSize = 40;
  const x = Math.random() * (window.innerWidth - targetSize);
  const y = Math.random() * (window.innerHeight - targetSize);

  target.classList.add("target");
  target.style.left = `${x}px`;
  target.style.top = `${y}px`;

  const timeout = setTimeout(() => {
    target.remove();
  }, 800);

  target.addEventListener("click", () => {
    clearTimeout(timeout);
    onTargetHit();
    target.remove();
    spawnFlickTarget(container, onTargetHit);
  });

  container.appendChild(target);
}
