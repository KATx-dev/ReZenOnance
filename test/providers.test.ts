import test from 'node:test';
import assert from 'node:assert/strict';
import { RacingProvider } from '../src/providers/racing.js';
import { RemoteAddonProvider } from '../src/providers/remote-addon.js';
import { UpstreamError } from '../src/providers/http.js';
import type { QobuzProvider, QobuzTrack, QobuzStream, Quality } from '../src/types.js';
import { loadConfig } from '../src/config.js';

const config = loadConfig();

test('RacingProvider returns first successful tracks', async () => {
  const slowProvider: QobuzProvider = {
    async search() {
      await new Promise(r => setTimeout(r, 100));
      return [{ upstreamId: 'slow-1', title: 'Slow Song' }];
    },
    async getStream() { return null; },
  };

  const fastProvider: QobuzProvider = {
    async search() {
      return [{ upstreamId: 'fast-1', title: 'Fast Song' }];
    },
    async getStream() { return null; },
  };

  const racing = new RacingProvider([
    { name: 'slow', provider: slowProvider },
    { name: 'fast', provider: fastProvider },
  ]);

  const results = await racing.search('query', 'LOSSLESS', 'auto');
  assert.equal(results.length, 1);
  assert.equal(results[0].upstreamId, 'fast:fast-1');
  assert.equal(results[0].title, 'Fast Song');
});

test('RacingProvider tolerates failing providers and returns surviving results', async () => {
  const failingProvider: QobuzProvider = {
    async search() { throw new UpstreamError(502, 'Failing source down'); },
    async getStream() { return null; },
  };

  const goodProvider: QobuzProvider = {
    async search() {
      await new Promise(r => setTimeout(r, 20));
      return [{ upstreamId: 'good-1', title: 'Good Song' }];
    },
    async getStream() { return null; },
  };

  const racing = new RacingProvider([
    { name: 'fail', provider: failingProvider },
    { name: 'good', provider: goodProvider },
  ]);

  const results = await racing.search('query', 'LOSSLESS', 'auto');
  assert.equal(results.length, 1);
  assert.equal(results[0].upstreamId, 'good:good-1');
});

test('RacingProvider returns empty list when a provider cleanly finds no tracks', async () => {
  const emptyProvider: QobuzProvider = {
    async search() { return []; },
    async getStream() { return null; },
  };

  const failingProvider: QobuzProvider = {
    async search() {
      await new Promise(r => setTimeout(r, 20));
      throw new UpstreamError(502, 'Outage');
    },
    async getStream() { return null; },
  };

  const racing = new RacingProvider([
    { name: 'empty', provider: emptyProvider },
    { name: 'fail', provider: failingProvider },
  ]);

  const results = await racing.search('unknown-song-xyz', 'LOSSLESS', 'auto');
  assert.deepEqual(results, []);
});

test('RacingProvider routes getStream using source prefix', async () => {
  const providerA: QobuzProvider = {
    async search() { return []; },
    async getStream(id) {
      if (id === 'track-a') return { url: 'https://cdn.example/a.flac', format: 'flac', manifest: 'none' };
      return null;
    },
  };

  const racing = new RacingProvider([
    { name: 'srcA', provider: providerA },
  ]);

  const stream = await racing.getStream('srcA:track-a', 'LOSSLESS', 'auto');
  assert.ok(stream);
  assert.equal(stream.url, 'https://cdn.example/a.flac');
});
