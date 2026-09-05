import { describe, expect, it, vi } from 'vitest';
import { createWorld } from './worlds';

describe('distinct deep-space destinations', () => {
  it('constructs four different surface/structure signatures, not recolored bubbles', () => {
    const worlds = [0, 1, 2, 3].map(createWorld);
    try {
      expect(new Set(worlds.map(w => w.structures.children.length)).size).toBe(4);
      expect(worlds[3].planet.material.flatShading).toBe(true);
      expect(worlds[0].planet.material.flatShading).toBe(false);
      expect(new Set(worlds.map(w => w.palette.night)).size).toBe(4);
    } finally { worlds.forEach(w => w.dispose()); }
  });
  it('uses rough opaque relief with a non-uniform authored surface', () => {
    for (const i of [0, 1, 2, 3]) {
      const world = createWorld(i);
      try {
        expect(world.planet.material.roughness).toBeGreaterThan(.8);
        expect(world.planet.material.opacity).toBe(1);
        expect(world.planet.material.transparent).toBe(false);
        expect(world.planet.material.type).toBe('MeshStandardMaterial');
        expect(new Set(world.planet.geometry.attributes.color.array).size).toBeGreaterThan(100);
      } finally { world.dispose(); }
    }
  });
  it('disposes its owned surface and material', () => {
    const world = createWorld(0);
    const geometry = vi.spyOn(world.planet.geometry, 'dispose');
    const material = vi.spyOn(world.planet.material, 'dispose');
    world.dispose();
    expect(geometry).toHaveBeenCalledOnce(); expect(material).toHaveBeenCalledOnce();
  });
});
