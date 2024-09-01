import React, { useState } from 'react';
import ToggleSlider from '../Components/ToggleSlider/ToggleSlider.js';
import SearchBar from '../Components/SearchBar/SearchBar.js';
import Header from '../Components/Header/Header.js';
function Home() {
    const [isSong, setIsSong] = useState(true);

    const handleToggle = () => {
      setIsSong(!isSong);
    };
  
    return (
      <div className="app-container">
        <Header isSong={isSong} />
        <SearchBar isSong={isSong} />
        <ToggleSlider isSong={isSong} onToggle={handleToggle} />
      </div>
    );
}

export default Home;
