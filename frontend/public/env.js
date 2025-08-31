// This file is loaded before the app and provides runtime environment configuration
// It's especially useful for Vercel deployments

window.ENV = {
  // This will be replaced with actual values during build/runtime
  PRODUCTION: window.location.hostname !== 'localhost' && !window.location.hostname.includes('127.0.0.1'),
  API_URL: '/api',
  APP_NAME: 'YouTube to Course Converter',
  VERSION: '1.0.0'
};