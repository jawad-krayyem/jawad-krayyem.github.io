import { createRequire } from 'node:module';
import assert from 'node:assert/strict';
const { chromium } = createRequire(process.argv[3] || new URL('../package.json', import.meta.url))('playwright');
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true, args: ['--enable-unsafe-swiftshader'] });
const base = process.argv[2] || 'http://127.0.0.1:4180';
let failures = 0;
async function check(name, fn) { try { await fn(); console.log(`PASS ${name}`); } catch (error) { failures++; console.log(`FAIL ${name}: ${error.message.slice(0, 700)}`); } }
try {
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  await context.addInitScript(() => { try { localStorage.setItem('jk-analytics-consent-v1', JSON.stringify({ choice: 'rejected', savedAt: Date.now() })); } catch {} });
  const page = await context.newPage(); const errors = []; page.on('pageerror', error => errors.push(error.message)); await page.goto(base);
  await check('CPU button reveals all four navigable project modules', async () => {
    const toggle = page.getByRole('button', { name: 'Explore the processor', exact: true }); await toggle.click({ timeout: 3000 });
    assert.equal(await toggle.getAttribute('aria-expanded'), 'true');
    assert.equal(await page.locator('.cpu-project-link:visible').count(), 4);
    assert.match(await page.getByRole('region', { name: 'Projects inside the processor' }).innerText(), /InsightPilot/);
    await toggle.press('Space'); assert.equal(await toggle.getAttribute('aria-expanded'), 'false');
  });
  await check('real WebGL processor renders', async () => { await page.waitForFunction(() => document.querySelector('.cpu-lab')?.dataset.scene === 'ready', undefined, { timeout: 12000 }); assert.equal(await page.locator('.cpu-canvas canvas').count(), 1); });
  await check('cursor changes on project and scroll, with an opt-out', async () => {
    await page.mouse.move(500, 500); await page.waitForFunction(() => document.documentElement.classList.contains('has-custom-cursor'));
    await page.getByRole('button', { name: 'Explore the processor', exact: true }).hover();
    await page.waitForFunction(() => document.querySelector('.custom-cursor')?.dataset.mode === 'Explore');
    await page.mouse.wheel(0, 120); await page.waitForFunction(() => document.querySelector('.custom-cursor')?.dataset.mode === 'Scroll');
    await page.getByRole('button', { name: 'Cursor effects', exact: true }).click(); assert.equal(await page.evaluate(() => document.documentElement.classList.contains('has-custom-cursor')), false);
    await page.locator('.footer').getByRole('link', { name: 'Résumé', exact: true }).click();
    await page.getByRole('heading', { level: 1 }).waitFor();
    await page.waitForFunction(() => document.querySelector('.cursor-setting')?.getAttribute('aria-pressed') === 'false', undefined, { timeout: 3000 });
    await page.goto(base);
  });
  await check('reduced motion disables custom cursor and leaves processor usable', async () => {
    await page.emulateMedia({ reducedMotion: 'reduce' }); await page.mouse.move(500, 400);
    await page.waitForFunction(() => !document.documentElement.classList.contains('has-custom-cursor'));
    await page.goto(base); await page.getByRole('button', { name: 'Explore the processor', exact: true }).click(); assert.equal(await page.locator('.cpu-project-link:visible').count(), 4);
  });
  await check('WebGL failure keeps project navigation usable', async () => {
    const fallback = await browser.newContext({ viewport: { width: 375, height: 812 } });
    await fallback.addInitScript(() => { const original = HTMLCanvasElement.prototype.getContext; HTMLCanvasElement.prototype.getContext = function(type, ...args) { if (type === 'webgl2' || type === 'webgl') return null; return original.call(this, type, ...args); }; });
    const plain = await fallback.newPage(); await plain.goto(base); await plain.getByRole('button', { name: 'Reject analytics', exact: true }).click();
    await plain.getByRole('button', { name: 'Explore the processor', exact: true }).click(); assert.equal(await plain.locator('.cpu-project-link:visible').count(), 4); assert.ok(await plain.evaluate(() => document.documentElement.scrollWidth <= innerWidth)); await fallback.close();
  });
  await check('no unhandled processor or cursor errors', async () => assert.deepEqual(errors, [])); await context.close();
} finally { await browser.close(); }
if (failures) process.exitCode = 1;
