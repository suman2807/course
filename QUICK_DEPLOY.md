# Quick Vercel Deployment Guide

This is a simplified guide for deploying your YouTube to Course Converter app to Vercel.

## Prerequisites

- A [Vercel account](https://vercel.com/signup) (free)
- Your code pushed to a Git repository (GitHub, GitLab, or Bitbucket)
- A [YouTube Data API key](https://console.cloud.google.com/apis/credentials)

## Deployment Steps

### 1. Connect Your Repository to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New" > "Project"
3. Import your Git repository
4. Configure the project:
   - Framework Preset: Leave as "Other"
   - Root Directory: `./` (default)
   - Build Command: `npm run build`
   - Output Directory: `frontend/dist`

### 2. Configure Environment Variables

1. Scroll down to "Environment Variables" section
2. Add the following variable:
   - Name: `YOUTUBE_API_KEY`
   - Value: [Your YouTube API Key]
3. Click "Add"

### 3. Deploy

1. Click "Deploy"
2. Wait for the deployment to complete
3. Once deployed, click "Visit" to see your live app

## Testing Your Deployment

1. Try the health check endpoint: `https://your-domain.vercel.app/api/health`
2. Try converting a YouTube playlist
3. If everything works, you're all set!

## Troubleshooting

If you encounter issues:

1. Check the deployment logs in Vercel dashboard
2. Verify your API key is set correctly
3. Make sure you're using a public YouTube playlist
4. Refer to the full [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) for detailed guidance

## Updating Your App

To update your app:
1. Make changes to your code
2. Commit and push to your Git repository
3. Vercel will automatically deploy the new version