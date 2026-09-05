// Local production-build verification. Never follows a product/provider URL.
// Supply existing Playwright/sharp packages via NODE_PATH; no install is performed.
import { createRequire } from 'node:module';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import assert from 'node:assert/strict';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const sharp = require('sharp');
const origin = process.env.HERO_TEST_ORIGIN || 'http://127.0.0.1:3027';
assert.equal(new URL(origin).hostname, '127.0.0.1', 'loopback only');
const output = process.env.HERO_EVIDENCE_DIR;
assert.ok(output, 'HERO_EVIDENCE_DIR required');
mkdirSync(output, { recursive: true });
const browser = await chromium.launch({ headless: true, channel: 'chrome' });
const results = [];

async function pageFor(options = {}) {
  const page = await browser.newPage(options);
  const external = [], errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.route('**/*', route => {
    if (new URL(route.request().url()).origin !== origin) { external.push(route.request().url()); return route.abort(); }
    return route.continue();
  });
  await page.addInitScript(() => {
    window.heroMetrics = { lcp: 0, cls: 0 };
    new PerformanceObserver(list => list.getEntries().forEach(e => { window.heroMetrics.lcp = e.startTime; })).observe({ type: 'largest-contentful-paint', buffered: true });
    new PerformanceObserver(list => list.getEntries().forEach(e => { if (!e.hadRecentInput) window.heroMetrics.cls += e.value; })).observe({ type: 'layout-shift', buffered: true });
  });
  return { page, external, errors };
}
try {
  for (const viewport of [{ width: 1440, height: 1000 }, { width: 375, height: 812 }, { width: 768, height: 1024 }, { width: 1024, height: 1000 }]) {
    const { page, external, errors } = await pageFor({ viewport, hasTouch: viewport.width <= 1000 });
    await page.goto(origin);
    await page.waitForFunction(() => document.querySelector('[data-constellation]')?.getAttribute('data-depth') === 'true');
    await page.waitForTimeout(1200);
    const metrics = await page.evaluate(() => ({ ...window.heroMetrics,
      mount: performance.getEntriesByName('constellation-webgl-mounted')[0]?.startTime,
      scheduled: performance.getEntriesByName('constellation-after-lcp')[0]?.startTime,
      overflow: document.documentElement.scrollWidth > innerWidth,
      heroBottom: document.querySelector('[data-constellation]').getBoundingClientRect().bottom,
    }));
    assert.equal(metrics.overflow, false);
    assert.ok(metrics.mount > metrics.lcp, 'WebGL mounted after measured LCP');
    assert.equal(metrics.cls, 0, 'fixed hero footprint');
    assert.ok(metrics.heroBottom < viewport.height, 'next band remains visible');
    await page.screenshot({ path: join(output, `after-${viewport.width}.png`) });
    const canvas = page.locator('[data-constellation] canvas');
    const frame1 = await canvas.screenshot({ path: join(output, `canvas-${viewport.width}-a.png`) });
    await page.waitForTimeout(700);
    const frame2 = await canvas.screenshot({ path: join(output, `canvas-${viewport.width}-b.png`) });
    const raw = await sharp(frame1).removeAlpha().raw().toBuffer();
    const colors = new Set();
    for (let i = 0; i < raw.length; i += 3) colors.add(`${raw[i]},${raw[i + 1]},${raw[i + 2]}`);
    assert.ok(colors.size > 50, 'canvas pixels nonblank');
    assert.notDeepEqual(frame1, frame2, 'scene is moving');
    for (const key of ['velocity', 'academy', 'andiamo', 'pathfinder']) {
      const node = page.locator(`[data-product="${key}"] [data-node]`);
      await node.focus();
      await page.waitForTimeout(500);
      assert.equal(await node.getAttribute('aria-expanded'), 'true');
      assert.equal(await page.locator(`#product-detail-${key}`).isVisible(), true);
      const overlap = await page.evaluate(() => {
        const detail = document.querySelector('[data-detail]:not([hidden])').getBoundingClientRect();
        return Array.from(document.querySelectorAll('[data-node]')).some(el => {
          const r = el.getBoundingClientRect();
          return Math.min(detail.right, r.right) - Math.max(detail.left, r.left) > 2 && Math.min(detail.bottom, r.bottom) - Math.max(detail.top, r.top) > 2;
        });
      });
      assert.equal(overlap, false, `${key} detail does not obscure another node`);
      const geometry = await page.evaluate(() => {
        const nodes = Array.from(document.querySelectorAll('[data-node]')).map(el => el.getBoundingClientRect());
        const detail = document.querySelector('[data-detail]:not([hidden])').getBoundingClientRect();
        const stage = document.querySelector('[data-stage]').getBoundingClientRect();
        return {
          pairOverlap: nodes.some((a, i) => nodes.slice(i + 1).some(b => Math.min(a.right, b.right) - Math.max(a.left, b.left) > 2 && Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top) > 2)),
          contained: detail.bottom <= stage.bottom + 1 && detail.left >= 0 && detail.right <= innerWidth,
        };
      });
      assert.equal(geometry.pairOverlap, false, `${key} product nodes do not overlap`);
      assert.equal(geometry.contained, true, `${key} detail stays inside the hero stage`);
      const bounds = await node.boundingBox(); assert.ok(bounds.height >= 44 && bounds.width >= 44);
      await page.screenshot({ path: join(output, `${key}-${viewport.width}.png`) });
      await page.keyboard.press('Tab');
      assert.equal(await page.locator(`#product-detail-${key} a`).first().evaluate(el => el === document.activeElement), true);
      await page.keyboard.press('Escape');
      assert.equal(await node.evaluate(el => el === document.activeElement), true);
      assert.equal(await node.getAttribute('aria-expanded'), 'false');
    }
    // Proximity outside a node, then focused selection must defeat pointer movement.
    await page.locator('h1').click();
    if (viewport.width > 1000) {
      const box = await page.locator('[data-product="academy"] [data-node]').boundingBox();
      await page.mouse.move(box.x + box.width + 15, box.y + box.height / 2);
      await page.waitForTimeout(100);
      assert.equal(await page.locator('[data-product="academy"] [data-node]').getAttribute('aria-expanded'), 'true');
      await page.locator('[data-product="velocity"] [data-node]').focus();
      await page.waitForTimeout(100);
      await page.mouse.move(box.x + 5, box.y + 5);
      assert.equal(await page.locator('[data-product="velocity"] [data-node]').getAttribute('aria-expanded'), 'true');
    } else {
      const node = page.locator('[data-product="andiamo"] [data-node]');
      await node.tap(); assert.equal(page.url(), `${origin}/`);
      await node.tap(); await page.waitForTimeout(200);
      assert.equal(external.length, 1, 'second tap attempts the canonical link, intercepted locally');
      assert.equal(external[0], 'https://rides.andiamo.tech/'); external.length = 0;
    }
    assert.deepEqual(errors, []); assert.deepEqual(external, []);
    results.push({ viewport, metrics, canvasColors: colors.size, controls: 'four selections/keyboard/focus/overlap/44px/no-fetch/motion pass' });
    await page.close();
  }
  for (const mode of ['no-js', 'no-webgl', 'context-loss', 'reduced']) {
    const { page, external, errors } = await pageFor({ viewport: { width: 375, height: 812 }, javaScriptEnabled: mode !== 'no-js', reducedMotion: mode === 'reduced' ? 'reduce' : 'no-preference' });
    if (mode === 'no-webgl') await page.addInitScript(() => {
      const original = HTMLCanvasElement.prototype.getContext;
      HTMLCanvasElement.prototype.getContext = function(type, ...args) { return type.startsWith('webgl') ? null : original.call(this, type, ...args); };
    });
    await page.goto(origin); await page.waitForTimeout(2200);
    assert.equal(await page.locator('[data-node]').count(), 4);
    if (mode === 'no-js') {
      assert.equal(await page.locator('[data-detail]:visible').count(), 4);
      assert.equal(await page.locator('[data-constellation] canvas').count(), 0);
    } else if (mode === 'no-webgl') {
      assert.equal(await page.locator('[data-constellation]').getAttribute('data-depth'), 'false');
      await page.locator('[data-product="andiamo"] [data-node]').focus();
      assert.equal(await page.locator('#product-detail-andiamo').isVisible(), true);
    } else if (mode === 'context-loss') {
      await page.waitForFunction(() => document.querySelector('[data-constellation]')?.getAttribute('data-depth') === 'true');
      await page.locator('[data-constellation] canvas').evaluate(el => el.getContext('webgl2').getExtension('WEBGL_lose_context').loseContext());
      await page.waitForFunction(() => document.querySelector('[data-constellation]')?.getAttribute('data-depth') === 'false');
      await page.locator('[data-product="academy"] [data-node]').focus();
      assert.equal(await page.locator('#product-detail-academy').isVisible(), true);
    } else {
      const canvas = page.locator('[data-constellation] canvas');
      const a = await canvas.screenshot(); await page.waitForTimeout(600); const b = await canvas.screenshot();
      assert.deepEqual(a, b, 'reduced-motion static pixels');
      await page.mouse.move(30, 300); assert.equal(await page.locator('[data-products]').evaluate(el => getComputedStyle(el).transform), 'none');
    }
    await page.screenshot({ path: join(output, `${mode}-375.png`), fullPage: mode === 'no-js' });
    assert.deepEqual(external, []); assert.deepEqual(errors, []);
    results.push({ mode, controls: 'pass' }); await page.close();
  }
  const { page: rides, external, errors } = await pageFor({ viewport: { width: 375, height: 812 } });
  const response = await rides.goto(`${origin}/products/rides`);
  assert.equal(response.status(), 200);
  assert.equal(await rides.locator('h1').textContent(), 'Rides');
  assert.ok((await rides.locator('main').textContent()).includes('Community mobility - for anyone, anywhere.'));
  assert.ok((await rides.locator('h2').first().textContent()).includes('One trip. Every mode.'));
  await rides.screenshot({ path: join(output, 'rides-route-375.png') });
  assert.deepEqual(external, []); assert.deepEqual(errors, []);
  results.push({ route: '/products/rides', controls: '200, name, tagline, relocated journey, no-fetch pass' });
  await rides.close();
  writeFileSync(join(output, 'after.json'), JSON.stringify(results, null, 2));
  console.log(JSON.stringify(results, null, 2));
} finally { await browser.close(); }
