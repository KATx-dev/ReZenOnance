import type { CSSProperties } from 'react';
import { formatTime } from '../data';
import { usePlayer } from '../store';
import { Cover } from './Cover';
import { Icon } from './Icon';

export function PlayerBar() {
  const { state, dispatch, currentTrack, navigate, toggleLike, isLiked, seek } = usePlayer();
  const track = currentTrack;
  const duration = state.duration > 0 ? state.duration : (track?.duration ?? 1);
  const progress = Math.min(100, (state.elapsed / duration) * 100);
  const volume = state.muted ? 0 : Math.round(state.volume * 100);
  const liked = track ? isLiked(track.id) : false;

  return (
    <footer className="player">
      <div className="player__track">
        {track ? (
          <>
            <button
              className="player__cover"
              onClick={() => navigate({ kind: 'album', id: track.albumId })}
              aria-label={`Open album ${track.album}`}
            >
              <Cover hue={track.hue} hue2={track.hue2} artworkURL={track.artworkURL} size="sm" />
            </button>
            <div className="player__meta">
              <button className="player__title" onClick={() => navigate({ kind: 'album', id: track.albumId })}>
                {track.title}
              </button>
              <button className="player__artist link-quiet" onClick={() => navigate({ kind: 'artist', id: track.artistId })}>
                {state.buffering ? 'Buffering stream…' : track.artist}
              </button>
            </div>
            <button
              className={`icon-btn ${liked ? 'is-liked' : ''}`.trim()}
              onClick={() => toggleLike(track.id)}
              aria-label={liked ? 'Remove from liked songs' : 'Add to liked songs'}
              aria-pressed={liked}
            >
              <Icon name={liked ? 'heartFilled' : 'heart'} size={17} />
            </button>
          </>
        ) : (
          <>
            <div className="player__cover player__cover--empty">
              <Icon name="note" size={18} />
            </div>
            <div className="player__meta">
              <span className="player__title">Nothing playing</span>
              <span className="player__artist">Pick a track to start</span>
            </div>
          </>
        )}
      </div>

      <div className="player__center">
        <div className="player__controls">
          <button
            className={`icon-btn ${state.shuffle ? 'is-active' : ''}`.trim()}
            onClick={() => dispatch({ type: 'TOGGLE_SHUFFLE' })}
            aria-label="Shuffle"
            aria-pressed={state.shuffle}
          >
            <Icon name="shuffle" size={17} />
          </button>
          <button className="icon-btn" onClick={() => dispatch({ type: 'PREV' })} aria-label="Previous track">
            <Icon name="prev" size={18} />
          </button>
          <button
            className="play-btn"
            onClick={() => dispatch({ type: 'TOGGLE_PLAY' })}
            aria-label={state.isPlaying ? 'Pause' : 'Play'}
          >
            <Icon name={state.isPlaying ? 'pause' : 'play'} size={20} />
          </button>
          <button className="icon-btn" onClick={() => dispatch({ type: 'NEXT' })} aria-label="Next track">
            <Icon name="next" size={18} />
          </button>
          <button
            className={`icon-btn ${state.repeat !== 'off' ? 'is-active' : ''}`.trim()}
            onClick={() => dispatch({ type: 'CYCLE_REPEAT' })}
            aria-label={`Repeat: ${state.repeat}`}
            title={`Repeat: ${state.repeat}`}
          >
            <Icon name={state.repeat === 'one' ? 'repeatOne' : 'repeat'} size={17} />
          </button>
        </div>

        <div className="player__timeline">
          <span className="player__time">{formatTime(state.elapsed)}</span>
          <input
            className="slider"
            type="range"
            min={0}
            max={track ? duration : 0}
            step={1}
            value={Math.min(state.elapsed, track ? duration : 0)}
            onChange={(event) => seek(Number(event.target.value))}
            style={{ '--progress': `${progress}%` } as CSSProperties}
            aria-label="Seek"
            disabled={!track}
          />
          <span className="player__time">{formatTime(track ? duration : 0)}</span>
        </div>
      </div>

      <div className="player__right">
        <button
          className={`icon-btn ${state.panel === 'eq' ? 'is-active' : ''}`.trim()}
          onClick={() => dispatch({ type: 'SET_PANEL', panel: state.panel === 'eq' ? 'none' : 'eq' })}
          aria-label="AutoEQ"
          title="AutoEQ & Engine (E)"
        >
          <Icon name="sliders" size={17} />
        </button>
        <button
          className={`icon-btn ${state.panel === 'lyrics' ? 'is-active' : ''}`.trim()}
          onClick={() => dispatch({ type: 'SET_PANEL', panel: state.panel === 'lyrics' ? 'none' : 'lyrics' })}
          aria-label="Lyrics"
          title="Lyrics (L)"
        >
          <Icon name="lyrics" size={17} />
        </button>
        <button
          className={`icon-btn ${state.panel === 'queue' ? 'is-active' : ''}`.trim()}
          onClick={() => dispatch({ type: 'SET_PANEL', panel: state.panel === 'queue' ? 'none' : 'queue' })}
          aria-label="Queue"
          title="Queue (Q)"
        >
          <Icon name="queue" size={18} />
        </button>
        <div className="volume">
          <button
            className="icon-btn"
            onClick={() => dispatch({ type: 'TOGGLE_MUTE' })}
            aria-label={state.muted ? 'Unmute' : 'Mute'}
          >
            <Icon name={state.muted || state.volume === 0 ? 'volumeMute' : 'volume'} size={17} />
          </button>
          <input
            className="slider slider--volume"
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={state.muted ? 0 : state.volume}
            onChange={(event) => dispatch({ type: 'SET_VOLUME', value: Number(event.target.value) })}
            style={{ '--progress': `${volume}%` } as CSSProperties}
            aria-label="Volume"
          />
        </div>
      </div>
    </footer>
  );
}
