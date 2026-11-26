import type { ReactNode } from 'react';
import { albumsFor, coverStyle, formatLongDuration, totalDuration } from '../data';
import { usePlayer } from '../store';
import type { Album, Artist, Playlist } from '../types';
import { shuffled } from '../utils';
import { Cover } from './Cover';
import { Icon } from './Icon';

export function Section({
  title,
  subtitle,
  action,
  children,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="section">
      <div className="section__head">
        <div>
          <h2 className="section__title">{title}</h2>
          {subtitle ? <p className="section__sub">{subtitle}</p> : null}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

export function AlbumCard({ album }: { album: Album }) {
  const { navigate, playContext } = usePlayer();
  return (
    <article className="card">
      <div className="card__art">
        <Cover hue={album.hue} hue2={album.hue2} label={album.title} artworkURL={album.artworkURL} size="fill" />
        <button
          className="card__play"
          onClick={() => playContext(album.trackIds)}
          aria-label={`Play ${album.title}`}
        >
          <Icon name="play" size={18} />
        </button>
      </div>
      <button className="card__title" onClick={() => navigate({ kind: 'album', id: album.id })}>
        {album.title}
      </button>
      <p className="card__meta">
        {album.year} · {album.artist}
      </p>
    </article>
  );
}

export function PlaylistCard({ playlist }: { playlist: Playlist }) {
  const { navigate, playContext } = usePlayer();
  return (
    <article className="card">
      <div className="card__art">
        <Cover hue={playlist.hue} hue2={playlist.hue2} label={playlist.name} size="fill" />
        <button
          className="card__play"
          onClick={() => playContext(playlist.trackIds)}
          aria-label={`Play ${playlist.name}`}
        >
          <Icon name="play" size={18} />
        </button>
      </div>
      <button className="card__title" onClick={() => navigate({ kind: 'playlist', id: playlist.id })}>
        {playlist.name}
      </button>
      <p className="card__meta">
        {playlist.trackIds.length} songs · {formatLongDuration(totalDuration(playlist.trackIds))}
      </p>
    </article>
  );
}

export function ArtistCard({ artist }: { artist: Artist }) {
  const { navigate, playContext } = usePlayer();
  const ids = albumsFor(artist.id).flatMap((album) => album.trackIds);
  return (
    <article className="card">
      <div className="card__art card__art--round">
        <Cover hue={artist.hue} hue2={artist.hue2} artworkURL={artist.artworkURL} size="fill" round />
        <button
          className="card__play"
          onClick={() => playContext(shuffled(ids))}
          aria-label={`Play ${artist.name}`}
        >
          <Icon name="play" size={18} />
        </button>
      </div>
      <button className="card__title" onClick={() => navigate({ kind: 'artist', id: artist.id })}>
        {artist.name}
      </button>
      <p className="card__meta">Artist</p>
    </article>
  );
}

export function CollectionHeader({
  kind,
  title,
  description,
  hue,
  hue2,
  artworkURL,
  coverLabel,
  meta,
  round = false,
  actions,
  onPlay,
  onShuffle,
}: {
  kind: string;
  title: string;
  description?: string;
  hue: number;
  hue2: number;
  artworkURL?: string;
  coverLabel?: string;
  meta: string;
  round?: boolean;
  actions?: ReactNode;
  onPlay: () => void;
  onShuffle?: () => void;
}) {
  return (
    <header className="collection" style={coverStyle(hue, hue2)}>
      <div className="collection__art">
        <Cover hue={hue} hue2={hue2} artworkURL={artworkURL} size="xl" label={coverLabel} round={round} />
      </div>
      <div className="collection__body">
        <span className="eyebrow">{kind}</span>
        <h1 className="collection__title">{title}</h1>
        {description ? <p className="collection__desc">{description}</p> : null}
        <p className="collection__meta">{meta}</p>
        <div className="collection__actions">
          <button className="btn btn--solid" onClick={onPlay}>
            <Icon name="play" size={16} />
            Play
          </button>
          {onShuffle ? (
            <button className="btn btn--ghost" onClick={onShuffle}>
              <Icon name="shuffle" size={16} />
              Shuffle
            </button>
          ) : null}
          {actions}
        </div>
      </div>
    </header>
  );
}
