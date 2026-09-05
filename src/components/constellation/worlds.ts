import * as THREE from 'three';

const PALETTES = [
  { night: 0x041323, land: 0x18526c, light: 0x37d4ef },
  { night: 0x130e2b, land: 0x493872, light: 0xa98cf4 },
  { night: 0x052019, land: 0x236f57, light: 0x61dcac },
  { night: 0x171d23, land: 0x4d514f, light: 0xe3b45e },
];

/** Authored planetary relief and structures, not geographic or product data. */
export function createWorld(index: number) {
  const palette = PALETTES[index];
  const group = new THREE.Group();
  const geometry = index === 3 ? new THREE.IcosahedronGeometry(1, 2) : new THREE.SphereGeometry(1, 64, 40);
  const positions = geometry.attributes.position;
  const colors = new Float32Array(positions.count * 3);
  const dark = new THREE.Color(palette.night), land = new THREE.Color(palette.land);
  for (let i = 0; i < positions.count; i++) {
    const x = positions.getX(i), y = positions.getY(i), z = positions.getZ(i);
    const terrain = Math.sin(x * 9 + index * 2) * Math.cos(y * 12 - z * 4) + Math.sin(z * 17 + x * 5) * .35;
    const relief = index === 3 ? 1 : 1 + Math.max(0, terrain) * .025;
    positions.setXYZ(i, x * relief, y * relief, z * relief);
    dark.clone().lerp(land, THREE.MathUtils.clamp((terrain + 1.4) / 2.5, 0, 1)).toArray(colors, i * 3);
  }
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geometry.computeVertexNormals();
  const surface = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: .87, metalness: .12,
    flatShading: index === 3, emissive: palette.night, emissiveIntensity: .15 });
  const planet = new THREE.Mesh(geometry, surface); group.add(planet);
  const glow = new THREE.MeshBasicMaterial({ color: palette.light, transparent: true, opacity: .055, side: THREE.BackSide });
  const atmosphere = new THREE.Mesh(new THREE.SphereGeometry(1.025, 48, 32), glow); group.add(atmosphere);
  const structures = new THREE.Group(); group.add(structures);
  const lineMaterial = new THREE.LineBasicMaterial({ color: palette.light, transparent: true, opacity: .5 });
  function curve(points: THREE.Vector3[], opacity = .5) {
    const mat = lineMaterial.clone(); mat.opacity = opacity;
    const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), mat);
    structures.add(line);
  }
  function latitude(angle: number, radius = 1.03) {
    return Array.from({ length: 97 }, (_, i) => {
      const t = i / 96 * Math.PI * 2;
      return new THREE.Vector3(Math.cos(t) * Math.cos(angle), Math.sin(angle), Math.sin(t) * Math.cos(angle)).multiplyScalar(radius);
    });
  }
  if (index === 0) {
    // Signal world: restrained longitudinal/latitudinal network bands.
    for (const a of [-.6, -.15, .3, .7]) curve(latitude(a), .28);
    for (let i = 0; i < 3; i++) {
      const points = latitude(0).map(p => p.applyAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI / 2).applyAxisAngle(new THREE.Vector3(0, 1, 0), i));
      curve(points, .25);
    }
  } else if (index === 1) {
    // Learning world: a broad partial orbit with small warm navigation lights.
    const orbit = Array.from({ length: 100 }, (_, i) => {
      const t = i / 99 * Math.PI * 1.8;
      return new THREE.Vector3(Math.cos(t) * 1.42, Math.sin(t) * .45, Math.sin(t) * 1.22);
    });
    curve(orbit, .68);
    for (const i of [12, 51, 82]) {
      const star = new THREE.Mesh(new THREE.OctahedronGeometry(.025), new THREE.MeshBasicMaterial({ color: 0xefca88 }));
      star.position.copy(orbit[i]); structures.add(star);
    }
  } else if (index === 2) {
    // Community world: distinct curved routes join a small set of surface nodes.
    const anchors = [new THREE.Vector3(-.5, .6, .7), new THREE.Vector3(.65, .22, .72), new THREE.Vector3(.1, -.65, .77)].map(p => p.normalize().multiplyScalar(1.045));
    for (let i = 0; i < 3; i++) {
      const a = anchors[i], b = anchors[(i + 1) % 3];
      curve(Array.from({ length: 40 }, (_, j) => a.clone().lerp(b, j / 39).normalize().multiplyScalar(1.045)), .8);
      const node = new THREE.Mesh(new THREE.SphereGeometry(.025, 8, 6), new THREE.MeshBasicMaterial({ color: palette.light }));
      node.position.copy(a); structures.add(node);
    }
  } else {
    // Workspace world: graphite facets and an amber orbital frame.
    const facets = new THREE.IcosahedronGeometry(1.01, 1);
    const edges = new THREE.LineSegments(new THREE.EdgesGeometry(facets), lineMaterial.clone());
    facets.dispose();
    structures.add(edges);
    curve([new THREE.Vector3(-1.2, -.7, 0), new THREE.Vector3(-1.2, .7, 0), new THREE.Vector3(1.2, .7, 0), new THREE.Vector3(1.2, -.7, 0)], .6);
  }
  lineMaterial.dispose();
  return { group, planet, structures, palette,
    dispose() {
      group.traverse(object => {
        const mesh = object as THREE.Mesh;
        mesh.geometry?.dispose();
        const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        materials.forEach(material => material?.dispose());
      });
    },
  };
}
