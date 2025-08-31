import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Handle ESM in Node.js
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Try to load environment variables from multiple locations
try {
  // Try project root .env file
  dotenv.config({ path: path.join(__dirname, '../../../.env') });
  // Also try .env.local for Vercel
  dotenv.config({ path: path.join(__dirname, '../../../.env.local') });
  // Finally, try the backend directory
  dotenv.config({ path: path.join(__dirname, '../../.env') });
} catch (error) {
  console.error('Error loading environment variables:', error);
}

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
  
  // Enhanced response for debugging
  res.status(200).json({
    status: 'OK',
    apiKeyConfigured: isApiKeyConfigured,
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
    platform: 'Vercel',
    nodeVersion: process.version,
    vercel: {
      region: process.env.VERCEL_REGION || 'unknown',
      environment: process.env.VERCEL_ENV || 'unknown',
      url: process.env.VERCEL_URL || 'unknown'
    }
  });
}