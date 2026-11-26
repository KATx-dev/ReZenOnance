import { useState } from 'react';
import { formatLongDuration, getAllAlbums, getAllArtists, totalDuration } from '../data';
import { usePlayer } from '../store';
import { AlbumCard, ArtistCard, PlaylistCard, Section } from '../components/Cards';
import { Cover } from '../components/Cover';
import { Icon } from '../components/Icon';
import { shuffled } from '../utils';

type Filter = 'all' | 'playlists' | 'albums' | 'artists';

const filters: Array<{ id: Filter; label: string }> = [
  { id: 'all', label: 'All' },
  { id: 'playlists', label: 'Playlists' },
  { id: 'albums', label: 'Albums' },
  { id: 'artists', label: 'Artists' },
];

export function LibraryView() {
  const { state, playContext, navigate, likedTracks } = usePlayer();
  const [filter, setFilter] = useState<Filter>('all');
  const likedIds = likedTracks.map((track) => track.id);
  const albums = getAllAlbums();
  const artists = getAllArtists();

  return (
    <div className="view">
      <header className="view__head">
        <p className="eyebrow">Your library</p>
        <h1 className="display display--sm">
          Everything you’ve <em>kept</em>
        </h1>
        <p className="view__sub">Playlists, community albums and cached artists saved in this browser.</p>
      </header>

      <div className="chips" role="tablist" aria-label="Library filter">
        {filters.map((option) => (
          <button
            key={option.id}
            role="tab"
            aria-selected={filter === option.id}
            className={`chip ${filter === option.id ? 'is-active' : ''}`.trim()}
            onClick={() => setFilter(option.id)}
          >
            {option.label}
          </button>
        ))}
      </div>

      {filter === 'all' ? (
        <section className="liked-banner">
          <span className="liked-banner__art">
            <Icon name="heartFilled" size={26} />
          </span>
          <div className="liked-banner__body">
            <span className="eyebrow">Playlist</span>
            <h2>Liked songs</h2>
            <p>
              {likedIds.length} songs · {formatLongDuration(totalDuration(likedIds))}
            </p>
          </div>
          <div className="liked-banner__actions">
            <button className="btn btn--solid" onClick={() => playContext(likedIds)} disabled={likedIds.length === 0}>
              <Icon name="play" size={15} />
              Play
            </button>
            <button className="btn btn--ghost" onClick={() => navigate({ kind: 'liked' })}>
              Open
            </button>
          </div>
        </section>
      ) : null}

      {filter === 'all' || filter === 'playlists' ? (
        <Section
          title="Playlists"
          subtitle={`${state.playlists.length} playlists, including the ones you create.`}
        >
          <div className="card-grid">
            {state.playlists.map((playlist) => (
              <PlaylistCard key={playlist.id} playlist={playlist} />
            ))}
          </div>
        </Section>
      ) : null}

      {filter === 'all' || filter === 'albums' ? (
        <Section title="Albums" subtitle="Every indexed album in this session.">
          <div className="card-grid">
            {albums.map((album) => (
              <AlbumCard key={album.id} album={album} />
            ))}
          </div>
        </Section>
      ) : null}

      {filter === 'all' || filter === 'artists' ? (
        <Section title="Artists" subtitle="Artists discovered from cached &amp; searched streams.">
          <div className="card-grid">
            {artists.map((artist) => (
              <ArtistCard key={artist.id} artist={artist} />
            ))}
          </div>
        </Section>
      ) : null}

      {filter === 'playlists' ? (
        <section className="library-note">
          <div>
            <Cover hue={266} hue2={318} size="md" label="New" />
          </div>
          <div>
            <h3>Make your own</h3>
            <p>Use the + next to Playlists, or any track menu, to start a playlist.</p>
          </div>
          <button
            className="btn btn--ghost btn--sm"
            onClick={() => playContext(shuffled(likedIds))}
            disabled={likedIds.length === 0}
          >
            <Icon name="shuffle" size={14} />
            Shuffle likes
          </button>
        </section>
      ) : null}
    </div>
  );
}
