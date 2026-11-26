import { useEffect, useState } from 'react';
import { searchLocalLibrary } from '../data';
import { usePlayer } from '../store';
import { AlbumCard, ArtistCard, PlaylistCard, Section } from '../components/Cards';
import { Cover } from '../components/Cover';
import { Icon } from '../components/Icon';
import { TrackTable } from '../components/TrackTable';

const browse = [
  { name: 'Daft Punk', hue: 292, hue2: 192 },
  { name: 'The Weeknd', hue: 258, hue2: 332 },
  { name: 'Radiohead', hue: 12, hue2: 318 },
  { name: 'Ambient', hue: 186, hue2: 222 },
  { name: 'Linkin Park', hue: 34, hue2: 92 },
  { name: 'Arijit Singh', hue: 214, hue2: 274 },
];

export function SearchView() {
  const { state, dispatch, navigate, playContext, searchRemote } = usePlayer();
  const [searching, setSearching] = useState(false);
  const query = state.search.trim();

  useEffect(() => {
    if (query.length < 2) {
      setSearching(false);
      return;
    }
    let alive = true;
    setSearching(true);
    const timer = window.setTimeout(() => {
      searchRemote(query)
        .catch(() => {})
        .finally(() => {
          if (alive) setSearching(false);
        });
    }, 340);
    return () => {
      alive = false;
      window.clearTimeout(timer);
    };
  }, [query, state.providerRoute, state.searchNonce, searchRemote]);

  const results = searchLocalLibrary(query, state.playlists);
  const total = results.tracks.length + results.albums.length + results.artists.length + results.playlists.length;
  const top = results.tracks[0] ?? null;
  const topAlbum = !top ? results.albums[0] ?? null : null;

  return (
    <div className="view">
      <header className="view__head">
        <p className="eyebrow">Live Search · {state.providerRoute || 'Master Engine'}</p>
        <h1 className="display display--sm">
          Find your <em>next</em> favourite
        </h1>
        {query ? (
          <p className="view__sub">
            {searching
              ? `Querying lossless clusters for “${query}”… (${total} cached)`
              : `${total} result${total === 1 ? '' : 's'} for “${query}”`}
          </p>
        ) : (
          <p className="view__sub">Type above to race Arcod &amp; Monochrome clusters, or pick a prompt below.</p>
        )}
      </header>

      {!query ? (
        <Section title="Quick discovery" subtitle="Click any tile to trigger a live ReZenOnance cluster search.">
          <div className="genre-grid">
            {browse.map((genre) => (
              <button
                key={genre.name}
                className="genre-tile"
                style={{
                  background: `linear-gradient(135deg, hsl(${genre.hue} 70% 42%), hsl(${genre.hue2} 72% 30%))`,
                }}
                onClick={() => {
                  dispatch({ type: 'SET_SEARCH', value: genre.name });
                  navigate({ kind: 'search' });
                }}
              >
                <span>{genre.name}</span>
                <span className="genre-tile__dot" aria-hidden="true" />
              </button>
            ))}
          </div>
        </Section>
      ) : total === 0 && !searching ? (
        <div className="empty-state">
          <span className="empty-state__icon">
            <Icon name="search" size={22} />
          </span>
          <h2>Nothing matched “{query}”</h2>
          <p>Try switching routes in AutoEQ panel or searching another artist/track.</p>
          <button className="btn btn--ghost" onClick={() => dispatch({ type: 'SET_SEARCH', value: '' })}>
            Clear search
          </button>
        </div>
      ) : (
        <>
          <div className="search-top">
            <div className="top-card">
              <span className="eyebrow">Top result</span>
              {top ? (
                <>
                  <button
                    className="top-card__art"
                    onClick={() => playContext(results.tracks.map((track) => track.id), 0)}
                    aria-label={`Play ${top.title}`}
                  >
                    <Cover
                      hue={top.hue}
                      hue2={top.hue2}
                      artworkURL={top.artworkURL}
                      size="lg"
                      label={top.album}
                    />
                    <span className="top-card__play">
                      <Icon name="play" size={18} />
                    </span>
                  </button>
                  <button
                    className="top-card__title"
                    onClick={() => navigate({ kind: 'album', id: top.albumId })}
                  >
                    {top.title}
                  </button>
                  <p className="top-card__meta">
                    {top.format ?? 'Song'} · <span className="link-quiet">{top.artist}</span>
                  </p>
                </>
              ) : topAlbum ? (
                <>
                  <button
                    className="top-card__art"
                    onClick={() => playContext(topAlbum.trackIds)}
                    aria-label={`Play ${topAlbum.title}`}
                  >
                    <Cover
                      hue={topAlbum.hue}
                      hue2={topAlbum.hue2}
                      artworkURL={topAlbum.artworkURL}
                      size="lg"
                      label={topAlbum.title}
                    />
                    <span className="top-card__play">
                      <Icon name="play" size={18} />
                    </span>
                  </button>
                  <button
                    className="top-card__title"
                    onClick={() => navigate({ kind: 'album', id: topAlbum.id })}
                  >
                    {topAlbum.title}
                  </button>
                  <p className="top-card__meta">
                    Album · <span className="link-quiet">{topAlbum.artist}</span>
                  </p>
                </>
              ) : null}
            </div>

            <div className="search-top__songs">
              <h2 className="section__title">Songs</h2>
              <TrackTable
                trackIds={results.tracks.slice(0, 15).map((track) => track.id)}
                contextIds={results.tracks.map((track) => track.id)}
                showCover
                showAlbum={false}
                showPlays={false}
                emptyMessage={searching ? 'Searching lossless catalog…' : 'No song titles matched.'}
              />
            </div>
          </div>

          {results.albums.length > 0 ? (
            <Section title="Albums">
              <div className="card-grid">
                {results.albums.map((album) => (
                  <AlbumCard key={album.id} album={album} />
                ))}
              </div>
            </Section>
          ) : null}

          {results.artists.length > 0 ? (
            <Section title="Artists">
              <div className="card-grid">
                {results.artists.map((artist) => (
                  <ArtistCard key={artist.id} artist={artist} />
                ))}
              </div>
            </Section>
          ) : null}

          {results.playlists.length > 0 ? (
            <Section title="Playlists">
              <div className="card-grid">
                {results.playlists.map((playlist) => (
                  <PlaylistCard key={playlist.id} playlist={playlist} />
                ))}
              </div>
            </Section>
          ) : null}
        </>
      )}
    </div>
  );
}
