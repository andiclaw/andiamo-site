/**
 * SITE-SEC-DEFENDER-DEPS-001 - the runtime image must not carry npm.
 *
 * Defender's 12 findings on the LIVE andiamo-site image (0.8.3, digest
 * 7f21037782) are not in this app's dependency tree at all: 11 are npm-CLI
 * internals (tar, glob, minimatch, pacote, sigstore, cross-spawn, ...) that
 * ship inside the base image's bundled npm, and one is alpine's openssl. The
 * runtime entrypoint is `node server.js`, so npm is software we carry and never
 * run. The Dockerfile deletes it from the runner stage.
 *
 * A source-shaped guard, deliberately: there is no container runtime on this
 * machine, so the image itself cannot be built or scanned here. What this can
 * still catch is the regression that would silently undo the fix - the removal
 * being dropped, or drifting into the wrong stage, where it would break the
 * build instead of shrinking the image.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';

/** The Dockerfile split into [stageHeader, body] pairs, in file order. */
function stages(): Array<{ header: string; body: string }> {
  const src = readFileSync('Dockerfile', 'utf8');
  const parts = src.split(/^(FROM .*)$/m).slice(1);
  const out: Array<{ header: string; body: string }> = [];
  for (let i = 0; i < parts.length; i += 2) out.push({ header: parts[i], body: parts[i + 1] ?? '' });
  return out;
}

const RUNNER = () => stages().find((s) => / AS runner$/.test(s.header.trim()));
const BUILDER = () => stages().find((s) => / AS builder$/.test(s.header.trim()));

describe('the runtime image carries no package manager', () => {
  it('the runner stage deletes the bundled npm and its bin shims', () => {
    const runner = RUNNER();
    expect(runner).toBeDefined();
    expect(runner!.body).toContain('rm -rf /usr/local/lib/node_modules/npm');
    expect(runner!.body).toContain('/usr/local/bin/npm');
    expect(runner!.body).toContain('/usr/local/bin/npx');
  });

  it('the builder stage still HAS npm, so the removal did not drift upstream', () => {
    // Positive control. Without this, deleting npm in the builder would pass
    // the assertion above while making the image unbuildable.
    const builder = BUILDER();
    expect(builder).toBeDefined();
    expect(builder!.body).toMatch(/npm ci|npm install/);
    expect(builder!.body).toContain('npm run build');
    expect(builder!.body).not.toContain('rm -rf /usr/local/lib/node_modules/npm');
  });

  it('the runtime entrypoint is node, not a package-manager script', () => {
    // The reason the removal is safe: nothing at runtime invokes npm.
    const runner = RUNNER();
    expect(runner!.body).toContain('CMD ["node", "server.js"]');
    expect(runner!.body).not.toMatch(/CMD \[?"?npm/);
  });
});
