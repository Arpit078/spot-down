import React, { useState, useEffect } from 'react';
import './SongCard.css';

function SongCard({ trackName, artistName, imageUrl, songId, isSong }) {
  const [buttonText, setButtonText] = useState('Check Status');
  const [loading, setLoading] = useState(false);
  const [statusChecked, setStatusChecked] = useState(false);
  const [pollStatus, setPollStatus] = useState(null);
  const [downloading, setIsDownloading] = useState(false);
  const hostname = window.location.hostname

  const checkStatus = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://${hostname}/api/poll?songId=${songId}`);
      const data = await response.json();
      console.log(data.success);
      setPollStatus(data.success);
      setStatusChecked(true);
      if (data.success == 0) {
        setButtonText('Request');
      } else if(data.success == 1){
        setButtonText('Download');
      }
      else{
        setButtonText('Loading...');
      }
    } catch (error) {
      console.error('Error fetching song status:', error);
    } finally {
      setLoading(false);
    }
  };

  const startDownload = async () => {
    setIsDownloading(true);
    setButtonText('Loading...');
    try {
      const response = await fetch(`http://${hostname}/api/download`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          songs: [
            {
              id: songId,
              trackName: trackName,
              artistName: artistName,
              imageUrl: imageUrl,
            },
          ],
        }),
      });
      const data = await response.json();
      console.log('Download request sent:', data);
    } catch (error) {
      console.error('Error sending download request:', error);
      setIsDownloading(false);
      setButtonText('Request');
    }
  };

  const pollDownloadStatus = async () => {
    try {
      const response = await fetch(`http://${hostname}/api/poll?songId=${songId}`);
      const data = await response.json();
      console.log('Polling result:', data.success);
      if (data.success == 1) {
        setIsDownloading(false);
        setButtonText('Download');
      }
    } catch (error) {
      console.error('Error polling download status:', error);
    }
  };

  useEffect(() => {
    let interval;
    if (downloading) {
      interval = setInterval(pollDownloadStatus, 5000); // Poll every 5 seconds
    }
    return () => clearInterval(interval);
  }, [downloading]);

  const handleButtonClick = async () => {
    if (buttonText === 'Check Status') {
      checkStatus();
    } else if (buttonText === 'Request') {
      startDownload();
    } else if (buttonText === 'Download') {
      // Handle Download logic
      try {
        const response = await fetch(`http://${hostname}/worker/client_download`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            listOfIds: [songId],
          }),
        });
    
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
    
        // Get the Content-Disposition header
        const contentDisposition = response.headers.get('Content-Disposition');
    
        // Extract the filename from the Content-Disposition header
        let filename;
        if (contentDisposition && contentDisposition.includes('filename=')) {
          const filenameMatch = contentDisposition.match(/filename="(.+)"/);
          if (filenameMatch.length === 2) {
            filename = decodeURIComponent(filenameMatch[1]);
          }
        }
    
        // Fallback to trackName if filename is not found
        if (!filename) {
          filename = trackName+ '.m4a';
        }
    
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
        console.log('Download initiated:', filename);
      } catch (error) {
        console.error('Error initiating download:', error);
      }
    }
  };

  return (
    <div className="song-card">
      <img src={imageUrl} alt={trackName} className="song-image" />
      <div className="song-info">
        <h3 className="song-title">{trackName}</h3>
        <p className="song-artist">{artistName}</p>
        <button onClick={handleButtonClick} className={`searchbutton ${isSong ? 'song' : 'playlist'}`} disabled={loading}>
          {downloading ? 'Loading...' : buttonText}
        </button>
      </div>
    </div>
  );
}

export default SongCard;
