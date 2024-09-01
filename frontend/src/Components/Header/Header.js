import React from 'react';
import './Header.css'; // Import the CSS file

function Header({ isSong }) {
  return (
    <header className="header">
      <h1 className={`title ${isSong ? 'song' : 'playlist'}`}>Spot-Down</h1>
      <p className={`description ${isSong ? 'song' : 'playlist'}`}>
        A place where you can download songs ad free
      </p>
    </header>
  );
}

export default Header;
