import { createRequire } from 'node:module';
import assert from 'node:assert/strict';
const require = createRequire(process.argv[3] || new URL('../package.json', import.meta.url));
const { chromium } = require('playwright');
const base = process.argv[2] || 'http://127.0.0.1:4180';
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
let failed = 0;
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
await context.addInitScript(() => { try { localStorage.setItem('jk-analytics-consent-v1', JSON.stringify({ choice: 'rejected', savedAt: Date.now() })); } catch {} });
const page = await context.newPage();
const errors = [];
page.on('pageerror', error => errors.push(error.message));
await page.route('**/www.googletagmanager.com/**', route => route.abort());
async function check(name, action) { try { await action(); console.log(`PASS ${name}`); } catch (error) { failed++; console.log(`FAIL ${name}: ${error.message.split('\n')[0]}`); } }
try {
  await page.goto(base);
  await check('filtering selects voice projects and restores all projects', async () => {
    await page.getByRole('button', { name: 'Voice & audio', exact: true }).click({ timeout: 3000 });
    assert.equal(await page.locator('.project-card').count(), 1);
    assert.match(await page.locator('.project-card').innerText(), /The Interview Room/);
    await page.getByRole('button', { name: 'All work', exact: true }).click();
    assert.equal(await page.locator('.project-card').count(), 4);
  });
  await check('command navigation searches and restores focus on Escape', async () => {
    const trigger = page.getByRole('button', { name: 'Open quick navigation', exact: true }).first();
    await trigger.click({ timeout: 3000 });
    await page.getByRole('searchbox', { name: 'Search pages and projects' }).fill('InsightPilot');
    assert.equal(await page.getByRole('dialog', { name: 'Quick navigation' }).getByRole('link').count(), 1);
    await page.keyboard.press('Escape');
    await page.waitForFunction(() => !document.querySelector('.command-dialog').open);
    await page.waitForFunction(() => document.activeElement?.getAttribute('aria-label') === 'Open quick navigation');
    assert.equal(await trigger.evaluate(element => element === document.activeElement), true);
  });
  await check('mobile menu supports Escape and usable targets', async () => {
    await page.setViewportSize({ width: 375, height: 812 });
    const trigger = page.getByRole('button', { name: 'Open menu', exact: true });
    await trigger.click({ timeout: 3000 });
    await page.getByRole('navigation', { name: 'Mobile navigation' }).getByRole('link', { name: 'Work', exact: true }).waitFor();
    await page.keyboard.press('Escape');
    await page.waitForFunction(() => !document.querySelector('.mobile-menu-dialog').open);
    assert.equal(await trigger.evaluate(element => element === document.activeElement), true);
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  });
  await check('clipboard rejection offers a manual copy path', async () => {
    await page.evaluate(() => Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: () => Promise.reject(new Error('blocked')) } }));
    await page.getByRole('button', { name: 'Copy email', exact: true }).click({ timeout: 3000 });
    await page.getByRole('status').filter({ hasText: 'Select and copy' }).waitFor({ timeout: 3000 });
  });
  await check('InsightPilot deep link and case study are available', async () => {
    await page.goto(`${base}/projects/insightpilot/`);
    await page.getByRole('heading', { name: 'InsightPilot', exact: true, level: 1 }).waitFor({ timeout: 3000 });
    assert.equal(await page.locator('main').getByText('FRACTURE', { exact: true }).count(), 0);
    assert.ok(await page.locator('video').count() > 0);
  });
  await check('notes and résumé assets resolve', async () => {
    await page.goto(`${base}/notes/`);
    assert.ok(await page.locator('.note-card').count() >= 3);
    const response = await page.request.get(`${base}/resume/jawad-krayyem-resume.pdf`);
    assert.equal(response.status(), 200);
    assert.ok((await response.body()).subarray(0, 4).equals(Buffer.from('%PDF')));
  });
  await check('loading screen cannot trap reduced-motion or JavaScript-disabled visitors', async () => {
    await page.goto(base);
    await page.waitForFunction(() => !document.querySelector('.site-loader') || getComputedStyle(document.querySelector('.site-loader')).visibility === 'hidden', { timeout: 4000 });
    const noJs = await browser.newContext({ javaScriptEnabled: false });
    const plain = await noJs.newPage();
    await plain.goto(base);
    assert.ok(await plain.getByRole('heading', { level: 1 }).isVisible());
    assert.ok(await plain.getByRole('link', { name: 'View selected work', exact: true }).isVisible());
    await noJs.close();
  });
  await check('browser has no unhandled errors', async () => assert.deepEqual(errors, []));
} finally { await browser.close(); }
if (failed) process.exitCode = 1;
