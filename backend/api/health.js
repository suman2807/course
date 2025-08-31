import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Check if API key is configured
const isApiKeyConfigured = process.env.YOUTUBE_API_KEY && process.env.YOUTUBE_API_KEY !== 'YOUR_API_KEY_HERE';

export default function handler(req, res) {
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
  
  res.status(200).json({
    status: 'OK',
    apiKeyConfigured: isApiKeyConfigured,
    timestamp: new Date().toISOString(),
    platform: 'Vercel'
  });
}