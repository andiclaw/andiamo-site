import * as THREE from 'three';
import { createWorld } from './worlds';
import type { SceneInput } from './interaction';

/** Local authored space scene. Semantic controls remain the navigation authority. */
export function mountScene(host: HTMLElement, stage: HTMLElement, input: SceneInput, lost: () => void): () => void {
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.setClearColor(0x030610, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, 1, .1, 100);
  camera.position.z = 15;
  scene.add(new THREE.AmbientLight(0x667aaa, .65));
  const sun = new THREE.DirectionalLight(0xc7defa, 3.8);
  sun.position.set(-5, 5, 4); scene.add(sun);
  const rim = new THREE.DirectionalLight(0x5d9fce, 4);
  rim.position.set(4, 1, -4); scene.add(rim);
  const worlds = [0, 1, 2, 3].map(createWorld);
  worlds.forEach(({ group }) => scene.add(group));
  const dustGeometry = new THREE.PlaneGeometry(90, 50);
  const dustMaterial = new THREE.ShaderMaterial({ depthWrite: false,
    vertexShader: `varying vec2 uvSpace; void main(){ uvSpace=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }`,
    fragmentShader: `varying vec2 uvSpace;
      float wave(vec2 p){return sin(p.x*9.0+sin(p.y*6.0))*sin(p.y*7.0+cos(p.x*5.0));}
      void main(){vec2 p=uvSpace*3.0; float dust=wave(p)*.5+wave(p*2.1)*.25+wave(p*4.3)*.125;
      float band=exp(-pow((uvSpace.y-.55+(uvSpace.x-.5)*.4)*7.0,2.0));
      vec3 color=vec3(.009,.015,.035)+vec3(.018,.032,.052)*band*max(.0,dust+.65);
      gl_FragColor=vec4(color,1.0); }`,
  });
  const dust = new THREE.Mesh(dustGeometry, dustMaterial); dust.position.z = -22; scene.add(dust);
  const skies = [0, 1, 2].map(layer => {
    const geometry = new THREE.BufferGeometry(), points = new Float32Array(180 * 3);
    for (let i = 0; i < 180; i++) {
      points[i * 3] = Math.sin(i * 137.5 + layer * 3) * 17;
      points[i * 3 + 1] = Math.cos(i * 39.7 + layer * 5) * 9;
      points[i * 3 + 2] = -3 - layer * 4 - i % 3;
    }
    geometry.setAttribute('position', new THREE.BufferAttribute(points, 3));
    const material = new THREE.PointsMaterial({ color: [0xd5dfef, 0x708bbc, 0x978bc1][layer], size: [.027, .025, .024][layer], transparent: true, opacity: [.7, .6, .5][layer] });
    const sky = new THREE.Points(geometry, material); scene.add(sky); return sky;
  });
  const linkGeometry = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3()]);
  const linkMaterial = new THREE.LineBasicMaterial({ color: 0x39747a, transparent: true, opacity: .35 });
  const link = new THREE.Line(linkGeometry, linkMaterial); scene.add(link);
  const anchors = Array.from(stage.querySelectorAll<HTMLElement>('[data-world-anchor]'));
  let width = 1, height = 1, frame = 0, dead = false, visible = true, previous = 0, elapsed = 0;
  function resize() {
    width = host.clientWidth; height = host.clientHeight;
    renderer.setSize(width, height); camera.aspect = width / height; camera.updateProjectionMatrix();
  }
  function tick(now: number) {
    frame = 0;
    if (dead || !visible || document.hidden) return;
    const dt = Math.min((now - previous) / 1000, .05); previous = now;
    if (!input.reduced) elapsed += dt;
    const box = host.getBoundingClientRect();
    worlds.forEach(({ group, planet, structures }, i) => {
      const r = anchors[i].getBoundingClientRect();
      const z = [0, -2, -1, -3][i];
      const viewHeight = 2 * Math.tan(THREE.MathUtils.degToRad(19)) * (15 - z);
      const viewWidth = viewHeight * camera.aspect;
      group.position.set(((r.left + r.width / 2 - box.left) / width - .5) * viewWidth,
        (.5 - (r.top + r.height / 2 - box.top) / height) * viewHeight, z);
      group.scale.setScalar(r.width / width * viewWidth * .47);
      group.rotation.set(-.2, 0, [.15, -.3, -.18, .35][i]);
      planet.rotation.y = structures.rotation.y = input.reduced ? .2 : .2 + elapsed * [.025, .018, .022, .012][i];
    });
    skies.forEach((sky, i) => {
      sky.rotation.y = input.reduced ? 0 : Math.sin(elapsed * .03) * .006 * (i + 1) + input.x * .003 * (3 - i);
    });
    link.visible = input.selected >= 0;
    if (link.visible) {
      const detail = stage.querySelector<HTMLElement>('[data-detail]:not([hidden])');
      const label = stage.querySelectorAll<HTMLElement>('[data-world-label]')[input.selected];
      if (detail && label) {
        const d = detail.getBoundingClientRect(), r = label.getBoundingClientRect();
        const viewHeight = 2 * Math.tan(THREE.MathUtils.degToRad(19)) * 15;
        const points = linkGeometry.attributes.position as THREE.BufferAttribute;
        points.setXYZ(0, ((r.left + r.width / 2 - box.left) / width - .5) * viewHeight * camera.aspect, (.5 - (r.bottom - box.top + 5) / height) * viewHeight, 0);
        points.setXYZ(1, ((d.left + d.width / 2 - box.left) / width - .5) * viewHeight * camera.aspect, (.5 - (d.top - box.top - 8) / height) * viewHeight, 0);
        points.needsUpdate = true; linkMaterial.color.setHex(worlds[input.selected].palette.light);
      }
    }
    renderer.render(scene, camera); frame = requestAnimationFrame(tick);
  }
  function resume() {
    stage.dataset.paused = String(document.hidden || !visible);
    if (document.hidden || !visible) { cancelAnimationFrame(frame); frame = 0; }
    else if (!dead && !frame) { previous = performance.now(); frame = requestAnimationFrame(tick); }
  }
  const observer = new ResizeObserver(resize); observer.observe(host);
  const intersection = new IntersectionObserver(entries => { visible = entries[0]?.isIntersecting ?? false; resume(); }); intersection.observe(stage);
  document.addEventListener('visibilitychange', resume);
  const onLost = (event: Event) => { event.preventDefault(); dead = true; cancelAnimationFrame(frame); lost(); };
  renderer.domElement.addEventListener('webglcontextlost', onLost);
  host.appendChild(renderer.domElement); performance.mark('constellation-webgl-mounted'); resize(); resume();
  return () => {
    dead = true; cancelAnimationFrame(frame); observer.disconnect(); intersection.disconnect();
    document.removeEventListener('visibilitychange', resume);
    renderer.domElement.removeEventListener('webglcontextlost', onLost);
    worlds.forEach(world => world.dispose());
    skies.forEach(sky => { sky.geometry.dispose(); sky.material.dispose(); });
    dustGeometry.dispose(); dustMaterial.dispose(); linkGeometry.dispose(); linkMaterial.dispose();
    renderer.dispose(); renderer.domElement.remove();
  };
}
