import { useState, useEffect } from 'react';
import './VideoPlayer.css';

const VideoPlayer = ({ videoId, title }) => {
  const [embedUrl, setEmbedUrl] = useState('');

  useEffect(() => {
    if (videoId) {
      // Create embed URL with parameters to minimize distractions
      const url = `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&autoplay=1&controls=1&color=white&iv_load_policy=3`;
      setEmbedUrl(url);
    }
  }, [videoId]);

  return (
    <div className="video-player-container">
      {embedUrl ? (
        <iframe
          className="video-iframe"
          src={embedUrl}
          title={title || 'YouTube Video Player'}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      ) : (
        <div className="video-placeholder">
          <div className="placeholder-content">
            <div className="placeholder-icon">🎬</div>
            <h3>Select a Video</h3>
            <p>Choose a lesson from the curriculum to start learning</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;