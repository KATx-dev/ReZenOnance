import { useEffect, useRef, useState, type ReactNode } from 'react';
import { formatTime, getTrack } from '../data';
import { usePlayer } from '../store';
import type { Track } from '../types';
import { Cover, Equalizer } from './Cover';
import { Icon, type IconName } from './Icon';

interface TrackTableProps {
  trackIds: string[];
  /** The list used as playback context — defaults to trackIds. */
  contextIds?: string[];
  showCover?: boolean;
  showAlbum?: boolean;
  showPlays?: boolean;
  onRemove?: (trackId: string) => void;
  removeLabel?: string;
  emptyMessage?: string;
}

export function TrackTable({
  trackIds,
  contextIds,
  showCover = false,
  showAlbum = true,
  showPlays = true,
  onRemove,
  removeLabel = 'Remove',
  emptyMessage = 'No tracks here yet.',
}: TrackTableProps) {
  const { state, playContext, currentTrack } = usePlayer();
  const context = contextIds ?? trackIds;

  if (trackIds.length === 0) {
    return <p className="empty-note">{emptyMessage}</p>;
  }

  return (
    <div className="track-table" role="table">
      <div className="track-head" role="row">
        <span className="track-head__index" role="columnheader">
          #
        </span>
        {showCover ? <span className="track-head__cover" aria-hidden="true" /> : null}
        <span className="track-head__title" role="columnheader">
          Title
        </span>
        {showAlbum ? <span className="track-head__album" role="columnheader">Album</span> : null}
        {showPlays ? <span className="track-head__plays" role="columnheader">Plays</span> : null}
        <span className="track-head__duration" role="columnheader">
          <Icon name="note" size={14} />
        </span>
        <span className="track-head__actions" aria-hidden="true" />
      </div>

      {trackIds.map((id, index) => (
        <TrackRow
          key={`${id}-${index}`}
          id={id}
          index={index}
          isCurrent={currentTrack?.id === id}
          playing={state.isPlaying}
          context={context}
          showCover={showCover}
          showAlbum={showAlbum}
          showPlays={showPlays}
          onPlay={() => {
            const start = context.indexOf(id);
            playContext(context, start >= 0 ? start : 0);
          }}
          onRemove={onRemove ? () => onRemove(id) : undefined}
          removeLabel={removeLabel}
        />
      ))}
    </div>
  );
}

interface TrackRowProps {
  id: string;
  index: number;
  isCurrent: boolean;
  playing: boolean;
  context: string[];
  showCover: boolean;
  showAlbum: boolean;
  showPlays: boolean;
  onPlay: () => void;
  onRemove?: () => void;
  removeLabel: string;
}

function TrackRow({
  id,
  index,
  isCurrent,
  playing,
  context,
  showCover,
  showAlbum,
  showPlays,
  onPlay,
  onRemove,
  removeLabel,
}: TrackRowProps) {
  const { navigate, isLiked, toggleLike } = usePlayer();
  const track = getTrack(id);
  if (!track) return null;

  const liked = isLiked(id);
  const className = ['track-row', showCover ? 'track-row--cover' : '', isCurrent ? 'is-current' : '']
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={className}
      role="row"
      onDoubleClick={onPlay}
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === 'Enter') {
          event.preventDefault();
          onPlay();
        }
      }}
    >
      <button className="track-row__index" onClick={onPlay} aria-label={`Play ${track.title}`}>
        {isCurrent ? <Equalizer playing={playing} /> : <span className="track-row__num">{index + 1}</span>}
        <Icon name="play" size={13} className="track-row__hint" />
      </button>

      {showCover ? (
        <button className="track-row__cover" onClick={onPlay} aria-label={`Play ${track.title}`}>
          <Cover hue={track.hue} hue2={track.hue2} artworkURL={track.artworkURL} size="xs" />
        </button>
      ) : null}

      <div className="track-row__main">
        <span className="track-row__title">{track.title}</span>
        <button
          className="track-row__artist link-quiet"
          onClick={() => navigate({ kind: 'artist', id: track.artistId })}
        >
          {track.artist}
        </button>
      </div>

      {showAlbum ? (
        <button
          className="track-row__album link-quiet"
          onClick={() => navigate({ kind: 'album', id: track.albumId })}
        >
          {track.album}
        </button>
      ) : null}

      {showPlays ? <span className="track-row__plays">{track.plays}</span> : null}

      <span className="track-row__duration">{formatTime(track.duration)}</span>

      <div className="track-row__actions">
        <button
          className={`icon-btn icon-btn--tiny ${liked ? 'is-liked' : ''}`.trim()}
          onClick={() => toggleLike(id)}
          aria-label={liked ? 'Remove from liked songs' : 'Add to liked songs'}
          aria-pressed={liked}
        >
          <Icon name={liked ? 'heartFilled' : 'heart'} size={15} />
        </button>
        <TrackMenu track={track} context={context} onRemove={onRemove} removeLabel={removeLabel} />
      </div>
    </div>
  );
}

interface TrackMenuProps {
  track: Track;
  context: string[];
  onRemove?: () => void;
  removeLabel: string;
}

export function TrackMenu({ track, context, onRemove, removeLabel }: TrackMenuProps) {
  const { state, dispatch, navigate } = usePlayer();
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    const onScroll = () => setOpen(false);
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    window.addEventListener('scroll', onScroll, true);
    window.addEventListener('resize', onScroll);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('scroll', onScroll, true);
      window.removeEventListener('resize', onScroll);
    };
  }, [open]);

  const toggle = () => {
    if (open) {
      setOpen(false);
      return;
    }
    const rect = buttonRef.current?.getBoundingClientRect();
    if (!rect) return;
    const width = 252;
    const height = 300 + Math.min(state.playlists.length, 5) * 32;
    const openUp = rect.bottom + height > window.innerHeight - 12;
    setPosition({
      top: openUp ? Math.max(12, rect.top - height - 8) : rect.bottom + 8,
      left: Math.min(Math.max(12, rect.right - width), window.innerWidth - width - 12),
    });
    setOpen(true);
  };

  const item = (icon: IconName, label: string, action: () => void, extra?: ReactNode) => (
    <button
      className="menu__item"
      role="menuitem"
      onClick={() => {
        action();
        setOpen(false);
      }}
    >
      <Icon name={icon} size={16} />
      <span className="menu__truncate">{label}</span>
      {extra}
    </button>
  );

  return (
    <>
      <button
        ref={buttonRef}
        className="icon-btn icon-btn--tiny"
        onClick={toggle}
        aria-label={`More options for ${track.title}`}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <Icon name="more" size={16} />
      </button>

      {open && position ? (
        <div className="menu" role="menu" ref={menuRef} style={{ top: position.top, left: position.left }}>
          <div className="menu__label">{track.title}</div>
          {item('play', 'Play now', () =>
            dispatch({
              type: 'PLAY_CONTEXT',
              ids: context,
              startIndex: Math.max(0, context.indexOf(track.id)),
            }),
          )}
          {item('next', 'Play next', () => dispatch({ type: 'PLAY_NEXT', trackId: track.id }))}
          {item('queue', 'Add to queue', () => dispatch({ type: 'ADD_TO_QUEUE', trackId: track.id }))}
          {item('heart', 'Like / unlike', () => dispatch({ type: 'TOGGLE_LIKE', id: track.id }))}
          {onRemove ? item('trash', removeLabel, onRemove) : null}
          <div className="menu__divider" />
          <div className="menu__label">Add to playlist</div>
          <div className="menu__scroll">
            {state.playlists.map((playlist) => (
              <button
                key={playlist.id}
                className="menu__item"
                role="menuitem"
                onClick={() => {
                  dispatch({ type: 'ADD_TO_PLAYLIST', playlistId: playlist.id, trackId: track.id });
                  setOpen(false);
                }}
              >
                <Cover hue={playlist.hue} hue2={playlist.hue2} size="xs" />
                <span className="menu__truncate">{playlist.name}</span>
                {playlist.trackIds.includes(track.id) ? (
                  <Icon name="check" size={14} className="menu__check" />
                ) : null}
              </button>
            ))}
            <button
              className="menu__item"
              role="menuitem"
              onClick={() => {
                dispatch({
                  type: 'CREATE_PLAYLIST',
                  name: `${track.title} mix`,
                  description: 'Started from a track menu.',
                  trackId: track.id,
                });
                setOpen(false);
              }}
            >
              <span className="menu__plus">
                <Icon name="plus" size={14} />
              </span>
              <span>New playlist</span>
            </button>
          </div>
          <div className="menu__divider" />
          {item('note', 'Go to album', () => navigate({ kind: 'album', id: track.albumId }))}
          {item('sparkles', 'Go to artist', () => navigate({ kind: 'artist', id: track.artistId }))}
        </div>
      ) : null}
    </>
  );
}
