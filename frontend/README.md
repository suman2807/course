# YouTube Playlist to Course Converter

Transform YouTube playlists into distraction-free learning experiences similar to online courses.

## Features

- Convert any YouTube playlist into a clean, organized course format
- Distraction-free viewing experience with no YouTube suggestions or comments
- Interactive curriculum with lesson navigation
- Modern, responsive design that works on desktop and mobile devices
- Beautiful UI with smooth animations and transitions
- Real-time video duration display
- Intuitive course navigation

## Prerequisites

1. Node.js (version 14 or higher)
2. A Google Cloud Platform account with YouTube Data API enabled
3. A YouTube Data API key

## Setup Instructions

### 1. Frontend Setup

```bash
cd frontend
npm install
```

### 2. Backend Setup

```bash
cd backend
npm install
```

### 3. Configure YouTube API Key

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the YouTube Data API v3
4. Create credentials (API Key) for the project
5. Copy the API key and replace `YOUR_API_KEY_HERE` in `backend/.env`:

```
YOUTUBE_API_KEY=your_actual_api_key_here
PORT=5000
```

## Running the Application Locally

### 1. Start the Backend Server

```bash
cd backend
npm start
```

Or for development with auto-restart:

```bash
cd backend
npm run dev
```

### 2. Start the Frontend Application

In a new terminal:

```bash
cd frontend
npm run dev
```

### 3. Access the Application

Open your browser and navigate to `http://localhost:5173`

## Deploying to Vercel

This application can be easily deployed to Vercel. For detailed deployment instructions, please refer to [VERCEL_DEPLOYMENT.md](../VERCEL_DEPLOYMENT.md).

### Quick Deployment Steps:

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Import your project in the Vercel dashboard
3. Set the `YOUTUBE_API_KEY` environment variable in your Vercel project settings
4. Deploy!

### Environment Variables for Vercel:

- `YOUTUBE_API_KEY` - Required. Your YouTube Data API key.

## Usage

1. Copy the URL of any YouTube playlist
2. Paste it into the input field in the application
3. Click "Convert to Course"
4. Browse and watch videos in a distraction-free environment

## How It Works

1. The frontend sends the YouTube playlist URL to our backend service
2. The backend uses the YouTube Data API to fetch playlist and video information
3. The data is processed and sent back to the frontend
4. The frontend displays the course in a clean, organized interface
5. Videos are played using YouTube's embedded player with distraction-free parameters

## Troubleshooting

### "Failed to fetch playlist data" Error

This is the most common error and can have several causes:

1. **API Key Not Configured**: 
   - Check that you've set the `YOUTUBE_API_KEY` environment variable
   - For local development, ensure you've replaced `YOUR_API_KEY_HERE` in `backend/.env` with your actual YouTube API key
   - Restart the backend server after updating the API key

2. **Backend Server Not Running**:
   - Make sure the backend server is running on `http://localhost:5000`
   - Check the terminal where you started the backend for any error messages

3. **Invalid Playlist URL**:
   - Ensure you're using a valid YouTube playlist URL (should contain `?list=`)
   - Example: `https://www.youtube.com/playlist?list=PLWKjhJtqVAbnRT_hue-VIyY1iQ0oBggPM`

4. **Private Playlist**:
   - The application can only access public playlists
   - Private playlists require OAuth authentication which is not implemented in this version

5. **API Quota Exceeded**:
   - YouTube API has usage quotas
   - If you've exceeded your quota, you'll need to wait or upgrade your quota in Google Cloud Console

### Checking Backend Health

You can check if the backend is properly configured by visiting:
- Local development: `http://localhost:5000/api/health`
- Vercel deployment: `https://your-app.vercel.app/api/health`

This endpoint will tell you if the API key is properly configured.

### Network Issues

- Ensure both frontend and backend servers are running
- Check that your firewall isn't blocking the connections
- Make sure you're using the correct ports (5173 for frontend, 5000 for backend)

## UI/UX Features

### Modern Design
- Clean, minimalist interface inspired by popular learning platforms
- Smooth animations and transitions for better user experience
- Responsive design that works on all device sizes

### Course Interface
- Video player with distraction-free viewing
- Interactive curriculum with lesson navigation
- Video duration display for better time management
- Clear visual indication of currently playing video

### User Experience
- Intuitive workflow from playlist URL to course viewing
- Helpful error messages with actionable solutions
- Loading states and visual feedback during operations
- Easy navigation between videos and back to search

## Limitations

- Due to YouTube API quotas, there may be limits on how many playlists can be converted per day
- Private playlists cannot be accessed (they require OAuth authentication)
- The application requires both frontend and backend to be running for local development

## Technologies Used

- Frontend: React, Vite
- Backend: Node.js, Express
- YouTube Data API v3
- Google APIs Node.js Client

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.