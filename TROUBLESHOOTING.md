# Troubleshooting "Failed to fetch playlist data" Error

This guide will help you resolve the "Failed to fetch playlist data" error when using the YouTube Playlist to Course Converter with real YouTube playlists.

## Common Causes and Solutions

### 1. Missing or Invalid YouTube API Key

**Symptoms**: 
- Error message: "Backend configuration error: Invalid or missing YouTube API key"
- Error message: "Failed to fetch playlist data from YouTube"

**Solution**:
1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a project and enable the YouTube Data API v3
3. Generate an API key
4. Open `youtube-to-course-backend/.env` in a text editor
5. Replace `YOUR_API_KEY_HERE` with your actual API key:
   ```
   YOUTUBE_API_KEY=AIzaSyB12a7c4F3k27D1eX8w9F0v1n2p3q4r5s
   PORT=5000
   ```
6. Save the file and restart the backend server

### 2. Backend Server Not Running

**Symptoms**:
- Error message: "Unable to connect to the backend service"
- No response when trying to convert a playlist

**Solution**:
1. Open a terminal and navigate to the backend directory:
   ```bash
   cd youtube-to-course-backend
   ```
2. Start the backend server:
   ```bash
   npm start
   ```
3. You should see output like:
   ```
   Server is running on port 5000
   YouTube API key is configured.
   ```
4. Keep this terminal open and running

### 3. Incorrect Playlist URL

**Symptoms**:
- Error message: "Invalid YouTube playlist URL"
- Error message: "Playlist not found"

**Solution**:
1. Make sure you're using a valid YouTube playlist URL
2. The URL should contain `?list=` parameter
3. Example of a valid playlist URL:
   ```
   https://www.youtube.com/playlist?list=PLWKjhJtqVAbnRT_hue-VIyY1iQ0oBggPM
   ```
4. Try a different public playlist if the current one doesn't work

### 4. Private or Unavailable Playlist

**Symptoms**:
- Error message: "Playlist not found"
- Works with some playlists but not others

**Solution**:
1. The application can only access public playlists
2. Try with a different public playlist
3. Check if the playlist owner has made it private or unlisted

### 5. API Quota Exceeded

**Symptoms**:
- Error message: "YouTube API quota exceeded"
- Works intermittently or stops working after several requests

**Solution**:
1. YouTube API has daily quotas
2. Check your quota usage in the Google Cloud Console
3. Wait until the quota resets (usually 24 hours)
4. Consider upgrading your quota if you need more requests

### 6. Network or Firewall Issues

**Symptoms**:
- Intermittent connection failures
- Slow loading times

**Solution**:
1. Check your internet connection
2. Ensure your firewall isn't blocking localhost connections
3. Try accessing `http://localhost:5000/api/health` in your browser

## Diagnostic Steps

### Step 1: Check Backend Health

Visit `http://localhost:5000/api/health` in your browser. You should see a JSON response like:
```json
{
  "status": "OK",
  "apiKeyConfigured": true,
  "apiKey": "Configured (hidden)"
}
```

If `apiKeyConfigured` is `false`, you need to configure your API key.

### Step 2: Check Backend Console

Look at the terminal where you started the backend server. You should see:
```
Server is running on port 5000
YouTube API key is configured.
```

If you see a warning about the API key not being configured, follow the API key setup instructions.

### Step 3: Test with a Known Good Playlist

Try using this public playlist URL to test if the application is working:
```
https://www.youtube.com/playlist?list=PLWKjhJtqVAbnRT_hue-VIyY1iQ0oBggPM
```

### Step 4: Check Browser Console

Open your browser's developer tools (usually F12) and check the Console tab for any error messages when you try to convert a playlist.

## Advanced Troubleshooting

### Enable Detailed Logging

To get more detailed information about what's happening, you can add logging to the backend:

1. In `youtube-to-course-backend/server.js`, add more console.log statements
2. Restart the backend server
3. Try converting a playlist again
4. Check the backend terminal for detailed logs

### Testing the YouTube API Directly

You can test if your API key is working by making a direct request to the YouTube API:

```bash
curl "https://www.googleapis.com/youtube/v3/playlists?part=snippet&id=PLWKjhJtqVAbnRT_hue-VIyY1iQ0oBggPM&key=YOUR_API_KEY_HERE"
```

Replace `YOUR_API_KEY_HERE` with your actual API key.

## Getting Help

If you're still having issues after following this guide:

1. Check the browser console for specific error messages
2. Check the backend terminal for error logs
3. Verify all setup steps in the README
4. Try with a different playlist URL
5. Ensure both frontend and backend servers are running

If you continue to have problems, please provide:
1. The exact error message you're seeing
2. The playlist URL you're trying to convert
3. Screenshots of any console errors
4. Information about your operating system and browser