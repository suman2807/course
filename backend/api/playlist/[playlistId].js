import { google } from 'googleapis';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Handle ESM in Node.js
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Try to load environment variables from multiple locations
try {
  // Try project root .env file
  dotenv.config({ path: path.join(__dirname, '../../../../.env') });
  // Also try .env.local for Vercel
  dotenv.config({ path: path.join(__dirname, '../../../../.env.local') });
  // Finally, try the backend directory
  dotenv.config({ path: path.join(__dirname, '../../../.env') });
} catch (error) {
  console.error('Error loading environment variables:', error);
}

// Check if API key is configured
const isApiKeyConfigured = process.env.YOUTUBE_API_KEY && process.env.YOUTUBE_API_KEY !== 'YOUR_API_KEY_HERE';

// Initialize YouTube API client
let youtube = null;
if (isApiKeyConfigured) {
  youtube = google.youtube({
    version: 'v3',
    auth: process.env.YOUTUBE_API_KEY
  });
} else {
  console.error('YouTube API key not configured. API will not function properly.');
}

// Helper function to format ISO 8601 duration to MM:SS or HH:MM:SS
function formatDuration(duration) {
  if (!duration) return 'N/A';
  
  try {
    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    
    if (!match) return 'N/A';
    
    const hours = (parseInt(match[1]) || 0);
    const minutes = (parseInt(match[2]) || 0);
    const seconds = (parseInt(match[3]) || 0);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    } else {
      return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
  } catch (error) {
    console.error('Error formatting duration:', error);
    return 'N/A';
  }
}

export default async function handler(req, res) {
  console.log('Request received:', req.url, req.method, req.query);
  
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  // Only allow GET requests
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed. Only GET requests are supported.' });
    return;
  }
  
  try {
    // Get playlist ID from path parameter
    const { playlistId } = req.query;
    console.log('Processing playlist ID:', playlistId);
    
    // Validate API key
    if (!isApiKeyConfigured) {
      console.error('YouTube API key not configured');
      return res.status(500).json({ 
        error: 'YouTube API key not configured. Please contact the administrator.' 
      });
    }
    
    // Validate playlist ID format (basic validation)
    if (!playlistId || playlistId.length < 10) {
      console.error('Invalid playlist ID format:', playlistId);
      return res.status(400).json({ error: 'Invalid playlist ID format.' });
    }
    
    // Fetch playlist details
    console.log('Fetching playlist details for ID:', playlistId);
    const playlistResponse = await youtube.playlists.list({
      part: ['snippet'],
      id: [playlistId]
    }).catch(error => {
      console.error('Error fetching playlist details:', error);
      throw error;
    });
    
    if (!playlistResponse.data.items || playlistResponse.data.items.length === 0) {
      console.error('Playlist not found:', playlistId);
      return res.status(404).json({ error: 'Playlist not found. Please check if the playlist URL is correct and the playlist is public.' });
    }
    
    const playlist = playlistResponse.data.items[0];
    console.log('Playlist found:', playlist.snippet.title);
    
    // Fetch playlist items (videos)
    const videos = [];
    let nextPageToken = null;
    let videoFetchErrors = 0;
    const maxVideoFetchErrors = 5;
    
    do {
      console.log('Fetching playlist items, page token:', nextPageToken || 'initial');
      const playlistItemsResponse = await youtube.playlistItems.list({
        part: ['snippet', 'contentDetails'],
        playlistId: playlistId,
        maxResults: 50,
        pageToken: nextPageToken
      }).catch(error => {
        console.error('Error fetching playlist items:', error);
        throw error;
      });
      
      const items = playlistItemsResponse.data.items || [];
      console.log(`Retrieved ${items.length} playlist items`);
      
      for (const item of items) {
        // Skip items without video ID
        if (!item.contentDetails || !item.contentDetails.videoId) {
          console.log('Skipping item without video ID');
          continue;
        }
        
        // Fetch video details for duration
        try {
          console.log('Fetching video details for:', item.contentDetails.videoId);
          const videoResponse = await youtube.videos.list({
            part: ['contentDetails'],
            id: [item.contentDetails.videoId]
          }).catch(error => {
            console.error('Error fetching video details:', error);
            throw error;
          });
          
          const videoDetails = videoResponse.data.items[0];
          const duration = videoDetails ? formatDuration(videoDetails.contentDetails.duration) : 'N/A';
          
          videos.push({
            id: item.contentDetails.videoId,
            title: item.snippet.title,
            description: item.snippet.description,
            duration: duration
          });
        } catch (videoError) {
          videoFetchErrors++;
          console.error(`Error fetching video details for ${item.contentDetails.videoId}:`, videoError.message);
          
          // Add video without duration if we can't fetch details
          videos.push({
            id: item.contentDetails.videoId,
            title: item.snippet.title,
            description: item.snippet.description,
            duration: 'N/A'
          });
          
          // If too many video fetch errors, stop processing
          if (videoFetchErrors >= maxVideoFetchErrors) {
            console.warn(`Too many video fetch errors (${videoFetchErrors}), stopping processing`);
            break;
          }
        }
      }
      
      nextPageToken = playlistItemsResponse.data.nextPageToken;
    } while (nextPageToken && videoFetchErrors < maxVideoFetchErrors);
    
    console.log('Total videos processed:', videos.length);
    
    // Send response
    res.status(200).json({
      id: playlistId,
      title: playlist.snippet.title,
      description: playlist.snippet.description,
      videos: videos,
      stats: {
        totalVideos: videos.length,
        videoFetchErrors: videoFetchErrors
      }
    });
  } catch (error) {
    console.error('Error processing request:', error);
    
    // Handle specific error cases
    if (error.code === 400) {
      return res.status(400).json({ error: 'Invalid playlist ID format.' });
    }
    
    if (error.code === 403) {
      return res.status(403).json({ 
        error: 'YouTube API quota exceeded or invalid API key. Please contact the administrator.' 
      });
    }
    
    if (error.code === 404) {
      return res.status(404).json({ 
        error: 'Playlist not found. Please check if the playlist URL is correct and the playlist is public.' 
      });
    }
    
    // Check if it's an authentication error
    if (error.message && error.message.includes('API key not valid')) {
      return res.status(403).json({ 
        error: 'Invalid YouTube API key. Please contact the administrator.' 
      });
    }
    
    // Generic error response
    res.status(500).json({ 
      error: 'Failed to fetch playlist data from YouTube. Please try again later.',
      message: error.message || 'Unknown error'
    });
  }
}