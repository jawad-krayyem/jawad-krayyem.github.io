// Start a production preview, then run: node scripts/export-resume.mjs [base URL] [Playwright package.json]
import { createRequire } from 'node:module';
import { mkdirSync } from 'node:fs';
const require = createRequire(process.argv[3] || new URL('../package.json', import.meta.url));
const { chromium } = require('playwright');
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
try {
  const context = await browser.newContext({ colorScheme: 'light' });
  await context.addInitScript(() => { localStorage.setItem('jk-analytics-consent-v1', JSON.stringify({ choice: 'rejected', savedAt: Date.now() })); });
  const page = await context.newPage();
  await page.route('**/www.googletagmanager.com/**', route => route.abort());
  const response = await page.goto(`${process.argv[2] || 'http://127.0.0.1:4180'}/resume/`, { waitUntil: 'networkidle' });
  if (response.status() !== 200) throw new Error(`Résumé page returned ${response.status()}`);
  await page.evaluate(() => document.fonts.ready);
  await page.emulateMedia({ media: 'print' });
  mkdirSync(new URL('../public/resume/', import.meta.url), { recursive: true });
  await page.pdf({ path: new URL('../public/resume/jawad-krayyem-resume.pdf', import.meta.url).pathname.replace(/^\/([A-Z]):/, '$1:'), format: 'A4', printBackground: true, margin: { top: '15mm', right: '16mm', bottom: '15mm', left: '16mm' }, tagged: true });
  console.log('Generated public/resume/jawad-krayyem-resume.pdf from verified portfolio content.');
} finally { await browser.close(); }
