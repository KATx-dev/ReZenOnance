import test from 'node:test';
import assert from 'node:assert/strict';
import { randomBytes } from 'node:crypto';
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

  // 4. Zombie Tracker Resurrection: NO cookie sent, but zombieTracker provided -> resurrects cookie & blocks sybil
  const rawTrackerToken = trackerMatch[1];
  const resZombie = await app.inject({
    method: 'POST',
    url: '/api/user/claim-addon',
    payload: { email: `user_${Date.now()}_3@example.com`, zombieTracker: rawTrackerToken },
  });
  assert.equal(resZombie.statusCode, 403);
  const dataZombie = JSON.parse(resZombie.payload);
  assert.equal(dataZombie.code, 'SYBIL_DETECTED');
  assert.ok(resZombie.headers['set-cookie'], 'Must resurrect __rz_tracker cookie');

  // 5. Hardware Fingerprint Anti-Sybil: Brand new cookie and no zombieTracker, but matching hardware signature
  const testHwFingerprint = randomBytes(32).toString('hex');
  const hwEmail1 = `user_${Date.now()}_hw1@example.com`;
  const hwEmail2 = `user_${Date.now()}_hw2@example.com`;

  const resHw1 = await app.inject({
    method: 'POST',
    url: '/api/user/claim-addon',
    payload: { email: hwEmail1, hardwareFingerprint: testHwFingerprint },
  });
  assert.equal(resHw1.statusCode, 200);

  // Sybil with cleared cookies & fresh IP, but same hardware fingerprint
  const resHw2 = await app.inject({
    method: 'POST',
    url: '/api/user/claim-addon',
    payload: { email: hwEmail2, hardwareFingerprint: testHwFingerprint },
  });
  assert.equal(resHw2.statusCode, 403);
  const dataHw2 = JSON.parse(resHw2.payload);
  assert.equal(dataHw2.code, 'SYBIL_DETECTED');
  assert.match(dataHw2.error, /Hardware signature already registered/);

  // 6. Disposable Email Rejection
  const resDisposable = await app.inject({
    method: 'POST',
    url: '/api/user/claim-addon',
    payload: { email: 'baduser@tempmail.com' },
  });
  assert.equal(resDisposable.statusCode, 400);
  const dataDisposable = JSON.parse(resDisposable.payload);
  assert.match(dataDisposable.error, /Disposable or temporary email/);

  // 7. Check quota endpoint
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

test('Admin Console endpoints: auth, overview, provider toggling, and link revocation', async () => {
  // 1. GET /admin returns HTML portal
  const adminHtmlRes = await app.inject({ method: 'GET', url: '/admin' });
  assert.equal(adminHtmlRes.statusCode, 200);
  assert.match(adminHtmlRes.payload, /ReZenOnance/);
  assert.match(adminHtmlRes.payload, /Master Admin Access/);

  // 2. Overview requires auth
  const unauthRes = await app.inject({ method: 'GET', url: '/api/admin/overview' });
  assert.equal(unauthRes.statusCode, 401);

  // 3. Login with wrong password
  const badLoginRes = await app.inject({
    method: 'POST',
    url: '/api/admin/login',
    payload: { password: 'wrong-password-123' },
  });
  assert.equal(badLoginRes.statusCode, 401);

  // 4. Login with correct password
  const goodLoginRes = await app.inject({
    method: 'POST',
    url: '/api/admin/login',
    payload: { password: config.adminPassword },
  });
  assert.equal(goodLoginRes.statusCode, 200);
  const loginData = JSON.parse(goodLoginRes.payload);
  assert.equal(loginData.ok, true);
  assert.ok(loginData.token);

  const adminCookie = goodLoginRes.headers['set-cookie'];
  const cookies = (Array.isArray(adminCookie) ? adminCookie : [adminCookie].filter(Boolean)) as string[];
  const sessionCookieHeader = cookies.find((c) => c?.includes('__rz_admin_session'));
  assert.ok(sessionCookieHeader, 'Must set __rz_admin_session');
  const sessionMatch = sessionCookieHeader.match(/__rz_admin_session=([^;]+)/);
  assert.ok(sessionMatch);
  const sessionCookie = sessionMatch[0];

  // 5. Authorized overview (via cookie)
  const authOverviewRes = await app.inject({
    method: 'GET',
    url: '/api/admin/overview',
    headers: { cookie: sessionCookie },
  });
  assert.equal(authOverviewRes.statusCode, 200);
  const overviewData = JSON.parse(authOverviewRes.payload);
  assert.equal(overviewData.ok, true);
  assert.ok(typeof overviewData.totalAddons === 'number');

  // 6. List providers (via Bearer token)
  const provRes = await app.inject({
    method: 'GET',
    url: '/api/admin/providers',
    headers: { authorization: `Bearer ${loginData.token}` },
  });
  assert.equal(provRes.statusCode, 200);
  const provData = JSON.parse(provRes.payload);
  assert.ok(Array.isArray(provData.providers));

  // 7. Toggle provider enabled state
  const toggleRes = await app.inject({
    method: 'POST',
    url: '/api/admin/providers/toggle',
    headers: { cookie: sessionCookie },
    payload: { id: 'monochrome', enabled: false },
  });
  assert.equal(toggleRes.statusCode, 200);

  // Restore provider to enabled
  await app.inject({
    method: 'POST',
    url: '/api/admin/providers/toggle',
    headers: { cookie: sessionCookie },
    payload: { id: 'monochrome', enabled: true },
  });
});

test('Direct Auth endpoints: providers, guest session, and me', async () => {
  // 1. Providers list
  const provRes = await app.inject({ method: 'GET', url: '/api/auth/providers' });
  assert.equal(provRes.statusCode, 200);
  const provData = JSON.parse(provRes.payload);
  assert.equal(provData.guest, true);

  // 2. Unauthenticated /api/auth/me
  const unauthMe = await app.inject({ method: 'GET', url: '/api/auth/me' });
  assert.equal(unauthMe.statusCode, 200);
  const unauthData = JSON.parse(unauthMe.payload);
  assert.equal(unauthData.authenticated, false);

  // 3. Create guest session
  const guestRes = await app.inject({ method: 'POST', url: '/api/auth/guest' });
  assert.equal(guestRes.statusCode, 200);
  const guestData = JSON.parse(guestRes.payload);
  assert.equal(guestData.ok, true);
  assert.equal(guestData.user.provider, 'guest');
  assert.ok(guestData.token);

  const guestCookies = (Array.isArray(guestRes.headers['set-cookie'])
    ? guestRes.headers['set-cookie']
    : [guestRes.headers['set-cookie']].filter(Boolean)) as string[];
  const authCookieHeader = guestCookies.find(c => c?.includes('__rz_auth_session'));
  assert.ok(authCookieHeader, 'Must set __rz_auth_session');
  const authCookie = authCookieHeader.match(/__rz_auth_session=([^;]+)/)![0];

  // 4. Authenticated /api/auth/me using session cookie
  const authMe = await app.inject({
    method: 'GET',
    url: '/api/auth/me',
    headers: { cookie: authCookie },
  });
  assert.equal(authMe.statusCode, 200);
  const meData = JSON.parse(authMe.payload);
  assert.equal(meData.authenticated, true);
  assert.equal(meData.user.id, guestData.user.id);

  // 5. Claim addon using guest session
  const claimRes = await app.inject({
    method: 'POST',
    url: '/api/user/claim-addon',
    headers: { cookie: authCookie },
    payload: {},
  });
  assert.equal(claimRes.statusCode, 200);
  const claimData = JSON.parse(claimRes.payload);
  assert.equal(claimData.ok, true);
  assert.equal(claimData.email, guestData.user.email);
});

test.after(async () => {
  await app.close();
});
