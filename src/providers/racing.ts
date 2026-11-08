import type { QobuzProvider, QobuzStream, QobuzTrack, Quality } from '../types.js';

interface Source { name: string; provider: QobuzProvider }

export class RacingProvider implements QobuzProvider {
  constructor(private readonly sources: Source[]) {}

  async search(query: string, quality: Quality, atmos: string): Promise<QobuzTrack[]> {
    return new Promise((resolve, reject) => {
      let pending = this.sources.length;
      let anySuccess = false;
      let lastError: unknown;
      let settled = false;

      for (const source of this.sources) {
        source.provider.search(query, quality, atmos).then(tracks => {
          if (settled) return;
          anySuccess = true;
          if (tracks.length > 0) {
            settled = true;
            resolve(tracks.map(track => ({ ...track, upstreamId: `${source.name}:${track.upstreamId}` })));
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
      const source = this.sources.find(candidate => candidate.name === sourceName);
      if (source) {
        const stream = await source.provider.getStream(upstreamId, quality, atmos);
        if (stream) return stream;
      }
    }

    // Fallback: Try all providers if prefix was missing or primary provider had no stream
    for (const source of this.sources) {
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
  heisenberg?: QobuzProvider,
): QobuzProvider {
  const sources: Source[] = [
    { name: 'lastbabe', provider: lastbabe },
    { name: 'qobuzdl', provider: qobuzdl },
  ];
  if (deezer) sources.unshift({ name: 'deezer', provider: deezer });
  if (monochrome) sources.unshift({ name: 'monochrome', provider: monochrome });
  if (eljohnzc) sources.unshift({ name: 'eljohnzc', provider: eljohnzc });
  if (instable) sources.unshift({ name: 'instable', provider: instable });
  if (heisenberg) sources.unshift({ name: 'heisenberg', provider: heisenberg });
  return new RacingProvider(sources);
}
