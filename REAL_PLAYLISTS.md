# Using Real YouTube Playlists

To make the YouTube Playlist to Course Converter work with real YouTube playlists, you'll need to set up the backend service with a valid YouTube Data API key.

## Prerequisites

1. A Google Cloud Platform account
2. A project in Google Cloud Console
3. YouTube Data API v3 enabled for your project
4. An API key for accessing the YouTube Data API

## Step-by-Step Setup

### 1. Create a Google Cloud Project

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" then "New Project"
3. Enter a project name (e.g., "youtube-course-converter")
4. Click "Create"

### 2. Enable YouTube Data API

1. In the Google Cloud Console, with your project selected, go to "APIs & Services" > "Library"
2. Search for "YouTube Data API v3"
3. Click on "YouTube Data API v3" in the search results
4. Click "Enable"

### 3. Create API Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "API Key"
3. Copy the generated API key (you'll need this in the next step)
4. Click "Close"

### 4. Configure the Backend

1. Open `youtube-to-course-backend/.env` in a text editor
2. Replace `YOUR_API_KEY_HERE` with your actual API key:
   ```
   YOUTUBE_API_KEY=your_actual_api_key_here
   PORT=5000
   ```

### 5. Install Dependencies

In separate terminals:

Terminal 1 (Backend):
```bash
cd youtube-to-course-backend
npm install
```

Terminal 2 (Frontend):
```bash
cd youtube-to-course
npm install
```

### 6. Start the Servers

Terminal 1 (Backend):
```bash
cd youtube-to-course-backend
npm start
```

Terminal 2 (Frontend):
```bash
cd youtube-to-course
npm run dev
```

### 7. Use the Application

1. Open your browser and go to `http://localhost:5173`
2. Enter a valid YouTube playlist URL (e.g., `https://www.youtube.com/playlist?list=PLWKjhJtqVAbnRT_hue-VIyY1iQ0oBggPM`)
3. Click "Convert to Course"
4. Enjoy your distraction-free learning experience!

## Troubleshooting

### API Key Issues

If you see errors about API keys:
1. Make sure you've enabled the YouTube Data API v3 for your project
2. Verify that your API key is correctly entered in the `.env` file
3. Check that your API key hasn't been restricted

### CORS Errors

If you see CORS errors in the browser console:
1. Ensure the backend server is running on `http://localhost:5000`
2. Check that the frontend is making requests to the correct backend URL

### Playlist Not Loading

If a playlist doesn't load:
1. Verify the playlist URL is correct
2. Some playlists may be private or unavailable
3. Check the browser console for specific error messages

## API Quotas

The YouTube Data API has usage quotas. If you exceed these quotas, you may see errors. For more information, check the [YouTube Data API Quota documentation](https://developers.google.com/youtube/v3/getting-started#quota).

## Limitations

1. Private playlists cannot be accessed without OAuth authentication
2. Playlists with a very large number of videos may take longer to load
3. The application requires both frontend and backend servers to be running