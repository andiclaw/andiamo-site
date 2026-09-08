import { describe, expect, it } from 'vitest';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import ts from 'typescript';
import { getProduct } from '../../lib/products';
import { ecosystemApps } from '../ecosystem/ecosystem-apps';
import { HOME_PRODUCTS } from './home-products';
import Constellation from './constellation';

const slogan = 'Mobility with Meaning.';
const read = (path: string) => readFileSync(new URL(path, import.meta.url), 'utf8');
const hash = (bytes: Buffer) => createHash('sha256').update(bytes).digest('hex');

function metadata() {
  const module = { exports: {} as { metadata?: { title: string; description: string } } };
  const source = ts.transpileModule(read('../../app/products/rides/page.tsx'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX },
  }).outputText;
  runInNewContext(source, { module, exports: module.exports, require(id: string) {
    if (id === '@/lib/products') return { getProduct };
    if (id === '@/components/hero/journey-hero') return { default: () => null };
    if (id === 'react/jsx-runtime') return { jsx: () => null };
    throw new Error(`Unexpected fixture import: ${id}`);
  } });
  return module.exports.metadata!;
}

describe('September 7 source and capture remainder', () => {
  it('uses the exact owner slogan in the canonical Rides product', () => {
    expect(getProduct('andiamo').tagline).toBe(slogan);
  });
  it('uses the exact owner slogan in the ecosystem label', () => {
    expect(ecosystemApps.find(p => p.key === 'andiamo')!.tagline).toBe(slogan);
  });
  it('uses the same slogan in Rides title and description metadata', () => {
    expect(metadata().title).toBe(`Rides: ${slogan} | Andiamo Tech`);
    expect(metadata().description).toBe(`Rides by Andiamo Tech. ${slogan} Closed beta.`);
  });
  it('server renders the slogan in both the Rides node and disclosure', () => {
    const html = renderToStaticMarkup(createElement(Constellation));
    const rides = html.slice(html.indexOf('data-product="andiamo"'), html.indexOf('data-product="pathfinder"'));
    expect(rides.slice(0, rides.indexOf('</button>'))).toContain(slogan);
    expect(rides.match(/Mobility with Meaning\./g)).toHaveLength(2);
    expect(rides).not.toContain('Community mobility');
    expect(rides).toContain('Closed beta');
  });

  function manifest() { return JSON.parse(read('./capture-provenance.json')); }
  function verifyMissingCaptureRegister(register: ReturnType<typeof manifest>) {
    expect(register.status).toBe('NEEDS_EVIDENCE');
    expect(register.siteBaseline.commit).toBe('a546775cf93bef48287fd023c1e5aee960cd47df');
    expect(register.siteBaseline.tree).toBe('efdc6d7a6e757ff06dab0d54308d6a7c3cdc237f');
    expect(register.products.map((p: { key: string }) => p.key)).toEqual(HOME_PRODUCTS.map(p => p.key));
    for (const [i, product] of HOME_PRODUCTS.entries()) {
      const entry = register.products[i];
      expect(entry.captureStatus).toBe('NEEDS_EVIDENCE');
      expect(entry.reason).toBe('NO_APPROVED_LOCAL_DEMO_CAPTURE_PACKET');
      expect(entry.capture).toBeNull();
      expect(entry.illustration).toEqual({
        kind: product.preview.kind, label: product.preview.label,
        asset: product.preview.asset,
        sha256: hash(readFileSync(new URL(`../../../public${product.preview.asset}`, import.meta.url))),
        sourceRepo: product.preview.sourceRepo, sourceCommit: product.preview.sourceCommit,
        sourcePaths: [...product.preview.sourcePaths],
      });
    }
  }
  it('records four missing captures and exact retained illustration bytes/source references', () => {
    verifyMissingCaptureRegister(manifest());
  });
  it('rejects omitted or duplicated products rather than overstating coverage', () => {
    const missing = manifest(); missing.products.pop();
    expect(() => verifyMissingCaptureRegister(missing)).toThrow();
    const duplicate = manifest(); duplicate.products[1] = duplicate.products[0];
    expect(() => verifyMissingCaptureRegister(duplicate)).toThrow();
  });
  it('rejects substituted assets or source custody', () => {
    for (const field of ['sha256', 'asset', 'sourceCommit']) {
      const changed = manifest(); changed.products[0].illustration[field] = 'substituted';
      expect(() => verifyMissingCaptureRegister(changed)).toThrow();
    }
  });
  it('rejects a claimed screenshot or invented capture receipt', () => {
    const relabeled = manifest(); relabeled.products[0].illustration.kind = 'screenshot';
    expect(() => verifyMissingCaptureRegister(relabeled)).toThrow();
    const invented = manifest(); invented.products[0].capture = { route: '/synthetic-test-only' };
    expect(() => verifyMissingCaptureRegister(invented)).toThrow();
    const cleared = manifest(); cleared.products[0].captureStatus = 'CAPTURED';
    expect(() => verifyMissingCaptureRegister(cleared)).toThrow();
  });
  it('keeps public render honestly labeled and the known motto intact', () => {
    const html = renderToStaticMarkup(createElement(Constellation));
    expect(html.match(/Interface illustration/g)).toHaveLength(4);
    expect(html).toContain('Building software to better the world.');
    expect(html).not.toContain('/brand/captures/');
  });
});
