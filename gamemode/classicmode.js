export function spawnTarget(container, targetsPositions, onTargetHit) {
  const target = document.createElement("div");
  target.classList.add("target");

  const targetSize = 40;

  const scoreZone = {
    x: window.innerWidth - 150,
    y: 0,
    width: 150,
    height: 60,
  };

  let x, y;
  let tries = 0;
  const maxTries = 100;

  do {
    x = Math.random() * (window.innerWidth - targetSize);
    y = Math.random() * (window.innerHeight - targetSize);

    const overlapsScoreZone =
      x + targetSize > scoreZone.x && y < scoreZone.height;

    const overlapsOtherTarget = targetsPositions.some((pos) => {
      const dx = pos.x - x;
      const dy = pos.y - y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      return distance < targetSize;
    });

    if (!overlapsScoreZone && !overlapsOtherTarget) break;

    tries++;
  } while (tries < maxTries);

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
