import assert from 'node:assert/strict';

const base = process.argv[2] || 'http://127.0.0.1:4180';
const projects = ['insightpilot', 'sdxl-studio', 'interview-room', 'datheon-workbench'];
let failures = 0;
async function fetchPage(path) {
  const response = await fetch(new URL(path, base));
  return { response, html: await response.text() };
}
async function check(name, action) {
  try { await action(); console.log(`PASS ${name}`); }
  catch (error) { failures++; console.log(`FAIL ${name}: ${error.message.split('\n')[0]}`); }
}
const has = (html, selector) => html.includes(selector);
const count = (html, pattern) => [...html.matchAll(pattern)].length;

const home = await fetchPage('/');
await check('home route renders', async () => assert.equal(home.response.status, 200));
await check('processor exposes explode and four selectable chiplets', async () => {
  assert.ok(has(home.html, 'Explode processor layers'));
  assert.ok(count(home.html, /class="cpu-chiplet"/g) >= 4);
});
await check('audience pathways are present', async () => assert.ok(has(home.html, 'audience-pathways')));
await check('comparison is linked from the home page', async () => assert.ok(has(home.html, '/compare/')));
await check('skills link to public source evidence', async () => assert.ok(count(home.html, /github\.com/g) >= 4));
await check('English-only interface retains theme control and offline status', async () => {
  assert.ok(!has(home.html, 'Switch language'));
  assert.ok(!has(home.html, 'dir="rtl"'));
  assert.ok(has(home.html, 'Switch to light theme'));
  assert.ok(has(home.html, 'offline-status'));
});
const compare = await fetchPage('/compare/');
await check('project comparison is a static route with all four projects', async () => {
  assert.equal(compare.response.status, 200);
  assert.equal(count(compare.html, /class="comparison-row"/g), 4);
});
for (const slug of projects) {
  const page = await fetchPage(`/projects/${slug}/`);
  await check(`${slug} includes its tour and a client-side local sample`, async () => {
    assert.equal(page.response.status, 200);
    assert.ok(has(page.html, 'project-tour'));
    assert.ok(has(page.html, 'data-local-sample="true"'));
  });
  await check(`${slug} includes architecture, implementation map, tradeoffs, phases, disclosures, and contact draft`, async () => {
    assert.ok(has(page.html, 'architecture-node'));
    assert.ok(has(page.html, 'source-map'));
    assert.ok(has(page.html, 'engineering-decision'));
    assert.ok(has(page.html, 'project-phase'));
    assert.ok(has(page.html, 'benchmark-disclosure'));
    assert.ok(has(page.html, 'data-disclosure'));
    assert.ok(has(page.html, 'class="project-contact"'));
    assert.ok(has(page.html, `/og/projects/${slug}.png`));
  });
  await check(`${slug} has a valid project social card`, async () => {
    const card = await fetch(new URL(`/og/projects/${slug}.png`, base));
    assert.equal(card.status, 200);
    const bytes = Buffer.from(await card.arrayBuffer());
    assert.deepEqual([...bytes.subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10]);
    assert.equal(bytes.readUInt32BE(16), 1200);
    assert.equal(bytes.readUInt32BE(20), 630);
  });
}
const resume = await fetchPage('/resume/');
await check('résumé has role-focused filters and project evidence only', async () => {
  assert.equal(resume.response.status, 200);
  assert.ok(has(resume.html, 'resume-focus'));
  assert.ok(has(resume.html, 'data-role="voice"'));
  assert.ok(!has(resume.html, 'resume-history'));
});
const manifest = await fetchPage('/manifest.webmanifest');
const sw = await fetchPage('/sw.js');
await check('static offline manifest and scoped service worker are present', async () => {
  assert.equal(manifest.response.status, 200);
  assert.equal(sw.response.status, 200);
  assert.ok(has(sw.html, 'jawad-portfolio'));
  assert.ok(!/googletagmanager|google-analytics/i.test(sw.html));
});
if (failures) process.exitCode = 1;
