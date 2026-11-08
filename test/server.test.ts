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

test('GET / returns lightweight HTML TV page', async () => {
  const res = await app.inject({ method: 'GET', url: '/' });
  assert.equal(res.statusCode, 200);
  assert.match(res.headers['content-type'] ?? '', /text\/html/);
  assert.match(res.payload, /<audio/);
  assert.match(res.payload, /doSearch/);
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

test('Isolated manifests (/a through /f) return valid playback-only manifests', async () => {
  const prefixes = ['/a', '/b', '/c', '/d', '/e', '/f'];
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
