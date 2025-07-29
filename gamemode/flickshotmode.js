import { diameter } from "../config.js";

export function spawnFlickTarget(container, onTargetHit) {
  const target = document.createElement("div");
  const targetSize = diameter.targetSize;

  const x = Math.random() * (window.innerWidth - targetSize);
  const y = Math.random() * (window.innerHeight - targetSize);

  const flickshotSpeedSlider = document.getElementById("flickshotSpeed");
  const delay = parseInt(flickshotSpeedSlider.value, 10);

  target.classList.add("target");
  target.style.width = `${targetSize}px`;
  target.style.height = `${targetSize}px`;
  target.style.left = `${x}px`;
  target.style.top = `${y}px`;

  const timeout = setTimeout(() => {
    target.remove();
  }, delay);

  target.addEventListener("click", () => {
    clearTimeout(timeout);
    onTargetHit(target);
    target.remove();
  });

  container.appendChild(target);
}
