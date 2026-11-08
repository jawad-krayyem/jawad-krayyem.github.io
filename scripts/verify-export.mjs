import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
const output = fileURLToPath(new URL('../out/', import.meta.url));
const publicDirectory = fileURLToPath(new URL('../public/', import.meta.url));
function walk(directory) { return readdirSync(directory, { withFileTypes: true }).flatMap(entry => entry.isDirectory() ? walk(join(directory, entry.name)) : [join(directory, entry.name)]); }
const files = walk(output).filter(file => file.endsWith('.html'));
let checked = 0;
for (const file of files) {
  const html = readFileSync(file, 'utf8');
  const route = '/' + relative(output, file).replaceAll('\\', '/').replace(/index\.html$/, '');
  for (const match of html.matchAll(/\b(?:href|src|poster)="([^"<>]+)"/g)) {
    const value = match[1].replaceAll('&amp;', '&');
    if (/^(?:https?:|mailto:|tel:|data:|blob:|#)/.test(value)) continue;
    const url = new URL(value, `https://jawad-krayyem.github.io${route}`);
    const path = decodeURIComponent(url.pathname);
    let target = join(output, path);
    if (existsSync(target) && statSync(target).isDirectory()) target = join(target, 'index.html');
    assert.ok(existsSync(target), `${route}: missing ${value}`);
    if (url.hash && target.endsWith('.html')) assert.ok(readFileSync(target, 'utf8').includes(`id="${decodeURIComponent(url.hash.slice(1))}"`), `${route}: missing anchor ${value}`);
    checked++;
  }
  assert.ok(!/<script[^>]+src="https:\/\/www\.googletagmanager\.com/.test(html), `${route}: analytics must remain opt-in`);
  const publicSource = join(publicDirectory, relative(output, file));
  if (existsSync(publicSource)) {
    assert.deepEqual(readFileSync(file), readFileSync(publicSource), `${route}: standalone public HTML must be preserved exactly`);
  } else if (!route.includes('404') && !route.includes('_not-found')) {
    assert.match(html, /rel="canonical"/);
  }
}
const home = readFileSync(join(output, 'index.html'), 'utf8');
assert.ok(!home.includes('StudyFlow') && !home.includes('FRACTURE'), 'Withdrawn apps must not be promoted');
const privacy = readFileSync(join(output, 'privacy-policy/index.html'), 'utf8');
const policy = readFileSync(new URL('../content/privacy-policy.txt', import.meta.url), 'utf8');
const escaped = policy.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#x27;');
assert.ok(privacy.replaceAll('\r\n', '\n').includes(escaped.replaceAll('\r\n', '\n')), 'The complete supplied policy must be exported');
assert.ok(existsSync(join(output, '.nojekyll')));
assert.match(readFileSync(join(output, 'sitemap.xml'), 'utf8'), /projects\/insightpilot/);
assert.match(readFileSync(join(output, 'resume/jawad-krayyem-resume.pdf')).subarray(0, 4).toString(), /%PDF/);
console.log(`Verified ${files.length} HTML pages, ${checked} local routes/assets, policy content, sitemap, résumé, and opt-in analytics.`);
