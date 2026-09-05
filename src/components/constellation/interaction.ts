export interface SceneInput { x: number; y: number; selected: number; reduced: boolean }

export function nearestNode(x: number, y: number, nodes: { x: number; y: number }[], radius: number): number | null {
  let result: number | null = null;
  let distance = radius * radius;
  nodes.forEach((node, index) => {
    const d = (node.x - x) ** 2 + (node.y - y) ** 2;
    if (d < distance) { distance = d; result = index; }
  });
  return result;
}

/** A measured LCP candidate plus a quiet paint interval, never a guessed load
 * timeout. Unsupported browsers retain the complete semantic HTML experience. */
export function afterHeroPaint(start: () => void): () => void {
  let timer: ReturnType<typeof setTimeout> | undefined;
  let frame = 0;
  let stopped = false;
  if (typeof PerformanceObserver === 'undefined' || !PerformanceObserver.supportedEntryTypes?.includes('largest-contentful-paint')) return () => {};
  const observer = new PerformanceObserver((list) => {
    if (!list.getEntries().length || stopped) return;
    clearTimeout(timer);
    timer = setTimeout(() => {
      frame = requestAnimationFrame(() => {
        if (stopped) return;
        stopped = true; observer.disconnect();
        performance.mark('constellation-after-lcp'); start();
      });
    }, 800);
  });
  observer.observe({ type: 'largest-contentful-paint', buffered: true });
  return () => { stopped = true; clearTimeout(timer); cancelAnimationFrame(frame); observer.disconnect(); };
}
