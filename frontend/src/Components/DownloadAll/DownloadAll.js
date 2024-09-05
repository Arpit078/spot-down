import React, { useState, useEffect } from 'react';
import './DownloadAll.css';

function DownloadPlaylist({ isSong, songs }) {
  const [buttonText, setButtonText] = useState('Check Status');
  const [loading, setLoading] = useState(false);
  const [statusChecked, setStatusChecked] = useState(false);
  const [pollStatus, setPollStatus] = useState(null);
  const [downloading, setIsDownloading] = useState(false);
  const hostname = window.location.hostname
  const checkStatus = async () => {
    setLoading(true);
    try {
      let isAllDownloaded = false;
      for(let i=0;i<songs.length;i++){
        let songId = songs[i].id;
        const response = await fetch(`http://${hostname}/api/poll?songId=${songId}`);
        const data = await response.json();
        if (data.success == 0) {
          setButtonText('Request');
          isAllDownloaded = false;
          break;
        }
        else if(data.success == 1){
          isAllDownloaded = true;
        }
        else{
          setButtonText('Loading...');
          isAllDownloaded = false;
        }
      }
      if(isAllDownloaded){
        setButtonText('Download');
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
          songs : songs
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
      let isAllDownloaded = false;
      for(let i=0;i<songs.length;i++){
        let songId = songs[i].id;
        const response = await fetch(`http://${hostname}/api/poll?songId=${songId}`);
        const data = await response.json();
        if (data.success == 0) {
          setButtonText('Request');
          isAllDownloaded = false;
          break;
        }
        else if(data.success == 1){
          isAllDownloaded = true;
        }
        else{
          isAllDownloaded = false;
        }
      }
      if(isAllDownloaded){
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
      interval = setInterval(pollDownloadStatus, 30); // Poll every 5 seconds
    }
    return () => clearInterval(interval);
  }, [downloading]);

  const handleButtonClick = async () => {
    if (buttonText === 'Check Status') {
      checkStatus();
    } else if (buttonText === 'Request') {
      startDownload();
    } else if (buttonText === 'Download') {
      let ids = [];
      for(let i=0;i<songs.length;i++){
        ids.push(songs[i].id);
      }
      // Handle Download logic
      try {
        const response = await fetch(`http://${hostname}/worker/client_download`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            listOfIds: ids,
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
          filename = 'playlist.zip';
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

<div className="download-all">
  <input
    type="text"
    // value={query}
    // onChange={handleChange}
    placeholder="Download All Songs"
    className="searchinput"
    disabled={true}

  />
  <button onClick={handleButtonClick} disabled={loading} className={`searchbutton ${isSong ? 'song' : 'playlist'}`}>
     {downloading ? 'Loading...' : buttonText}
  </button>
</div>
  
  );
}

export default DownloadPlaylist;
