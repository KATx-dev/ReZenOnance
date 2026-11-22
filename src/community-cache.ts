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
  private metadata = new Map<string, { title: string; artist?: string }>();
  private totalHits = 0;
  private totalMisses = 0;

  constructor(
    private readonly searchTtlMs = 10 * 60 * 1000,   // 10 minutes search cache
    private readonly streamTtlMs = 60 * 60 * 1000,   // 1 hour stream link cache
    private readonly maxEntries = 500
  ) {}

  setMetadata(id: string, title?: string, artist?: string): void {
    if (!title || title.trim() === '' || title === 'Unknown Track') return;
    const cleanTitle = title.trim();
    const cleanArtist = artist && artist.trim() !== 'Unknown Artist' ? artist.trim() : undefined;
    this.metadata.set(id, { title: cleanTitle, artist: cleanArtist });

    // Backfill existing cached stream entry if missing title or artist
    const existing = this.streams.get(id);
    if (existing) {
      if (!existing.title || existing.title === 'Unknown Track') {
        existing.title = cleanTitle;
      }
      if ((!existing.artist || existing.artist === 'Unknown Artist') && cleanArtist) {
        existing.artist = cleanArtist;
      }
    }
  }

  getMetadata(id: string): { title: string; artist?: string } | undefined {
    return this.metadata.get(id);
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

  setSearch(key: string, tracks: PublicTrack[]): void {
    for (const track of tracks) {
      if (track.id && track.title) {
        this.setMetadata(track.id, track.title, track.artist);
      }
    }
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

    // If metadata was learned after initial stream caching, backfill
    if (!hit.title || hit.title === 'Unknown Track') {
      const meta = this.metadata.get(id);
      if (meta) {
        hit.title = meta.title;
        hit.artist = meta.artist || hit.artist;
      }
    }

    return hit.stream;
  }

  setStream(id: string, stream: QobuzStream, title?: string, artist?: string): void {
    if (this.streams.size >= this.maxEntries) {
      const oldestKey = this.streams.keys().next().value;
      if (oldestKey) this.streams.delete(oldestKey);
    }

    const meta = this.metadata.get(id);
    const resolvedTitle = (title && title !== 'Unknown Track' ? title.trim() : undefined) || meta?.title;
    const resolvedArtist = (artist && artist !== 'Unknown Artist' ? artist.trim() : undefined) || meta?.artist;

    if (resolvedTitle) {
      this.setMetadata(id, resolvedTitle, resolvedArtist);
    }

    const existing = this.streams.get(id);
    const hits = existing ? existing.hits + 1 : 1;

    this.streams.set(id, {
      stream,
      title: resolvedTitle || existing?.title,
      artist: resolvedArtist || existing?.artist,
      cachedAt: Date.now(),
      expiresAt: Date.now() + this.streamTtlMs,
      hits,
    });
  }

  getStats(): CommunityCacheStats {
    const activeStreams = Array.from(this.streams.entries()).filter(([_, item]) => item.expiresAt > Date.now());
    const topTracks = activeStreams
      .sort((a, b) => b[1].hits - a[1].hits)
      .slice(0, 8)
      .map(([id, item]) => {
        const meta = this.metadata.get(id);
        return {
          id,
          title: item.title || meta?.title,
          artist: item.artist || meta?.artist,
          hits: item.hits,
        };
      });

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
    this.metadata.clear();
  }
}

export const communityCache = new CommunityCache();
