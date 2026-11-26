import { formatLongDuration, totalDuration } from '../data';
import { usePlayer } from '../store';
import { shuffled } from '../utils';
import { CollectionHeader } from '../components/Cards';
import { Icon } from '../components/Icon';
import { TrackTable } from '../components/TrackTable';

export function LikedView() {
  const { likedTracks, playContext, navigate, dispatch } = usePlayer();
  const ids = likedTracks.map((track) => track.id);

  return (
    <div className="view">
      <CollectionHeader
        kind="Playlist"
        title="Liked songs"
        description="Every track you’ve hearted, newest first. Likes persist in this browser."
        hue={332}
        hue2={266}
        coverLabel="Liked"
        meta={`${ids.length} songs · ${formatLongDuration(totalDuration(ids))}`}
        onPlay={() => playContext(ids)}
        onShuffle={() => playContext(shuffled(ids))}
      />

      {ids.length === 0 ? (
        <div className="empty-state">
          <span className="empty-state__icon">
            <Icon name="heart" size={22} />
          </span>
          <h2>No liked songs yet</h2>
          <p>Tap a heart anywhere in the player and it lands here.</p>
          <button className="btn btn--ghost" onClick={() => navigate({ kind: 'search' })}>
            Find something to like
          </button>
        </div>
      ) : (
        <TrackTable
          trackIds={ids}
          contextIds={ids}
          showCover
          showAlbum
          showPlays={false}
          onRemove={(id) => dispatch({ type: 'TOGGLE_LIKE', id })}
          removeLabel="Unlike"
        />
      )}
    </div>
  );
}
