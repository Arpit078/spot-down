import React from 'react';
import './ToggleSlider.css'; // Import the CSS file

function ToggleSlider({ isSong, onToggle }) {
  return (
    <div className="slider-container">
      <div className="slider" onClick={onToggle}>
        <div className={`slider-knob ${isSong ? 'song' : 'playlist'}`}></div>
        <div className="slider-text">
          <span className={`text ${isSong ? 'active' : ''}`}>Search Song</span>
          <span className={`text ${!isSong ? 'active' : ''}`}>Search Playlist</span>
        </div>
      </div>
    </div>
  );
}

export default ToggleSlider;
