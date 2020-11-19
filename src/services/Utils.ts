export function randomInt(min = 0, max = 1) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function isWithinCircle(
  x: number,
  y: number,
  circleX: number,
  circleY: number,
  circleR: number
) {
  const posY = y - circleY;
  const posX = x - circleX;
  const dist = Math.sqrt(posY * posY + posX * posX);

  if (dist < circleR) {
    // coords are within circle
    return true;
  }
  return false;
}

export function resizeCanvas(
  context: CanvasRenderingContext2D,
  resolutionScaling: number
) {
  // resize whith aspect ratio
  context.canvas.height =
    context.canvas.getBoundingClientRect().height * resolutionScaling;
  context.canvas.width =
    context.canvas.getBoundingClientRect().width * resolutionScaling;
  context.scale(resolutionScaling, resolutionScaling);
}

export function getScaledCanvasDimendsions(
  canvas: HTMLCanvasElement,
  resolutionScale: number
) {
  return {
    width: canvas.width * (1 / resolutionScale),
    height: canvas.height * (1 / resolutionScale)
  };
}

export function getPointInCircle(radius: number) {
  const angle = Math.random() * Math.PI * 2;
  return {
    x: Math.cos(angle) * radius,
    y: Math.sin(angle) * radius
  }
}
