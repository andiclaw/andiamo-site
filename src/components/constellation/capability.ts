/**
 * Should this device run the depth layer? (AND-TECH-ROOT-CONSTELLATION-001)
 *
 * Same approach proven on the Rides landing: decide ONCE, before any three.js is
 * imported, so a weak device never downloads it. Here the stakes are lower and
 * the discipline is the same, because this is the apex site and most arrivals
 * are on a phone from a link.
 */

export type DepthMode = 'canvas' | 'none';

function hasWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    const gl = (canvas.getContext('webgl2') ||
      canvas.getContext('webgl')) as WebGLRenderingContext | null;
    if (!gl) return false;
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return true;
  } catch {
    return false;
  }
}

interface WeakSignals {
  deviceMemory?: number;
  hardwareConcurrency?: number;
  saveData?: boolean;
}

/**
 * Any one signal is enough to skip it. Absent fields mean "unknown", not "weak":
 * Safari reports neither `deviceMemory` nor `connection`, and capable iPhones
 * must not be punished for that.
 */
export function isWeakDevice({ deviceMemory, hardwareConcurrency, saveData }: WeakSignals): boolean {
  if (saveData === true) return true;
  if (typeof deviceMemory === 'number' && deviceMemory <= 4) return true;
  if (typeof hardwareConcurrency === 'number' && hardwareConcurrency <= 4) return true;
  return false;
}

/** Pure, so every rule is testable without a browser. */
export function decideDepthMode(input: {
  prefersReducedMotion: boolean;
  webgl: boolean;
  weakDevice: boolean;
}): DepthMode {
  if (input.prefersReducedMotion) return 'none';
  if (!input.webgl) return 'none';
  if (input.weakDevice) return 'none';
  return 'canvas';
}

/** Browser only. Call from an effect, never during render. */
export function detectDepthMode(): DepthMode {
  if (typeof window === 'undefined') return 'none';
  const nav = navigator as Navigator & {
    deviceMemory?: number;
    connection?: { saveData?: boolean };
  };
  return decideDepthMode({
    prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    webgl: hasWebGL(),
    weakDevice: isWeakDevice({
      deviceMemory: nav.deviceMemory,
      hardwareConcurrency: nav.hardwareConcurrency,
      saveData: nav.connection?.saveData,
    }),
  });
}
