import type { CSSProperties } from 'react';
import type { Album, Artist, Playlist, Track } from './types';

/** Deterministic harmonic hue pair for any track/artist string. */
export function huePairFromSeed(seed: string): [number, number] {
  let hash = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    hash ^= seed.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  const h1 = Math.abs(hash) % 360;
  const h2 = (h1 + 52 + (Math.abs(hash >>> 8) % 68)) % 360;
  return [h1, h2];
}

export function slugify(text: string): string {
  return (
    text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') || 'item'
  );
}

/** Mutable live catalogue registry backed by ReZenOnance /search and /api/community responses. */
const trackMap = new Map<string, Track>();
const albumMap = new Map<string, Album>();
const artistMap = new Map<string, Artist>();

export interface ApiPublicTrack {
  id: string;
  title: string;
  artist?: string;
  album?: string;
  duration?: number;
  artworkURL?: string;
  format?: string;
  audioQuality?: string;
  provider?: string;
  hits?: number;
}

export function registerApiTracks(apiTracks: ApiPublicTrack[]): Track[] {
  const registered: Track[] = [];
  for (const item of apiTracks) {
    if (!item || !item.id || !item.title) continue;
    const existing = trackMap.get(item.id);
    const artistName = item.artist?.trim() || existing?.artist || 'Studio Artist';
    const albumTitle = item.album?.trim() || existing?.album || `${artistName} Singles`;
    const artistId = `art-${slugify(artistName)}`;
    const albumId = `alb-${slugify(`${artistName}-${albumTitle}`)}`;
    const [hue, hue2] = existing
      ? [existing.hue, existing.hue2]
      : huePairFromSeed(`${item.title}:${artistName}`);

    const track: Track = {
      id: item.id,
      title: item.title.trim(),
      artistId,
      artist: artistName,
      albumId,
      album: albumTitle,
      duration: typeof item.duration === 'number' && item.duration > 0 ? item.duration : existing?.duration ?? 210,
      year: existing?.year ?? 2025,
      genre: existing?.genre ?? 'Lossless Master',
      plays: typeof item.hits === 'number' ? `${item.hits} cache hits` : existing?.plays ?? '24-bit FLAC',
      hue,
      hue2,
      artworkURL: item.artworkURL || existing?.artworkURL,
      format: item.format || existing?.format || 'flac',
      audioQuality: item.audioQuality || existing?.audioQuality || 'LOSSLESS',
      provider: item.provider || existing?.provider,
      lyrics: existing?.lyrics ?? [],
    };
    trackMap.set(track.id, track);
    registered.push(track);

    // Maintain artist index
    const artistRec = artistMap.get(artistId);
    if (!artistRec) {
      artistMap.set(artistId, {
        id: artistId,
        name: artistName,
        hue,
        hue2,
        artworkURL: track.artworkURL,
        bio: `Streaming studio-grade lossless releases for ${artistName} via ReZenOnance.`,
        albumIds: [albumId],
      });
    } else {
      if (!artistRec.artworkURL && track.artworkURL) artistRec.artworkURL = track.artworkURL;
      if (!artistRec.albumIds.includes(albumId)) artistRec.albumIds.push(albumId);
    }

    // Maintain album index
    const albumRec = albumMap.get(albumId);
    if (!albumRec) {
      albumMap.set(albumId, {
        id: albumId,
        title: albumTitle,
        artistId,
        artist: artistName,
        year: track.year,
        genre: track.genre,
        blurb: `Bit-perfect studio lossless release by ${artistName}.`,
        hue,
        hue2,
        artworkURL: track.artworkURL,
        trackIds: [track.id],
      });
    } else {
      if (!albumRec.artworkURL && track.artworkURL) albumRec.artworkURL = track.artworkURL;
      if (!albumRec.trackIds.includes(track.id)) albumRec.trackIds.push(track.id);
    }
  }
  return registered;
}

export function hydrateStoredTracks(tracks: Track[]): void {
  for (const t of tracks) {
    if (t && t.id && !trackMap.has(t.id)) {
      registerApiTracks([
        {
          id: t.id,
          title: t.title,
          artist: t.artist,
          album: t.album,
          duration: t.duration,
          artworkURL: t.artworkURL,
          format: t.format,
          audioQuality: t.audioQuality,
          provider: t.provider,
        },
      ]);
    }
  }
}

export function setTrackLyrics(trackId: string, lyrics: Track['lyrics']): void {
  const rec = trackMap.get(trackId);
  if (rec) rec.lyrics = lyrics;
}

export function exportRegisteredTracks(ids: string[]): Track[] {
  const unique = new Set(ids);
  const out: Track[] = [];
  for (const id of unique) {
    const rec = trackMap.get(id);
    if (rec) out.push(rec);
  }
  return out;
}

export const defaultPlaylists: Playlist[] = [
  {
    id: 'p-community-hot',
    name: 'Community Cache Pulse',
    description: 'Most replayed 24-bit studio tracks cached live by all listeners across ReZenOnance.',
    trackIds: [],
    hue: 266,
    hue2: 196,
  },
  {
    id: 'p-studio-showcase',
    name: 'Lossless Reference Mix',
    description: 'Curated acoustic and electronic recordings to audition clarity, sub-bass and stereo imaging.',
    trackIds: [],
    hue: 292,
    hue2: 332,
  },
];

export function getAllTracks(): Track[] {
  return Array.from(trackMap.values());
}

export function getAllAlbums(): Album[] {
  return Array.from(albumMap.values());
}

export function getAllArtists(): Artist[] {
  return Array.from(artistMap.values());
}

export function getTrack(id: string | null | undefined): Track | null {
  if (!id) return null;
  return trackMap.get(id) ?? null;
}

export function getAlbum(id: string | null | undefined): Album | null {
  if (!id) return null;
  return albumMap.get(id) ?? null;
}

export function getArtist(id: string | null | undefined): Artist | null {
  if (!id) return null;
  return artistMap.get(id) ?? null;
}

export function getPlaylist(id: string | null | undefined, playlists: Playlist[]): Playlist | null {
  if (!id) return null;
  return playlists.find((p) => p.id === id) ?? null;
}

export function albumsFor(artistId: string): Album[] {
  return getAllAlbums().filter((a) => a.artistId === artistId);
}

export function tracksFor(ids: string[]): Track[] {
  return ids.map((id) => getTrack(id)).filter((t): t is Track => t !== null);
}

export function totalDuration(trackIds: string[]): number {
  return tracksFor(trackIds).reduce((sum, t) => sum + t.duration, 0);
}

export function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function formatLongDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.round((seconds % 3600) / 60);
  return h > 0 ? `${h} hr ${m} min` : `${m} min`;
}

export function coverStyle(hue: number, hue2: number): CSSProperties {
  return { '--h1': `${hue}`, '--h2': `${hue2}` } as CSSProperties;
}

export interface SearchResults {
  tracks: Track[];
  albums: Album[];
  artists: Artist[];
  playlists: Playlist[];
}

export function searchLocalLibrary(query: string, playlists: Playlist[]): SearchResults {
  const q = query.trim().toLowerCase();
  if (!q) return { tracks: [], albums: [], artists: [], playlists: [] };
  const has = (value: string) => value.toLowerCase().includes(q);
  return {
    tracks: getAllTracks().filter(
      (t) => has(t.title) || has(t.artist) || has(t.album) || has(t.genre),
    ),
    albums: getAllAlbums().filter((a) => has(a.title) || has(a.artist) || has(a.genre)),
    artists: getAllArtists().filter((a) => has(a.name)),
    playlists: playlists.filter((p) => has(p.name) || has(p.description)),
  };
}
