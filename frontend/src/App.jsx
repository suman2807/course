import { useState, useRef, useEffect } from 'react';
import VideoPlayer from './VideoPlayer';
import { fetchPlaylistData } from './services/youtubeService';
import './App.css';

function App() {
  const [playlistUrl, setPlaylistUrl] = useState('');
  const [courseData, setCourseData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentVideo, setCurrentVideo] = useState(null);
  const [expandedDescriptions, setExpandedDescriptions] = useState({});
  const activeVideoRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!playlistUrl) {
      setError('Please enter a YouTube playlist URL');
      return;
    }
    
    // Basic validation for YouTube playlist URL
    if (!playlistUrl.includes('youtube.com/playlist?list=')) {
      setError('Please enter a valid YouTube playlist URL (should contain "?list=" parameter)');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const data = await fetchPlaylistData(playlistUrl);
      setCourseData(data);
      // Set the first video as the current video
      if (data.videos.length > 0) {
        setCurrentVideo(data.videos[0]);
      }
    } catch (err) {
      console.error('Error fetching playlist:', err);
      setError(err.message || 'Failed to fetch playlist data. Please check the console for more details.');
    } finally {
      setLoading(false);
    }
  };

  const handleVideoSelect = (video) => {
    setCurrentVideo(video);
  };

  const handleBackToSearch = () => {
    setCourseData(null);
    setCurrentVideo(null);
    setPlaylistUrl('');
    setError('');
    setExpandedDescriptions({});
  };

  // Toggle description visibility
  const toggleDescription = (videoId) => {
    setExpandedDescriptions(prev => ({
      ...prev,
      [videoId]: !prev[videoId]
    }));
  };

  // Toggle current video description
  const toggleCurrentDescription = () => {
    if (currentVideo) {
      toggleDescription(currentVideo.id);
    }
  };

  // Scroll to active video when it changes
  useEffect(() => {
    if (activeVideoRef.current) {
      activeVideoRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      });
    }
  }, [currentVideo]);

  // Function to truncate text with ellipsis
  const truncateText = (text, maxLength) => {
    if (text && text.length > maxLength) {
      return text.substring(0, maxLength) + '...';
    }
    return text;
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1>YouTube Playlist to Course Converter</h1>
          <p>Transform YouTube playlists into distraction-free learning experiences</p>
        </div>
      </header>
      
      <main className="app-main">
        {!courseData ? (
          <div className="converter-section">
            <div className="hero-section">
              <h2>Learn Without Distractions</h2>
              <p>Convert any YouTube playlist into a clean, organized course format</p>
            </div>
            
            <form onSubmit={handleSubmit} className="playlist-form">
              <div className="form-group">
                <label htmlFor="playlist-url">YouTube Playlist URL</label>
                <div className="input-group">
                  <input
                    type="text"
                    id="playlist-url"
                    value={playlistUrl}
                    onChange={(e) => setPlaylistUrl(e.target.value)}
                    placeholder="https://www.youtube.com/playlist?list=..."
                  />
                  <button type="submit" disabled={loading}>
                    {loading ? (
                      <span className="loading-spinner"></span>
                    ) : (
                      'Convert to Course'
                    )}
                  </button>
                </div>
              </div>
              
              {error && <div className="error-message">{error}</div>}
              
              <div className="features-section">
                <div className="feature-card">
                  <div className="feature-icon">📚</div>
                  <h3>Organized Learning</h3>
                  <p>All videos in one place, no distractions</p>
                </div>
                
                <div className="feature-card">
                  <div className="feature-icon">🎬</div>
                  <h3>Distraction-Free</h3>
                  <p>Remove suggestions, comments, and ads</p>
                </div>
                
                <div className="feature-card">
                  <div className="feature-icon">📱</div>
                  <h3>Mobile Friendly</h3>
                  <p>Works on any device, anywhere</p>
                </div>
              </div>
            </form>
            
            <div className="instructions-section">
              <h3>How to use:</h3>
              <div className="steps">
                <div className="step">
                  <div className="step-number">1</div>
                  <p>Find a YouTube playlist you want to learn from</p>
                </div>
                <div className="step">
                  <div className="step-number">2</div>
                  <p>Copy the playlist URL</p>
                </div>
                <div className="step">
                  <div className="step-number">3</div>
                  <p>Paste it above and click "Convert to Course"</p>
                </div>
                <div className="step">
                  <div className="step-number">4</div>
                  <p>Start learning without distractions!</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="course-section">
            <div className="course-header">
              <div className="course-info">
                <h2>{truncateText(courseData.title, 100)}</h2>
                <div className="description-container">
                  <div className={`course-description ${expandedDescriptions['main'] ? 'expanded' : 'collapsed'}`}>
                    {courseData.description}
                  </div>
                  {courseData.description && courseData.description.length > 100 && (
                    <button 
                      className="toggle-description-btn"
                      onClick={() => toggleDescription('main')}
                    >
                      {expandedDescriptions['main'] ? 'Show Less' : 'Show More'}
                    </button>
                  )}
                </div>
                <div className="course-meta">
                  <span className="video-count">{courseData.videos.length} lessons</span>
                  {courseData.stats && courseData.stats.videoFetchErrors > 0 && (
                    <span className="warning">
                      {courseData.stats.videoFetchErrors} videos with missing details
                    </span>
                  )}
                </div>
              </div>
              <button onClick={handleBackToSearch} className="back-button">
                ← New Search
              </button>
            </div>
            
            <div className="course-content">
              <div className="video-section">
                <div className="video-player-container">
                  <VideoPlayer videoId={currentVideo?.id} title={currentVideo?.title} />
                </div>
                {currentVideo && (
                  <div className="current-video-info">
                    <h3>{currentVideo.title}</h3>
                    <div className="description-container">
                      <div className={`video-description ${expandedDescriptions[currentVideo.id] ? 'expanded' : 'collapsed'}`}>
                        {currentVideo.description}
                      </div>
                      {currentVideo.description && currentVideo.description.length > 100 && (
                        <button 
                          className="toggle-description-btn"
                          onClick={toggleCurrentDescription}
                        >
                          {expandedDescriptions[currentVideo.id] ? 'Show Less' : 'Show More'}
                        </button>
                      )}
                    </div>
                    {currentVideo.duration !== 'N/A' && (
                      <p className="duration">Duration: {currentVideo.duration}</p>
                    )}
                  </div>
                )}
              </div>
              
              <div className="course-curriculum">
                <div className="curriculum-header">
                  <h3>Curriculum</h3>
                  <span className="lesson-count">{courseData.videos.length} lessons</span>
                </div>
                <div className="curriculum-list-container">
                  <ul className="curriculum-list">
                    {courseData.videos.map((video, index) => (
                      <li 
                        key={video.id} 
                        className={`curriculum-item ${currentVideo?.id === video.id ? 'active' : ''}`}
                        onClick={() => handleVideoSelect(video)}
                        ref={currentVideo?.id === video.id ? activeVideoRef : null}
                      >
                        <div className="video-info">
                          <span className="video-index">{index + 1}</span>
                          <div className="video-details">
                            <h4 title={video.title}>{truncateText(video.title, 60)}</h4>
                            <button 
                              className="toggle-description-btn small"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleDescription(video.id);
                              }}
                            >
                              {expandedDescriptions[video.id] ? 'Hide Details' : 'Show Details'}
                            </button>
                            {expandedDescriptions[video.id] && (
                              <p className="video-description" title={video.description}>
                                {truncateText(video.description, 200)}
                              </p>
                            )}
                          </div>
                          <span className="video-duration">{video.duration}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      
      <footer className="app-footer">
        <p>YouTube Playlist to Course Converter &copy; {new Date().getFullYear()}</p>
        <p className="footer-note">This tool is not affiliated with YouTube or Google</p>
      </footer>
    </div>
  );
}

export default App;