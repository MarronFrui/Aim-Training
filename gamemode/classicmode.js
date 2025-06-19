import { config } from "../config.js";

export function spawnTarget(container, targetsPositions, onTargetHit) {
  const target = document.createElement("div");
  const targetSize = config.targetSize;

  let x, y, overlapsOtherTarget;

  target.classList.add("target");
  target.style.width = `${targetSize}px`;
  target.style.height = `${targetSize}px`;

  do {
    x = Math.random() * (window.innerWidth - targetSize);
    y = Math.random() * (window.innerHeight - targetSize);

    overlapsOtherTarget = targetsPositions.some((pos) => {
      return (
        Math.abs(pos.x - x) < targetSize && Math.abs(pos.y - y) < targetSize
      );
    });
  } while (overlapsOtherTarget);

  target.style.left = `${x}px`;
  target.style.top = `${y}px`;

  const index = targetsPositions.length;
  targetsPositions.push({ x, y });

  target.dataset.index = index;

  target.addEventListener("click", () => {
    onTargetHit(target);
    target.remove();
    const removeIndex = Number(target.dataset.index);
    targetsPositions.splice(removeIndex, 1);
    spawnTarget(container, targetsPositions, onTargetHit);
  });

  container.appendChild(target);
}
