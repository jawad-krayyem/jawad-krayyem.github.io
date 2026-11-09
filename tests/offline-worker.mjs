import assert from 'node:assert/strict';
import vm from 'node:vm';

const base = process.argv[2] || 'http://127.0.0.1:4180/';
const workerResponse = await fetch(new URL('/sw.js', base));
assert.equal(workerResponse.status, 200, 'the exported service worker is reachable');
const source = await workerResponse.text();
const listeners = new Map();
const entries = new Map();
let online = true;
const keyFor = request => new URL(typeof request === 'string' ? request : request.url, base).href;
const networkFetch = async request => {
  if (!online) throw new Error('offline test network');
  const response = await fetch(new URL(typeof request === 'string' ? request : request.url, base));
  if (!response.ok) throw new Error(`Unexpected status ${response.status} for ${request.url || request}`);
  return response;
};
const cache = {
  async add(request) { entries.set(keyFor(request), (await networkFetch(request)).clone()); },
  async put(request, response) { entries.set(keyFor(request), response.clone()); },
  async match(request) { return entries.get(keyFor(request))?.clone(); },
};
const workerSelf = {
  location: new URL(base),
  addEventListener(type, handler) { listeners.set(type, handler); },
  skipWaiting: async () => {},
  clients: { claim: async () => {} },
};
const sandbox = {
  self: workerSelf,
  caches: { open: async () => cache, keys: async () => ['jawad-portfolio-v2'], delete: async () => true },
  fetch: networkFetch,
  URL, Request, Response, Headers, Promise, console,
};
vm.runInNewContext(source, sandbox, { filename: 'sw.js' });

async function dispatchLifecycle(type) {
  let pending;
  listeners.get(type)({ waitUntil(value) { pending = value; } });
  await pending;
}
async function dispatchFetch(request) {
  let responsePromise;
  listeners.get('fetch')({ request, respondWith(value) { responsePromise = value; } });
  assert.ok(responsePromise, `service worker handles ${request.url}`);
  return responsePromise;
}

await dispatchLifecycle('install');
const cachedPaths = [...entries.keys()].map(url => new URL(url).pathname);
assert.ok(cachedPaths.some(path => path.endsWith('.css')), 'install caches stylesheet assets for the home shell');
assert.ok(cachedPaths.some(path => path.endsWith('.js')), 'install caches JavaScript assets for the home shell');

online = false;
const home = await dispatchFetch({ url: base, method: 'GET', mode: 'navigate', headers: new Headers() });
assert.equal(home.status, 200, 'the first-visit home page opens offline');
assert.match(await home.text(), /Jawad/);
const cssUrl = [...entries.keys()].find(url => new URL(url).pathname.endsWith('.css'));
const css = await dispatchFetch({ url: cssUrl, method: 'GET', mode: 'cors', headers: new Headers() });
assert.equal(css.status, 200, 'the home stylesheet is available offline');
assert.ok((await css.text()).length > 0);
const unknown = await dispatchFetch({ url: new URL('/not-cached/', base).href, method: 'GET', mode: 'navigate', headers: new Headers() });
assert.equal(unknown.status, 200, 'unvisited offline routes get the offline page');
assert.match(await unknown.text(), /You’re offline/);
console.log('PASS first-visit home shell and unvisited-route fallback work offline');
