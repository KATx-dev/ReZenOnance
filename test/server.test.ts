import test from 'node:test';
import assert from 'node:assert/strict';
import { app } from '../src/server.js';
import { publicId } from '../src/normalize.js';
import { loadConfig } from '../src/config.js';

const config = loadConfig();

test('GET /health returns ok', async () => {
  const res = await app.inject({ method: 'GET', url: '/health' });
  assert.equal(res.statusCode, 200);
  assert.deepEqual(JSON.parse(res.payload), { ok: true });
});

test('GET / returns modern web portal', async () => {
  const res = await app.inject({ method: 'GET', url: '/' });
  assert.equal(res.statusCode, 200);
  assert.match(res.headers['content-type'] ?? '', /text\/html/);
  assert.match(res.payload, /ReZenOnance/);
  assert.match(res.payload, /addon-url/);
  assert.match(res.payload, /generateNewLink/);
});

test('GET /tv returns lightweight legacy TV page', async () => {
  const res = await app.inject({ method: 'GET', url: '/tv' });
  assert.equal(res.statusCode, 200);
  assert.match(res.headers['content-type'] ?? '', /text\/html/);
  assert.match(res.payload, /ReZenOnance TV/);
  assert.match(res.payload, /doSearch/);
});

test('GET /api/telemetry returns telemetry data', async () => {
  const res = await app.inject({ method: 'GET', url: '/api/telemetry' });
  assert.equal(res.statusCode, 200);
  const data = JSON.parse(res.payload);
  assert.equal(data.status, 'operational');
  assert.ok(Array.isArray(data.sources));
});

test('GET /manifest.json returns valid BitChord contract', async () => {
  const res = await app.inject({ method: 'GET', url: '/manifest.json' });
  assert.equal(res.statusCode, 200);
  const data = JSON.parse(res.payload);
  assert.equal(data.id, 'com.bitchord.qobuz');
  assert.deepEqual(data.resources, ['search', 'stream']);
  assert.equal(data.allowDownloads, 0);
  assert.ok(Array.isArray(data.settings));
});

test('GET /u/:userSlug/manifest.json returns valid personal gateway manifest', async () => {
  const res = await app.inject({ method: 'GET', url: '/u/user-abc-123/manifest.json' });
  assert.equal(res.statusCode, 200);
  const data = JSON.parse(res.payload);
  assert.equal(data.id, 'com.bitchord.qobuz');
  assert.deepEqual(data.resources, ['search', 'stream']);
  assert.equal(data.allowDownloads, 0);
});

test('Isolated manifests (/a through /g) return valid playback-only manifests', async () => {
  const prefixes = ['/a', '/b', '/c', '/d', '/e', '/f', '/g'];
  for (const prefix of prefixes) {
    const res = await app.inject({ method: 'GET', url: `${prefix}/manifest.json` });
    assert.equal(res.statusCode, 200);
    const data = JSON.parse(res.payload);
    assert.match(data.id, /^com\.bitchord\.qobuz\./);
    assert.deepEqual(data.resources, ['search', 'stream']);
    assert.equal(data.allowDownloads, 0);
  }
});

test('GET /search requires q parameter', async () => {
  const res = await app.inject({ method: 'GET', url: '/search' });
  assert.equal(res.statusCode, 400);
});

test('GET /search rejects invalid quality', async () => {
  const res = await app.inject({ method: 'GET', url: '/search?q=test&quality=INVALID' });
  assert.equal(res.statusCode, 400);
});

test('GET /stream rejects malformed id', async () => {
  const res = await app.inject({ method: 'GET', url: '/stream/not_a_valid_id' });
  assert.equal(res.statusCode, 404);
});

test('GET /stream rejects tampered signed id', async () => {
  const validId = publicId({ upstreamId: '12345', title: 'Test Track' }, config.idSecret);
  const tampered = `${validId.slice(0, -1)}x`;
  const res = await app.inject({ method: 'GET', url: `/stream/${tampered}` });
  assert.equal(res.statusCode, 404);
});

test('GET /api/auth/config returns Supabase config', async () => {
  const res = await app.inject({ method: 'GET', url: '/api/auth/config' });
  assert.equal(res.statusCode, 200);
  const data = JSON.parse(res.payload);
  assert.ok(data.supabaseUrl);
  assert.ok(data.supabaseKey);
});

test('POST /api/user/claim-addon enforces anti-sybil and sets __rz_tracker cookie', async () => {
  const randomEmail1 = `user_${Date.now()}_1@example.com`;
  const randomEmail2 = `user_${Date.now()}_2@example.com`;

  // 1. First claim with email 1
  const res1 = await app.inject({
    method: 'POST',
    url: '/api/user/claim-addon',
    payload: { email: randomEmail1, customSlug: `rz-test-${Date.now().toString(36)}` },
  });
  assert.equal(res1.statusCode, 200);
  const data1 = JSON.parse(res1.payload);
  assert.equal(data1.ok, true);
  assert.ok(data1.slug);
  assert.equal(data1.email, randomEmail1);

  // Extract set-cookie
  const setCookie = res1.headers['set-cookie'];
  assert.ok(setCookie, 'Must set __rz_tracker cookie');
  const cookieHeader = Array.isArray(setCookie) ? setCookie[0] : setCookie;
  const trackerMatch = cookieHeader.match(/__rz_tracker=([^;]+)/);
  assert.ok(trackerMatch, 'Tracker cookie present');
  const trackerCookie = trackerMatch[0];

  // 2. Repeat claim with SAME email and SAME cookie -> succeeds and returns existing slug
  const res2 = await app.inject({
    method: 'POST',
    url: '/api/user/claim-addon',
    headers: { cookie: trackerCookie },
    payload: { email: randomEmail1 },
  });
  assert.equal(res2.statusCode, 200);
  const data2 = JSON.parse(res2.payload);
  assert.equal(data2.ok, true);
  assert.equal(data2.slug, data1.slug);

  // 3. Sybil attempt: SAME cookie, DIFFERENT email -> must reject with 403 SYBIL_DETECTED
  const res3 = await app.inject({
    method: 'POST',
    url: '/api/user/claim-addon',
    headers: { cookie: trackerCookie },
    payload: { email: randomEmail2 },
  });
  assert.equal(res3.statusCode, 403);
  const data3 = JSON.parse(res3.payload);
  assert.equal(data3.ok, false);
  assert.equal(data3.code, 'SYBIL_DETECTED');
  assert.match(data3.error, /Device already registered to another account/);

  // 4. Check quota endpoint
  const quotaRes = await app.inject({
    method: 'GET',
    url: `/api/user/quota/${data1.slug}`,
  });
  assert.equal(quotaRes.statusCode, 200);
  const quotaData = JSON.parse(quotaRes.payload);
  assert.equal(quotaData.ok, true);
  assert.equal(quotaData.quota.maxStreams, 300);
  assert.equal(quotaData.quota.maxDevices, 2);
  assert.equal(quotaData.quota.maxIps, 15);
});
