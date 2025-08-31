# Separate Vercel Deployment Guide

This guide explains how to deploy the YouTube to Course Converter as separate frontend and backend projects on Vercel.

## Why Separate Deployments?

In some cases, you might want to deploy the frontend and backend as separate Vercel projects:

1. Better separation of concerns
2. Independent scaling and management
3. Different domain names if needed
4. More granular control over environment variables

## Prerequisites

1. A Vercel account (free at [vercel.com](https://vercel.com))
2. A YouTube Data API key (get one from [Google Cloud Console](https://console.cloud.google.com/))
3. Git repositories for both frontend and backend (can be separate repos or folders in a monorepo)

## Deployment Steps

### 1. Frontend Deployment

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Initialize as a git repository if not already:
   ```bash
   git init
   git add .
   git commit -m "Initial frontend commit"
   ```

3. Create a `vercel.json` file in the frontend directory:
   ```json
   {
     "version": 2,
     "builds": [
       {
         "src": "package.json",
         "use": "@vercel/static-build",
         "config": {
           "distDir": "dist"
         }
       }
     ],
     "routes": [
       {
         "handle": "filesystem"
       },
       {
         "src": "/assets/(.*)",
         "dest": "/dist/assets/$1"
       },
       {
         "src": "/(.*)",
         "dest": "/dist/index.html"
       }
     ],
     "env": {
       "VITE_API_URL": "https://your-backend-vercel-app.vercel.app/api"
     }
   }
   ```

4. Deploy to Vercel:
   ```bash
   vercel
   ```

### 2. Backend Deployment

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Initialize as a git repository if not already:
   ```bash
   git init
   git add .
   git commit -m "Initial backend commit"
   ```

3. Create a `vercel.json` file in the backend directory:
   ```json
   {
     "version": 2,
     "builds": [
       {
         "src": "api/**/*.js",
         "use": "@vercel/node"
       }
     ],
     "routes": [
       {
         "src": "/api/health",
         "dest": "/api/health.js"
       },
       {
         "src": "/api/playlist/(.*)",
         "dest": "/api/playlist/[playlistId].js?playlistId=$1"
       },
       {
         "src": "/api/(.*)",
         "dest": "/api/404.js"
       }
     ],
     "env": {
       "YOUTUBE_API_KEY": "@youtube_api_key"
     }
   }
   ```

4. Deploy to Vercel:
   ```bash
   vercel
   ```

5. Set up environment variables in the Vercel dashboard:
   - Go to your backend project settings
   - Add `YOUTUBE_API_KEY` environment variable

### 3. Connect Frontend to Backend

1. Get your backend deployment URL from Vercel dashboard

2. Update the frontend's environment variables:
   - In the Vercel dashboard, go to your frontend project settings
   - Set `VITE_API_URL` to your backend URL + `/api` (e.g., `https://my-backend.vercel.app/api`)

3. Redeploy the frontend:
   ```bash
   cd frontend
   vercel --prod
   ```

## Troubleshooting

### CORS Issues

If you encounter CORS issues, make sure your backend is properly handling CORS headers. Update your health.js and [playlistId].js files to include:

```javascript
// Set CORS headers
res.setHeader('Access-Control-Allow-Origin', '*');
res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
```

### API Connection Issues

If the frontend can't connect to the backend API:

1. Verify the `VITE_API_URL` is set correctly in the frontend Vercel project
2. Make sure the backend API endpoints are working (test using `/api/health`)
3. Check for CORS issues in browser developer console

### Environment Variables

For environment variables to work:

1. They must be prefixed with `VITE_` to be exposed to the frontend
2. Restart the development server after changing environment variables
3. For production, set them in the Vercel dashboard

## Updating Your Deployment

To update your deployment after making changes:

1. Commit your changes
2. Push to your Git repository or run `vercel --prod`