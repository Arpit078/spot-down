import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import SongsList from '../Components/SongList/SongList.js';

function SongPage() {
  const location = useLocation();
  const { isSong, query } = location.state || {};
  const [songs, setSongs] = useState([]);

  useEffect(() => {
    const fetchSongs = async () => {
      const response = await fetch(`http://localhost:5001/api/${isSong ? 'search' : 'queryPlaylist'}?query=${query}`);
      const data = await response.json();
      // console.log(data)
      setSongs(data)
    };

    fetchSongs();
  }, [isSong, query]);

  return (
    <div className="app">
      <h1>{isSong ? 'Songs' : 'Playlists'} for "{query}"</h1>
      <SongsList songs={songs} />
    </div>
  );
}

export default SongPage;
