import React from 'react';
import SongCard from '../SongCard/SongCard.js';
import './SongList.css'; // Import the CSS file for styling

function SongList({ songs, isSong}) {
  if (!Array.isArray(songs)) {
    return <p>Loading...</p>;
  }

  return (
    <div className="songs-list">
      {songs.map((song) => (
        <SongCard
          key={song.id}
          trackName={song.trackName}
          artistName={song.artistName}
          imageUrl={song.imageUrl}
          songId={song.id}
          isSong={isSong}
        />
      ))}
    </div>
  );
}

export default SongList;
