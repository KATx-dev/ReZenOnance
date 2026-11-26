import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Config } from './config.js';
import type { PublicTrack, QobuzStream, Quality } from './types.js';

export const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;
export const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
const THIRTY_DAYS_SEC = 30 * 24 * 60 * 60;
const SEVEN_DAYS_SEC = 7 * 24 * 60 * 60;

export interface TrackMetaRecord {
  title: string;
  artist?: string;
  album?: string;
  artworkURL?: string;
  duration?: number;
  provider?: string;
  updatedAt: number;
}

export interface CachedStream {
  id: string;
  canonicalKey: string;
  provider: string;
  quality: string;
  stream: QobuzStream;
  title?: string;
  artist?: string;
  album?: string;
  artworkURL?: string;
  duration?: number;
  cachedAt: number;
  lastPlayedAt: number;
  expiresAt: number;
  hits: number;
}

export interface RecentPlayRecord {
  id: string;
  canonicalKey: string;
  title: string;
  artist: string;
  album?: string;
  artworkURL?: string;
  duration?: number;
  provider: string;
  routePrefix: string;
  deliveryMode: 'json' | 'audio-proxy';
  quality: string;
  cacheHit: boolean;
  playedAt: number;
}

export interface CommunityCacheStats {
  cachedSearchesCount: number;
  cachedStreamsCount: number;
  knownTracksCount: number;
  totalHits: number;
  totalMisses: number;
  totalPlays: number;
  estimatedMbSaved: number;
  retentionDays: number;
  persistenceBackend: 'upstash-redis' | 'supabase' | 'disk+memory' | 'memory';
  providerBreakdown: Record<string, number>;
  topCachedTracks: Array<{
    id: string;
    canonicalKey: string;
    title?: string;
    artist?: string;
    album?: string;
    artworkURL?: string;
    duration?: number;
    provider?: string;
    hits: number;
    lastPlayedAt?: number;
    expiresAt?: number;
  }>;
  recentPlays: RecentPlayRecord[];
}

export function resolveProviderSlug(upstreamId: string | undefined, routePrefix: string): string {
  if (upstreamId && upstreamId.includes(':')) {
    const src = upstreamId.slice(0, upstreamId.indexOf(':')).toLowerCase();
    if (src === 'instable' || src === 'arcod') return 'arcod';
    return src;
  }
  const cleanPrefix = routePrefix.toLowerCase();
  if (cleanPrefix === '/p/arcod' || cleanPrefix === '/p/instable' || cleanPrefix === '/f') return 'arcod';
  if (cleanPrefix === '/p/monochrome' || cleanPrefix === '/c') return 'monochrome';
  if (cleanPrefix === '/a') return 'qobuzdl';
  if (cleanPrefix === '/b') return 'lastbabe';
  if (cleanPrefix === '/d') return 'deezer';
  if (cleanPrefix === '/e') return 'eljohnzc';
  return 'racing';
}

export function buildCanonicalKey(upstreamId: string | undefined, routePrefix: string, quality: Quality | string): string {
  const provider = resolveProviderSlug(upstreamId, routePrefix);
  const raw = upstreamId ?? '';
  const bareId = raw.includes(':') ? raw.slice(raw.lastIndexOf(':') + 1) : raw;
  return `${provider}:${bareId}:${String(quality).toUpperCase()}`;
}

export function bareCanonicalKey(upstreamId: string | undefined, routePrefix: string): string {
  const provider = resolveProviderSlug(upstreamId, routePrefix);
  const raw = upstreamId ?? '';
  const bareId = raw.includes(':') ? raw.slice(raw.lastIndexOf(':') + 1) : raw;
  return `${provider}:${bareId}`;
}

function isUsableText(value?: string, rejectValue?: string): value is string {
  if (!value) return false;
  const trimmed = value.trim();
  return trimmed.length > 0 && trimmed !== rejectValue;
}

function raceWithTimeout<T>(promise: Promise<T>, ms: number, fallback: T): Promise<T> {
  return new Promise<T>(resolve => {
    const timer = setTimeout(() => resolve(fallback), ms);
    promise.then(
      val => { clearTimeout(timer); resolve(val); },
      () => { clearTimeout(timer); resolve(fallback); },
    );
  });
}

export class CommunityCache {
  private searches = new Map<string, { tracks: PublicTrack[]; expiresAt: number }>();
  private streams = new Map<string, CachedStream>();
  private idToCanonical = new Map<string, string>();
  private metadata = new Map<string, TrackMetaRecord>();
  private recentPlays: RecentPlayRecord[] = [];
  private providerBreakdown: Record<string, number> = {};
  private totalHits = 0;
  private totalMisses = 0;
  private totalPlays = 0;

  // Persistent backends
  private redisUrl?: string;
  private redisToken?: string;
  private supabase: SupabaseClient | null = null;
  private supabaseBrokenUntil = 0;
  private diskPath?: string;
  private persistTimer?: NodeJS.Timeout;
  private persistenceMode: CommunityCacheStats['persistenceBackend'] = 'memory';

  constructor(
    private readonly searchTtlMs = SEVEN_DAYS_MS,     // 7 days search results
    private readonly streamTtlMs = THIRTY_DAYS_MS,    // 30 days cached streams
    private readonly maxEntries = 2000
  ) {}

  configure(config: Config): void {
    if (process.env.NODE_ENV === 'test') {
      this.persistenceMode = 'memory';
      return;
    }

    if (config.redisRestUrl && config.redisRestToken) {
      this.redisUrl = config.redisRestUrl.replace(/\/+$/, '');
      this.redisToken = config.redisRestToken;
      this.persistenceMode = 'upstash-redis';
    } else {
      const sbKey = config.supabaseServiceKey || config.supabaseKey;
      if (config.supabaseUrl && sbKey && process.env.DISABLE_SUPABASE !== 'true') {
        try {
          this.supabase = createClient(config.supabaseUrl, sbKey, {
            auth: { persistSession: false },
          });
          this.persistenceMode = 'supabase';
        } catch {
          this.supabase = null;
        }
      }
    }

    // Always enable fast local disk snapshot on non-test runtimes as durable L2-C
    try {
      if (config.cacheFilePath) {
        this.diskPath = config.cacheFilePath;
      } else if (process.env.VERCEL === '1') {
        this.diskPath = path.join(os.tmpdir(), 'rezen-community-cache-v2.json');
      } else {
        this.diskPath = path.resolve(process.cwd(), '.rezen-cache', 'community-cache-v2.json');
      }
      if (this.persistenceMode === 'memory') {
        this.persistenceMode = 'disk+memory';
      }
      this.loadFromDiskSync();
    } catch {
      this.diskPath = undefined;
    }
  }

  private isSupabaseReady(): boolean {
    if (!this.supabase) return false;
    return Date.now() > this.supabaseBrokenUntil;
  }

  private tripSupabase(): void {
    this.supabaseBrokenUntil = Date.now() + 60_000;
  }

  private async redisCmd<T = unknown>(...args: Array<string | number>): Promise<T | null> {
    if (!this.redisUrl || !this.redisToken) return null;
    try {
      const res = await fetch(this.redisUrl, {
        method: 'POST',
        headers: {
          authorization: `Bearer ${this.redisToken}`,
          'content-type': 'application/json',
        },
        body: JSON.stringify(args),
        signal: AbortSignal.timeout(1200),
      });
      if (!res.ok) return null;
      const body = await res.json() as { result?: T };
      return body.result ?? null;
    } catch {
      return null;
    }
  }

  private loadFromDiskSync(): void {
    if (!this.diskPath || !fs.existsSync(this.diskPath)) return;
    try {
      const raw = fs.readFileSync(this.diskPath, 'utf8');
      const parsed = JSON.parse(raw) as {
        totalHits?: number;
        totalMisses?: number;
        totalPlays?: number;
        providerBreakdown?: Record<string, number>;
        streams?: Array<[string, CachedStream]>;
        idToCanonical?: Array<[string, string]>;
        metadata?: Array<[string, TrackMetaRecord]>;
        recentPlays?: RecentPlayRecord[];
        searches?: Array<[string, { tracks: PublicTrack[]; expiresAt: number }]>;
      };
      const now = Date.now();
      if (typeof parsed.totalHits === 'number') this.totalHits = parsed.totalHits;
      if (typeof parsed.totalMisses === 'number') this.totalMisses = parsed.totalMisses;
      if (typeof parsed.totalPlays === 'number') this.totalPlays = parsed.totalPlays;
      if (parsed.providerBreakdown) this.providerBreakdown = parsed.providerBreakdown;
      if (Array.isArray(parsed.recentPlays)) this.recentPlays = parsed.recentPlays.slice(0, 60);
      if (Array.isArray(parsed.idToCanonical)) {
        for (const [id, key] of parsed.idToCanonical) this.idToCanonical.set(id, key);
      }
      if (Array.isArray(parsed.metadata)) {
        for (const [k, v] of parsed.metadata) {
          if (now - (v.updatedAt ?? 0) < THIRTY_DAYS_MS) this.metadata.set(k, v);
        }
      }
      if (Array.isArray(parsed.streams)) {
        for (const [k, s] of parsed.streams) {
          if (s.expiresAt > now) this.streams.set(k, s);
        }
      }
      if (Array.isArray(parsed.searches)) {
        for (const [k, v] of parsed.searches) {
          if (v.expiresAt > now) this.searches.set(k, v);
        }
      }
    } catch {
      // Ignore corrupt cache snapshot
    }
  }

  private scheduleDiskFlush(): void {
    if (!this.diskPath) return;
    if (this.persistTimer) return;
    this.persistTimer = setTimeout(() => {
      this.persistTimer = undefined;
      this.flushDiskSync();
    }, 1000);
    if (typeof this.persistTimer.unref === 'function') this.persistTimer.unref();
  }

  private flushDiskSync(): void {
    if (!this.diskPath) return;
    try {
      const dir = path.dirname(this.diskPath);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      const payload = {
        totalHits: this.totalHits,
        totalMisses: this.totalMisses,
        totalPlays: this.totalPlays,
        providerBreakdown: this.providerBreakdown,
        idToCanonical: Array.from(this.idToCanonical.entries()).slice(-this.maxEntries),
        metadata: Array.from(this.metadata.entries()).slice(-5000),
        streams: Array.from(this.streams.entries()).slice(-this.maxEntries),
        searches: Array.from(this.searches.entries()).slice(-1000),
        recentPlays: this.recentPlays.slice(0, 60),
      };
      fs.writeFileSync(this.diskPath, JSON.stringify(payload), 'utf8');
    } catch {
      // Disk may be read-only in strict containers
    }
  }

  setMetadata(
    id: string,
    title?: string,
    artist?: string,
    extra?: { album?: string; artworkURL?: string; duration?: number; provider?: string; canonicalBareKey?: string },
  ): void {
    if (!isUsableText(title, 'Unknown Track')) return;
    const cleanTitle = title.trim();
    const cleanArtist = isUsableText(artist, 'Unknown Artist') ? artist.trim() : undefined;
    const record: TrackMetaRecord = {
      title: cleanTitle,
      artist: cleanArtist,
      album: extra?.album?.trim() || undefined,
      artworkURL: extra?.artworkURL,
      duration: extra?.duration,
      provider: extra?.provider,
      updatedAt: Date.now(),
    };

    this.storeMetadataKey(id, record);
    if (extra?.canonicalBareKey) {
      this.storeMetadataKey(extra.canonicalBareKey, record);
    }

    const existing = this.findStreamEntry(id, extra?.canonicalBareKey);
    if (existing) {
      if (!isUsableText(existing.title, 'Unknown Track')) existing.title = cleanTitle;
      if (!isUsableText(existing.artist, 'Unknown Artist') && cleanArtist) existing.artist = cleanArtist;
      if (!existing.album && record.album) existing.album = record.album;
      if (!existing.artworkURL && record.artworkURL) existing.artworkURL = record.artworkURL;
      if (!existing.duration && record.duration) existing.duration = record.duration;
    }
  }

  private storeMetadataKey(key: string, record: TrackMetaRecord): void {
    if (this.metadata.size >= 5000 && !this.metadata.has(key)) {
      const oldest = this.metadata.keys().next().value;
      if (oldest) this.metadata.delete(oldest);
    }
    const prev = this.metadata.get(key);
    this.metadata.set(key, {
      title: record.title || prev?.title || '',
      artist: record.artist || prev?.artist,
      album: record.album || prev?.album,
      artworkURL: record.artworkURL || prev?.artworkURL,
      duration: record.duration ?? prev?.duration,
      provider: record.provider || prev?.provider,
      updatedAt: Date.now(),
    });
  }

  getMetadata(id: string, canonicalBare?: string): TrackMetaRecord | undefined {
    return this.metadata.get(id) ?? (canonicalBare ? this.metadata.get(canonicalBare) : undefined);
  }

  getSearch(key: string): PublicTrack[] | undefined {
    const hit = this.searches.get(key);
    if (!hit) {
      this.totalMisses++;
      return undefined;
    }
    if (hit.expiresAt <= Date.now()) {
      this.searches.delete(key);
      this.totalMisses++;
      return undefined;
    }
    this.totalHits++;
    return hit.tracks;
  }

  async getSearchAsync(key: string): Promise<PublicTrack[] | undefined> {
    const l1 = this.searches.get(key);
    if (l1 && l1.expiresAt > Date.now()) {
      this.totalHits++;
      return l1.tracks;
    }
    if (l1) this.searches.delete(key);

    if (this.redisUrl && this.redisToken) {
      const raw = await this.redisCmd<string>('GET', `rezen:search:${key}`);
      if (raw) {
        try {
          const parsed = JSON.parse(raw) as PublicTrack[];
          if (Array.isArray(parsed)) {
            this.setSearch(key, parsed);
            this.totalHits++;
            return parsed;
          }
        } catch {}
      }
    }

    if (this.isSupabaseReady()) {
      try {
        const res = await raceWithTimeout(
          Promise.resolve(
            this.supabase!
              .from('community_searches')
              .select('tracks_json, expires_at')
              .eq('cache_key', key)
              .gt('expires_at', new Date().toISOString())
              .maybeSingle(),
          ),
          900,
          null,
        );
        if (res && !res.error && res.data && Array.isArray((res.data as any).tracks_json)) {
          const tracks = (res.data as any).tracks_json as PublicTrack[];
          this.setSearch(key, tracks);
          this.totalHits++;
          return tracks;
        }
        if (res?.error) this.tripSupabase();
      } catch {
        this.tripSupabase();
      }
    }

    this.totalMisses++;
    return undefined;
  }

  setSearch(
    key: string,
    tracks: PublicTrack[],
    resolverForCanonical?: (track: PublicTrack) => string | undefined,
  ): void {
    for (const track of tracks) {
      if (track.id && track.title) {
        const canonicalBare = resolverForCanonical?.(track);
        this.setMetadata(track.id, track.title, track.artist, {
          album: track.album,
          artworkURL: track.artworkURL,
          duration: track.duration,
          canonicalBareKey: canonicalBare,
        });
      }
    }
    if (this.searches.size >= this.maxEntries) {
      const oldestKey = this.searches.keys().next().value;
      if (oldestKey) this.searches.delete(oldestKey);
    }
    this.searches.set(key, { tracks, expiresAt: Date.now() + this.searchTtlMs });
    this.scheduleDiskFlush();
  }

  async setSearchAsync(
    key: string,
    tracks: PublicTrack[],
    resolverForCanonical?: (track: PublicTrack) => string | undefined,
  ): Promise<void> {
    this.setSearch(key, tracks, resolverForCanonical);
    this.flushDiskSync();

    if (this.redisUrl && this.redisToken) {
      await raceWithTimeout(
        this.redisCmd('SET', `rezen:search:${key}`, JSON.stringify(tracks), 'EX', SEVEN_DAYS_SEC),
        800,
        null,
      );
    } else if (this.isSupabaseReady()) {
      try {
        await raceWithTimeout(
          Promise.resolve(
            this.supabase!.from('community_searches').upsert({
              cache_key: key,
              tracks_json: tracks,
              expires_at: new Date(Date.now() + SEVEN_DAYS_MS).toISOString(),
              updated_at: new Date().toISOString(),
            }),
          ),
          800,
          null,
        );
      } catch {
        this.tripSupabase();
      }
    }
  }

  private findStreamEntry(id: string, canonicalKey?: string): CachedStream | undefined {
    if (canonicalKey) {
      const byCanonical = this.streams.get(canonicalKey);
      if (byCanonical) return byCanonical;
    }
    const mapped = this.idToCanonical.get(id);
    if (mapped) {
      const entry = this.streams.get(mapped);
      if (entry) return entry;
    }
    return this.streams.get(id);
  }

  getStream(id: string, canonicalKey?: string): QobuzStream | undefined {
    const key = canonicalKey || this.idToCanonical.get(id) || id;
    const hit = this.streams.get(key) ?? this.streams.get(id);
    if (!hit) {
      this.totalMisses++;
      return undefined;
    }
    if (hit.expiresAt <= Date.now()) {
      this.streams.delete(key);
      this.streams.delete(id);
      this.totalMisses++;
      return undefined;
    }
    hit.hits++;
    this.totalHits++;
    hit.lastPlayedAt = Date.now();
    this.backfillEntryMetadata(hit, id, canonicalKey);
    return hit.stream;
  }

  private backfillEntryMetadata(hit: CachedStream, id: string, canonicalKey?: string): void {
    const bareKey = canonicalKey ? canonicalKey.replace(/:[^:]+$/, '') : undefined;
    const meta = this.getMetadata(id, bareKey) ?? this.getMetadata(hit.id, hit.canonicalKey.replace(/:[^:]+$/, ''));
    if (meta) {
      if (!isUsableText(hit.title, 'Unknown Track')) hit.title = meta.title;
      if (!isUsableText(hit.artist, 'Unknown Artist') && meta.artist) hit.artist = meta.artist;
      if (!hit.album && meta.album) hit.album = meta.album;
      if (!hit.artworkURL && meta.artworkURL) hit.artworkURL = meta.artworkURL;
      if (!hit.duration && meta.duration) hit.duration = meta.duration;
    }
  }

  async getStreamAsync(id: string, canonicalKey?: string): Promise<CachedStream | undefined> {
    const key = canonicalKey || this.idToCanonical.get(id) || id;
    const now = Date.now();
    const localHit = this.streams.get(key) ?? this.streams.get(id);
    if (localHit && localHit.expiresAt > now) {
      this.backfillEntryMetadata(localHit, id, canonicalKey);
      return localHit;
    }

    if (this.redisUrl && this.redisToken) {
      const raw = await this.redisCmd<string>('GET', `rezen:stream:${key}`);
      if (raw) {
        try {
          const parsed = JSON.parse(raw) as CachedStream;
          if (parsed && parsed.stream && parsed.expiresAt > now) {
            this.streams.set(key, parsed);
            this.idToCanonical.set(id, key);
            return parsed;
          }
        } catch {}
      }
    }

    if (this.isSupabaseReady()) {
      try {
        const res = await raceWithTimeout(
          Promise.resolve(
            this.supabase!
              .from('community_tracks')
              .select('*')
              .eq('canonical_key', key)
              .gt('expires_at', new Date().toISOString())
              .maybeSingle(),
          ),
          900,
          null,
        );
        if (res && !res.error && res.data) {
          const row = res.data as any;
          const hydrated: CachedStream = {
            id: row.track_id || id,
            canonicalKey: row.canonical_key || key,
            provider: row.provider || 'racing',
            quality: row.quality || 'LOSSLESS',
            stream: {
              url: row.stream_url,
              format: row.stream_format || 'flac',
              quality: row.quality || 'LOSSLESS',
              manifest: 'none',
              encrypted: false,
            },
            title: row.title || undefined,
            artist: row.artist || undefined,
            album: row.album || undefined,
            artworkURL: row.artwork_url || undefined,
            duration: typeof row.duration === 'number' ? row.duration : undefined,
            cachedAt: row.created_at ? Date.parse(row.created_at) : now,
            lastPlayedAt: row.last_played_at ? Date.parse(row.last_played_at) : now,
            expiresAt: row.expires_at ? Date.parse(row.expires_at) : now + this.streamTtlMs,
            hits: typeof row.hits === 'number' ? row.hits : 1,
          };
          if (hydrated.stream.url && /^https:\/\//i.test(hydrated.stream.url)) {
            this.streams.set(key, hydrated);
            this.idToCanonical.set(id, key);
            return hydrated;
          }
        }
        if (res?.error) this.tripSupabase();
      } catch {
        this.tripSupabase();
      }
    }

    return undefined;
  }

  invalidateStream(id: string, canonicalKey?: string): void {
    const key = canonicalKey || this.idToCanonical.get(id) || id;
    this.streams.delete(key);
    this.streams.delete(id);
    this.scheduleDiskFlush();
  }

  setStream(
    id: string,
    stream: QobuzStream,
    title?: string,
    artist?: string,
    options?: {
      canonicalKey?: string;
      provider?: string;
      quality?: string;
      album?: string;
      artworkURL?: string;
      duration?: number;
      routePrefix?: string;
      deliveryMode?: 'json' | 'audio-proxy';
    },
  ): CachedStream {
    const key = options?.canonicalKey || this.idToCanonical.get(id) || id;
    const bareKey = options?.canonicalKey ? options.canonicalKey.replace(/:[^:]+$/, '') : undefined;
    if (this.streams.size >= this.maxEntries && !this.streams.has(key)) {
      const oldestKey = this.streams.keys().next().value;
      if (oldestKey) this.streams.delete(oldestKey);
    }
    this.idToCanonical.set(id, key);

    const meta = this.getMetadata(id, bareKey);
    const existing = this.streams.get(key) ?? this.streams.get(id);

    const resolvedTitle =
      (isUsableText(title, 'Unknown Track') ? title.trim() : undefined) ||
      meta?.title ||
      (isUsableText(existing?.title, 'Unknown Track') ? existing?.title : undefined);
    const resolvedArtist =
      (isUsableText(artist, 'Unknown Artist') ? artist.trim() : undefined) ||
      meta?.artist ||
      (isUsableText(existing?.artist, 'Unknown Artist') ? existing?.artist : undefined);
    const resolvedAlbum = options?.album?.trim() || meta?.album || existing?.album;
    const resolvedArtwork = options?.artworkURL || meta?.artworkURL || existing?.artworkURL;
    const resolvedDuration = options?.duration ?? meta?.duration ?? existing?.duration;
    const provider = options?.provider || meta?.provider || existing?.provider || 'racing';

    if (resolvedTitle) {
      this.setMetadata(id, resolvedTitle, resolvedArtist, {
        album: resolvedAlbum,
        artworkURL: resolvedArtwork,
        duration: resolvedDuration,
        provider,
        canonicalBareKey: bareKey,
      });
    }

    const now = Date.now();
    const hits = existing ? existing.hits + 1 : 1;
    const entry: CachedStream = {
      id,
      canonicalKey: key,
      provider,
      quality: options?.quality || stream.quality || 'LOSSLESS',
      stream,
      title: resolvedTitle,
      artist: resolvedArtist,
      album: resolvedAlbum,
      artworkURL: resolvedArtwork,
      duration: resolvedDuration,
      cachedAt: existing?.cachedAt ?? now,
      lastPlayedAt: now,
      expiresAt: now + this.streamTtlMs,
      hits,
    };

    this.streams.set(key, entry);
    this.totalMisses++;
    this.recordPlayInternal(entry, options?.routePrefix ?? '/', options?.deliveryMode ?? 'json', false);
    this.scheduleDiskFlush();
    return entry;
  }

  recordCachedPlay(
    entry: CachedStream,
    routePrefix: string,
    deliveryMode: 'json' | 'audio-proxy',
  ): void {
    entry.hits++;
    entry.lastPlayedAt = Date.now();
    entry.expiresAt = Date.now() + this.streamTtlMs;
    this.totalHits++;
    this.recordPlayInternal(entry, routePrefix, deliveryMode, true);
    this.scheduleDiskFlush();
  }

  private recordPlayInternal(
    entry: CachedStream,
    routePrefix: string,
    deliveryMode: 'json' | 'audio-proxy',
    cacheHit: boolean,
  ): void {
    this.totalPlays++;
    const label = entry.provider || 'racing';
    this.providerBreakdown[label] = (this.providerBreakdown[label] ?? 0) + 1;

    const play: RecentPlayRecord = {
      id: entry.id,
      canonicalKey: entry.canonicalKey,
      title: entry.title || 'Lossless Track',
      artist: entry.artist || 'Studio Artist',
      album: entry.album,
      artworkURL: entry.artworkURL,
      duration: entry.duration,
      provider: label,
      routePrefix: routePrefix || '/',
      deliveryMode,
      quality: entry.quality,
      cacheHit,
      playedAt: Date.now(),
    };
    this.recentPlays.unshift(play);
    if (this.recentPlays.length > 60) this.recentPlays.length = 60;
  }

  async persistEntryAsync(entry: CachedStream, routePrefix: string, deliveryMode: 'json' | 'audio-proxy', cacheHit: boolean): Promise<void> {
    this.flushDiskSync();

    if (this.redisUrl && this.redisToken) {
      const latestPlay = this.recentPlays[0];
      await raceWithTimeout(
        Promise.all([
          this.redisCmd('SET', `rezen:stream:${entry.canonicalKey}`, JSON.stringify(entry), 'EX', THIRTY_DAYS_SEC),
          this.redisCmd('ZADD', 'rezen:leaderboard', entry.hits, entry.canonicalKey),
          this.redisCmd('HINCRBY', 'rezen:counters', cacheHit ? 'hits' : 'misses', 1),
          this.redisCmd('HINCRBY', 'rezen:counters', 'plays', 1),
          this.redisCmd('HINCRBY', 'rezen:providers', entry.provider, 1),
          ...(latestPlay
            ? [
                this.redisCmd('LPUSH', 'rezen:recent_plays', JSON.stringify(latestPlay)),
                this.redisCmd('LTRIM', 'rezen:recent_plays', 0, 59),
              ]
            : []),
        ]),
        900,
        null,
      );
      return;
    }

    if (this.isSupabaseReady()) {
      try {
        await raceWithTimeout(
          Promise.all([
            this.supabase!.from('community_tracks').upsert({
              canonical_key: entry.canonicalKey,
              track_id: entry.id,
              provider: entry.provider,
              title: entry.title || 'Lossless Track',
              artist: entry.artist || 'Studio Artist',
              album: entry.album || null,
              artwork_url: entry.artworkURL || null,
              duration: entry.duration ?? null,
              quality: entry.quality,
              stream_url: entry.stream.url,
              stream_format: entry.stream.format || 'flac',
              hits: entry.hits,
              last_played_at: new Date(entry.lastPlayedAt).toISOString(),
              expires_at: new Date(entry.expiresAt).toISOString(),
            }),
            this.supabase!.from('community_play_logs').insert({
              canonical_key: entry.canonicalKey,
              track_id: entry.id,
              provider: entry.provider,
              route_prefix: routePrefix || '/',
              delivery_mode: deliveryMode,
              title: entry.title || 'Lossless Track',
              artist: entry.artist || 'Studio Artist',
              artwork_url: entry.artworkURL || null,
              quality: entry.quality,
              cache_hit: cacheHit,
              played_at: new Date().toISOString(),
            }),
          ]),
          900,
          null,
        );
      } catch {
        this.tripSupabase();
      }
    }
  }

  getStats(): CommunityCacheStats {
    const now = Date.now();
    const activeStreams = Array.from(this.streams.values()).filter(item => item.expiresAt > now);
    const topTracks = activeStreams
      .sort((a, b) => b.hits - a.hits || b.lastPlayedAt - a.lastPlayedAt)
      .slice(0, 12)
      .map(item => {
        const bareKey = item.canonicalKey.replace(/:[^:]+$/, '');
        const meta = this.getMetadata(item.id, bareKey);
        return {
          id: item.id,
          canonicalKey: item.canonicalKey,
          title: item.title || meta?.title,
          artist: item.artist || meta?.artist,
          album: item.album || meta?.album,
          artworkURL: item.artworkURL || meta?.artworkURL,
          duration: item.duration ?? meta?.duration,
          provider: item.provider,
          hits: item.hits,
          lastPlayedAt: item.lastPlayedAt,
          expiresAt: item.expiresAt,
        };
      });

    const estimatedMbSaved = Math.round(this.totalHits * 35.5);

    return {
      cachedSearchesCount: this.searches.size,
      cachedStreamsCount: activeStreams.length,
      knownTracksCount: Math.max(this.metadata.size, activeStreams.length),
      totalHits: this.totalHits,
      totalMisses: this.totalMisses,
      totalPlays: this.totalPlays,
      estimatedMbSaved,
      retentionDays: 30,
      persistenceBackend: this.persistenceMode,
      providerBreakdown: { ...this.providerBreakdown },
      topCachedTracks: topTracks,
      recentPlays: this.recentPlays.slice(0, 25),
    };
  }

  async getStatsAsync(): Promise<CommunityCacheStats> {
    const localStats = this.getStats();

    if (this.redisUrl && this.redisToken) {
      try {
        const [topKeys, recentRaw, countersRaw, providersRaw, totalLeaderboard] = await raceWithTimeout(
          Promise.all([
            this.redisCmd<string[]>('ZREVRANGE', 'rezen:leaderboard', 0, 11),
            this.redisCmd<string[]>('LRANGE', 'rezen:recent_plays', 0, 24),
            this.redisCmd<string[]>('HGETALL', 'rezen:counters'),
            this.redisCmd<string[]>('HGETALL', 'rezen:providers'),
            this.redisCmd<number>('ZCARD', 'rezen:leaderboard'),
          ]),
          900,
          [null, null, null, null, null] as const,
        );

        const counters: Record<string, number> = {};
        if (Array.isArray(countersRaw)) {
          for (let i = 0; i < countersRaw.length; i += 2) {
            counters[String(countersRaw[i])] = Number(countersRaw[i + 1]) || 0;
          }
        }
        const providers: Record<string, number> = {};
        if (Array.isArray(providersRaw)) {
          for (let i = 0; i < providersRaw.length; i += 2) {
            providers[String(providersRaw[i])] = Number(providersRaw[i + 1]) || 0;
          }
        }

        const topCachedTracks: CommunityCacheStats['topCachedTracks'] = [];
        if (Array.isArray(topKeys) && topKeys.length > 0) {
          const entries = await Promise.all(topKeys.map(k => this.redisCmd<string>('GET', `rezen:stream:${k}`)));
          for (const raw of entries) {
            if (!raw) continue;
            try {
              const s = JSON.parse(raw) as CachedStream;
              topCachedTracks.push({
                id: s.id,
                canonicalKey: s.canonicalKey,
                title: s.title,
                artist: s.artist,
                album: s.album,
                artworkURL: s.artworkURL,
                duration: s.duration,
                provider: s.provider,
                hits: s.hits,
                lastPlayedAt: s.lastPlayedAt,
                expiresAt: s.expiresAt,
              });
            } catch {}
          }
        }

        const recentPlays: RecentPlayRecord[] = [];
        if (Array.isArray(recentRaw)) {
          for (const raw of recentRaw) {
            try {
              recentPlays.push(JSON.parse(raw) as RecentPlayRecord);
            } catch {}
          }
        }

        const hits = Math.max(localStats.totalHits, counters.hits ?? 0);
        const misses = Math.max(localStats.totalMisses, counters.misses ?? 0);
        const plays = Math.max(localStats.totalPlays, counters.plays ?? 0);

        return {
          ...localStats,
          cachedStreamsCount: typeof totalLeaderboard === 'number' && totalLeaderboard > 0 ? totalLeaderboard : localStats.cachedStreamsCount,
          totalHits: hits,
          totalMisses: misses,
          totalPlays: plays,
          estimatedMbSaved: Math.round(hits * 35.5),
          providerBreakdown: Object.keys(providers).length > 0 ? providers : localStats.providerBreakdown,
          topCachedTracks: topCachedTracks.length > 0 ? topCachedTracks : localStats.topCachedTracks,
          recentPlays: recentPlays.length > 0 ? recentPlays : localStats.recentPlays,
        };
      } catch {}
    }

    if (this.isSupabaseReady()) {
      try {
        const nowIso = new Date().toISOString();
        const [topRes, logsRes, countRes] = await raceWithTimeout(
          Promise.all([
            this.supabase!
              .from('community_tracks')
              .select('track_id, canonical_key, title, artist, album, artwork_url, duration, provider, hits, last_played_at, expires_at')
              .gt('expires_at', nowIso)
              .order('hits', { ascending: false })
              .limit(12),
            this.supabase!
              .from('community_play_logs')
              .select('track_id, canonical_key, title, artist, artwork_url, provider, route_prefix, delivery_mode, quality, cache_hit, played_at')
              .order('played_at', { ascending: false })
              .limit(25),
            this.supabase!
              .from('community_tracks')
              .select('canonical_key', { count: 'exact', head: true })
              .gt('expires_at', nowIso),
          ]),
          900,
          [null, null, null] as any,
        );

        if (topRes && !topRes.error && Array.isArray(topRes.data) && topRes.data.length > 0) {
          const mappedTop = topRes.data.map((r: any) => ({
            id: r.track_id,
            canonicalKey: r.canonical_key,
            title: r.title,
            artist: r.artist,
            album: r.album || undefined,
            artworkURL: r.artwork_url || undefined,
            duration: typeof r.duration === 'number' ? r.duration : undefined,
            provider: r.provider,
            hits: r.hits || 1,
            lastPlayedAt: r.last_played_at ? Date.parse(r.last_played_at) : undefined,
            expiresAt: r.expires_at ? Date.parse(r.expires_at) : undefined,
          }));
          const mappedRecent: RecentPlayRecord[] = logsRes && !logsRes.error && Array.isArray(logsRes.data)
            ? logsRes.data.map((l: any) => ({
                id: l.track_id,
                canonicalKey: l.canonical_key,
                title: l.title || 'Lossless Track',
                artist: l.artist || 'Studio Artist',
                artworkURL: l.artwork_url || undefined,
                provider: l.provider || 'racing',
                routePrefix: l.route_prefix || '/',
                deliveryMode: l.delivery_mode === 'audio-proxy' ? 'audio-proxy' : 'json',
                quality: l.quality || 'LOSSLESS',
                cacheHit: Boolean(l.cache_hit),
                playedAt: l.played_at ? Date.parse(l.played_at) : Date.now(),
              }))
            : localStats.recentPlays;

          const totalHitsDb = mappedTop.reduce((acc: number, item: any) => acc + Math.max(0, (item.hits ?? 1) - 1), 0);
          const hits = Math.max(localStats.totalHits, totalHitsDb);
          return {
            ...localStats,
            cachedStreamsCount: typeof countRes?.count === 'number' ? countRes.count : mappedTop.length,
            totalHits: hits,
            totalPlays: Math.max(localStats.totalPlays, mappedTop.reduce((a: number, t: any) => a + (t.hits ?? 1), 0)),
            estimatedMbSaved: Math.round(hits * 35.5),
            topCachedTracks: mappedTop,
            recentPlays: mappedRecent.length > 0 ? mappedRecent : localStats.recentPlays,
          };
        }
        if (topRes?.error) this.tripSupabase();
      } catch {
        this.tripSupabase();
      }
    }

    return localStats;
  }

  clear(): void {
    this.searches.clear();
    this.streams.clear();
    this.idToCanonical.clear();
    this.metadata.clear();
    this.recentPlays = [];
    this.providerBreakdown = {};
    this.totalHits = 0;
    this.totalMisses = 0;
    this.totalPlays = 0;
    this.flushDiskSync();
  }
}

export const communityCache = new CommunityCache();
