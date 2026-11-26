import {
  albumsFor,
  formatLongDuration,
  getAlbum,
  getArtist,
  getPlaylist,
  getTrack,
  totalDuration,
} from '../data';
import { usePlayer } from '../store';
import { shuffled } from '../utils';
import { AlbumCard, CollectionHeader, Section } from '../components/Cards';
import { Icon } from '../components/Icon';
import { TrackTable } from '../components/TrackTable';

export function NotFound({ label }: { label: string }) {
  const { navigate } = usePlayer();
  return (
    <div className="empty-state">
      <span className="empty-state__icon">
        <Icon name="search" size={22} />
      </span>
      <h2>{label} not found</h2>
      <p>It may have been deleted, or the link is out of date.</p>
      <button className="btn btn--ghost" onClick={() => navigate({ kind: 'home' })}>
        Back home
      </button>
    </div>
  );
}

export function PlaylistView({ id }: { id: string }) {
  const { state, dispatch, playContext, navigate } = usePlayer();
  const playlist = getPlaylist(id, state.playlists);
  if (!playlist) return <NotFound label="Playlist" />;

  const ids = playlist.trackIds;

  return (
    <div className="view">
      <CollectionHeader
        kind={playlist.created ? 'Your playlist' : 'Playlist'}
        title={playlist.name}
        description={playlist.description}
        hue={playlist.hue}
        hue2={playlist.hue2}
        artworkURL={getTrack(ids[0])?.artworkURL}
        coverLabel={playlist.name}
        meta={`${ids.length} songs · ${formatLongDuration(totalDuration(ids))}`}
        onPlay={() => playContext(ids)}
        onShuffle={() => playContext(shuffled(ids))}
        actions={
          playlist.created ? (
            <button
              className="btn btn--ghost btn--danger"
              onClick={() => dispatch({ type: 'DELETE_PLAYLIST', playlistId: playlist.id })}
            >
              <Icon name="trash" size={15} />
              Delete
            </button>
          ) : null
        }
      />

      {ids.length === 0 ? (
        <div className="empty-state">
          <span className="empty-state__icon">
            <Icon name="plus" size={22} />
          </span>
          <h2>This playlist is empty</h2>
          <p>Add tracks from any row’s ••• menu, or start from the catalogue.</p>
          <button className="btn btn--ghost" onClick={() => navigate({ kind: 'search' })}>
            <Icon name="search" size={15} />
            Browse music
          </button>
        </div>
      ) : (
        <TrackTable
          trackIds={ids}
          contextIds={ids}
          showCover
          showAlbum
          showPlays={false}
          onRemove={(trackId) =>
            dispatch({ type: 'REMOVE_FROM_PLAYLIST', playlistId: playlist.id, trackId })
          }
          removeLabel="Remove from playlist"
        />
      )}
    </div>
  );
}

export function AlbumView({ id }: { id: string }) {
  const { playContext } = usePlayer();
  const album = getAlbum(id);
  if (!album) return <NotFound label="Album" />;

  const ids = album.trackIds;
  const others = albumsFor(album.artistId).filter((item) => item.id !== album.id);

  return (
    <div className="view">
      <CollectionHeader
        kind="Album"
        title={album.title}
        description={album.blurb}
        hue={album.hue}
        hue2={album.hue2}
        artworkURL={album.artworkURL}
        coverLabel={album.title}
        meta={`${album.artist} · ${album.year} · ${album.genre} · ${ids.length} songs · ${formatLongDuration(
          totalDuration(ids),
        )}`}
        onPlay={() => playContext(ids)}
        onShuffle={() => playContext(shuffled(ids))}
      />

      <TrackTable trackIds={ids} contextIds={ids} showCover showAlbum={false} showPlays={false} />

      {others.length > 0 ? (
        <Section title={`More by ${album.artist}`}>
          <div className="card-grid">
            {others.map((item) => (
              <AlbumCard key={item.id} album={item} />
            ))}
          </div>
        </Section>
      ) : null}
    </div>
  );
}

export function ArtistView({ id }: { id: string }) {
  const { playContext } = usePlayer();
  const artist = getArtist(id);
  if (!artist) return <NotFound label="Artist" />;

  const releaseIds = albumsFor(artist.id);
  const allIds = releaseIds.flatMap((album) => album.trackIds);
  const popular = allIds.slice(0, 5);

  return (
    <div className="view">
      <CollectionHeader
        kind="Artist"
        title={artist.name}
        description={artist.bio}
        hue={artist.hue}
        hue2={artist.hue2}
        artworkURL={artist.artworkURL}
        round
        meta={`${releaseIds.length} release${releaseIds.length === 1 ? '' : 's'} · ${allIds.length} tracks`}
        onPlay={() => playContext(allIds)}
        onShuffle={() => playContext(shuffled(allIds))}
      />

      <Section title="Popular" subtitle={`Most played from ${artist.name}.`}>
        <TrackTable
          trackIds={popular}
          contextIds={allIds}
          showCover
          showAlbum
          showPlays={false}
        />
      </Section>

      <Section title="Discography">
        <div className="card-grid">
          {releaseIds.map((album) => (
            <AlbumCard key={album.id} album={album} />
          ))}
        </div>
      </Section>
    </div>
  );
}
