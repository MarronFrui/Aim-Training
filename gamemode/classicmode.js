export function spawnTarget(container, targetsPositions, onTargetHit) {
  const target = document.createElement("div");
  const targetSize = 40;
  const scoreZone = {
    x: window.innerWidth - 200,
    y: 0,
    width: 200,
    height: 80,
  };

  let x, y, overlapsOtherTarget;

  target.classList.add("target");

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

  targetsPositions.push({ x, y });

  target.addEventListener("click", () => {
    onTargetHit();
    target.remove();
    const index = targetsPositions.findIndex(
      (pos) => pos.x === x && pos.y === y
    );
    if (index > -1) targetsPositions.splice(index, 1);
    spawnTarget(container, targetsPositions, onTargetHit);
  });

  container.appendChild(target);
}
