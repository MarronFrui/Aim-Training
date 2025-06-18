export function spawnFlickTarget(container, onTargetHit) {
  const target = document.createElement("div");
  const targetSize = 70;
  const x = Math.random() * (window.innerWidth - targetSize);
  const y = Math.random() * (window.innerHeight - targetSize);

  target.classList.add("target");
  target.style.left = `${x}px`;
  target.style.top = `${y}px`;

  const timeout = setTimeout(() => {
    target.remove();
  }, 700);

  target.addEventListener("click", () => {
    clearTimeout(timeout);
    onTargetHit(target);
    target.remove();
  });

  container.appendChild(target);
}
