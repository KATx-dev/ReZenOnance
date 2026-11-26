import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  type Dispatch,
  type ReactNode,
} from 'react';
import {
  defaultPlaylists,
  exportRegisteredTracks,
  getAllTracks,
  getTrack,
  hydrateStoredTracks,
  registerApiTracks,
  setTrackLyrics,
  type ApiPublicTrack,
} from './data';
import type {
  LyricLine,
  PanelTab,
  Playlist,
  ProviderRoute,
  QualityTier,
  RepeatMode,
  ThemeId,
  Track,
  View,
} from './types';

export const EQ_FREQUENCIES = [32, 64, 125, 250, 500, 1000, 2000, 4000, 8000, 16000] as const;

export const AUTOEQ_PRESETS: Record<string, { label: string; gains: number[] }> = {
  flat: { label: 'Flat Reference', gains: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
  harman: { label: 'Harman 2019', gains: [4.5, 4.0, 2.5, 1.0, 0.0, 0.5, 2.0, 3.0, 2.0, 1.0] },
  warmth: { label: 'Studio Warmth', gains: [3.0, 4.0, 3.5, 2.5, 1.0, -0.5, 0.0, 1.5, -1.0, -2.5] },
  air: { label: 'Hi-Res Air', gains: [0.0, 0.5, 0.5, 0.0, 0.5, 1.0, 2.0, 3.5, 5.0, 5.5] },
  bass: { label: 'Bass Boost', gains: [6.5, 5.5, 4.0, 2.0, 0.5, 0.0, 0.0, 0.5, 1.0, 1.0] },
  vocal: { label: 'Vocal Presence', gains: [-1.0, -1.0, 0.0, 1.0, 2.5, 3.5, 3.0, 2.0, 1.0, 0.5] },
};

interface Toast {
  id: number;
  text: string;
}

export interface PlayerState {
  view: View;
  history: View[];
  future: View[];
  search: string;
  searchNonce: number;
  likedIds: string[];
  playlists: Playlist[];
  queue: string[];
  index: number;
  isPlaying: boolean;
  buffering: boolean;
  shuffle: boolean;
  repeat: RepeatMode;
  volume: number;
  muted: boolean;
  elapsed: number;
  duration: number;
  panel: PanelTab | 'none';
  theme: ThemeId;
  providerRoute: ProviderRoute;
  quality: QualityTier;
  eqPreset: string;
  eqGains: number[];
  catalogVersion: number;
  recentlyPlayedIds: string[];
  toast: Toast | null;
}

type Action =
  | { type: 'NAVIGATE'; view: View }
  | { type: 'BACK' }
  | { type: 'FORWARD' }
  | { type: 'SET_SEARCH'; value: string }
  | { type: 'BUMP_CATALOG'; queueIfEmpty?: string[] }
  | { type: 'PLAY_CONTEXT'; ids: string[]; startIndex?: number }
  | { type: 'TOGGLE_PLAY' }
  | { type: 'SET_PLAYING'; value: boolean }
  | { type: 'SET_BUFFERING'; value: boolean }
  | { type: 'NEXT' }
  | { type: 'PREV' }
  | { type: 'SET_ELAPSED'; seconds: number }
  | { type: 'SET_DURATION'; seconds: number }
  | { type: 'SEEK'; seconds: number }
  | { type: 'SET_VOLUME'; value: number }
  | { type: 'TOGGLE_MUTE' }
  | { type: 'TOGGLE_SHUFFLE' }
  | { type: 'CYCLE_REPEAT' }
  | { type: 'TOGGLE_LIKE'; id: string }
  | { type: 'CREATE_PLAYLIST'; name: string; description: string; trackId?: string }
  | { type: 'ADD_TO_PLAYLIST'; playlistId: string; trackId: string }
  | { type: 'REMOVE_FROM_PLAYLIST'; playlistId: string; trackId: string }
  | { type: 'DELETE_PLAYLIST'; playlistId: string }
  | { type: 'SYNC_SYSTEM_PLAYLIST'; playlistId: string; trackIds: string[] }
  | { type: 'ADD_TO_QUEUE'; trackId: string }
  | { type: 'PLAY_NEXT'; trackId: string }
  | { type: 'REMOVE_FROM_QUEUE'; index: number }
  | { type: 'MOVE_IN_QUEUE'; from: number; to: number }
  | { type: 'CLEAR_QUEUE' }
  | { type: 'JUMP_QUEUE'; index: number }
  | { type: 'SET_PANEL'; panel: PanelTab | 'none' }
  | { type: 'SET_THEME'; theme: ThemeId }
  | { type: 'SET_PROVIDER_ROUTE'; route: ProviderRoute }
  | { type: 'SET_QUALITY'; quality: QualityTier }
  | { type: 'SET_EQ_PRESET'; preset: string }
  | { type: 'SET_EQ_BAND'; band: number; gain: number }
  | { type: 'TOAST'; text: string }
  | { type: 'DISMISS_TOAST' };

const STORAGE_KEY = 'rezenonance-player:v1';
const SHARED_THEME_KEY = 'rezenonance:theme';

const playlistHues: Array<[number, number]> = [
  [266, 318],
  [188, 232],
  [24, 350],
  [140, 190],
  [320, 20],
];

function initialState(): PlayerState {
  const sharedTheme = (() => {
    try {
      const t = localStorage.getItem(SHARED_THEME_KEY);
      if (t === 'aurora' || t === 'sunset' || t === 'noir' || t === 'mono') return t;
    } catch {}
    return undefined;
  })();

  const base: PlayerState = {
    view: { kind: 'home' },
    history: [],
    future: [],
    search: '',
    searchNonce: 0,
    likedIds: [],
    playlists: defaultPlaylists,
    queue: [],
    index: -1,
    isPlaying: false,
    buffering: false,
    shuffle: false,
    repeat: 'all',
    volume: 0.78,
    muted: false,
    elapsed: 0,
    duration: 0,
    panel: typeof window !== 'undefined' && window.innerWidth > 1180 ? 'queue' : 'none',
    theme: sharedTheme ?? 'aurora',
    providerRoute: '',
    quality: 'LOSSLESS',
    eqPreset: 'flat',
    eqGains: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    catalogVersion: 0,
    recentlyPlayedIds: [],
    toast: null,
  };

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return base;
    const saved = JSON.parse(raw) as Partial<
      Pick<
        PlayerState,
        | 'likedIds'
        | 'playlists'
        | 'theme'
        | 'volume'
        | 'repeat'
        | 'shuffle'
        | 'providerRoute'
        | 'quality'
        | 'eqPreset'
        | 'eqGains'
        | 'recentlyPlayedIds'
      > & { storedTracks?: Track[] }
    >;

    if (Array.isArray(saved.storedTracks)) {
      hydrateStoredTracks(saved.storedTracks);
    }

    const userPlaylists = Array.isArray(saved.playlists)
      ? saved.playlists.filter((p) => p && typeof p.id === 'string')
      : [];
    const mergedPlaylists = [
      ...defaultPlaylists.map((dp) => {
        const prev = userPlaylists.find((u) => u.id === dp.id);
        return prev ? { ...dp, trackIds: prev.trackIds ?? [] } : dp;
      }),
      ...userPlaylists.filter((u) => u.created),
    ];

    return {
      ...base,
      likedIds: Array.isArray(saved.likedIds) ? saved.likedIds : base.likedIds,
      playlists: mergedPlaylists,
      theme: sharedTheme ?? saved.theme ?? base.theme,
      volume: typeof saved.volume === 'number' ? saved.volume : base.volume,
      repeat: saved.repeat ?? base.repeat,
      shuffle: Boolean(saved.shuffle),
      providerRoute:
        saved.providerRoute === '/p/arcod' || saved.providerRoute === '/p/monochrome'
          ? saved.providerRoute
          : '',
      quality:
        saved.quality === 'HIGH' || saved.quality === 'LOW' || saved.quality === 'LOSSLESS'
          ? saved.quality
          : 'LOSSLESS',
      eqPreset: typeof saved.eqPreset === 'string' ? saved.eqPreset : 'flat',
      eqGains:
        Array.isArray(saved.eqGains) && saved.eqGains.length === 10
          ? saved.eqGains
          : base.eqGains,
      recentlyPlayedIds: Array.isArray(saved.recentlyPlayedIds)
        ? saved.recentlyPlayedIds
        : base.recentlyPlayedIds,
    };
  } catch {
    return base;
  }
}

function currentId(state: PlayerState): string | null {
  return state.queue[state.index] ?? null;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function randomIndex(length: number, avoid: number): number {
  if (length <= 1) return 0;
  let next = avoid;
  while (next === avoid) next = Math.floor(Math.random() * length);
  return next;
}

function step(state: PlayerState, direction: 1 | -1, wrap: boolean): PlayerState {
  const { queue, index } = state;
  if (queue.length === 0) return state;

  if (direction === 1 && state.shuffle) {
    return { ...state, index: randomIndex(queue.length, index) };
  }

  let next = index + direction;
  if (next >= queue.length) {
    if (!wrap) return { ...state, isPlaying: false, elapsed: 0 };
    next = 0;
  }
  if (next < 0) {
    if (!wrap) return state;
    next = queue.length - 1;
  }
  return { ...state, index: next };
}

function addRecent(recent: string[], trackId: string): string[] {
  return [trackId, ...recent.filter((id) => id !== trackId)].slice(0, 24);
}

function reducer(state: PlayerState, action: Action): PlayerState {
  switch (action.type) {
    case 'NAVIGATE': {
      if (JSON.stringify(action.view) === JSON.stringify(state.view)) return state;
      return { ...state, view: action.view, history: [...state.history, state.view], future: [] };
    }
    case 'BACK': {
      if (state.history.length === 0) return state;
      const previous = state.history[state.history.length - 1]!;
      return {
        ...state,
        view: previous,
        history: state.history.slice(0, -1),
        future: [state.view, ...state.future],
      };
    }
    case 'FORWARD': {
      if (state.future.length === 0) return state;
      const [next, ...rest] = state.future;
      return { ...state, view: next!, history: [...state.history, state.view], future: rest };
    }
    case 'SET_SEARCH':
      return { ...state, search: action.value };
    case 'BUMP_CATALOG': {
      const nextQueue =
        state.queue.length === 0 && action.queueIfEmpty && action.queueIfEmpty.length > 0
          ? action.queueIfEmpty
          : state.queue;
      return { ...state, catalogVersion: state.catalogVersion + 1, queue: nextQueue };
    }
    case 'PLAY_CONTEXT': {
      const ids = action.ids.filter((id) => getTrack(id) !== null);
      if (ids.length === 0) return state;
      const startIndex = clamp(action.startIndex ?? 0, 0, ids.length - 1);
      const trackId = ids[startIndex]!;
      return {
        ...state,
        queue: ids,
        index: startIndex,
        elapsed: 0,
        duration: getTrack(trackId)?.duration ?? 0,
        isPlaying: true,
        buffering: true,
        recentlyPlayedIds: addRecent(state.recentlyPlayedIds, trackId),
      };
    }
    case 'TOGGLE_PLAY': {
      if (state.index === -1 || !currentId(state)) {
        const pool = state.queue.length > 0 ? state.queue : getAllTracks().map((t) => t.id);
        if (pool.length === 0) {
          return { ...state, toast: { id: Date.now(), text: 'Search for any song above to start streaming' } };
        }
        const firstId = pool[0]!;
        return {
          ...state,
          queue: pool,
          index: 0,
          isPlaying: true,
          buffering: true,
          elapsed: 0,
          duration: getTrack(firstId)?.duration ?? 0,
          recentlyPlayedIds: addRecent(state.recentlyPlayedIds, firstId),
        };
      }
      return { ...state, isPlaying: !state.isPlaying };
    }
    case 'SET_PLAYING':
      return { ...state, isPlaying: action.value };
    case 'SET_BUFFERING':
      return { ...state, buffering: action.value };
    case 'NEXT': {
      const stepped = step(state, 1, true);
      const nextId = currentId(stepped);
      return {
        ...stepped,
        elapsed: 0,
        duration: nextId ? getTrack(nextId)?.duration ?? 0 : 0,
        isPlaying: stepped.queue.length > 0,
        buffering: stepped.queue.length > 0,
        recentlyPlayedIds: nextId ? addRecent(state.recentlyPlayedIds, nextId) : state.recentlyPlayedIds,
      };
    }
    case 'PREV': {
      if (state.elapsed > 4) return { ...state, elapsed: 0 };
      const stepped = step(state, -1, true);
      const prevId = currentId(stepped);
      return {
        ...stepped,
        elapsed: 0,
        duration: prevId ? getTrack(prevId)?.duration ?? 0 : 0,
        buffering: stepped.queue.length > 0,
        recentlyPlayedIds: prevId ? addRecent(state.recentlyPlayedIds, prevId) : state.recentlyPlayedIds,
      };
    }
    case 'SET_ELAPSED':
      return { ...state, elapsed: action.seconds };
    case 'SET_DURATION':
      return { ...state, duration: action.seconds };
    case 'SEEK':
      return { ...state, elapsed: Math.max(0, action.seconds) };
    case 'SET_VOLUME':
      return { ...state, volume: clamp(action.value, 0, 1), muted: false };
    case 'TOGGLE_MUTE':
      return { ...state, muted: !state.muted };
    case 'TOGGLE_SHUFFLE':
      return { ...state, shuffle: !state.shuffle };
    case 'CYCLE_REPEAT': {
      const order: RepeatMode[] = ['off', 'all', 'one'];
      return { ...state, repeat: order[(order.indexOf(state.repeat) + 1) % order.length]! };
    }
    case 'TOGGLE_LIKE': {
      const liked = state.likedIds.includes(action.id);
      return {
        ...state,
        likedIds: liked ? state.likedIds.filter((id) => id !== action.id) : [action.id, ...state.likedIds],
      };
    }
    case 'CREATE_PLAYLIST': {
      const id = `p-user-${Date.now()}`;
      const [hue, hue2] = playlistHues[state.playlists.length % playlistHues.length]!;
      const playlist: Playlist = {
        id,
        name: action.name.trim() || 'New playlist',
        description: action.description.trim() || `Made by you · ${new Date().toLocaleDateString()}`,
        trackIds: action.trackId ? [action.trackId] : [],
        hue,
        hue2,
        created: true,
      };
      return {
        ...state,
        playlists: [playlist, ...state.playlists],
        view: { kind: 'playlist', id },
        history: [...state.history, state.view],
        future: [],
        toast: { id: Date.now(), text: `Playlist “${playlist.name}” created` },
      };
    }
    case 'ADD_TO_PLAYLIST': {
      const playlist = state.playlists.find((p) => p.id === action.playlistId);
      if (!playlist) return state;
      if (playlist.trackIds.includes(action.trackId)) {
        return { ...state, toast: { id: Date.now(), text: `Already in “${playlist.name}”` } };
      }
      return {
        ...state,
        playlists: state.playlists.map((p) =>
          p.id === action.playlistId ? { ...p, trackIds: [...p.trackIds, action.trackId] } : p,
        ),
        toast: { id: Date.now(), text: `Added to “${playlist.name}”` },
      };
    }
    case 'REMOVE_FROM_PLAYLIST': {
      return {
        ...state,
        playlists: state.playlists.map((p) =>
          p.id === action.playlistId
            ? { ...p, trackIds: p.trackIds.filter((id) => id !== action.trackId) }
            : p,
        ),
      };
    }
    case 'DELETE_PLAYLIST': {
      const playlists = state.playlists.filter((p) => p.id !== action.playlistId);
      const onThisPlaylist = state.view.kind === 'playlist' && state.view.id === action.playlistId;
      return {
        ...state,
        playlists,
        view: onThisPlaylist ? { kind: 'library' } : state.view,
        toast: { id: Date.now(), text: 'Playlist deleted' },
      };
    }
    case 'SYNC_SYSTEM_PLAYLIST': {
      return {
        ...state,
        playlists: state.playlists.map((p) =>
          p.id === action.playlistId ? { ...p, trackIds: action.trackIds } : p,
        ),
      };
    }
    case 'ADD_TO_QUEUE': {
      if (!getTrack(action.trackId)) return state;
      return {
        ...state,
        queue: [...state.queue, action.trackId],
        toast: { id: Date.now(), text: 'Added to queue' },
      };
    }
    case 'PLAY_NEXT': {
      if (!getTrack(action.trackId)) return state;
      const queue = [...state.queue];
      queue.splice(state.index + 1, 0, action.trackId);
      return { ...state, queue, toast: { id: Date.now(), text: 'Playing next' } };
    }
    case 'REMOVE_FROM_QUEUE': {
      if (action.index === state.index) return state;
      const queue = state.queue.filter((_, i) => i !== action.index);
      const index = action.index < state.index ? state.index - 1 : state.index;
      return { ...state, queue, index };
    }
    case 'MOVE_IN_QUEUE': {
      const { from, to } = action;
      if (from === to || from < 0 || to < 0 || from >= state.queue.length || to >= state.queue.length) {
        return state;
      }
      const queue = [...state.queue];
      const [moved] = queue.splice(from, 1);
      queue.splice(to, 0, moved!);
      return {
        ...state,
        queue,
        index: from === state.index ? to : state.index,
      };
    }
    case 'CLEAR_QUEUE': {
      const playing = currentId(state);
      const queue = playing ? [playing] : [];
      return { ...state, queue, index: playing ? 0 : -1 };
    }
    case 'JUMP_QUEUE': {
      const idx = clamp(action.index, 0, state.queue.length - 1);
      const jumpedId = state.queue[idx];
      return {
        ...state,
        index: idx,
        elapsed: 0,
        duration: jumpedId ? getTrack(jumpedId)?.duration ?? 0 : 0,
        isPlaying: true,
        buffering: true,
        recentlyPlayedIds: jumpedId ? addRecent(state.recentlyPlayedIds, jumpedId) : state.recentlyPlayedIds,
      };
    }
    case 'SET_PANEL':
      return { ...state, panel: action.panel };
    case 'SET_THEME':
      return { ...state, theme: action.theme };
    case 'SET_PROVIDER_ROUTE':
      return { ...state, providerRoute: action.route };
    case 'SET_QUALITY':
      return { ...state, quality: action.quality };
    case 'SET_EQ_PRESET': {
      const profile = AUTOEQ_PRESETS[action.preset] ?? AUTOEQ_PRESETS.flat!;
      return { ...state, eqPreset: action.preset, eqGains: [...profile.gains] };
    }
    case 'SET_EQ_BAND': {
      const next = [...state.eqGains];
      next[action.band] = clamp(action.gain, -12, 12);
      return { ...state, eqPreset: 'custom', eqGains: next };
    }
    case 'TOAST':
      return { ...state, toast: { id: Date.now(), text: action.text } };
    case 'DISMISS_TOAST':
      return { ...state, toast: null };
    default:
      return state;
  }
}

function parseLrc(lrc: string): LyricLine[] {
  const lines: LyricLine[] = [];
  for (const rawLine of lrc.split('\n')) {
    const match = /^\[(\d{1,2}):(\d{2})(?:\.(\d{1,3}))?\]\s*(.*)$/.exec(rawLine.trim());
    if (!match) continue;
    const min = Number(match[1]);
    const sec = Number(match[2]);
    const frac = match[3] ? Number(`0.${match[3]}`) : 0;
    const text = match[4]?.trim();
    if (text) {
      lines.push({ t: min * 60 + sec + frac, text });
    }
  }
  return lines.sort((a, b) => a.t - b.t);
}

export interface PlayerApi {
  state: PlayerState;
  dispatch: Dispatch<Action>;
  currentTrack: Track | null;
  currentPlaylist: Playlist | null;
  communityLoading: boolean;
  isLiked: (id: string) => boolean;
  likedTracks: Track[];
  navigate: (view: View) => void;
  back: () => void;
  forward: () => void;
  playContext: (ids: string[], startIndex?: number) => void;
  togglePlay: () => void;
  next: () => void;
  prev: () => void;
  seek: (seconds: number) => void;
  toggleLike: (id: string) => void;
  toast: (text: string) => void;
  searchRemote: (query: string) => Promise<Track[]>;
}

const PlayerContext = createContext<PlayerApi | null>(null);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, initialState);
  const [communityLoading, setCommunityLoading] = useState(true);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const eqFiltersRef = useRef<BiquadFilterNode[]>([]);
  const activeTrackKeyRef = useRef<string>('');
  const stateRef = useRef(state);
  stateRef.current = state;

  const ensureAudioEngine = useCallback(() => {
    if (!audioRef.current && typeof Audio !== 'undefined') {
      const el = new Audio();
      el.crossOrigin = 'anonymous';
      el.preload = 'auto';
      audioRef.current = el;
    }
    return audioRef.current;
  }, []);

  const initWebAudioEq = useCallback(() => {
    const el = ensureAudioEngine();
    if (!el || audioCtxRef.current) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const source = ctx.createMediaElementSource(el);
      let prev: AudioNode = source;
      const filters = EQ_FREQUENCIES.map((freq, idx) => {
        const filter = ctx.createBiquadFilter();
        filter.type = idx === 0 ? 'lowshelf' : idx === EQ_FREQUENCIES.length - 1 ? 'highshelf' : 'peaking';
        if (filter.type === 'peaking') filter.Q.value = 1.4;
        filter.frequency.value = freq;
        filter.gain.value = stateRef.current.eqGains[idx] ?? 0;
        prev.connect(filter);
        prev = filter;
        return filter;
      });
      prev.connect(ctx.destination);
      audioCtxRef.current = ctx;
      eqFiltersRef.current = filters;
    } catch {
      // Fallback safely to native audio if Web Audio restricted
    }
  }, [ensureAudioEngine]);

  // Apply EQ gains live to BiquadFilter chain
  useEffect(() => {
    const ctx = audioCtxRef.current;
    eqFiltersRef.current.forEach((filter, idx) => {
      const gain = state.eqGains[idx] ?? 0;
      if (ctx) filter.gain.setTargetAtTime(gain, ctx.currentTime, 0.04);
      else filter.gain.value = gain;
    });
  }, [state.eqGains]);

  // Bind HTML5 Audio events once
  useEffect(() => {
    const el = ensureAudioEngine();
    if (!el) return;

    const onTimeUpdate = () => {
      dispatch({ type: 'SET_ELAPSED', seconds: el.currentTime || 0 });
    };
    const onDurationChange = () => {
      if (Number.isFinite(el.duration) && el.duration > 0) {
        dispatch({ type: 'SET_DURATION', seconds: el.duration });
      }
    };
    const onPlaying = () => {
      dispatch({ type: 'SET_BUFFERING', value: false });
      dispatch({ type: 'SET_PLAYING', value: true });
    };
    const onPause = () => {
      if (!el.ended) dispatch({ type: 'SET_PLAYING', value: false });
    };
    const onEnded = () => {
      const cur = stateRef.current;
      if (cur.repeat === 'one') {
        el.currentTime = 0;
        el.play().catch(() => {});
        return;
      }
      const atEnd = cur.index >= cur.queue.length - 1;
      if (atEnd && cur.repeat === 'off' && !cur.shuffle) {
        dispatch({ type: 'SET_PLAYING', value: false });
        return;
      }
      dispatch({ type: 'NEXT' });
    };

    el.addEventListener('timeupdate', onTimeUpdate);
    el.addEventListener('durationchange', onDurationChange);
    el.addEventListener('playing', onPlaying);
    el.addEventListener('pause', onPause);
    el.addEventListener('ended', onEnded);

    return () => {
      el.removeEventListener('timeupdate', onTimeUpdate);
      el.removeEventListener('durationchange', onDurationChange);
      el.removeEventListener('playing', onPlaying);
      el.removeEventListener('pause', onPause);
      el.removeEventListener('ended', onEnded);
    };
  }, [ensureAudioEngine]);

  // Sync volume & mute to audio element
  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    el.volume = state.volume;
    el.muted = state.muted;
  }, [state.volume, state.muted]);

  const currentTrack = useMemo(
    () => getTrack(currentId(state)),
    [state.queue, state.index, state.catalogVersion],
  );

  // Sync play/pause & resolve real audio stream whenever track changes
  useEffect(() => {
    const el = ensureAudioEngine();
    if (!el) return;

    if (!currentTrack) {
      el.pause();
      activeTrackKeyRef.current = '';
      return;
    }

    const trackKey = `${currentTrack.id}|${state.providerRoute}|${state.quality}`;
    const isSameTrack = activeTrackKeyRef.current === trackKey;

    if (isSameTrack) {
      if (state.isPlaying && el.paused) {
        initWebAudioEq();
        if (audioCtxRef.current?.state === 'suspended') {
          audioCtxRef.current.resume().catch(() => {});
        }
        el.play().catch(() => {});
      } else if (!state.isPlaying && !el.paused) {
        el.pause();
      }
      return;
    }

    if (!state.isPlaying) return;

    activeTrackKeyRef.current = trackKey;
    let cancelled = false;
    initWebAudioEq();
    if (audioCtxRef.current?.state === 'suspended') {
      audioCtxRef.current.resume().catch(() => {});
    }

    const prefix = state.providerRoute;
    const qs = new URLSearchParams({
      quality: state.quality,
      title: currentTrack.title,
      artist: currentTrack.artist,
      album: currentTrack.album,
      duration: String(Math.round(currentTrack.duration || 0)),
    });
    if (currentTrack.artworkURL) qs.set('artwork', currentTrack.artworkURL);

    const directEndpoint = `${prefix}/stream/${encodeURIComponent(currentTrack.id)}?${qs.toString()}`;
    const proxyEndpoint = `${prefix}/stream/${encodeURIComponent(currentTrack.id)}/audio?${qs.toString()}`;

    const tryPlayUrl = (url: string, fallbackUrl: string | null) => {
      if (cancelled) return;
      el.src = url;
      el.load();
      el.play().catch(() => {
        if (cancelled) return;
        if (fallbackUrl) {
          tryPlayUrl(fallbackUrl, null);
        } else {
          dispatch({ type: 'SET_BUFFERING', value: false });
          dispatch({ type: 'SET_PLAYING', value: false });
          dispatch({ type: 'TOAST', text: `Stream unavailable for “${currentTrack.title}”. Switching next or try another provider.` });
        }
      });
    };

    fetch(directEndpoint)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<{ url?: string }>;
      })
      .then((data) => {
        if (!data?.url) throw new Error('Missing stream URL');
        tryPlayUrl(data.url, proxyEndpoint);
      })
      .catch(() => {
        tryPlayUrl(proxyEndpoint, null);
      });

    // Best-effort LRC lyrics lookup when none cached on track
    if (currentTrack.lyrics.length === 0) {
      const lrcQs = new URLSearchParams({
        track_name: currentTrack.title,
        artist_name: currentTrack.artist,
      });
      fetch(`https://lrclib.net/api/get?${lrcQs.toString()}`)
        .then((r) => (r.ok ? r.json() : null))
        .then((data: { syncedLyrics?: string; plainLyrics?: string } | null) => {
          if (cancelled || !data) return;
          if (data.syncedLyrics) {
            const parsed = parseLrc(data.syncedLyrics);
            if (parsed.length > 0) {
              setTrackLyrics(currentTrack.id, parsed);
              dispatch({ type: 'BUMP_CATALOG' });
            }
          } else if (data.plainLyrics) {
            const plain = data.plainLyrics
              .split('\n')
              .map((line) => line.trim())
              .filter(Boolean)
              .map((text, idx) => ({ t: idx * 5, text }));
            if (plain.length > 0) {
              setTrackLyrics(currentTrack.id, plain);
              dispatch({ type: 'BUMP_CATALOG' });
            }
          }
        })
        .catch(() => {});
    }

    return () => {
      cancelled = true;
    };
  }, [currentTrack?.id, state.isPlaying, state.providerRoute, state.quality, ensureAudioEngine, initWebAudioEq]);

  const searchRemote = useCallback(
    async (query: string): Promise<Track[]> => {
      const trimmed = query.trim();
      if (!trimmed) return [];
      const prefix = stateRef.current.providerRoute;
      const quality = stateRef.current.quality;
      const url = `${prefix}/search?q=${encodeURIComponent(trimmed)}&quality=${encodeURIComponent(quality)}`;
      const res = await fetch(url);
      if (!res.ok) return [];
      const data = (await res.json()) as { tracks?: ApiPublicTrack[] };
      const registered = registerApiTracks(data.tracks ?? []);
      dispatch({ type: 'BUMP_CATALOG' });
      return registered;
    },
    [],
  );

  // Hydrate player on boot from /api/community + starter lossless searches + URL query params
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        // 1. Fetch community cached tracks so HomeView reflects live global plays immediately
        const commRes = await fetch('/api/community').then((r) => (r.ok ? r.json() : null)).catch(() => null);
        if (alive && commRes) {
          const pool: ApiPublicTrack[] = [];
          if (Array.isArray(commRes.topCachedTracks)) pool.push(...commRes.topCachedTracks);
          if (Array.isArray(commRes.recentPlays)) pool.push(...commRes.recentPlays);
          const reg = registerApiTracks(pool);
          const communityIds = Array.from(new Set(reg.map((t) => t.id)));
          if (communityIds.length > 0) {
            dispatch({ type: 'SYNC_SYSTEM_PLAYLIST', playlistId: 'p-community-hot', trackIds: communityIds });
            dispatch({ type: 'BUMP_CATALOG', queueIfEmpty: communityIds });
          }
        }

        // 2. Fetch curated live showcase tracks in parallel so Home always feels rich and ready to play
        const showcaseQueries = ['Daft Punk', 'Inertia AJR'];
        const showcaseResponses = await Promise.all(
          showcaseQueries.map((q) =>
            fetch(`/search?q=${encodeURIComponent(q)}&quality=LOSSLESS`)
              .then((r) => (r.ok ? r.json() : null))
              .catch(() => null),
          ),
        );
        if (alive) {
          const showcaseTracks: Track[] = [];
          for (const resp of showcaseResponses) {
            if (resp && Array.isArray(resp.tracks)) {
              showcaseTracks.push(...registerApiTracks(resp.tracks.slice(0, 6)));
            }
          }
          const showcaseIds = Array.from(new Set(showcaseTracks.map((t) => t.id)));
          if (showcaseIds.length > 0) {
            dispatch({ type: 'SYNC_SYSTEM_PLAYLIST', playlistId: 'p-studio-showcase', trackIds: showcaseIds });
            dispatch({ type: 'BUMP_CATALOG', queueIfEmpty: showcaseIds });
          }
        }

        // 3. Handle deep link URL params (?id=...&title=...&artist=... or ?q=...)
        if (alive && typeof window !== 'undefined') {
          const params = new URLSearchParams(window.location.search);
          const deepId = params.get('id');
          const deepQuery = params.get('q');
          if (deepId) {
            const deepTrack: ApiPublicTrack = {
              id: deepId,
              title: params.get('title') || 'Lossless Track',
              artist: params.get('artist') || 'Studio Artist',
              album: params.get('album') || undefined,
              artworkURL: params.get('artwork') || undefined,
              duration: params.get('duration') ? Number(params.get('duration')) : undefined,
            };
            const [reg] = registerApiTracks([deepTrack]);
            if (reg) {
              dispatch({ type: 'PLAY_CONTEXT', ids: [reg.id], startIndex: 0 });
            }
          } else if (deepQuery) {
            dispatch({ type: 'SET_SEARCH', value: deepQuery });
            dispatch({ type: 'NAVIGATE', view: { kind: 'search' } });
          }
        }
      } finally {
        if (alive) setCommunityLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  // Persist user preferences, playlists, likes, and known tracks to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(SHARED_THEME_KEY, state.theme);
      const persistIds = [
        ...state.likedIds,
        ...state.recentlyPlayedIds,
        ...state.playlists.flatMap((p) => p.trackIds),
      ];
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          likedIds: state.likedIds,
          playlists: state.playlists,
          theme: state.theme,
          volume: state.volume,
          repeat: state.repeat,
          shuffle: state.shuffle,
          providerRoute: state.providerRoute,
          quality: state.quality,
          eqPreset: state.eqPreset,
          eqGains: state.eqGains,
          recentlyPlayedIds: state.recentlyPlayedIds,
          storedTracks: exportRegisteredTracks(persistIds).slice(0, 200),
        }),
      );
    } catch {
      // Ignore storage quota errors
    }
  }, [
    state.likedIds,
    state.playlists,
    state.theme,
    state.volume,
    state.repeat,
    state.shuffle,
    state.providerRoute,
    state.quality,
    state.eqPreset,
    state.eqGains,
    state.recentlyPlayedIds,
  ]);

  const currentPlaylist = useMemo(
    () => state.playlists.find((p) => state.view.kind === 'playlist' && p.id === state.view.id) ?? null,
    [state.playlists, state.view],
  );

  const isLiked = useCallback((id: string) => state.likedIds.includes(id), [state.likedIds]);
  const likedTracks = useMemo(
    () => state.likedIds.map((id) => getTrack(id)).filter((t): t is Track => t !== null),
    [state.likedIds, state.catalogVersion],
  );

  const navigate = useCallback((view: View) => dispatch({ type: 'NAVIGATE', view }), []);
  const back = useCallback(() => dispatch({ type: 'BACK' }), []);
  const forward = useCallback(() => dispatch({ type: 'FORWARD' }), []);
  const playContext = useCallback(
    (ids: string[], startIndex?: number) => dispatch({ type: 'PLAY_CONTEXT', ids, startIndex }),
    [],
  );
  const togglePlay = useCallback(() => dispatch({ type: 'TOGGLE_PLAY' }), []);
  const next = useCallback(() => dispatch({ type: 'NEXT' }), []);
  const prev = useCallback(() => dispatch({ type: 'PREV' }), []);
  const seek = useCallback((seconds: number) => {
    const el = audioRef.current;
    if (el && Number.isFinite(seconds)) {
      el.currentTime = Math.max(0, seconds);
    }
    dispatch({ type: 'SEEK', seconds });
  }, []);
  const toggleLike = useCallback((id: string) => dispatch({ type: 'TOGGLE_LIKE', id }), []);
  const toast = useCallback((text: string) => dispatch({ type: 'TOAST', text }), []);

  const api = useMemo<PlayerApi>(
    () => ({
      state,
      dispatch,
      currentTrack,
      currentPlaylist,
      communityLoading,
      isLiked,
      likedTracks,
      navigate,
      back,
      forward,
      playContext,
      togglePlay,
      next,
      prev,
      seek,
      toggleLike,
      toast,
      searchRemote,
    }),
    [
      state,
      currentTrack,
      currentPlaylist,
      communityLoading,
      isLiked,
      likedTracks,
      navigate,
      back,
      forward,
      playContext,
      togglePlay,
      next,
      prev,
      seek,
      toggleLike,
      toast,
      searchRemote,
    ],
  );

  return <PlayerContext.Provider value={api}>{children}</PlayerContext.Provider>;
}

export function usePlayer(): PlayerApi {
  const context = useContext(PlayerContext);
  if (!context) throw new Error('usePlayer must be used inside <PlayerProvider>');
  return context;
}
