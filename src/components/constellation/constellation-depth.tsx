'use client';

/**
 * Depth layer behind the constellation (AND-TECH-ROOT-CONSTELLATION-001).
 *
 * Purely atmospheric: a slowly drifting starfield that gives the node layout
 * some depth. It draws NO TEXT and carries NO INFORMATION, which is what keeps
 * the binding constraint honest. Every word on this page is HTML.
 *
 * If this never mounts, nothing is lost: the constellation above it is already
 * complete server-rendered markup.
 *
 * Plain three.js rather than @react-three/fiber, per the lead ruling of
 * 2026-08-07. R3F's reconciler resolves a different React copy than the App
 * Router serves and dies on ReactCurrentOwner, so the canvas never renders. A
 * starfield needs no component tree, so a reconciler would buy nothing here.
 */
import { useEffect, useRef, useState } from 'react';
import { detectDepthMode } from './capability';

const STAR_COUNT = 420;

export default function ConstellationDepth() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    // Deferred a frame: the WebGL probe builds and discards a context, which is
    // not work worth doing before the page has painted.
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

    // Imported only once the device has been judged capable, so a weak phone
    // never downloads three.js at all.
    import('three')
      .then((THREE) => {
        if (disposed || !mount) return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100);
        camera.position.z = 14;

        let renderer: import('three').WebGLRenderer;
        try {
          renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true, powerPreference: 'low-power' });
        } catch {
          return; // context creation can still fail after a successful probe
        }
        renderer.setClearColor(0x000000, 0);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
        mount.appendChild(renderer.domElement);
        renderer.domElement.style.width = '100%';
        renderer.domElement.style.height = '100%';

        const positions = new Float32Array(STAR_COUNT * 3);
        for (let i = 0; i < STAR_COUNT; i++) {
          positions[i * 3] = (Math.random() - 0.5) * 44;
          positions[i * 3 + 1] = (Math.random() - 0.5) * 30;
          positions[i * 3 + 2] = (Math.random() - 0.5) * 26;
        }
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        const material = new THREE.PointsMaterial({
          color: 0xffffff,
          size: 0.09,
          transparent: true,
          opacity: 0.5,
          sizeAttenuation: true,
        });
        const stars = new THREE.Points(geometry, material);
        scene.add(stars);

        function resize() {
          const { clientWidth: w, clientHeight: h } = mount!;
          if (!w || !h) return;
          renderer.setSize(w, h, false);
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
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
          // Slow enough to read as depth rather than motion, which also keeps it
          // civil for anyone who did not ask for reduced motion but dislikes it.
          stars.rotation.y = t * 0.012;
          stars.rotation.x = Math.sin(t * 0.05) * 0.05;
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
          geometry.dispose();
          material.dispose();
          renderer.dispose();
          if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
        };
      })
      .catch(() => {
        // three failed to load. The constellation is already fully rendered.
      });

    return () => {
      disposed = true;
      cleanup?.();
    };
  }, [enabled]);

  return <div ref={mountRef} aria-hidden className="pointer-events-none absolute inset-0" />;
}
