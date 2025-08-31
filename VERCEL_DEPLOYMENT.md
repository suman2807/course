# Vercel Deployment Guide

This guide explains how to deploy the YouTube to Course Converter application to Vercel.

## Prerequisites

1. A Vercel account (free at [vercel.com](https://vercel.com))
2. A YouTube Data API key (get one from [Google Cloud Console](https://console.cloud.google.com/))
3. Git installed on your computer

## Deployment Steps

### 1. Prepare Your Project

Make sure you have the following files in your project root:
- `vercel.json` (Vercel configuration)
- `frontend/` (React frontend)
- `backend/` (Backend API functions)
- `.env.local` (Environment variable template)
- `index.html` (Root redirect file)

### 2. Set Up Environment Variables

Before deploying, you need to configure the YouTube API key in Vercel:

1. Go to your Vercel dashboard
2. Select your project
3. Go to Settings > Environment Variables
4. Add the following environment variable:
   - Name: `YOUTUBE_API_KEY`
   - Value: Your actual YouTube Data API key

**Note**: Never commit your actual API key to version control. The `.env.local` file contains a placeholder value.

### 3. Deploy to Vercel

You can deploy in two ways:

#### Option A: Using Vercel CLI (Recommended)

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Deploy:
   ```bash
   vercel
   ```

3. Follow the prompts to link your project and deploy

#### Option B: Using Git Integration

1. Push your code to GitHub/GitLab/Bitbucket:
   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push
   ```
   
2. Import your project in the Vercel dashboard:
   - Go to [vercel.com](https://vercel.com) and log in
   - Click "Add New" > "Project"
   - Import your Git repository
   - Configure the project settings (leave defaults)
   - Add the environment variables as described above
   - Click "Deploy"

### 4. Post-Deployment Configuration

After deployment, make sure to:

1. Verify the environment variable is set correctly
2. Test the health endpoint: `https://your-app.vercel.app/api/health`
3. Test the playlist endpoint with a real playlist ID: `https://your-app.vercel.app/api/playlist/PLAYLIST_ID`

## Troubleshooting

### Common Issues

1. **404 Errors**: If you see 404 errors, check:
   - The vercel.json file has correct routing configuration
   - Your API endpoints are properly named and in the correct directories
   - The frontend build completed successfully

2. **API Key Not Configured**: If you see errors about API keys, make sure you've set the `YOUTUBE_API_KEY` environment variable in your Vercel dashboard.

3. **CORS Errors**: The application should handle CORS properly, but if you encounter issues, check the Vercel function logs.

4. **Playlist Not Found**: Make sure the playlist is public and the ID is correct.

### Checking Logs

You can check your deployment logs in the Vercel dashboard:
1. Go to your project
2. Click on the latest deployment
3. View the function logs for any errors
4. For API logs, go to the "Functions" tab to see each serverless function's logs

## Project Structure for Vercel

```
/
├── frontend/              # React frontend
│   ├── dist/             # Built frontend files
│   ├── public/           # Public assets
│   │   └── env.js        # Runtime environment configuration
│   └── src/
│       ├── services/
│       │   └── youtubeService.js  # API integration
│       └── config.js     # Frontend configuration
├── backend/
│   ├── api/              # Serverless functions
│   │   ├── health.js     # Health check endpoint
│   │   ├── 404.js        # API 404 handler
│   │   └── playlist/
│   │       └── [playlistId].js  # Playlist data endpoint
├── vercel.json           # Vercel configuration
├── index.html            # Root redirect
├── .env.local            # Environment variable template
└── README.md
```

## API Endpoints

Once deployed, your application will have the following endpoints:

- `GET /api/health` - Health check and environment status
- `GET /api/playlist/{playlistId}` - Get playlist data

## Environment Variables

- `YOUTUBE_API_KEY` - Required. Your YouTube Data API key.

## Updating Your Deployment

To update your deployment:

1. Make your changes locally
2. Commit and push to your Git repository:
   ```bash
   git add .
   git commit -m "Update application with changes"
   git push
   ```
3. Vercel will automatically deploy the new version (if using Git integration)
4. Or run `vercel --prod` to deploy manually

## Separate Deployments

If you prefer to deploy the frontend and backend as separate projects, see the [SEPARATE_VERCEL_DEPLOYMENT.md](./SEPARATE_VERCEL_DEPLOYMENT.md) guide.