import { createRequire } from 'node:module';
import assert from 'node:assert/strict';
const { chromium } = createRequire(process.argv[3] || new URL('../package.json', import.meta.url))('playwright');
const base = process.argv[2] || 'http://127.0.0.1:4180';
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
function contrast(a, b) { const luminance = color => { const values = color.match(/[\d.]+/g).slice(0, 3).map(Number).map(value => { const c = value / 255; return c <= .04045 ? c / 12.92 : ((c + .055) / 1.055) ** 2.4; }); return values[0] * .2126 + values[1] * .7152 + values[2] * .0722; }; const x = luminance(a), y = luminance(b); return (Math.max(x, y) + .05) / (Math.min(x, y) + .05); }
let failures = 0;
async function check(name, run) { try { await run(); console.log(`PASS ${name}`); } catch (error) { failures++; console.log(`FAIL ${name}: ${error.message}`); } }
try {
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, colorScheme: 'light', reducedMotion: 'reduce' });
  await context.addInitScript(() => { try { localStorage.setItem('jk-theme', 'light'); localStorage.setItem('jk-analytics-consent-v1', JSON.stringify({ choice: 'rejected', savedAt: Date.now() })); } catch {} });
  const page = await context.newPage();
  await page.goto(base);
  await check('terminal band focus outline has at least 3:1 contrast', async () => {
    await page.locator('.lab-band .button-primary').focus();
    const colors = await page.evaluate(() => [getComputedStyle(document.querySelector('.lab-band .button-primary')).outlineColor, getComputedStyle(document.querySelector('.lab-band')).backgroundColor]);
    assert.ok(contrast(...colors) >= 3, `outline contrast is ${contrast(...colors).toFixed(2)}:1`);
  });
  await check('dark-theme browser printing preserves text contrast', async () => {
    await page.goto(`${base}/resume/`); await page.waitForFunction(() => document.documentElement.classList.contains('dark')); await page.emulateMedia({ media: 'print' });
    await page.waitForFunction(() => getComputedStyle(document.querySelector('.resume-sheet')).backgroundColor === 'rgb(255, 255, 255)');
    const colors = await page.evaluate(() => [getComputedStyle(document.querySelector('.resume-skills span')).color, getComputedStyle(document.querySelector('.resume-sheet')).backgroundColor]);
    assert.equal(colors[1], 'rgb(255, 255, 255)', 'Résumé print surface should be white');
    assert.ok(contrast(...colors) >= 4.5, `print contrast is ${contrast(...colors).toFixed(2)}:1`); await page.emulateMedia({ media: 'screen' });
  });
  await page.emulateMedia({ media: 'screen' });
  await check('responsive pages and images fit at 320, 375, 768, and 1440px', async () => {
    for (const width of [320, 375, 768, 1440]) {
      await page.setViewportSize({ width, height: 900 }); await page.goto(base);
      await page.evaluate(async () => { [...document.images].forEach(image => { image.loading = 'eager'; }); await Promise.allSettled([...document.images].map(image => image.decode())); });
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${width}px overflows`);
      assert.ok(await page.evaluate(() => [...document.images].every(image => image.naturalWidth > 0)), 'a project image did not load');
    }
  });
  await check('walkthroughs play with caption tracks', async () => {
    for (const slug of ['insightpilot', 'sdxl-studio']) {
      await page.goto(`${base}/projects/${slug}/`); const video = page.locator('video');
      await video.evaluate(element => { element.muted = true; return element.play(); });
      await page.waitForFunction(() => document.querySelector('video').currentTime > .1); await video.evaluate(element => element.pause());
      assert.equal(await video.locator('track').count(), 1);
      const captions = await page.request.get(`${base}/demos/${slug}.vtt`); assert.equal(captions.status(), 200); assert.match(await captions.text(), /^WEBVTT/);
    }
  });
  await check('the graphite theme stays fixed and clears an old light preference', async () => {
    await page.goto(base);
    assert.equal(await page.getByRole('button', { name: /Switch to (light|dark) theme/ }).count(), 0);
    await page.evaluate(() => localStorage.setItem('jk-theme', 'light'));
    await page.reload(); await page.waitForFunction(() => document.documentElement.classList.contains('dark'));
    assert.deepEqual(await page.evaluate(() => ({ paper: getComputedStyle(document.documentElement).getPropertyValue('--paper').trim(), oldPreference: localStorage.getItem('jk-theme') })), { paper: '#0d1213', oldPreference: null });
  });
  await context.close();
} finally { await browser.close(); }
if (failures) process.exitCode = 1;
