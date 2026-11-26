import { coverStyle, formatLongDuration, getAllAlbums, getAllTracks, getTrack, totalDuration } from '../data';
import { usePlayer } from '../store';
import { shuffled } from '../utils';
import { AlbumCard, PlaylistCard, Section } from '../components/Cards';
import { Cover } from '../components/Cover';
import { Icon } from '../components/Icon';
import { TrackTable } from '../components/TrackTable';

function greeting(): string {
  const hour = new Date().getHours();
  if (hour < 5) return 'Still up?';
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

export function HomeView() {
  const { state, playContext, navigate, communityLoading } = usePlayer();
  const featured = state.playlists[0];
  const featuredCover = featured ? getTrack(featured.trackIds[0])?.artworkURL : undefined;
  const albums = getAllAlbums();
  const recentIds = Array.from(
    new Set([
      ...state.recentlyPlayedIds,
      ...getAllTracks()
        .slice(0, 12)
        .map((t) => t.id),
    ]),
  ).slice(0, 12);

  return (
    <div className="view">
      <header className="view__head">
        <p className="eyebrow">{greeting()}</p>
        <h1 className="display">
          Press play on
          <br />
          <em>lossless audio</em>
        </h1>
        <p className="view__sub">
          Live community-cached streams, 10-band AutoEQ DSP and instant search across ReZenOnance clusters.
        </p>
      </header>

      {featured ? (
        <section className="hero-card" style={coverStyle(featured.hue, featured.hue2)}>
          <div className="hero-card__art">
            <Cover
              hue={featured.hue}
              hue2={featured.hue2}
              artworkURL={featuredCover}
              label={featured.name}
              size="xl"
            />
            <span className="hero-card__disc" aria-hidden="true" />
          </div>
          <div className="hero-card__body">
            <span className="pill">{communityLoading ? 'Syncing live cache…' : 'Live community cache'}</span>
            <h2 className="hero-card__title">{featured.name}</h2>
            <p className="hero-card__desc">{featured.description}</p>
            <div className="hero-card__meta">
              {featured.trackIds.length} songs · {formatLongDuration(totalDuration(featured.trackIds))}
            </div>
            <div className="hero-card__actions">
              <button
                className="btn btn--solid"
                onClick={() => playContext(featured.trackIds)}
                disabled={featured.trackIds.length === 0}
              >
                <Icon name="play" size={15} />
                Play
              </button>
              <button
                className="btn btn--ghost"
                onClick={() => playContext(shuffled(featured.trackIds))}
                disabled={featured.trackIds.length === 0}
              >
                <Icon name="shuffle" size={15} />
                Shuffle
              </button>
              <button
                className="btn btn--plain"
                onClick={() => navigate({ kind: 'playlist', id: featured.id })}
              >
                Open playlist
                <Icon name="forward" size={14} />
              </button>
            </div>
          </div>
          <div className="hero-card__bars" aria-hidden="true">
            {Array.from({ length: 22 }, (_, index) => (
              <span key={index} style={{ animationDelay: `${index * 0.11}s` }} />
            ))}
          </div>
        </section>
      ) : null}

      <Section
        title="Community &amp; curated"
        subtitle="Streams cached globally by every connected listener — sub-25ms start."
        action={
          <button className="text-btn" onClick={() => navigate({ kind: 'library' })}>
            See all
          </button>
        }
      >
        <div className="card-grid">
          {state.playlists.slice(0, 5).map((playlist) => (
            <PlaylistCard key={playlist.id} playlist={playlist} />
          ))}
        </div>
      </Section>

      {albums.length > 0 ? (
        <Section title="Indexed releases" subtitle="Albums populated from cached streams and your searches.">
          <div className="card-grid">
            {albums.slice(0, 10).map((album) => (
              <AlbumCard key={album.id} album={album} />
            ))}
          </div>
        </Section>
      ) : null}

      <Section
        title="Live stream log"
        subtitle="Recently played locally or fetched straight from the community cache."
      >
        <TrackTable
          trackIds={recentIds}
          showCover
          showAlbum
          showPlays={true}
          emptyMessage={
            communityLoading
              ? 'Loading live community streams…'
              : 'Use Search or open a split cluster stream to populate tracks.'
          }
        />
      </Section>
    </div>
  );
}
