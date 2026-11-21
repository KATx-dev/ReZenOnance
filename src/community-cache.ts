import type { PublicTrack, QobuzStream } from './types.js';

export interface CachedStream {
  stream: QobuzStream;
  title?: string;
  artist?: string;
  cachedAt: number;
  expiresAt: number;
  hits: number;
}

export interface CommunityCacheStats {
  cachedSearchesCount: number;
  cachedStreamsCount: number;
  totalHits: number;
  totalMisses: number;
  estimatedMbSaved: number;
  topCachedTracks: Array<{ id: string; title?: string; artist?: string; hits: number }>;
}

export class CommunityCache {
  private searches = new Map<string, { tracks: PublicTrack[]; expiresAt: number }>();
  private streams = new Map<string, CachedStream>();
  private totalHits = 0;
  private totalMisses = 0;

  constructor(
    private readonly searchTtlMs = 10 * 60 * 1000,   // 10 minutes search cache
    private readonly streamTtlMs = 60 * 60 * 1000,   // 1 hour stream link cache
    private readonly maxEntries = 500
  ) {}

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

  setSearch(key: string, tracks: PublicTrack[]): void {
    if (this.searches.size >= this.maxEntries) {
      const oldestKey = this.searches.keys().next().value;
      if (oldestKey) this.searches.delete(oldestKey);
    }
    this.searches.set(key, { tracks, expiresAt: Date.now() + this.searchTtlMs });
  }

  getStream(id: string): QobuzStream | undefined {
    const hit = this.streams.get(id);
    if (!hit) {
      this.totalMisses++;
      return undefined;
    }
    if (hit.expiresAt <= Date.now()) {
      this.streams.delete(id);
      this.totalMisses++;
      return undefined;
    }
    hit.hits++;
    this.totalHits++;
    return hit.stream;
  }

  setStream(id: string, stream: QobuzStream, title?: string, artist?: string): void {
    if (this.streams.size >= this.maxEntries) {
      const oldestKey = this.streams.keys().next().value;
      if (oldestKey) this.streams.delete(oldestKey);
    }
    this.streams.set(id, {
      stream,
      title,
      artist,
      cachedAt: Date.now(),
      expiresAt: Date.now() + this.streamTtlMs,
      hits: 1,
    });
  }

  getStats(): CommunityCacheStats {
    const activeStreams = Array.from(this.streams.entries()).filter(([_, item]) => item.expiresAt > Date.now());
    const topTracks = activeStreams
      .sort((a, b) => b[1].hits - a[1].hits)
      .slice(0, 8)
      .map(([id, item]) => ({
        id,
        title: item.title,
        artist: item.artist,
        hits: item.hits,
      }));

    // Estimate ~35MB saved per 24-bit FLAC cache hit
    const estimatedMbSaved = Math.round(this.totalHits * 35.5);

    return {
      cachedSearchesCount: this.searches.size,
      cachedStreamsCount: activeStreams.length,
      totalHits: this.totalHits,
      totalMisses: this.totalMisses,
      estimatedMbSaved,
      topCachedTracks: topTracks,
    };
  }

  clear(): void {
    this.searches.clear();
    this.streams.clear();
  }
}

export const communityCache = new CommunityCache();
