import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SearchBar.css'; // Import the CSS file

function SearchBar({ isSong }) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setQuery(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Navigate to the /search page with query and isSong parameters
    navigate('/search', { state: { query, isSong } });
  };

  return (
    <div className="searchbox">
      <form onSubmit={handleSubmit} className="searchform">
        <input
          type="text"
          value={query}
          onChange={handleChange}
          placeholder="Search..."
          className="searchinput"
        />
        <button
          type="submit"
          className={`searchbutton ${isSong ? 'song' : 'playlist'}`}
        >
          Search
        </button>
      </form>
    </div>
  );
}

export default SearchBar;
