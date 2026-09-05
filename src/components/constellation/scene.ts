import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import type { SceneInput } from './interaction';

/** Spheres share the semantic buttons' projected bounds; no remote assets. */
export function mountScene(host: HTMLElement, stage: HTMLElement, input: SceneInput, lost: () => void): () => void {
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.setClearColor(0x060b09, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, 1, .1, 100);
  camera.position.z = 15;
  const pmrem = new THREE.PMREMGenerator(renderer);
  const room = new RoomEnvironment();
  const environment = pmrem.fromScene(room, .04);
  scene.environment = environment.texture;
  room.dispose(); pmrem.dispose();
  scene.add(new THREE.AmbientLight(0xd6e8e3, .7));
  const key = new THREE.PointLight(0xecfff6, 110, 40);
  key.position.set(-4, 5, 7); scene.add(key);
  const rim = new THREE.DirectionalLight(0x84c7ff, 3);
  rim.position.set(4, -2, 3); scene.add(rim);
  const geometry = new THREE.SphereGeometry(1, 64, 40);
  const ringGeometry = new THREE.TorusGeometry(1.13, .006, 6, 96);
  const colors = [0x22bbd6, 0x8466ed, 0x31c47d, 0xe6b349];
  const spheres = colors.map(color => {
    const material = new THREE.MeshPhysicalMaterial({ color, metalness: .36, roughness: .15,
      clearcoat: 1, clearcoatRoughness: .08, transmission: .18, thickness: 1.2,
      ior: 1.42, envMapIntensity: 1.5 });
    const sphere = new THREE.Mesh(geometry, material);
    const ring = new THREE.Mesh(ringGeometry, new THREE.MeshBasicMaterial({ color, transparent: true, opacity: .38 }));
    sphere.add(ring); scene.add(sphere);
    return { sphere, material, ring };
  });
  const linkGeometry = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3()]);
  const linkMaterial = new THREE.LineBasicMaterial({ color: colors[0], transparent: true, opacity: .35 });
  const link = new THREE.Line(linkGeometry, linkMaterial); scene.add(link);
  // Deterministic sparse depth field, not customer/data markers.
  const starsGeometry = new THREE.BufferGeometry();
  const stars = new Float32Array(90 * 3);
  for (let i = 0; i < 90; i++) {
    stars[i * 3] = Math.sin(i * 137.5) * 12;
    stars[i * 3 + 1] = Math.cos(i * 39.7) * 5;
    stars[i * 3 + 2] = -3 - (i % 7);
  }
  starsGeometry.setAttribute('position', new THREE.BufferAttribute(stars, 3));
  const starsMaterial = new THREE.PointsMaterial({ color: 0x9ebdb7, size: .025, transparent: true, opacity: .45 });
  const sky = new THREE.Points(starsGeometry, starsMaterial); scene.add(sky);
  const nodes = Array.from(stage.querySelectorAll<HTMLElement>('[data-node]'));
  let width = 1, height = 1, frame = 0, dead = false, visible = true, previous = 0, elapsed = 0;
  function resize() {
    width = stage.clientWidth; height = stage.clientHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height; camera.updateProjectionMatrix();
  }
  function tick(now: number) {
    frame = 0;
    if (dead || !visible || document.hidden) return;
    const dt = Math.min((now - previous) / 1000, .05); previous = now;
    if (!input.reduced) elapsed += dt;
    const box = stage.getBoundingClientRect();
    const viewHeight = 2 * Math.tan(THREE.MathUtils.degToRad(19)) * 15;
    const viewWidth = viewHeight * camera.aspect;
    key.position.x = -4 + (input.reduced ? 0 : input.x * 2);
    sky.rotation.y = input.reduced ? 0 : Math.sin(elapsed * .05) * .025;
    spheres.forEach(({ sphere, material, ring }, i) => {
      const r = nodes[i].getBoundingClientRect();
      sphere.position.set(((r.left + r.width / 2 - box.left) / width - .5) * viewWidth,
        (.5 - (r.top + r.height / 2 - box.top) / height) * viewHeight, 0);
      sphere.scale.setScalar(r.width / width * viewWidth * .46);
      material.envMapIntensity = input.selected === i ? 2 : 1.25;
      ring.rotation.set(1.05, .3 + i * .6, input.reduced ? .2 : elapsed * .08);
    });
    link.visible = input.selected >= 0;
    if (link.visible) {
      const detail = stage.querySelector<HTMLElement>('[data-detail]:not([hidden])');
      if (detail) {
        const r = detail.getBoundingClientRect();
        const points = linkGeometry.attributes.position as THREE.BufferAttribute;
        const p = spheres[input.selected].sphere.position;
        points.setXYZ(0, p.x, p.y - spheres[input.selected].sphere.scale.x, -.2);
        points.setXYZ(1, 0, (.5 - (r.top - box.top - 8) / height) * viewHeight, -.2);
        points.needsUpdate = true; linkMaterial.color.setHex(colors[input.selected]);
      }
    }
    renderer.render(scene, camera);
    frame = requestAnimationFrame(tick);
  }
  function resume() {
    stage.dataset.paused = String(document.hidden || !visible);
    if (document.hidden || !visible) { cancelAnimationFrame(frame); frame = 0; }
    else if (!dead && !frame) { previous = performance.now(); frame = requestAnimationFrame(tick); }
  }
  const observer = new ResizeObserver(resize); observer.observe(stage);
  const intersection = new IntersectionObserver(entries => { visible = entries[0]?.isIntersecting ?? false; resume(); });
  intersection.observe(stage);
  document.addEventListener('visibilitychange', resume);
  const onLost = (event: Event) => { event.preventDefault(); dead = true; cancelAnimationFrame(frame); lost(); };
  renderer.domElement.addEventListener('webglcontextlost', onLost);
  host.appendChild(renderer.domElement);
  performance.mark('constellation-webgl-mounted');
  resize(); resume();
  return () => {
    dead = true; cancelAnimationFrame(frame); observer.disconnect(); intersection.disconnect();
    document.removeEventListener('visibilitychange', resume);
    renderer.domElement.removeEventListener('webglcontextlost', onLost);
    geometry.dispose(); ringGeometry.dispose(); linkGeometry.dispose(); linkMaterial.dispose(); environment.dispose();
    starsGeometry.dispose(); starsMaterial.dispose();
    spheres.forEach(({ material, ring }) => { material.dispose(); ring.material.dispose(); });
    renderer.dispose(); renderer.domElement.remove();
  };
}
