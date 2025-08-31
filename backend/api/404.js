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
  
  // Return 404 response with helpful information
  res.status(404).json({
    error: 'Endpoint not found',
    requestedUrl: req.url,
    availableEndpoints: [
      '/api/health',
      '/api/playlist/:playlistId'
    ],
    message: 'Please check the URL and try again.',
    timestamp: new Date().toISOString()
  });
}