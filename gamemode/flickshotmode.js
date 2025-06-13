export function spawnFlickTarget(container, onTargetHit) {
  const target = document.createElement("div");
  target.classList.add("target");

  const targetSize = 40;
  const x = Math.random() * (window.innerWidth - targetSize);
  const y = Math.random() * (window.innerHeight - targetSize);

  target.style.left = `${x}px`;
  target.style.top = `${y}px`;

  const timeout = setTimeout(() => {
    target.remove();
    spawnFlickTarget(container, onTargetHit); // spawn next regardless of hit
  }, 700);

  target.addEventListener("click", () => {
    clearTimeout(timeout);
    onTargetHit();
    target.remove();
    spawnFlickTarget(container, onTargetHit);
  });

  container.appendChild(target);
}
