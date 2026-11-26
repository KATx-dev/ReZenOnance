import { usePlayer } from '../store';
import { Cover } from './Cover';
import { Icon } from './Icon';

interface SidebarProps {
  onCreatePlaylist: () => void;
}

export function Sidebar({ onCreatePlaylist }: SidebarProps) {
  const { state, dispatch, navigate, likedTracks } = usePlayer();
  const view = state.view;

  return (
    <aside className="sidebar">
      <div className="brand">
        <span className="brand__mark" aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
        </span>
        <span className="brand__text">
          <span className="brand__name">ReZenOnance</span>
          <span className="brand__sub">lossless player</span>
        </span>
      </div>

      <nav className="nav" aria-label="Main">
        <button
          className={`nav__item ${view.kind === 'home' ? 'is-active' : ''}`.trim()}
          onClick={() => navigate({ kind: 'home' })}
        >
          <Icon name="home" size={18} />
          Home
        </button>
        <button
          className={`nav__item ${view.kind === 'search' ? 'is-active' : ''}`.trim()}
          onClick={() => navigate({ kind: 'search' })}
        >
          <Icon name="search" size={18} />
          Search
        </button>
        <button
          className={`nav__item ${view.kind === 'library' ? 'is-active' : ''}`.trim()}
          onClick={() => navigate({ kind: 'library' })}
        >
          <Icon name="library" size={18} />
          Your library
        </button>
        <a href="/" className="nav__item">
          <Icon name="portal" size={18} />
          Addon Portal
        </a>
      </nav>

      <div className="sidebar__section">
        <div className="sidebar__heading">
          <span>Playlists</span>
          <button className="icon-btn icon-btn--tiny" onClick={onCreatePlaylist} aria-label="Create playlist">
            <Icon name="plus" size={15} />
          </button>
        </div>

        <button
          className={`side-item side-item--liked ${view.kind === 'liked' ? 'is-active' : ''}`.trim()}
          onClick={() => navigate({ kind: 'liked' })}
        >
          <span className="side-liked" aria-hidden="true">
            <Icon name="heartFilled" size={15} />
          </span>
          <span className="side-item__text">
            <span>Liked songs</span>
            <small>{likedTracks.length} songs</small>
          </span>
        </button>

        <div className="sidebar__scroll">
          {state.playlists.map((playlist) => {
            const active = view.kind === 'playlist' && view.id === playlist.id;
            return (
              <button
                key={playlist.id}
                className={`side-item ${active ? 'is-active' : ''}`.trim()}
                onClick={() => navigate({ kind: 'playlist', id: playlist.id })}
              >
                <Cover hue={playlist.hue} hue2={playlist.hue2} size="sm" />
                <span className="side-item__text">
                  <span>{playlist.name}</span>
                  <small>{playlist.created ? 'Your playlist' : 'Playlist'} · {playlist.trackIds.length}</small>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="sidebar__footer">
        <span className="avatar">R</span>
        <span className="sidebar__user">
          <span>ReZen Engine</span>
          <small>
            {state.providerRoute === '/p/arcod'
              ? 'Arcod split'
              : state.providerRoute === '/p/monochrome'
                ? 'Monochrome split'
                : 'Master lossless'}
          </small>
        </span>
        <button
          className={`icon-btn icon-btn--tiny ${state.panel === 'visuals' ? 'is-active' : ''}`.trim()}
          aria-label="Background settings"
          onClick={() => dispatch({ type: 'SET_PANEL', panel: state.panel === 'visuals' ? 'none' : 'visuals' })}
        >
          <Icon name="palette" size={16} />
        </button>
      </div>
    </aside>
  );
}
