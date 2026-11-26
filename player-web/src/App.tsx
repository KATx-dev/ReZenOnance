import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { getTrack } from './data';
import { usePlayer } from './store';
import { CreatePlaylistModal } from './components/CreatePlaylistModal';
import { PlayerBar } from './components/PlayerBar';
import { RightPanel } from './components/RightPanel';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { AlbumView, ArtistView, NotFound, PlaylistView } from './views/Collections';
import { HomeView } from './views/HomeView';
import { LibraryView } from './views/LibraryView';
import { LikedView } from './views/LikedView';
import { SearchView } from './views/SearchView';

function Stage() {
  const { state, currentTrack } = usePlayer();
  const style = {
    '--stage-h1': `${currentTrack?.hue ?? 276}`,
    '--stage-h2': `${currentTrack?.hue2 ?? 196}`,
  } as CSSProperties;

  return (
    <div className="stage" data-theme={state.theme} style={style} aria-hidden="true">
      <span className="stage__blob stage__blob--a" />
      <span className="stage__blob stage__blob--b" />
      <span className="stage__grid" />
      <span className="stage__grain" />
    </div>
  );
}

function CurrentView() {
  const { state } = usePlayer();
  const view = state.view;

  switch (view.kind) {
    case 'home':
      return <HomeView />;
    case 'search':
      return <SearchView />;
    case 'library':
      return <LibraryView />;
    case 'liked':
      return <LikedView />;
    case 'playlist':
      return <PlaylistView id={view.id} />;
    case 'album':
      return <AlbumView id={view.id} />;
    case 'artist':
      return <ArtistView id={view.id} />;
    default:
      return <NotFound label="Page" />;
  }
}

export default function App() {
  const { state, dispatch, togglePlay, seek } = usePlayer();
  const [modalOpen, setModalOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef(state);
  stateRef.current = state;

  // Keyboard shortcuts. Space is handled natively when a button is focused.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.closest('input, textarea, select, [contenteditable="true"]')) return;
      const current = stateRef.current;
      const track = getTrack(current.queue[current.index] ?? null);
      const duration = current.duration > 0 ? current.duration : (track?.duration ?? 1);

      if (event.key === ' ' && !target?.closest('button, a')) {
        event.preventDefault();
        togglePlay();
        return;
      }

      switch (event.key) {
        case 'ArrowRight':
          if (!track) return;
          event.preventDefault();
          if (event.shiftKey) dispatch({ type: 'NEXT' });
          else seek(Math.min(duration, current.elapsed + 5));
          break;
        case 'ArrowLeft':
          if (!track) return;
          event.preventDefault();
          if (event.shiftKey) dispatch({ type: 'PREV' });
          else seek(Math.max(0, current.elapsed - 5));
          break;
        case 'e':
        case 'E':
          dispatch({ type: 'SET_PANEL', panel: current.panel === 'eq' ? 'none' : 'eq' });
          break;
        case 'l':
        case 'L':
          dispatch({ type: 'SET_PANEL', panel: current.panel === 'lyrics' ? 'none' : 'lyrics' });
          break;
        case 'q':
        case 'Q':
          dispatch({ type: 'SET_PANEL', panel: current.panel === 'queue' ? 'none' : 'queue' });
          break;
        case 'b':
        case 'B':
          dispatch({ type: 'SET_PANEL', panel: current.panel === 'visuals' ? 'none' : 'visuals' });
          break;
        case 'm':
        case 'M':
          dispatch({ type: 'TOGGLE_MUTE' });
          break;
        case 'Escape':
          if (current.panel !== 'none') dispatch({ type: 'SET_PANEL', panel: 'none' });
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [dispatch, togglePlay, seek]);

  // Auto-dismiss toasts.
  useEffect(() => {
    if (!state.toast) return;
    const timer = window.setTimeout(() => dispatch({ type: 'DISMISS_TOAST' }), 2400);
    return () => window.clearTimeout(timer);
  }, [state.toast, dispatch]);

  // Reset scroll when the route changes.
  useEffect(() => {
    contentRef.current?.scrollTo({ top: 0 });
  }, [state.view]);

  return (
    <div className={`app ${state.panel !== 'none' ? 'has-panel' : ''}`.trim()} data-theme={state.theme}>
      <Stage />
      <Sidebar onCreatePlaylist={() => setModalOpen(true)} />
      <main className="main">
        <TopBar />
        <div className="content" ref={contentRef}>
          <CurrentView />
        </div>
      </main>
      {state.panel !== 'none' ? <RightPanel /> : null}
      <PlayerBar />
      <CreatePlaylistModal open={modalOpen} onClose={() => setModalOpen(false)} />
      {state.toast ? (
        <div className="toast" key={state.toast.id} role="status">
          {state.toast.text}
        </div>
      ) : null}
    </div>
  );
}
