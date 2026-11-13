import type { QobuzProvider, QobuzStream, QobuzTrack, Quality } from '../types.js';

export interface DynamicSource {
  id: string;
  name: string;
  type?: 'built-in' | 'remote-addon';
  baseUrl?: string;
  enabled?: boolean;
  provider: QobuzProvider;
  healthStatus?: string;
  lastLatencyMs?: number;
}

export type Source = DynamicSource | { name: string; provider: QobuzProvider; id?: string; enabled?: boolean; type?: string; baseUrl?: string };

export class RacingProvider implements QobuzProvider {
  private sources: DynamicSource[];

  constructor(initialSources: Source[]) {
    this.sources = initialSources.map(s => ({
      id: s.id ?? s.name,
      name: s.name,
      type: (s as any).type ?? 'built-in',
      baseUrl: (s as any).baseUrl,
      enabled: s.enabled !== false,
      provider: s.provider,
      healthStatus: (s as any).healthStatus ?? 'operational',
      lastLatencyMs: (s as any).lastLatencyMs,
    }));
  }

  addSource(source: DynamicSource): void {
    const existingIndex = this.sources.findIndex(s => s.id === source.id);
    if (existingIndex >= 0) {
      this.sources[existingIndex] = { ...this.sources[existingIndex], ...source };
    } else {
      this.sources.push(source);
    }
  }

  removeSource(id: string): boolean {
    const initialLen = this.sources.length;
    this.sources = this.sources.filter(s => s.id !== id);
    return this.sources.length < initialLen;
  }

  setSourceEnabled(id: string, enabled: boolean): boolean {
    const source = this.sources.find(s => s.id === id);
    if (!source) return false;
    source.enabled = enabled;
    return true;
  }

  getSources(): DynamicSource[] {
    return [...this.sources];
  }

  async search(query: string, quality: Quality, atmos: string): Promise<QobuzTrack[]> {
    const activeSources = this.sources.filter(s => s.enabled !== false);
    if (activeSources.length === 0) return [];

    return new Promise((resolve, reject) => {
      let pending = activeSources.length;
      let anySuccess = false;
      let lastError: unknown;
      let settled = false;

      for (const source of activeSources) {
        source.provider.search(query, quality, atmos).then(tracks => {
          if (settled) return;
          anySuccess = true;
          if (tracks.length > 0) {
            settled = true;
            resolve(tracks.map(track => ({ ...track, upstreamId: `${source.id}:${track.upstreamId}` })));
            return;
          }
          pending -= 1;
          if (pending === 0) {
            settled = true;
            resolve([]);
          }
        }).catch(error => {
          if (settled) return;
          lastError = error;
          pending -= 1;
          if (pending === 0) {
            settled = true;
            if (anySuccess) {
              resolve([]);
            } else {
              reject(lastError);
            }
          }
        });
      }
    });
  }

  async getStream(trackId: string, quality: Quality, atmos: string): Promise<QobuzStream | null> {
    const separator = trackId.indexOf(':');
    if (separator > 0) {
      const sourceName = trackId.slice(0, separator);
      const upstreamId = trackId.slice(separator + 1);
      const source = this.sources.find(candidate => (candidate.id === sourceName || candidate.name === sourceName));
      if (source && source.enabled !== false) {
        const stream = await source.provider.getStream(upstreamId, quality, atmos);
        if (stream) return stream;
      }
    }

    // Fallback: Try all enabled providers if prefix was missing or primary provider had no stream
    for (const source of this.sources.filter(s => s.enabled !== false)) {
      try {
        const cleanId = trackId.includes(':') ? trackId.slice(trackId.lastIndexOf(':') + 1) : trackId;
        const stream = await source.provider.getStream(cleanId, quality, atmos);
        if (stream) return stream;
      } catch {
        // Continue fallback attempts
      }
    }
    return null;
  }
}

export function createRacingProvider(
  qobuzdl: QobuzProvider,
  lastbabe: QobuzProvider,
  monochrome?: QobuzProvider,
  deezer?: QobuzProvider,
  eljohnzc?: QobuzProvider,
  instable?: QobuzProvider,
): RacingProvider {
  const sources: DynamicSource[] = [
    { id: 'lastbabe', name: 'LastBabe Source', provider: lastbabe, enabled: true },
    { id: 'qobuzdl', name: 'Legacy Source', provider: qobuzdl, enabled: true },
  ];
  if (deezer) sources.unshift({ id: 'deezer', name: 'Deezer Fallback', provider: deezer, enabled: true });
  if (monochrome) sources.unshift({ id: 'monochrome', name: 'Monochrome Lossless Core', provider: monochrome, enabled: true });
  if (eljohnzc) sources.unshift({ id: 'eljohnzc', name: 'Lossless Alternate', provider: eljohnzc, enabled: true });
  if (instable) sources.unshift({ id: 'instable', name: 'Arcod Lossless', provider: instable, enabled: true });
  return new RacingProvider(sources);
}
