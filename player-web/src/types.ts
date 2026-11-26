/** Shared domain types for the ReZenOnance Waveform player. */
export type View =
  | { kind: 'home' }
  | { kind: 'search' }
  | { kind: 'library' }
  | { kind: 'liked' }
  | { kind: 'playlist'; id: string }
  | { kind: 'album'; id: string }
  | { kind: 'artist'; id: string };

export interface LyricLine {
  /** Start time in seconds. */
  t: number;
  text: string;
}

export interface Track {
  id: string;
  title: string;
  artistId: string;
  artist: string;
  albumId: string;
  album: string;
  /** Duration in seconds. */
  duration: number;
  year: number;
  genre: string;
  plays: string;
  /** Cover art hues — also serves as ambient stage gradient. */
  hue: number;
  hue2: number;
  artworkURL?: string;
  format?: string;
  audioQuality?: string;
  provider?: string;
  lyrics: LyricLine[];
}

export interface Album {
  id: string;
  title: string;
  artistId: string;
  artist: string;
  year: number;
  genre: string;
  blurb: string;
  hue: number;
  hue2: number;
  artworkURL?: string;
  trackIds: string[];
}

export interface Artist {
  id: string;
  name: string;
  hue: number;
  hue2: number;
  artworkURL?: string;
  bio: string;
  albumIds: string[];
}

export interface Playlist {
  id: string;
  name: string;
  description: string;
  trackIds: string[];
  hue: number;
  hue2: number;
  /** True for playlists created in the UI. */
  created?: boolean;
}

export type RepeatMode = 'off' | 'all' | 'one';

export type ThemeId = 'aurora' | 'sunset' | 'noir' | 'mono';

export type PanelTab = 'queue' | 'lyrics' | 'eq' | 'visuals';

export type ProviderRoute = '' | '/p/arcod' | '/p/monochrome';

export type QualityTier = 'LOSSLESS' | 'HIGH' | 'LOW';
