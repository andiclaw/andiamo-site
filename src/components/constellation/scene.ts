import * as THREE from 'three';
import type { SceneInput } from './interaction';

/** Decorative geometry shares the DOM anchors; it has no data or network role. */
export function mountScene(host: HTMLElement, stage: HTMLElement, input: SceneInput, lost: () => void): () => void {
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.setClearColor(0x060b09, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
  camera.position.set(0, 0, 15);
  const assembly = new THREE.Group();
  scene.add(assembly);
  scene.add(new THREE.AmbientLight(0xb9ddc9, 1.4));
  const key = new THREE.PointLight(0x6affac, 85, 30);
  key.position.set(-4, 4, 6); scene.add(key);
  const rim = new THREE.DirectionalLight(0x7acfe5, 2.4);
  rim.position.set(4, -2, 3); scene.add(rim);
  const materials: THREE.Material[] = [];
  const geometries: THREE.BufferGeometry[] = [];
  const metallic = new THREE.MeshStandardMaterial({ color: 0x26794e, metalness: .8, roughness: .28, emissive: 0x0c3020, emissiveIntensity: .5 });
  materials.push(metallic);
  const rings = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const geometry = new THREE.TorusGeometry(3.05 + i * .32, i === 0 ? .036 : .013, 10, 128);
    geometries.push(geometry);
    const ring = new THREE.Mesh(geometry, metallic);
    ring.rotation.set(.7 + i * .28, .15 + i * .18, i * .4);
    rings.add(ring);
  }
  assembly.add(rings);
  const colors = [0x22d3ee, 0xa28bff, 0x51eaa0, 0xf5c365];
  const anchors = colors.map(color => {
    const geometry = new THREE.OctahedronGeometry(.16, 0);
    const material = new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: .5, metalness: .6, roughness: .22 });
    geometries.push(geometry); materials.push(material);
    const mesh = new THREE.Mesh(geometry, material);
    assembly.add(mesh); return mesh;
  });
  const lineMaterial = new THREE.LineBasicMaterial({ color: 0x58916c, transparent: true, opacity: .55 });
  materials.push(lineMaterial);
  const lineGeometry = new THREE.BufferGeometry(); geometries.push(lineGeometry);
  const positions = new Float32Array(5 * 6);
  lineGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const lines = new THREE.LineSegments(lineGeometry, lineMaterial); assembly.add(lines);
  const links = [[0, 1], [0, 2], [1, 2], [1, 3], [2, 3]];
  let width = 1, height = 1, frame = 0, dead = false, visible = true;
  let previous = 0, elapsed = 0;
  let anchorPositions: THREE.Vector3[] = [];
  function resize() {
    width = stage.clientWidth; height = stage.clientHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height; camera.updateProjectionMatrix();
    const viewHeight = 2 * Math.tan(THREE.MathUtils.degToRad(19)) * 15;
    const viewWidth = viewHeight * camera.aspect;
    const box = stage.getBoundingClientRect();
    anchorPositions = Array.from(stage.querySelectorAll<HTMLElement>('[data-node]')).map(el => {
      const r = el.getBoundingClientRect();
      return new THREE.Vector3(((r.left + r.width / 2 - box.left) / width - .5) * viewWidth,
        (.5 - (r.top - box.top + 6) / height) * viewHeight, 0);
    });
    rings.scale.setScalar(window.innerWidth <= 1000 ? .48 : .95);
    rings.position.y = window.innerWidth <= 1000 ? 2.5 : .1;
  }
  function tick(now: number) {
    if (dead) return;
    frame = requestAnimationFrame(tick);
    const dt = Math.min((now - previous) / 1000, .05); previous = now;
    if (!visible || document.hidden) return;
    if (!input.reduced) elapsed += dt;
    assembly.rotation.x = input.reduced ? 0 : THREE.MathUtils.damp(assembly.rotation.x, input.y * .045, 5, dt);
    assembly.rotation.y = input.reduced ? 0 : THREE.MathUtils.damp(assembly.rotation.y, input.x * .07, 5, dt);
    rings.rotation.z = input.reduced ? -.16 : -.16 + Math.sin(elapsed * .18) * .12;
    key.position.x = -4 + (input.reduced ? 0 : input.x * 3);
    anchors.forEach((mesh, i) => {
      mesh.position.copy(anchorPositions[i] ?? new THREE.Vector3());
      if (!input.reduced) mesh.position.y += Math.sin(elapsed * .7 + i) * .07;
      mesh.rotation.set(.4, input.reduced ? .3 : elapsed * .2, .6);
      mesh.scale.setScalar(input.selected === i ? 1.8 : 1);
    });
    links.forEach(([a, b], i) => { anchors[a].position.toArray(positions, i * 6); anchors[b].position.toArray(positions, i * 6 + 3); });
    lineGeometry.attributes.position.needsUpdate = true;
    renderer.render(scene, camera);
  }
  const observer = new ResizeObserver(resize); observer.observe(stage);
  const selectionObserver = new MutationObserver(resize);
  selectionObserver.observe(stage, { attributes: true, attributeFilter: ['data-selected'] });
  const intersection = new IntersectionObserver(entries => { visible = entries[0]?.isIntersecting ?? false; }); intersection.observe(stage);
  const onLost = (event: Event) => { event.preventDefault(); dead = true; cancelAnimationFrame(frame); lost(); };
  renderer.domElement.addEventListener('webglcontextlost', onLost);
  host.appendChild(renderer.domElement);
  performance.mark('constellation-webgl-mounted');
  resize(); frame = requestAnimationFrame(tick);
  return () => {
    dead = true; cancelAnimationFrame(frame); observer.disconnect(); selectionObserver.disconnect(); intersection.disconnect();
    renderer.domElement.removeEventListener('webglcontextlost', onLost);
    geometries.forEach(g => g.dispose()); materials.forEach(m => m.dispose());
    renderer.dispose(); renderer.domElement.remove();
  };
}
