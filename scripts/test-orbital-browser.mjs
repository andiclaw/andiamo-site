// Loopback-only production candidate checks. External requests are intercepted.
import { createRequire } from 'node:module';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import assert from 'node:assert/strict';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const sharp = require('sharp');
const origin = process.env.HERO_TEST_ORIGIN || 'http://127.0.0.1:3028';
assert.equal(new URL(origin).hostname, '127.0.0.1');
const output = process.env.HERO_EVIDENCE_DIR;
assert.ok(output); mkdirSync(output, { recursive: true });
const browser = await chromium.launch({ headless: true, channel: 'chrome' });
const results = [];
const keys = ['velocity', 'academy', 'andiamo', 'pathfinder'];
async function point(page, locator, action = 'hover') {
  // Real coordinates permit pointer entry into an intentionally floating target.
  const r = await locator.boundingBox(); assert.ok(r);
  const x = r.x + r.width / 2, y = r.y + r.height / 2;
  await page.mouse.move(x, y);
  if (action === 'click') await page.mouse.click(x, y);
  if (action === 'tap') await page.touchscreen.tap(x, y);
}
async function open(options = {}, mode = '') {
  const page = await browser.newPage(options), errors = [], external = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.route('**/*', route => {
    if (new URL(route.request().url()).origin !== origin) { external.push(route.request().url()); return route.abort(); }
    return route.continue();
  });
  await page.addInitScript(() => {
    window.metrics = { lcp: 0, cls: 0, frames: 0 };
    new PerformanceObserver(list => list.getEntries().forEach(e => { window.metrics.lcp = e.startTime; })).observe({ type: 'largest-contentful-paint', buffered: true });
    new PerformanceObserver(list => list.getEntries().forEach(e => { if (!e.hadRecentInput) window.metrics.cls += e.value; })).observe({ type: 'layout-shift', buffered: true });
    const render = WebGL2RenderingContext.prototype.drawElements;
    WebGL2RenderingContext.prototype.drawElements = function(...args) { window.metrics.frames++; return render.apply(this, args); };
  });
  if (mode === 'no-webgl') await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function(type, ...args) { return type.startsWith('webgl') ? null : original.call(this, type, ...args); };
  });
  await page.goto(origin);
  return { page, errors, external };
}
try {
  for (const viewport of [{ width: 1440, height: 1000 }, { width: 768, height: 1024 }, { width: 375, height: 812 }]) {
    const { page, errors, external } = await open({ viewport, hasTouch: viewport.width === 375 });
    await page.waitForFunction(() => document.querySelector('[data-constellation]')?.dataset.depth === 'true');
    await page.waitForTimeout(700);
    const metrics = await page.evaluate(() => ({ ...window.metrics,
      mount: performance.getEntriesByName('constellation-webgl-mounted')[0]?.startTime,
      overflow: document.documentElement.scrollWidth > innerWidth,
      heroBottom: document.querySelector('[data-constellation]').getBoundingClientRect().bottom,
    }));
    assert.equal(metrics.overflow, false); assert.equal(metrics.cls, 0);
    assert.ok(metrics.mount > metrics.lcp, 'SSR content paints before Three.js');
    assert.ok(metrics.heroBottom < viewport.height, 'next section hint');
    await page.screenshot({ path: join(output, `initial-${viewport.width}.png`) });
    for (const img of await page.locator('#products img').all()) {
      await img.scrollIntoViewIfNeeded();
      await img.evaluate(el => el.decode());
    }
    await page.evaluate(() => scrollTo(0, 0));
    await page.waitForTimeout(200);
    await page.screenshot({ path: join(output, `full-${viewport.width}.png`), fullPage: true });
    const canvas = page.locator('[data-constellation] canvas');
    const first = await canvas.screenshot({ path: join(output, `canvas-${viewport.width}-a.png`) });
    await page.waitForTimeout(500);
    const second = await canvas.screenshot({ path: join(output, `canvas-${viewport.width}-b.png`) });
    assert.notDeepEqual(first, second, 'moving rendered pixels');
    const pixels = await sharp(first).removeAlpha().raw().toBuffer();
    const colors = new Set();
    for (let i = 0; i < pixels.length; i += 3) colors.add(`${pixels[i]},${pixels[i+1]},${pixels[i+2]}`);
    assert.ok(colors.size > 500, 'nonblank sphere surfaces');
    const samples = [];
    for (const key of keys) {
      const node = page.locator(`[data-product="${key}"] [data-node]`);
      await node.focus();
      const detail = page.locator(`#product-detail-${key}`);
      await page.waitForTimeout(350);
      assert.equal(await node.getAttribute('aria-expanded'), 'true');
      assert.ok(Number(await node.evaluate(el => getComputedStyle(el).scale)) > 1.1, 'selected sphere expands');
      assert.equal(await detail.isVisible(), true);
      assert.equal(await detail.locator('figcaption').textContent(), 'Interface illustration');
      const shape = await detail.evaluate(el => {
        const line = el.querySelector('[data-preview-line]').getBoundingClientRect();
        const img = el.querySelector('img'), image = img.getBoundingClientRect();
        const rect = el.getBoundingClientRect(), stage = el.closest('[data-stage]').getBoundingClientRect();
        return { below: image.top >= line.bottom, loaded: img.complete && img.naturalWidth > 0,
          contained: rect.bottom <= stage.bottom + 1 && rect.left >= 0 && rect.right <= innerWidth,
          overlap: [...document.querySelectorAll('[data-node]')].some(node => { const n = node.getBoundingClientRect(); return Math.min(n.right, rect.right) > Math.max(n.left, rect.left) + 2 && Math.min(n.bottom, rect.bottom) > Math.max(n.top, rect.top) + 2; }) };
      });
      assert.deepEqual(shape, { below: true, loaded: true, contained: true, overlap: false });
      const targetSamples = await page.evaluate(async () => {
        const elements = [...document.querySelectorAll('[data-node], [data-detail]:not([hidden]) a')];
        const animations = document.querySelector('[data-stage]').getAnimations({ subtree: true });
        animations.forEach(a => a.pause());
        const samples = [];
        for (let ms = 0; ms <= 350; ms += 25) {
          animations.forEach(a => { a.currentTime = ms; }); await new Promise(requestAnimationFrame);
          for (const el of elements) { const r = el.getBoundingClientRect(); samples.push({ ms, text: el.textContent, width: r.width, height: r.height }); }
        }
        animations.forEach(a => a.play()); return samples;
      });
      for (const sample of targetSamples) assert.ok(sample.width >= 44 && sample.height >= 44, JSON.stringify(sample));
      samples.push({ key, targets: targetSamples });
      await page.screenshot({ path: join(output, `${key}-${viewport.width}.png`) });
      await page.keyboard.press('Tab');
      assert.equal(await detail.locator('a').first().evaluate(el => el === document.activeElement), true);
      await page.keyboard.press('Escape');
      assert.equal(await node.evaluate(el => el === document.activeElement), true);
      assert.equal(await node.getAttribute('aria-expanded'), 'false');
    }
    const velocity = page.locator('[data-product="velocity"] [data-node]');
    const academy = page.locator('[data-product="academy"] [data-node]');
    await point(page, velocity, 'click'); await point(page, academy);
    assert.equal(await academy.getAttribute('aria-expanded'), 'true', 'click one then hover another');
    await page.locator('#product-detail-academy img').hover();
    await page.locator('#product-detail-academy a').hover();
    assert.equal(await academy.getAttribute('aria-expanded'), 'true', 'hover transfer remains open');
    await page.locator('#product-detail-academy a').focus(); await point(page, velocity);
    assert.equal(await academy.getAttribute('aria-expanded'), 'true', 'keyboard CTA retains custody');
    if (viewport.width === 375) {
      await point(page, page.locator('[data-product="andiamo"] [data-node]'), 'tap');
      assert.equal(page.url(), `${origin}/`);
      assert.equal(await page.locator('#product-detail-andiamo').isVisible(), true);
    }
    // Browser-executed visibility event control; not a claim of OS tab switching.
    await page.evaluate(() => { Object.defineProperty(document, 'hidden', { configurable: true, get: () => true }); document.dispatchEvent(new Event('visibilitychange')); });
    const paused = await page.evaluate(() => window.metrics.frames);
    await page.waitForTimeout(300);
    assert.equal(await page.evaluate(() => window.metrics.frames), paused, 'hidden state stops GPU draws');
    assert.equal(await page.locator('[data-stage]').getAttribute('data-paused'), 'true');
    await page.evaluate(() => { delete document.hidden; document.dispatchEvent(new Event('visibilitychange')); });
    await page.waitForTimeout(300);
    assert.ok(await page.evaluate(() => window.metrics.frames) > paused, 'visible state resumes GPU draws');
    const labels = await page.locator('#products article').evaluateAll(articles => articles.map(article => {
      const label = article.querySelector('p');
      const color = getComputedStyle(label).color;
      const rgb = color.match(/[\d.]+/g).slice(0, 3).map(Number);
      const lum = c => c.map(v => { v /= 255; return v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4; }).reduce((s, v, i) => s + v * [.2126, .7152, .0722][i], 0);
      return { text: label.textContent, color, contrast: (lum(rgb) + .05) / (lum([10, 15, 26]) + .05) };
    }));
    for (const label of labels) assert.ok(label.contrast >= 4.5, JSON.stringify(label));
    assert.deepEqual(errors, []); assert.deepEqual(external, []);
    results.push({ viewport, metrics, canvasColors: colors.size, samples, labels, checks: 'previews/order/expansion/hover/focus/Escape/tap/44px/visibility-event/contrast pass' });
    await page.close();
  }
  for (const mode of ['no-js', 'no-webgl', 'reduced', 'context-loss']) {
    const { page, errors, external } = await open({ viewport: { width: 375, height: 812 }, javaScriptEnabled: mode !== 'no-js', reducedMotion: mode === 'reduced' ? 'reduce' : 'no-preference' }, mode);
    await page.waitForTimeout(2200);
    assert.equal(await page.locator('[data-node]').count(), 4);
    if (mode === 'no-js') assert.equal(await page.locator('[data-detail]:visible').count(), 4);
    else if (mode === 'no-webgl') {
      assert.equal(await page.locator('[data-constellation]').getAttribute('data-depth'), 'false');
      await point(page, page.locator('[data-product="pathfinder"] [data-node]'), 'click');
      assert.equal(await page.locator('#product-detail-pathfinder').isVisible(), true);
    } else {
      await page.waitForFunction(() => document.querySelector('[data-constellation]').dataset.depth === 'true');
      if (mode === 'reduced') {
        const canvas = page.locator('[data-constellation] canvas');
        const a = await canvas.screenshot(); await page.waitForTimeout(400); const b = await canvas.screenshot();
        assert.deepEqual(a, b, 'static reduced-motion canvas');
        assert.equal(await page.locator('[data-node]').first().evaluate(el => getComputedStyle(el).animationName), 'none');
      } else {
        await page.locator('canvas').evaluate(el => el.getContext('webgl2').getExtension('WEBGL_lose_context').loseContext());
        await page.waitForFunction(() => document.querySelector('[data-constellation]').dataset.depth === 'false');
        await point(page, page.locator('[data-product="academy"] [data-node]'), 'click');
        assert.equal(await page.locator('#product-detail-academy').isVisible(), true);
      }
    }
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    await page.screenshot({ path: join(output, `${mode}-375.png`), fullPage: mode === 'no-js' });
    assert.deepEqual(errors, []); assert.deepEqual(external, []);
    results.push({ mode, pass: true }); await page.close();
  }
  writeFileSync(join(output, 'browser-results.json'), JSON.stringify(results, null, 2));
  console.log(JSON.stringify(results.map(({ samples, ...rest }) => rest), null, 2));
} finally { await browser.close(); }
