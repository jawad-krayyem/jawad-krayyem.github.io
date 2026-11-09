export const DEFAULT_PROCESSOR_ORBIT = Object.freeze({ x: 0, y: 0 });

export function rotateProcessorOrbit(current, horizontal, vertical) {
  return {
    x: Math.max(-0.48, Math.min(0.48, current.x + vertical)),
    y: current.y + horizontal,
  };
}

export function getProcessorTargetAngles(orbit, pointerX, pointerY, reducedMotion) {
  return {
    x: 0.07 + orbit.x + (reducedMotion ? 0 : pointerY * 0.12),
    y: -0.18 + orbit.y + (reducedMotion ? 0 : pointerX * 0.22),
  };
}
