// Logo.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

import './Logo.css'; // Import the CSS file for styling

function Logo({ isSong }) {
  const navigate = useNavigate();
  const handleClick = (e) => {
    e.preventDefault();
    navigate('/', { state: { isSong } });
  };
  return (
    <div className={`logo ${isSong ? 'song' : 'playlist'}`}>
      <h1 onClick={handleClick}>Spot-Down</h1>
    </div>
  );
}

export default Logo;
