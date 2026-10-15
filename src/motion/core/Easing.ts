/**
 * Deterministic easing equations for procedural Motion-as-Code
 */
export const Easing = {
  linear: (t: number) => t,
  easeInQuad: (t: number) => t * t,
  easeOutQuad: (t: number) => t * (2 - t),
  easeInOutQuad: (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
  easeInCubic: (t: number) => t * t * t,
  easeOutCubic: (t: number) => --t * t * t + 1,
  easeInOutCubic: (t: number) =>
    t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
  easeOutExpo: (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
  easeInOutExpo: (t: number) => {
    if (t === 0) return 0;
    if (t === 1) return 1;
    if ((t *= 2) < 1) return 0.5 * Math.pow(2, 10 * (t - 1));
    return 0.5 * (-Math.pow(2, -10 * --t) + 2);
  },
};

export function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

export function interpolate(
  progress: number,
  inputRange: number[],
  outputRange: number[],
  easing: (t: number) => number = Easing.linear
): number {
  if (inputRange.length < 2 || outputRange.length < 2) return outputRange[0] || 0;

  if (progress <= inputRange[0]) return outputRange[0];
  if (progress >= inputRange[inputRange.length - 1]) return outputRange[outputRange.length - 1];

  // Find active segment
  for (let i = 0; i < inputRange.length - 1; i++) {
    const inMin = inputRange[i];
    const inMax = inputRange[i + 1];
    if (progress >= inMin && progress <= inMax) {
      const outMin = outputRange[i];
      const outMax = outputRange[i + 1];
      const normalized = (progress - inMin) / (inMax - inMin);
      const eased = easing(clamp(normalized, 0, 1));
      return outMin + (outMax - outMin) * eased;
    }
  }

  return outputRange[outputRange.length - 1];
}
