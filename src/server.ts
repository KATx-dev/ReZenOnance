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
import { AddonDatabase } from './db.js';
import type { QobuzProvider, Quality, PublicTrack } from './types.js';

const config = loadConfig();
const app = Fastify({ logger: { redact: ['req.headers.authorization', 'req.headers.cookie', '*.url'] } });
const db = new AddonDatabase(config);

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
  heisenberg: { id: 'com.bitchord.qobuz.heisenberg', name: 'Studio Lossless Source', version: '1.0.0' },
} as const;

app.get('/', async (_request, reply) => reply.type('text/html; charset=utf-8').send(homePage));
app.get('/tv', async (_request, reply) => reply.type('text/html; charset=utf-8').send(legacyTvPage));
app.get('/health', async () => ({ ok: true }));

app.get('/api/telemetry', async () => ({
  status: 'operational',
  timestamp: Date.now(),
  sources: [
    { name: 'Studio Lossless Source', route: '/g', status: 'operational', quality: '24-bit / 192 kHz', latency: 520 },
    { name: 'Arcod Lossless Core', route: '/f', status: 'operational', quality: 'FLAC Lossless', latency: 380 },
    { name: 'Lossless Source Alternate', route: '/e', status: 'standby', quality: 'DASH / FLAC', latency: null },
    { name: 'Monochrome Core', route: '/c', status: 'offline', quality: 'FLAC', latency: null },
    { name: 'Legacy Qobuz-DL', route: '/a', status: 'unauthorized', quality: 'MP3', latency: null },
  ],
}));

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

registerAddon('', createProvider(config), manifests.root);
registerAddon('/u/:userSlug', createProvider(config), manifests.root);
registerAddon('/a', createSourceProvider(config, 'qobuzdl'), manifests.qobuzdl);
registerAddon('/b', createSourceProvider(config, 'lastbabe'), manifests.lastbabe);
registerAddon('/c', createSourceProvider(config, 'monochrome'), manifests.monochrome);
registerAddon('/d', createSourceProvider(config, 'deezer'), manifests.deezer);
registerAddon('/e', createSourceProvider(config, 'eljohnzc'), manifests.eljohnzc);
registerAddon('/f', createSourceProvider(config, 'instable'), manifests.instable);
registerAddon('/g', createSourceProvider(config, 'heisenberg'), manifests.heisenberg);

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
