import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import SongsList from '../Components/SongList/SongList.js';
import SearchBar from '../Components/SearchBar/SearchBar.js';
import DownloadPlaylist from '../Components/DownloadAll/DownloadAll.js';
import './SearchPage.css'
import Logo from '../Components/Logo/Logo.js';
function SongPage() {
  const location = useLocation();
  const { isSong, query } = location.state || {};
  const [songs, setSongs] = useState([]);

  useEffect(() => {
    const fetchSongs = async () => {
      const response = await fetch(`http://localhost:5001/api/${isSong ? 'search' : 'queryPlaylist'}?query=${query}`);
      const data = await response.json();
      console.log(data)
      setSongs(data)
    };

    fetchSongs();
  }, [isSong, query]);

  return (
    <div className="app">
      <Logo isSong={isSong} />
      <div className='search-bar'>
        <SearchBar isSong={isSong} />
        <DownloadPlaylist isSong={isSong} songs={isSong ? songs : songs[1]} />
      </div>
      <h1>{isSong ? 'Search result for : ' : ''}"{isSong ? query : songs[0]}"</h1>
      <SongsList songs={isSong ? songs : songs[1]} isSong={isSong} />
    </div>
  );
}

export default SongPage;
