// YouTube service to handle playlist parsing using our backend API
import config from '../config';

const extractPlaylistId = (url) => {
  const regex = /[?&]list=([^&]+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
};

// Function to fetch playlist data from our backend
export const fetchPlaylistData = async (playlistUrl) => {
  // Extract playlist ID from URL
  const playlistId = extractPlaylistId(playlistUrl);
  
  if (!playlistId) {
    throw new Error('Invalid YouTube playlist URL. Please make sure you are using a valid playlist URL that contains "?list=" parameter.');
  }
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
    
    console.log(`Fetching playlist ${playlistId} from ${config.API_BASE_URL}/playlist/${playlistId}`);
    
    const response = await fetch(`${config.API_BASE_URL}/playlist/${playlistId}`, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json'
      }
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Playlist not found. Please check if the playlist URL is correct and the playlist is public.');
      } else if (response.status === 500) {
        const errorData = await response.json().catch(() => ({}));
        if (errorData.error && errorData.error.includes('API key')) {
          throw new Error('Backend configuration error: Invalid or missing YouTube API key. Please contact the administrator.');
        }
        throw new Error('Server error: ' + (errorData.error || 'Failed to fetch playlist data from YouTube.'));
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Request timeout. The server is taking too long to respond. Please try again.');
    }
    
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error(`Unable to connect to the backend service at ${config.API_BASE_URL}. Please try again later.`);
    }
    
    // Re-throw other errors
    throw error;
  }
};

export default { fetchPlaylistData };