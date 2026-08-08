'use client';

/**
 * Motion layer for the journey hero (AND-SITE-HERO-JOURNEY-BETA-001).
 *
 * Sends light along the SAME route the SSR SVG draws, so the trip reads as one
 * continuous movement rather than four parked vehicles. It draws NO TEXT and
 * carries NO INFORMATION: every word in this hero is HTML, which is the binding
 * constraint. If this never mounts, the journey is already fully rendered
 * underneath it.
 *
 * Plain three.js per the standing ruling: R3F's reconciler resolves a different
 * React copy than the App Router serves and dies on ReactCurrentOwner.
 */
import { useEffect, useRef, useState } from 'react';
import type * as THREE_NS from 'three';
import { detectDepthMode } from '../constellation/capability';

/**
 * The route as cubic segments in SVG viewBox space (1200x600), matching ROUTE_D
 * in journey-scene.tsx. Kept as plain numbers so the two layers cannot drift
 * without someone noticing both.
 */
const SEGMENTS: Array<[number, number, number, number, number, number, number, number]> = [
  [-40, 486, 180, 486, 250, 452, 372, 430],
  [372, 430, 494, 408, 560, 386, 646, 300],
  [646, 300, 732, 214, 792, 176, 918, 236],
  [918, 236, 1044, 296, 1050, 402, 1240, 430],
];

const TRAVELLER_COUNT = 7;

export default function JourneyDepth() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const raf = requestAnimationFrame(() => {
      if (!cancelled) setEnabled(detectDepthMode() === 'canvas');
    });
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const mount = mountRef.current;
    if (!mount) return;

    let disposed = false;
    let cleanup: (() => void) | undefined;

    import('three')
      .then((THREE) => {
        if (disposed || !mount) return;

        // Orthographic camera in SVG coordinate space, so the traveller
        // positions are the SAME numbers the SVG uses. No mapping to get wrong.
        const camera = new THREE.OrthographicCamera(0, 1200, 0, 600, -10, 10);
        const scene = new THREE.Scene();

        let renderer: import('three').WebGLRenderer;
        try {
          renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
        } catch {
          return;
        }
        renderer.setClearColor(0x000000, 0);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
        mount.appendChild(renderer.domElement);
        renderer.domElement.style.width = '100%';
        renderer.domElement.style.height = '100%';

        const curve = new THREE.CurvePath<THREE_NS.Vector3>();
        for (const [x0, y0, x1, y1, x2, y2, x3, y3] of SEGMENTS) {
          curve.add(
            new THREE.CubicBezierCurve3(
              new THREE.Vector3(x0, y0, 0),
              new THREE.Vector3(x1, y1, 0),
              new THREE.Vector3(x2, y2, 0),
              new THREE.Vector3(x3, y3, 0),
            ),
          );
        }

        const geo = new THREE.CircleGeometry(3.2, 12);
        const travellers: Array<{ mesh: THREE_NS.Mesh; offset: number; mat: THREE_NS.MeshBasicMaterial }> = [];
        for (let i = 0; i < TRAVELLER_COUNT; i++) {
          const mat = new THREE.MeshBasicMaterial({ color: 0x4ade80, transparent: true, opacity: 0.9 });
          const mesh = new THREE.Mesh(geo, mat);
          scene.add(mesh);
          travellers.push({ mesh, offset: i / TRAVELLER_COUNT, mat });
        }

        function resize() {
          const { clientWidth: w, clientHeight: h } = mount!;
          if (!w || !h) return;
          renderer.setSize(w, h, false);
        }
        resize();
        const observer = new ResizeObserver(resize);
        observer.observe(mount);

        const clock = new THREE.Clock();
        let frame = 0;
        let running = true;

        function tick() {
          if (!running) return;
          frame = requestAnimationFrame(tick);
          const t = clock.getElapsedTime();
          for (const tr of travellers) {
            // Slow: the trip should read as a journey, not a race.
            const u = (t * 0.055 + tr.offset) % 1;
            const p = curve.getPointAt(u);
            tr.mesh.position.set(p.x, p.y, 0);
            // Fade in and out at the ends so travellers arrive and depart
            // rather than popping at the corners.
            tr.mat.opacity = Math.sin(u * Math.PI) * 0.85;
          }
          renderer.render(scene, camera);
        }
        tick();

        function onVisibility() {
          if (document.hidden) {
            running = false;
            cancelAnimationFrame(frame);
          } else if (!running) {
            running = true;
            tick();
          }
        }
        document.addEventListener('visibilitychange', onVisibility);

        cleanup = () => {
          running = false;
          cancelAnimationFrame(frame);
          document.removeEventListener('visibilitychange', onVisibility);
          observer.disconnect();
          geo.dispose();
          travellers.forEach((tr) => tr.mat.dispose());
          renderer.dispose();
          if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
        };
      })
      .catch(() => {
        // three failed to load; the SSR journey is already on screen.
      });

    return () => {
      disposed = true;
      cleanup?.();
    };
  }, [enabled]);

  return <div ref={mountRef} aria-hidden className="pointer-events-none absolute inset-0" />;
}
