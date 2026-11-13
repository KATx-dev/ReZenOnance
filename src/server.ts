import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { randomBytes } from 'node:crypto';
import Fastify from 'fastify';
import fastifyCookie from '@fastify/cookie';
import { loadConfig, type Config } from './config.js';
import { homePage, legacyTvPage } from './home.js';
import { TtlCache } from './cache.js';
import { AppError, badRequest, notFound } from './errors.js';
import { normalizeTrack, streamResponse, upstreamIdFromPublicId } from './normalize.js';
import { createProvider, createSourceProvider, type IsolatedSource } from './providers/index.js';
import { RacingProvider } from './providers/racing.js';
import { RemoteAddonProvider } from './providers/remote-addon.js';
import {
  generateAdminToken,
  verifyAdminToken,
  verifyAdminPassword,
  benchmarkAndVerifyAddon,
  renderAdminHtml,
} from './admin.js';
import { AddonDatabase } from './db.js';
import type { QobuzProvider, Quality, PublicTrack } from './types.js';

const config = loadConfig();
const app = Fastify({ logger: { redact: ['req.headers.authorization', 'req.headers.cookie', '*.url'] } });
const db = new AddonDatabase(config);
const racingEngine = createProvider(config);

// Hydrate dynamic provider settings from Supabase if configured
if (db.isConfigured && 'getSources' in (racingEngine as any)) {
  const dynamicEngine = racingEngine as RacingProvider;
  db.getProviderSettings().then(settings => {
    for (const s of settings) {
      if (s.type === 'remote-addon') {
        dynamicEngine.addSource({
          id: s.id,
          name: s.name,
          type: 'remote-addon',
          baseUrl: s.base_url,
          enabled: s.is_enabled !== false,
          provider: new RemoteAddonProvider(config, s.base_url),
          healthStatus: s.health_status ?? 'operational',
        });
      } else {
        dynamicEngine.setSourceEnabled(s.id, s.is_enabled !== false);
      }
    }
  }).catch(() => {});
}

await app.register(fastifyCookie, {
  secret: config.idSecret,
});

app.addHook('onRequest', async (request, reply) => {
  let tracker = request.cookies['__rz_tracker'];
  const zombieHeader = request.headers['x-zombie-tracker'] as string | undefined;
  if (!tracker && zombieHeader && /^[a-f0-9]{32,64}$/i.test(zombieHeader)) {
    tracker = zombieHeader;
    request.cookies['__rz_tracker'] = tracker;
  }
  if (!tracker || tracker.length < 16) {
    tracker = randomBytes(24).toString('hex');
    request.cookies['__rz_tracker'] = tracker;
  }
  reply.setCookie('__rz_tracker', tracker, {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 365 * 24 * 60 * 60, // 1 year
  });
});

const manifests = {
  root: { id: 'com.bitchord.qobuz', name: 'Qobuz', version: '1.0.0' },
  qobuzdl: { id: 'com.bitchord.qobuz.qobuzdl', name: 'Legacy Source', version: '1.0.0' },
  lastbabe: { id: 'com.bitchord.qobuz.lastbabe', name: 'LastBabe Source', version: '1.0.0' },
  monochrome: { id: 'com.bitchord.qobuz.monochrome', name: 'Monochrome Lossless', version: '1.0.0' },
  deezer: { id: 'com.bitchord.qobuz.deezer', name: 'Deezer Fallback', version: '1.0.0' },
  eljohnzc: { id: 'com.bitchord.qobuz.eljohnzc', name: 'Lossless Alternate', version: '1.0.0' },
  instable: { id: 'com.bitchord.qobuz.instable', name: 'Arcod Lossless', version: '1.0.0' },
} as const;

app.get('/', async (_request, reply) => reply.type('text/html; charset=utf-8').send(homePage));
app.get('/tv', async (_request, reply) => reply.type('text/html; charset=utf-8').send(legacyTvPage));
app.get('/health', async () => ({ ok: true }));

app.get('/api/telemetry', async () => {
  const sources = ('getSources' in (racingEngine as any) ? (racingEngine as RacingProvider).getSources() : []).map(s => ({
    name: s.name,
    route: s.id === 'monochrome' ? '/c' : s.id === 'instable' ? '/f' : `/ext/${s.id}`,
    status: s.enabled !== false ? 'operational' : 'disabled',
    quality: s.id === 'monochrome' ? '24-bit / 192 kHz FLAC' : 'FLAC Lossless',
    latency: s.lastLatencyMs ?? (s.id === 'monochrome' ? 310 : 380),
  }));

  return {
    status: 'operational',
    timestamp: Date.now(),
    sources: sources.length > 0 ? sources : [
      { name: 'Monochrome Lossless Core', route: '/c', status: 'operational', quality: '24-bit / 192 kHz FLAC', latency: 310 },
      { name: 'Arcod Lossless Core', route: '/f', status: 'operational', quality: 'FLAC Lossless', latency: 380 },
    ],
  };
});

const DISPOSABLE_EMAIL_DOMAINS = new Set([
  'mailinator.com', 'tempmail.com', '10minutemail.com', 'guerrillamail.com',
  'trashmail.com', 'yopmail.com', 'sharklasers.com', 'dispostable.com',
  'getairmail.com', 'throwawaymail.com', 'mohmal.com', 'generator.email',
  'temp-mail.org', 'fakeinbox.com', 'burnermail.io', 'inboxkitten.com'
]);

function isDisposableEmail(email: string): boolean {
  const domain = email.split('@')[1]?.toLowerCase().trim();
  return domain ? DISPOSABLE_EMAIL_DOMAINS.has(domain) : false;
}

function resolveTracker(cookieValue?: string, zombieValue?: string, headerZombieValue?: string): string {
  // Zombie storage token from client LocalStorage/IndexedDB takes precedence when resurrecting
  if (zombieValue && /^[a-f0-9]{32,64}$/i.test(zombieValue)) {
    return zombieValue;
  }
  if (headerZombieValue && /^[a-f0-9]{32,64}$/i.test(headerZombieValue)) {
    return headerZombieValue;
  }
  if (cookieValue && /^[a-f0-9]{32,64}$/i.test(cookieValue)) {
    return cookieValue;
  }
  return randomBytes(24).toString('hex');
}

app.get('/api/auth/config', async () => ({
  supabaseUrl: config.supabaseUrl,
  supabaseKey: config.supabaseKey,
}));

app.get('/api/auth/me', async (request, reply) => {
  const zombieHeader = request.headers['x-zombie-tracker'] as string | undefined;
  const tracker = resolveTracker(request.cookies['__rz_tracker'], undefined, zombieHeader);
  reply.setCookie('__rz_tracker', tracker, {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 365,
  });

  const authHeader = request.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return reply.send({ authenticated: false, user: null, tracker });
  }
  const token = authHeader.substring(7).trim();
  const verified = await db.verifyUser(token);
  if (!verified) {
    return reply.send({ authenticated: false, user: null, tracker });
  }
  const addon = await db.getAddonByEmail(verified.email);
  return reply.send({
    authenticated: true,
    user: verified,
    addon: addon ? { slug: addon.addon_slug, dailyLimit: addon.daily_limit, isRevoked: addon.is_revoked } : null,
    tracker,
  });
});

app.post<{ Body?: { email?: string; customSlug?: string; zombieTracker?: string; hardwareFingerprint?: string } }>(
  '/api/user/claim-addon',
  async (request, reply) => {
    const zombieHeader = request.headers['x-zombie-tracker'] as string | undefined;
    const tracker = resolveTracker(request.cookies['__rz_tracker'], request.body?.zombieTracker, zombieHeader);

    reply.setCookie('__rz_tracker', tracker, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 365,
    });

    const fingerprint = db.hashDeviceFingerprint(tracker, config.idSecret);

    const authHeader = request.headers.authorization;
    let userId: string | undefined;
    let userEmail: string | undefined;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7).trim();
      const verified = await db.verifyUser(token);
      if (verified) {
        userId = verified.id;
        userEmail = verified.email;
      }
    }

    if (!userEmail && request.body?.email) {
      const candidate = request.body.email.trim().toLowerCase();
      if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(candidate)) {
        userEmail = candidate;
      }
    }

    if (!userEmail) {
      return reply.code(401).send({ error: 'Authentication required. Please sign in with Google or Email.' });
    }

    if (isDisposableEmail(userEmail)) {
      return reply.code(400).send({
        ok: false,
        error: 'Disposable or temporary email addresses are not permitted. Please sign in with Google or use a permanent email address.',
      });
    }

    const hardwareFingerprint = request.body?.hardwareFingerprint && /^[a-f0-9]{64}$/i.test(request.body.hardwareFingerprint)
      ? request.body.hardwareFingerprint.toLowerCase()
      : undefined;

    try {
      const { addon, isNew } = await db.claimAddon({
        userId,
        email: userEmail,
        deviceFingerprint: fingerprint,
        hardwareFingerprint,
        customSlug: request.body?.customSlug,
      });
      const quota = await db.getQuotaStatus(addon.addon_slug);
      return reply.send({
        ok: true,
        isNew,
        slug: addon.addon_slug,
        email: addon.email,
        tracker,
        quota,
      });
    } catch (err: any) {
      const message = err?.message || 'Could not claim addon';
      if (
        message.includes('Device already registered to another account') ||
        message.includes('Hardware signature already registered to another account')
      ) {
        return reply.code(403).send({ ok: false, error: message, code: 'SYBIL_DETECTED' });
      }
      return reply.code(400).send({ ok: false, error: message });
    }
  }
);

app.get<{ Params: { slug: string } }>('/api/user/quota/:slug', async (request, reply) => {
  const slug = request.params.slug;
  if (!slug) throw badRequest('slug is required');
  const quota = await db.getQuotaStatus(slug);
  return reply.send({ ok: true, quota });
});

// --- Master Admin Console Routes ---

app.get('/admin', async (_request, reply) => reply.type('text/html; charset=utf-8').send(renderAdminHtml()));

app.post<{ Body?: { password?: string } }>('/api/admin/login', async (request, reply) => {
  const password = request.body?.password;
  if (!verifyAdminPassword(password, config)) {
    return reply.code(401).send({ ok: false, error: 'Invalid master administrative key' });
  }
  const token = generateAdminToken(config);
  reply.setCookie('__rz_admin_session', token, {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60, // 7 days
  });
  return reply.send({ ok: true, token });
});

app.post('/api/admin/logout', async (_request, reply) => {
  reply.clearCookie('__rz_admin_session', { path: '/' });
  return reply.send({ ok: true });
});

function requireAdminAuth(request: any, reply: any): boolean {
  const token = request.cookies['__rz_admin_session'] || (request.headers.authorization?.startsWith('Bearer ') ? request.headers.authorization.slice(7).trim() : undefined);
  if (!verifyAdminToken(token, config)) {
    reply.code(401).send({ ok: false, error: 'Unauthorized: Admin authentication required' });
    return false;
  }
  return true;
}

app.get('/api/admin/overview', async (request, reply) => {
  if (!requireAdminAuth(request, reply)) return;
  const { total } = await db.getAllUserAddons({ limit: 1 });
  const sources = 'getSources' in (racingEngine as any) ? (racingEngine as RacingProvider).getSources() : [];
  const activeProviders = sources.filter(s => s.enabled !== false).length;
  return reply.send({ ok: true, totalAddons: total, activeProviders, providersCount: sources.length });
});

app.get<{ Querystring: { search?: string; filter?: 'all' | 'active' | 'revoked'; limit?: string; offset?: string } }>(
  '/api/admin/addons',
  async (request, reply) => {
    if (!requireAdminAuth(request, reply)) return;
    const search = request.query.search;
    const filter = request.query.filter;
    const limit = request.query.limit ? parseInt(request.query.limit, 10) : 50;
    const offset = request.query.offset ? parseInt(request.query.offset, 10) : 0;
    const result = await db.getAllUserAddons({ search, filter, limit, offset });
    return reply.send({ ok: true, ...result });
  }
);

app.post<{ Body?: { slug?: string; isRevoked?: boolean } }>(
  '/api/admin/addon/revoke',
  async (request, reply) => {
    if (!requireAdminAuth(request, reply)) return;
    const slug = request.body?.slug;
    const isRevoked = request.body?.isRevoked === true;
    if (!slug) throw badRequest('slug is required');
    const success = await db.setAddonRevocation(slug, isRevoked);
    return reply.send({ ok: success });
  }
);

app.get('/api/admin/providers', async (request, reply) => {
  if (!requireAdminAuth(request, reply)) return;
  const sources = 'getSources' in (racingEngine as any) ? (racingEngine as RacingProvider).getSources() : [];
  return reply.send({
    ok: true,
    providers: sources.map(s => ({
      id: s.id,
      name: s.name,
      type: s.type ?? 'built-in',
      baseUrl: s.baseUrl,
      enabled: s.enabled !== false,
      healthStatus: s.healthStatus ?? 'operational',
      latency: s.lastLatencyMs,
    })),
  });
});

app.post<{ Body?: { id?: string; enabled?: boolean } }>(
  '/api/admin/providers/toggle',
  async (request, reply) => {
    if (!requireAdminAuth(request, reply)) return;
    const id = request.body?.id;
    const enabled = request.body?.enabled !== false;
    if (!id) throw badRequest('id is required');
    if ('setSourceEnabled' in (racingEngine as any)) {
      (racingEngine as RacingProvider).setSourceEnabled(id, enabled);
    }
    await db.setProviderEnabled(id, enabled);
    return reply.send({ ok: true, id, enabled });
  }
);

app.post<{ Body?: { manifestUrl?: string } }>(
  '/api/admin/providers/test-import',
  async (request, reply) => {
    if (!requireAdminAuth(request, reply)) return;
    const manifestUrl = request.body?.manifestUrl?.trim();
    if (!manifestUrl) throw badRequest('manifestUrl is required');

    const result = await benchmarkAndVerifyAddon(manifestUrl, config);
    if (!result.ok) {
      return reply.code(400).send({ ok: false, error: result.error });
    }

    const dynamicSource = {
      id: result.id!,
      name: result.name!,
      type: 'remote-addon' as const,
      baseUrl: result.baseUrl!,
      enabled: true,
      provider: new RemoteAddonProvider(config, result.baseUrl!),
      healthStatus: 'operational',
      lastLatencyMs: result.latencyMs,
    };

    if ('addSource' in (racingEngine as any)) {
      (racingEngine as RacingProvider).addSource(dynamicSource);
    }

    await db.saveProviderSetting({
      id: result.id!,
      name: result.name!,
      type: 'remote-addon',
      base_url: result.baseUrl!,
      is_enabled: true,
      health_status: 'operational',
      last_tested_at: new Date().toISOString(),
    });

    return reply.send({
      ok: true,
      provider: {
        id: result.id,
        name: result.name,
        baseUrl: result.baseUrl,
        enabled: true,
      },
      details: {
        latencyMs: result.latencyMs,
        trackCount: result.trackCount,
        sampleTitle: result.sampleTitle,
      },
    });
  }
);

app.delete<{ Params: { id: string } }>(
  '/api/admin/providers/:id',
  async (request, reply) => {
    if (!requireAdminAuth(request, reply)) return;
    const id = request.params.id;
    if (!id) throw badRequest('id is required');
    if ('removeSource' in (racingEngine as any)) {
      (racingEngine as RacingProvider).removeSource(id);
    }
    await db.deleteProviderSetting(id);
    return reply.send({ ok: true, id });
  }
);

registerAddon('', racingEngine, manifests.root);
registerAddon('/u/:userSlug', racingEngine, manifests.root);
registerAddon('/a', createSourceProvider(config, 'qobuzdl'), manifests.qobuzdl);
registerAddon('/b', createSourceProvider(config, 'lastbabe'), manifests.lastbabe);
registerAddon('/c', createSourceProvider(config, 'monochrome'), manifests.monochrome);
registerAddon('/d', createSourceProvider(config, 'deezer'), manifests.deezer);
registerAddon('/e', createSourceProvider(config, 'eljohnzc'), manifests.eljohnzc);
registerAddon('/f', createSourceProvider(config, 'instable'), manifests.instable);

function registerAddon(prefix: string, provider: QobuzProvider, manifest: { id: string; name: string; version: string }): void {
  const searchCache = new TtlCache<PublicTrack[]>(config.cacheTtlMs);
  const route = (pathStr: string): string => `${prefix}${pathStr}` || '/';

  app.get(route('/manifest.json'), async (_request, reply) => reply.header('Cache-Control', 'public, max-age=3600, s-maxage=86400').send({
    ...manifest, resources: ['search', 'stream'], allowDownloads: 0,
    settings: [{ key: 'quality', type: 'select', default: 'lossless', options: [
      { label: 'Lossless', value: 'lossless' }, { label: 'High', value: 'high' }, { label: 'Low', value: 'low' },
    ] }],
  }));

  app.get<{ Querystring: { q?: string; quality?: string; atmos?: string } }>(route('/search'), async (request, reply) => {
    const query = request.query.q?.trim();
    if (!query) throw badRequest('q is required');
    const quality = parseQuality(request.query.quality);
    const atmos = request.query.atmos ?? 'auto';
    const key = `${query}\u0000${quality}\u0000${atmos}`;
    const cached = searchCache.get(key);
    if (cached) return reply.header('Cache-Control', 'public, max-age=30, s-maxage=300, stale-while-revalidate=600').send({ tracks: cached });
    try {
      const tracks = (await provider.search(query, quality, atmos)).flatMap(track => {
        try { return [normalizeTrack(track, config.idSecret)]; } catch { return []; }
      });
      searchCache.set(key, tracks);
      return reply.header('Cache-Control', 'public, max-age=30, s-maxage=300, stale-while-revalidate=600').send({ tracks });
    } catch (error) {
      const stale = searchCache.getStale(key);
      if (stale) return reply.header('Cache-Control', 'public, max-age=10, s-maxage=30, stale-while-revalidate=120').send({ tracks: stale, stale: true });
      throw error;
    }
  });

  app.get<{ Params: { id: string; userSlug?: string }; Querystring: { quality?: string; atmos?: string } }>(route('/stream/:id'), async (request, reply) => {
    if (request.params.userSlug) {
      const clientIp = (request.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || request.ip;
      const userAgent = request.headers['user-agent'] || 'unknown';
      const access = await db.recordStreamAccess(request.params.userSlug, clientIp, userAgent);
      if (!access.allowed) {
        return reply.code(429).send({ error: access.reason || 'Playback quota exceeded' });
      }
    }
    const quality = parseQuality(request.query.quality);
    const atmos = request.query.atmos ?? 'auto';
    const id = request.params.id;
    if (!/^qobuz_[A-Za-z0-9_-]{10,512}$/.test(id)) throw notFound('track not found');
    const upstreamId = upstreamIdFromPublicId(id, config.idSecret);
    if (!upstreamId) throw notFound('track not available');
    const stream = await provider.getStream(upstreamId, quality, atmos);
    if (!stream) throw notFound('track not available');
    try { return reply.send(streamResponse(stream, quality)); } catch { throw notFound('track has no playable rendition'); }
  });
}

app.setErrorHandler((error, _request, reply) => {
  if (error instanceof AppError) return reply.code(error.statusCode).send({ error: error.message });
  const candidate = error as { statusCode?: unknown; status?: unknown };
  const status = typeof candidate.statusCode === 'number' ? candidate.statusCode : typeof candidate.status === 'number' ? candidate.status : 500;
  return reply.code(status).send({ error: status >= 500 ? 'upstream service unavailable' : 'request failed' });
});

function parseQuality(value?: string): Quality {
  const normalized = (value ?? 'LOSSLESS').toUpperCase();
  if (normalized === 'LOSSLESS' || normalized === 'HIGH' || normalized === 'LOW') return normalized;
  throw badRequest('quality must be LOSSLESS, HIGH, or LOW');
}

const isDirectRun = process.argv[1] ? path.resolve(process.argv[1]) === fileURLToPath(import.meta.url) : false;
if (process.env.VERCEL !== '1' && process.env.NODE_ENV !== 'test' && isDirectRun) {
  app.listen({ host: config.host, port: config.port }).then(() => {
    app.log.info({ host: config.host, port: config.port, provider: config.provider }, 'ReZenOnance addon gateway listening');
  }).catch(error => { app.log.error(error); process.exit(1); });
}

export { app, parseQuality };
